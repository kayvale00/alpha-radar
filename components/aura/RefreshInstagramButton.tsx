"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  /** Avvia refresh silenzioso al mount (post-OAuth o cache stale) */
  autoRefresh?: boolean;
  stale?: boolean;
  fetchedAt?: string | null;
};

export function RefreshInstagramButton({
  autoRefresh = false,
  stale = false,
  fetchedAt,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runRefresh = useCallback(
    async (force: boolean) => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/instagram/refresh?force=${force ? "1" : "0"}`,
          { method: "POST", body: JSON.stringify({ force }) }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Refresh fallito");
        setLastMs(data.ms);
        startTransition(() => router.refresh());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore refresh");
      } finally {
        setBusy(false);
      }
    },
    [router]
  );

  // Background auto-refresh — NON mostra "Sincronizzazione in corso"
  useEffect(() => {
    if (!autoRefresh && !stale) return;
    void runRefresh(Boolean(autoRefresh));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh ogni 30 minuti in background
  useEffect(() => {
    const id = setInterval(
      () => {
        void runRefresh(false);
      },
      30 * 60 * 1000
    );
    return () => clearInterval(id);
  }, [runRefresh]);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => runRefresh(true)}
        disabled={busy || pending}
        className="btn-secondary !px-4 !py-2 text-xs disabled:opacity-50"
        title="Forza aggiornamento Instagram"
      >
        {busy || pending ? "Updating…" : "Refresh"}
      </button>
      <p className="text-[10px] text-white/35 font-display uppercase tracking-wider">
        {fetchedAt
          ? `Cache ${new Date(fetchedAt).toLocaleTimeString("it-IT")}`
          : "Cache ready"}
        {lastMs != null ? ` · ${lastMs}ms` : ""}
        {stale ? " · stale→bg" : ""}
      </p>
      {error && (
        <p className="text-[10px] text-neon-magenta max-w-[200px] text-right">
          {error}
        </p>
      )}
    </div>
  );
}
