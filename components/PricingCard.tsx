import Link from "next/link";
import { Plan } from "@/lib/plans";

export function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col neon-border neon-border-hover bg-cyber-card/80 p-6 sm:p-8 animate-slide-up ${
        plan.highlighted ? "ring-1 ring-neon-magenta/50" : ""
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-magenta px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-white">
          Consigliato
        </span>
      )}

      <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
      <p className="mt-1 text-white/50">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-extrabold text-neon-green">
          {plan.priceLabel}
        </span>
        <span className="text-white/40">/mese</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
            <span className="mt-1 text-neon-cyan">▸</span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/checkout/${plan.id}`}
        className={`mt-8 w-full text-center ${
          plan.highlighted ? "btn-primary" : "btn-secondary"
        }`}
      >
        Inizia con {plan.name}
      </Link>
    </div>
  );
}
