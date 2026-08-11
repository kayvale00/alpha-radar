import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getSkillById } from "@/lib/skills";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  buildClaudeIgContext,
  getCachedSnapshot,
} from "@/lib/instagram-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatBody = {
  userMessage?: string;
  skillId?: string;
};

/**
 * Chat API — target first token < 3s.
 * - Instagram data SOLO da cache (0 Meta calls)
 * - Insert conversation in parallelo allo stream start
 * - max_tokens contenuto per TTFT più basso
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

    // Parallel: cache IG (istantanea) + insert conversation stub
    const [igSnapshot, insertResult] = await Promise.all([
      session.categoria === "Creator"
        ? getCachedSnapshot(session.userId)
        : Promise.resolve(null),
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
    const igContext =
      igSnapshot != null
        ? buildClaudeIgContext(igSnapshot)
        : "Nessun dato Instagram (categoria non Creator).";

    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `${skill.systemPrompt}

Contesto utente:
- Nome: ${session.nome}
- Categoria: ${session.categoria}
- Piano: ${session.piano}

${igContext}

Hai i dati utente SUBITO dalla cache (non aspettare sync). Usa i numeri reali.
Rispondi in italiano, chiaro, actionable, conciso. Sei Alpha Radar Settimana 1.`,
      messages: [{ role: "user", content: userMessage }],
    });

    console.log(`[chat] stream ready in ${Date.now() - t0}ms`);

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

          // Persist non-blocking rispetto alla UX (dopo stream)
          void supabase
            .from("conversations")
            .update({ ai_response: fullResponse })
            .eq("id", conversationId);

          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          if (fullResponse) {
            void supabase
              .from("conversations")
              .update({ ai_response: fullResponse })
              .eq("id", conversationId);
          }
          controller.error(
            err instanceof Error ? err : new Error("Errore streaming Claude")
          );
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Conversation-Id": conversationId,
        "X-Response-Start-Ms": String(Date.now() - t0),
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
