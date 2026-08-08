import type { AuraMetrics } from "@/lib/aura";

export function AuraSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 neon-border bg-cyber-card/40" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 neon-border bg-cyber-card/40" />
        <div className="h-64 neon-border bg-cyber-card/40" />
      </div>
      <div className="h-48 neon-border bg-cyber-card/40" />
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "cyan",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "cyan" | "green" | "magenta";
}) {
  const color =
    accent === "green"
      ? "text-neon-green"
      : accent === "magenta"
        ? "text-neon-magenta"
        : "text-neon-cyan";

  return (
    <div className="neon-border neon-border-hover bg-cyber-card/70 p-4 sm:p-5 animate-fade-in">
      <p className="font-display text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl font-bold ${color}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

/** Chart SVG leggero — zero dipendenze, paint istantaneo */
export function EngagementChart({
  series,
}: {
  series: AuraMetrics["engagementSeries"];
}) {
  if (!series.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-white/40">
        Nessun dato engagement
      </div>
    );
  }

  const w = 560;
  const h = 200;
  const pad = 24;
  const max = Math.max(...series.map((s) => s.value), 1);
  const points = series.map((s, i) => {
    const x = pad + (i / Math.max(series.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - (s.value / max) * (h - pad * 2);
    return `${x},${y}`;
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[280px]">
        <defs>
          <linearGradient id="engFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#00f0ff"
          strokeWidth="2"
          points={points.join(" ")}
        />
        <polygon
          fill="url(#engFill)"
          points={`${pad},${h - pad} ${points.join(" ")} ${w - pad},${h - pad}`}
        />
        {series.map((s, i) => {
          const x =
            pad + (i / Math.max(series.length - 1, 1)) * (w - pad * 2);
          const y = h - pad - (s.value / max) * (h - pad * 2);
          return (
            <g key={s.label + i}>
              <circle cx={x} cy={y} r="3.5" fill="#00ff88" />
              <text
                x={x}
                y={h - 6}
                textAnchor="middle"
                fill="#ffffff55"
                fontSize="10"
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ContentMixBars({
  mix,
}: {
  mix: AuraMetrics["contentMix"];
}) {
  const rows = [
    { label: "Foto", value: mix.image, color: "#00f0ff" },
    { label: "Video/Reel", value: mix.video, color: "#00ff88" },
    { label: "Carousel", value: mix.carousel, color: "#ff00aa" },
  ];

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-white/70">{r.label}</span>
            <span className="font-display text-neon-cyan">{r.value}%</span>
          </div>
          <div className="h-2 bg-white/5">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${r.value}%`, background: r.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AuraScoreRing({ score }: { score: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#00ff88"
          strokeWidth="10"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-neon-green">
          {score}
        </span>
        <span className="font-display text-[10px] uppercase tracking-widest text-white/40">
          Aura
        </span>
      </div>
    </div>
  );
}
