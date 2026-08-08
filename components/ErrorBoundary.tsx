"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-magenta mb-3">
        System Error
      </p>
      <h2 className="font-display text-2xl font-bold text-white mb-2">
        Qualcosa è andato storto
      </h2>
      <p className="max-w-md text-white/60 mb-6">
        {error.message || "Errore imprevisto. Riprova."}
      </p>
      <button onClick={reset} className="btn-secondary">
        Riprova
      </button>
    </div>
  );
}
