"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  skillId: string;
  skillName: string;
  initialMessages?: ChatMessage[];
};

export function ChatInterface({
  skillId,
  skillName,
  initialMessages = [],
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    setError(null);
    setInput("");
    setLoading(true);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userMessage,
    };
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage, skillId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Errore ${res.status}`);
      }

      if (!res.body) {
        throw new Error("Nessuno stream ricevuto");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: full } : m
          )
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Errore durante la chat";
      setError(message);
      setMessages((prev) =>
        prev.filter((m) => m.id !== assistantId || m.content.length > 0)
      );
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col neon-border bg-cyber-card/50">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <div className="mb-4 h-12 w-12 rounded-full border border-neon-cyan/40 flex items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-neon-cyan shadow-neon-cyan animate-pulse-neon" />
            </div>
            <p className="font-display text-sm uppercase tracking-widest text-neon-cyan">
              {skillName}
            </p>
            <p className="mt-2 max-w-sm text-white/50">
              Fai una domanda per attivare il radar. Le risposte sono generate da Alpha Radar.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-neon-green/15 border border-neon-green/30 text-white"
                  : "bg-cyber-darker border border-neon-cyan/20 text-white/90"
              }`}
            >
              <p className="mb-1 font-display text-[10px] uppercase tracking-widest opacity-60">
                {msg.role === "user" ? "Tu" : skillName}
              </p>
              {msg.content || (
                <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-neon-cyan/50" />
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.content === "" && (
          <LoadingSpinner label="Claude sta analizzando..." />
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mx-4 mb-2 border border-neon-magenta/40 bg-neon-magenta/10 px-3 py-2 text-sm text-neon-magenta">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-white/5 p-3 sm:p-4"
      >
        <div className="flex gap-2 sm:gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            placeholder="Scrivi la tua domanda..."
            disabled={loading}
            className="input-cyber min-h-[48px] max-h-32 resize-y flex-1"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary shrink-0 !px-4 sm:!px-6"
          >
            Invia
          </button>
        </div>
      </form>
    </div>
  );
}
