import Link from "next/link";
import { Skill } from "@/lib/skills";

export function SkillCard({ skill }: { skill: Skill }) {
  const isAura = skill.id === "aura-mirror";
  const href = isAura
    ? "/dashboard/aura-mirror"
    : `/dashboard/chat/${skill.id}`;

  return (
    <Link
      href={href}
      className="group block neon-border neon-border-hover bg-cyber-card/70 p-5 animate-slide-up"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="h-2 w-2 rounded-full bg-neon-green shadow-neon-green group-hover:bg-neon-cyan group-hover:shadow-neon-cyan transition-all" />
        <span className="font-display text-[10px] uppercase tracking-widest text-neon-magenta/70">
          {isAura ? "Fulmine" : "Skill"}
        </span>
      </div>
      <h3 className="font-display text-base font-bold text-white group-hover:text-neon-cyan transition-colors sm:text-lg">
        {skill.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        {skill.description}
      </p>
      <span className="mt-4 inline-block font-display text-xs uppercase tracking-wider text-neon-green opacity-0 group-hover:opacity-100 transition-opacity">
        {isAura ? "Apri dashboard →" : "Apri chat →"}
      </span>
    </Link>
  );
}
