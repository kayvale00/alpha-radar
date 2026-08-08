import { getSupabaseAdmin } from "./supabase";
import {
  CACHE_TTL_MS,
  IgMediaItem,
  IgProfile,
  fetchIgMedia,
  fetchIgProfile,
  getDemoSnapshot,
  isMetaConfigured,
} from "./meta";
import { computeAuraMetrics, AuraMetrics } from "./aura";

export type InstagramSnapshot = {
  connected: boolean;
  stale: boolean;
  demo: boolean;
  fetchedAt: string | null;
  expiresAt: string | null;
  profile: IgProfile | null;
  media: IgMediaItem[];
  metrics: AuraMetrics;
};

type CacheRow = {
  profile: IgProfile;
  media: IgMediaItem[];
  metrics: AuraMetrics;
  fetched_at: string;
  expires_at: string;
};

type AccountRow = {
  ig_user_id: string;
  username: string;
  access_token: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  name: string | null;
  profile_picture_url: string | null;
};

function emptyMetrics(): AuraMetrics {
  return computeAuraMetrics(null, []);
}

/** Lettura cache ONLY — zero chiamate Meta. Instant. */
export async function getCachedSnapshot(
  userId: string
): Promise<InstagramSnapshot> {
  const supabase = getSupabaseAdmin();

  const [{ data: cache }, { data: account }] = await Promise.all([
    supabase
      .from("instagram_cache")
      .select("profile, media, metrics, fetched_at, expires_at")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("instagram_accounts")
      .select(
        "ig_user_id, username, access_token, followers_count, follows_count, media_count, name, profile_picture_url"
      )
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (cache) {
    const row = cache as CacheRow;
    const stale = new Date(row.expires_at).getTime() < Date.now();
    return {
      connected: Boolean(account),
      stale,
      demo: false,
      fetchedAt: row.fetched_at,
      expiresAt: row.expires_at,
      profile: row.profile,
      media: Array.isArray(row.media) ? row.media : [],
      metrics: row.metrics || computeAuraMetrics(row.profile, row.media || []),
    };
  }

  if (account) {
    const acc = account as AccountRow;
    const profile: IgProfile = {
      id: acc.ig_user_id,
      username: acc.username,
      name: acc.name || undefined,
      profile_picture_url: acc.profile_picture_url || undefined,
      followers_count: acc.followers_count,
      follows_count: acc.follows_count,
      media_count: acc.media_count,
    };
    const metrics = computeAuraMetrics(profile, []);
    return {
      connected: true,
      stale: true,
      demo: false,
      fetchedAt: null,
      expiresAt: null,
      profile,
      media: [],
      metrics,
    };
  }

  // Nessun account: demo istantanea per Creator (zero sync wait)
  const demo = getDemoSnapshot();
  const metrics = computeAuraMetrics(demo.profile, demo.media);
  return {
    connected: false,
    stale: false,
    demo: true,
    fetchedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
    profile: demo.profile,
    media: demo.media,
    metrics,
  };
}

export async function upsertCache(
  userId: string,
  profile: IgProfile,
  media: IgMediaItem[]
) {
  const metrics = computeAuraMetrics(profile, media);
  const now = new Date();
  const expires = new Date(now.getTime() + CACHE_TTL_MS);
  const supabase = getSupabaseAdmin();

  await supabase.from("instagram_cache").upsert(
    {
      user_id: userId,
      profile,
      media,
      metrics,
      fetched_at: now.toISOString(),
      expires_at: expires.toISOString(),
    },
    { onConflict: "user_id" }
  );

  return { metrics, fetchedAt: now.toISOString(), expiresAt: expires.toISOString() };
}

/**
 * Refresh da Meta. Se force=false e cache fresca → return cache.
 * Se force=false e stale → aggiorna. Mai bloccare UI con "sincronizzazione".
 */
export async function refreshInstagramData(
  userId: string,
  options: { force?: boolean } = {}
): Promise<InstagramSnapshot> {
  const { force = false } = options;
  const supabase = getSupabaseAdmin();

  if (!force) {
    const cached = await getCachedSnapshot(userId);
    if (cached.connected && !cached.stale && cached.media.length > 0) {
      return cached;
    }
  }

  const { data: account } = await supabase
    .from("instagram_accounts")
    .select("ig_user_id, username, access_token")
    .eq("user_id", userId)
    .maybeSingle();

  if (!account) {
    return getCachedSnapshot(userId);
  }

  if (!isMetaConfigured()) {
    const demo = getDemoSnapshot(account.username);
    const saved = await upsertCache(userId, demo.profile, demo.media);
    return {
      connected: true,
      stale: false,
      demo: true,
      fetchedAt: saved.fetchedAt,
      expiresAt: saved.expiresAt,
      profile: demo.profile,
      media: demo.media,
      metrics: saved.metrics,
    };
  }

  try {
    const [profile, media] = await Promise.all([
      fetchIgProfile(account.ig_user_id, account.access_token),
      fetchIgMedia(account.ig_user_id, account.access_token, 12),
    ]);

    await supabase
      .from("instagram_accounts")
      .update({
        username: profile.username,
        name: profile.name || null,
        profile_picture_url: profile.profile_picture_url || null,
        followers_count: profile.followers_count,
        follows_count: profile.follows_count,
        media_count: profile.media_count,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    const saved = await upsertCache(userId, profile, media);

    return {
      connected: true,
      stale: false,
      demo: false,
      fetchedAt: saved.fetchedAt,
      expiresAt: saved.expiresAt,
      profile,
      media,
      metrics: saved.metrics,
    };
  } catch (err) {
    console.error("Instagram refresh failed:", err);
    // Fallback: ritorna cache esistente subito (mai lasciare l'utente in attesa)
    const fallback = await getCachedSnapshot(userId);
    return { ...fallback, stale: true };
  }
}

/**
 * Contesto compatto per Claude — dalla cache, 0ms Meta.
 */
export function buildClaudeIgContext(snapshot: InstagramSnapshot): string {
  if (!snapshot.profile) {
    return "Nessun dato Instagram disponibile.";
  }

  const p = snapshot.profile;
  const m = snapshot.metrics;
  const top = [...snapshot.media]
    .sort(
      (a, b) =>
        b.like_count + b.comments_count * 3 - (a.like_count + a.comments_count * 3)
    )
    .slice(0, 5)
    .map(
      (post, i) =>
        `${i + 1}. [${post.media_type}] ❤️${post.like_count} 💬${post.comments_count} — ${(post.caption || "").slice(0, 80)}`
    )
    .join("\n");

  return `DATI INSTAGRAM REALI (cache, aggiornati: ${snapshot.fetchedAt || "n/d"}):
@${p.username} | follower ${p.followers_count} | following ${p.follows_count} | media ${p.media_count}
Aura Score: ${m.auraScore}/100 | Engagement rate: ${m.engagementRate}% | Consistency: ${m.consistencyScore}/100
Mix: foto ${m.contentMix.image}% · video/reel ${m.contentMix.video}% · carousel ${m.contentMix.carousel}%
Tone: ${m.toneKeywords.join(", ") || "n/d"}
Top post:
${top || "nessun post in cache"}
Demo mode: ${snapshot.demo ? "sì" : "no"} | Stale: ${snapshot.stale ? "sì" : "no"}`;
}

export { emptyMetrics };
