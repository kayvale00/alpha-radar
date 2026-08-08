import Link from "next/link";

export function Navbar({
  showAuth = true,
}: {
  showAuth?: boolean;
}) {
  return (
    <header className="relative z-20 border-b border-white/5 bg-cyber-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-neon-cyan/40 animate-pulse-neon" />
            <span className="h-3 w-3 rounded-full bg-neon-green shadow-neon-green" />
          </span>
          <span className="font-display text-lg font-bold tracking-wider text-white group-hover:text-neon-cyan transition-colors sm:text-xl">
            ALPHA<span className="text-neon-green">RADAR</span>
          </span>
        </Link>

        {showAuth && (
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/auth/login"
              className="font-display text-xs uppercase tracking-widest text-white/70 hover:text-neon-cyan transition-colors sm:text-sm"
            >
              Login
            </Link>
            <Link href="/checkout/standard" className="btn-primary !px-4 !py-2 text-xs">
              Inizia
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
