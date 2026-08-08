import Link from "next/link";
import type { InstagramSnapshot } from "@/lib/instagram-cache";
import {
  AuraScoreRing,
  ContentMixBars,
  EngagementChart,
  StatCard,
} from "./AuraCharts";
import { RefreshInstagramButton } from "./RefreshInstagramButton";

export function AuraMirrorPanel({
  snapshot,
  autoBgRefresh = false,
}: {
  snapshot: InstagramSnapshot;
  autoBgRefresh?: boolean;
}) {
  const { profile, metrics } = snapshot;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-magenta">
            Aura Mirror · Fulmine
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
            @{profile?.username || "creator"}
          </h1>
          <p className="mt-1 text-sm text-white/45">
            {snapshot.demo
              ? "Modalità demo — collega Meta per dati reali"
              : snapshot.connected
                ? "Dati Instagram dalla cache (30 min TTL)"
                : "Collega Instagram per dati live"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!snapshot.connected && (
            <Link href="/api/meta/connect" className="btn-primary !px-4 !py-2 text-xs">
              Collega Instagram
            </Link>
          )}
          {snapshot.connected && (
            <RefreshInstagramButton
              autoRefresh={autoBgRefresh || snapshot.stale}
              stale={snapshot.stale}
              fetchedAt={snapshot.fetchedAt}
            />
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="neon-border bg-cyber-card/70 p-4 flex items-center justify-center">
          <AuraScoreRing score={metrics.auraScore} />
        </div>
        <StatCard
          label="Engagement rate"
          value={`${metrics.engagementRate}%`}
          hint={`Avg ❤️ ${metrics.avgLikes} · 💬 ${metrics.avgComments}`}
          accent="cyan"
        />
        <StatCard
          label="Consistency"
          value={metrics.consistencyScore}
          hint={
            metrics.bestPostHour != null
              ? `Best hour: ${metrics.bestPostHour}:00`
              : "—"
          }
          accent="green"
        />
        <StatCard
          label="Followers"
          value={profile?.followers_count?.toLocaleString("it-IT") || "—"}
          hint={`${profile?.media_count ?? 0} media`}
          accent="magenta"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="neon-border bg-cyber-card/60 p-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-neon-cyan mb-4">
            Engagement trend
          </h2>
          <EngagementChart series={metrics.engagementSeries} />
        </div>
        <div className="neon-border bg-cyber-card/60 p-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-neon-cyan mb-4">
            Content mix
          </h2>
          <ContentMixBars mix={metrics.contentMix} />
          {metrics.toneKeywords.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {metrics.toneKeywords.map((k) => (
                <span
                  key={k}
                  className="border border-neon-magenta/30 bg-neon-magenta/10 px-2 py-1 text-xs text-neon-magenta"
                >
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="neon-border bg-cyber-card/60 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-sm uppercase tracking-widest text-neon-cyan">
            Top posts
          </h2>
          <Link
            href="/dashboard/chat/aura-mirror"
            className="font-display text-xs uppercase tracking-wider text-neon-green hover:underline"
          >
            Chat Aura →
          </Link>
        </div>
        <ul className="space-y-3">
          {metrics.topPosts.length === 0 && (
            <li className="text-sm text-white/40">
              Nessun post in cache. Premi Refresh.
            </li>
          )}
          {metrics.topPosts.map((p, i) => (
            <li
              key={p.id}
              className="flex gap-3 border-b border-white/5 pb-3 last:border-0"
            >
              <span className="font-display text-neon-green w-6">#{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white/85">{p.caption}</p>
                <p className="mt-1 text-xs text-white/40">
                  {p.type} · ❤️ {p.likes} · 💬 {p.comments} · score {p.score}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
