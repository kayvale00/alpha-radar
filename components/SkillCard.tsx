import Link from "next/link";
import { Skill } from "@/lib/skills";

interface SkillCardProps {
  skill: Skill;
  index: number;
  isPro: boolean;
}

export function SkillCard({ skill, index, isPro }: SkillCardProps) {
  const isAura = skill.id === "aura-mirror";
  const isLocked = !isPro && index >= 2; // Standard: solo primi 2 skill
  
  const href = isAura
    ? "/dashboard/aura-mirror"
    : `/dashboard/chat/${skill.id}`;

  const cardContent = (
    <div className={`group block neon-border neon-border-hover bg-cyber-card/70 p-5 animate-slide-up ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`h-2 w-2 rounded-full ${isLocked ? 'bg-gray-500' : 'bg-neon-green'} shadow-neon-green group-hover:bg-neon-cyan group-hover:shadow-neon-cyan transition-all`} />
        <span className={`font-display text-[10px] uppercase tracking-widest ${isLocked ? 'text-gray-500' : 'text-neon-magenta/70'}`}>
          {isAura ? "Fulmine" : "Skill"}
        </span>
      </div>
      <h3 className={`font-display text-base font-bold ${isLocked ? 'text-gray-400' : 'text-white group-hover:text-neon-cyan'} transition-colors sm:text-lg`}>
        {skill.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        {skill.description}
      </p>
      {isLocked && (
        <span className="mt-4 inline-block font-display text-xs uppercase tracking-wider text-neon-magenta font-bold">
          🔒 Upgrade to Pro
        </span>
      )}
      {!isLocked && (
        <span className="mt-4 inline-block font-display text-xs uppercase tracking-wider text-neon-green opacity-0 group-hover:opacity-100 transition-opacity">
          {isAura ? "Apri dashboard →" : "Apri chat →"}
        </span>
      )}
    </div>
  );

  return isLocked ? (
    <div className="cursor-not-allowed">{cardContent}</div>
  ) : (
    <Link href={href}>{cardContent}</Link>
  );
}