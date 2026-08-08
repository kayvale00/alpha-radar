import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getSkillsByCategory } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";
import { logoutAction } from "@/app/auth/actions";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const skills = getSkillsByCategory(session.categoria);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[320px] w-[320px] rounded-full bg-neon-cyan/8 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-neon-green/8 blur-[100px]" />
      </div>

      <header className="relative z-20 border-b border-white/5 bg-cyber-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="font-display text-lg font-bold tracking-wider text-white">
            ALPHA<span className="text-neon-green">RADAR</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-display text-xs uppercase tracking-widest text-white/60 hover:text-neon-magenta transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="neon-border bg-cyber-card/60 p-5 sm:p-6 animate-fade-in">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-cyan">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            Ciao, {session.nome}
          </h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 font-display text-xs uppercase tracking-wider text-neon-cyan">
              {session.categoria}
            </span>
            <span className="border border-neon-green/40 bg-neon-green/10 px-3 py-1 font-display text-xs uppercase tracking-wider text-neon-green">
              Piano {session.piano}
            </span>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-white">
            Le tue Skill
          </h2>
          <p className="mt-1 text-white/45">
            Seleziona una skill per aprire la chat AI dedicata.
          </p>

          {skills.length === 0 ? (
            <p className="mt-6 text-neon-magenta">
              Nessuna skill trovata per la categoria &quot;{session.categoria}&quot;.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
