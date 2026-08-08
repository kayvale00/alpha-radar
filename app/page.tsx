import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PricingCard } from "@/components/PricingCard";
import { PLANS } from "@/lib/plans";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-neon-cyan/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-neon-magenta/10 blur-[100px]" />
        <div className="absolute top-1/3 left-0 h-[280px] w-[280px] rounded-full bg-neon-green/5 blur-[90px]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24 sm:pb-28">
          <p className="mb-4 font-display text-xs uppercase tracking-[0.35em] text-neon-cyan animate-fade-in">
            Opportunity Intelligence
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl animate-slide-up">
            Alpha Radar
          </h1>
          <p className="mt-4 max-w-2xl font-display text-lg text-neon-green sm:text-2xl animate-slide-up">
            Il Radar per le tue Opportunità
          </p>
          <p className="mt-6 max-w-xl text-base text-white/55 sm:text-lg animate-fade-in">
            Skill AI specializzate per Creator, E-commerce, Trader, Startup e
            Consulenti. Rileva segnali, agisci prima degli altri.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4 animate-slide-up">
            <Link href="/checkout/standard" className="btn-primary">
              Inizia con Standard
            </Link>
            <Link href="/checkout/pro" className="btn-secondary">
              Inizia con Pro
            </Link>
          </div>

          {/* Radar visual */}
          <div className="relative mt-16 h-48 w-48 sm:h-56 sm:w-56">
            <div className="absolute inset-0 rounded-full border border-neon-cyan/20" />
            <div className="absolute inset-4 rounded-full border border-neon-green/20" />
            <div className="absolute inset-8 rounded-full border border-neon-magenta/20" />
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s" }}>
              <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom bg-gradient-to-t from-neon-green to-transparent" />
            </div>
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green shadow-neon-green" />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="mb-10 text-center">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-magenta">
              Pricing
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Scegli il tuo piano
            </h2>
            <p className="mt-3 text-white/50">
              Standard €49 · Pro €97 — attiva il radar in pochi minuti.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            <PricingCard plan={PLANS.standard} />
            <PricingCard plan={PLANS.pro} />
          </div>
        </section>

        {/* Categories teaser */}
        <section className="border-t border-white/5 bg-cyber-darker/50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
              5 categorie · 25 skill
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Creator", "E-commerce", "Trader", "Startup", "Consulente"].map(
                (cat) => (
                  <span
                    key={cat}
                    className="neon-border bg-cyber-card px-4 py-2 font-display text-xs uppercase tracking-widest text-neon-cyan"
                  >
                    {cat}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-white/30">
        © {new Date().getFullYear()} Alpha Radar. All systems operational.
      </footer>
    </div>
  );
}
