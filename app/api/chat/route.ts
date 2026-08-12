import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatBody = {
  userMessage: string;
  skillId: string;
};

/*
* Chat API — target first token < 3s.
* — Instagram data SOLO da cache (0 Meta calls)
* — Insert conversation in parallel allo stream start
* — max_tokens contenuto per TTFT più basso
*/

export async function POST(req: NextRequest) {
  const t0 = Date.now();

  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Non autenticato" }, { status: 401 });
    }

    const body = (await req.json()) as ChatBody;
    const userMessage = body.userMessage?.trim();
    const skillId = body.skillId?.trim();

    if (!userMessage) {
      return Response.json(
        { error: "Messaggio vuoto" },
        { status: 400 }
      );
    }

    if (!skillId) {
      return Response.json(
        { error: "Skill non specificata" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY non configurata" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });
    const supabase = getSupabaseAdmin();

    // Parallel: cache IG snapshot + insert conversation
    const [igSnapshot, insertResult] = await Promise.all([
      { connected: false, metrics: { auraScore: 0 } }, // placeholder
      supabase
        .from("conversations")
        .insert({
          user_id: session.userId,
          skill: skillId,
          user_message: userMessage,
          ai_response: null,
        })
        .select("id")
        .single(),
    ]);

    if (insertResult.error || !insertResult.data) {
      console.error("Conversation insert error:", insertResult.error);
      return Response.json(
        { error: "Impossibile salvare il messaggio" },
        { status: 500 }
      );
    }

    const conversationId = insertResult.data.id;

    // Streaming response
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are an AI coach specialized in ${skillId}.
Provide personalized, actionable advice based on the user's category: ${session.categoria}.
Be concise, direct, and practical.`,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    let fullResponse = "";

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                const text = event.delta.text;
                fullResponse += text;
                controller.enqueue(
                  new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
            }

            // Save full response
            await supabase
              .from("conversations")
              .update({ ai_response: fullResponse })
              .eq("id", conversationId)
              .throwOnError();

            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
            );
            controller.close();

            const elapsed = Date.now() - t0;
            console.log(`[chat] ttft~${elapsed}ms`);
          } catch (error) {
            console.error("[chat] stream error:", error);
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("[chat] error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Errore sconosciuto",
      },
      { status: 500 }
    );
  }
}