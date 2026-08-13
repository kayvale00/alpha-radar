import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cyber-black">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-neon-cyan/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-neon-magenta/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] rounded-full bg-neon-green/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-cyber-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-wider text-white animate-fade-in"
          >
            ALPHA<span className="text-neon-green">RADAR</span>
          </Link>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="font-display text-xs uppercase tracking-widest text-white/60 hover:text-neon-cyan transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="font-display text-xs uppercase tracking-widest text-neon-green hover:text-neon-cyan transition-colors"
            >
              Registrati
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-32 sm:pb-32">
          <p className="mb-4 font-display text-xs uppercase tracking-[0.35em] text-neon-cyan animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Opportunity Intelligence
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-7xl animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Alpha Radar
          </h1>
          <p className="mt-4 max-w-2xl font-display text-xl text-neon-green sm:text-2xl animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            Il Radar per le tue Opportunità
          </p>
          <p className="mt-6 max-w-xl text-base text-white/55 sm:text-lg animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            Skill AI specializzate per Creator, Trader, E-commerce, Startup e Consulenti. Rileva segnali, agisci prima degli altri.
          </p>

          {/* Animated radar visual */}
          <div className="relative mt-16 h-56 w-56 sm:h-72 sm:w-72 animate-fade-in opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div className="absolute inset-0 rounded-full border border-neon-cyan/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-neon-green/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-8 rounded-full border border-neon-magenta/30 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Rotating radar arm */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
              <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom bg-gradient-to-t from-neon-green to-transparent" />
            </div>
            
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green shadow-lg" style={{ boxShadow: '0 0 20px rgba(34, 255, 136, 0.8)' }} />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="mb-16 text-center">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-magenta">
              Pricing
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
              Scegli il tuo piano
            </h2>
            <p className="mt-3 text-white/50">
              Standard €29 · Pro €59 · Extreme €99
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {/* Standard */}
            <div className="group neon-border relative bg-cyber-card/50 p-8 transition-all duration-300 hover:bg-cyber-card/80 hover:shadow-lg animate-slide-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-green/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="relative font-display text-2xl font-bold text-white">Standard</h3>
              <p className="relative mt-2 text-sm text-white/60">Per iniziare</p>
              <div className="relative mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-neon-green">€29</span>
                <span className="text-sm text-white/40">/mese</span>
              </div>
              <ul className="relative mt-6 space-y-3 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-neon-green">✓</span> 2 skill della tua categoria
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-green">✓</span> Chat illimitata
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">✗</span> Aura Mirror
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">✗</span> Social connect
                </li>
              </ul>
              <Link href="/auth/register?plan=standard" className="relative mt-8 block w-full rounded border border-neon-green bg-neon-green/10 py-2.5 text-center font-display text-sm uppercase tracking-wider text-neon-green transition-all hover:bg-neon-green hover:text-black">
                Inizia
              </Link>
            </div>

            {/* Pro - Featured */}
            <div className="group neon-border relative bg-gradient-to-b from-neon-magenta/10 to-cyber-card/50 p-8 ring-1 ring-neon-magenta/30 transition-all duration-300 hover:ring-neon-magenta/60 md:scale-105 animate-slide-up opacity-0" style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-neon-magenta to-neon-cyan px-4 py-1 font-display text-xs uppercase tracking-wider text-white">
                Più popolare
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-magenta/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="relative font-display text-2xl font-bold text-white">Pro</h3>
              <p className="relative mt-2 text-sm text-white/60">Accesso completo</p>
              <div className="relative mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-neon-magenta">€59</span>
                <span className="text-sm text-white/40">/mese</span>
              </div>
              <ul className="relative mt-6 space-y-3 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-neon-magenta">✓</span> 5 skill della tua categoria
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">✓</span> Chat illimitata
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">✓</span> Aura Mirror (Creator)
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">✓</span> Social connect
                </li>
              </ul>
              <Link href="/auth/register?plan=pro" className="relative mt-8 block w-full rounded bg-gradient-to-r from-neon-magenta to-neon-cyan py-2.5 text-center font-display text-sm uppercase tracking-wider text-black transition-all hover:shadow-lg">
                Inizia
              </Link>
            </div>

            {/* Extreme */}
            <div className="group neon-border relative bg-cyber-card/50 p-8 transition-all duration-300 hover:bg-cyber-card/80 hover:shadow-lg animate-slide-up opacity-0" style={{ animationDelay: '1.6s', animationFillMode: 'forwards' }}>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="relative font-display text-2xl font-bold text-white">Extreme</h3>
              <p className="relative mt-2 text-sm text-white/60">Tutto sbloccato</p>
              <div className="relative mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-neon-cyan">€99</span>
                <span className="text-sm text-white/40">/mese</span>
              </div>
              <ul className="relative mt-6 space-y-3 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-neon-cyan">✓</span> TUTTE le skill di TUTTE le categorie
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-cyan">✓</span> Chat illimitata
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-cyan">✓</span> Aura Mirror
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-cyan">✓</span> Social connect
                </li>
              </ul>
              <Link href="/auth/register?plan=extreme" className="relative mt-8 block w-full rounded border border-neon-cyan bg-neon-cyan/10 py-2.5 text-center font-display text-sm uppercase tracking-wider text-neon-cyan transition-all hover:bg-neon-cyan hover:text-black">
                Inizia
              </Link>
            </div>
          </div>
        </section>

        {/* Categories teaser */}
        <section className="border-t border-white/5 bg-cyber-darker/50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl">
              5 categorie · 25+ skill
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {["Creator", "Trader", "E-commerce", "Startup", "Consulente"].map(
                (cat) => (
                  <span
                    key={cat}
                    className="neon-border bg-cyber-card px-4 py-2 font-display text-xs uppercase tracking-widest text-neon-cyan animate-slide-up opacity-0"
                    style={{ animationDelay: `${1.8 + (cat.length * 0.1)}s`, animationFillMode: 'forwards' }}
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}