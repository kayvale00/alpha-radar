import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { getPlan } from "@/lib/plans";

type Props = {
  params: { plan: string };
};

export default function CheckoutPage({ params }: Props) {
  const plan = getPlan(params.plan.toLowerCase());
  if (!plan) notFound();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-neon-magenta/10 blur-[100px]" />
        <div className="absolute bottom-20 left-0 h-[280px] w-[280px] rounded-full bg-neon-cyan/10 blur-[90px]" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-cyan">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
          Piano {plan.name}
        </h1>
        <p className="mt-2 text-white/50">{plan.tagline}</p>

        <div className="mt-8 neon-border bg-cyber-card/80 p-6 sm:p-8 animate-slide-up">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-6">
            <span className="font-display text-lg text-white">{plan.name}</span>
            <div className="text-right">
              <span className="font-display text-3xl font-extrabold text-neon-green">
                {plan.priceLabel}
              </span>
              <span className="text-white/40"> /mese</span>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-white/80">
                <span className="text-neon-cyan">▸</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3">
            <Link
              href={`/auth/register?plan=${plan.id}`}
              className="btn-primary w-full text-center"
            >
              Continua a Registrazione
            </Link>
            <Link
              href="/#pricing"
              className="block text-center font-display text-xs uppercase tracking-widest text-white/40 hover:text-neon-cyan transition-colors"
            >
              ← Torna ai piani
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/35">
          Pagamento simulato in questa demo — la registrazione attiva subito
          l&apos;accesso al dashboard.
        </p>
      </main>
    </div>
  );
}
