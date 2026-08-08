import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getSkillById } from "@/lib/skills";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatBody = {
  userMessage?: string;
  skillId?: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Non autenticato" }, { status: 401 });
    }

    const body = (await req.json()) as ChatBody;
    const userMessage = body.userMessage?.trim();
    const skillId = body.skillId?.trim();

    if (!userMessage || !skillId) {
      return Response.json(
        { error: "Body non valido: servono userMessage e skillId" },
        { status: 400 }
      );
    }

    const skill = getSkillById(skillId);
    if (!skill) {
      return Response.json({ error: "Skill non trovata" }, { status: 404 });
    }

    if (skill.category !== session.categoria) {
      return Response.json(
        { error: "Skill non disponibile per la tua categoria" },
        { status: 403 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY non configurata" },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: conversation, error: insertError } = await supabase
      .from("conversations")
      .insert({
        user_id: session.userId,
        skill_id: skillId,
        user_message: userMessage,
        ai_response: null,
      })
      .select("id")
      .single();

    if (insertError || !conversation) {
      console.error("Conversation insert error:", insertError);
      return Response.json(
        { error: "Impossibile salvare il messaggio" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: `${skill.systemPrompt}

Contesto utente:
- Nome: ${session.nome}
- Categoria: ${session.categoria}
- Piano: ${session.piano}

Rispondi in italiano, in modo chiaro, strutturato e actionable. Sei parte di Alpha Radar.`,
      messages: [{ role: "user", content: userMessage }],
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullResponse += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          await supabase
            .from("conversations")
            .update({ ai_response: fullResponse })
            .eq("id", conversation.id);

          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          const message =
            err instanceof Error ? err.message : "Errore streaming Claude";

          if (fullResponse) {
            await supabase
              .from("conversations")
              .update({ ai_response: fullResponse })
              .eq("id", conversation.id);
          }

          controller.error(err instanceof Error ? err : new Error(message));
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Conversation-Id": conversation.id,
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Errore interno del server chat",
      },
      { status: 500 }
    );
  }
}
