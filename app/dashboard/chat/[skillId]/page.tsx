import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSkillsByCategory } from "@/lib/skills";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ChatInterface, ChatMessage } from "@/components/ChatInterface";

type Props = {
  params: { skillId: string };
};

export default async function ChatSkillPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  // Get skill from category
  const skills = getSkillsByCategory(session.categoria);
  const skill = skills.find((s) => s.id === params.skillId);
  
  if (!skill) notFound();

  let initialMessages: ChatMessage[] = [];

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("conversations")
      .select("id, user_message, ai_response, created_at")
      .eq("user_id", session.userId)
      .eq("skill", skill.id)
      .order("created_at", { ascending: true })
      .limit(50);

    if (data) {
      initialMessages = data.flatMap((row) => {
        const msgs: ChatMessage[] = [
          {
            id: `${row.id}-u`,
            role: "user",
            content: row.user_message,
          },
        ];
        if (row.ai_response) {
          msgs.push({
            id: `${row.id}-a`,
            role: "assistant",
            content: row.ai_response,
          });
        }
        return msgs;
      });
    }
  } catch (err) {
    console.error("Failed to load conversation history:", err);
  }

  return (
    <div className="relative min-h-screen">
      <header className="relative z-20 border-b border-white/5 bg-cyber-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="font-display text-xs uppercase tracking-widest text-white/50 hover:text-neon-cyan transition-colors"
            >
              ← Indietro
            </Link>
            <h1 className="mt-1 truncate font-display text-lg font-bold text-white sm:text-xl">
              {skill.name}
            </h1>
            <p className="truncate text-sm text-white/45">{skill.description}</p>
          </div>
          <span className="hidden shrink-0 border border-neon-green/30 px-2 py-1 font-display text-[10px] uppercase tracking-wider text-neon-green sm:inline">
            Online
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6">
        <ChatInterface
          skillId={skill.id}
          skillName={skill.name}
          initialMessages={initialMessages}
        />
      </main>
    </div>
  );
}