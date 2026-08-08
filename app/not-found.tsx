export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-magenta">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">
        Pagina non trovata
      </h1>
      <a
        href="/"
        className="btn-secondary mt-8"
      >
        Torna alla home
      </a>
    </div>
  );
}
