/** Meta / Instagram Graph API — priorità velocità */

export const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minuti
export const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";
export const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

export type IgProfile = {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  biography?: string;
};

export type IgMediaItem = {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  impressions?: number;
  reach?: number;
  saved?: number;
};

export function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  return raw.replace(/\/$/, "");
}

export function getMetaRedirectUri() {
  return (
    process.env.META_REDIRECT_URI ||
    `${getAppUrl()}/api/meta/callback`
  );
}

export function isMetaConfigured(): boolean {
  return Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
}

/** URL OAuth Meta — Instagram Business Login via Facebook Login */
export function buildMetaOAuthUrl(state: string): string {
  const appId = process.env.META_APP_ID;
  if (!appId) throw new Error("META_APP_ID non configurato");

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: getMetaRedirectUri(),
    state,
    scope: [
      "instagram_basic",
      "instagram_manage_insights",
      "pages_show_list",
      "pages_read_engagement",
      "business_management",
    ].join(","),
    response_type: "code",
  });

  return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  expires_in?: number;
}> {
  const appId = process.env.META_APP_ID!;
  const appSecret = process.env.META_APP_SECRET!;

  const url = new URL(`${GRAPH_BASE}/oauth/access_token`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("redirect_uri", getMetaRedirectUri());
  url.searchParams.set("code", code);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Token exchange fallito");
  }
  return data;
}

/** Long-lived user token (~60 giorni) */
export async function exchangeLongLivedToken(shortToken: string): Promise<{
  access_token: string;
  expires_in?: number;
}> {
  const url = new URL(`${GRAPH_BASE}/oauth/access_token`);
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", process.env.META_APP_ID!);
  url.searchParams.set("client_secret", process.env.META_APP_SECRET!);
  url.searchParams.set("fb_exchange_token", shortToken);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json();
  if (!res.ok || data.error) {
    // fallback: usa short token
    return { access_token: shortToken };
  }
  return data;
}

type GraphPage = {
  id: string;
  name?: string;
  access_token?: string;
  instagram_business_account?: { id: string };
};

/**
 * Risolve Instagram Business Account collegato alla Page.
 * Timeout aggressivo per OAuth < 2s.
 */
export async function resolveInstagramAccount(
  userToken: string,
  timeoutMs = 1500
): Promise<{ igUserId: string; pageToken: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${GRAPH_BASE}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${encodeURIComponent(userToken)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Impossibile leggere Pages");
    }

    const pages = (data.data || []) as GraphPage[];
    const withIg = pages.find((p) => p.instagram_business_account?.id);
    if (!withIg?.instagram_business_account?.id || !withIg.access_token) {
      throw new Error(
        "Nessun Instagram Business Account collegato a una Facebook Page"
      );
    }

    return {
      igUserId: withIg.instagram_business_account.id,
      pageToken: withIg.access_token,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchIgProfile(
  igUserId: string,
  token: string,
  timeoutMs = 1200
): Promise<IgProfile> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fields = [
      "id",
      "username",
      "name",
      "profile_picture_url",
      "followers_count",
      "follows_count",
      "media_count",
      "biography",
    ].join(",");
    const url = `${GRAPH_BASE}/${igUserId}?fields=${fields}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Profilo IG non disponibile");
    }
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      profile_picture_url: data.profile_picture_url,
      followers_count: data.followers_count ?? 0,
      follows_count: data.follows_count ?? 0,
      media_count: data.media_count ?? 0,
      biography: data.biography,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchIgMedia(
  igUserId: string,
  token: string,
  limit = 12,
  timeoutMs = 2500
): Promise<IgMediaItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "permalink",
      "thumbnail_url",
      "timestamp",
      "like_count",
      "comments_count",
    ].join(",");
    const url = `${GRAPH_BASE}/${igUserId}/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Media IG non disponibili");
    }

    const items = (data.data || []) as Omit<
      IgMediaItem,
      "impressions" | "reach" | "saved"
    >[];

    // Insights in parallelo (best-effort, non blocca se falliscono)
    const enriched = await Promise.all(
      items.map(async (item) => {
        try {
          const insights = await fetchMediaInsights(item.id, token, 800);
          return { ...item, ...insights };
        } catch {
          return {
            ...item,
            like_count: item.like_count ?? 0,
            comments_count: item.comments_count ?? 0,
          };
        }
      })
    );

    return enriched;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchMediaInsights(
  mediaId: string,
  token: string,
  timeoutMs: number
): Promise<{ impressions?: number; reach?: number; saved?: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${GRAPH_BASE}/${mediaId}/insights?metric=impressions,reach,saved&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data.error) return {};
    const map: Record<string, number> = {};
    for (const row of data.data || []) {
      map[row.name] = row.values?.[0]?.value ?? 0;
    }
    return {
      impressions: map.impressions,
      reach: map.reach,
      saved: map.saved,
    };
  } catch {
    return {};
  } finally {
    clearTimeout(timer);
  }
}

/** Demo data se Meta non configurato — Aura Mirror sempre istantaneo in dev */
export function getDemoSnapshot(username = "alpharadar_demo") {
  const now = Date.now();
  const media: IgMediaItem[] = Array.from({ length: 10 }).map((_, i) => {
    const daysAgo = i * 2;
    const likes = 120 + Math.round(Math.sin(i) * 40) + i * 18;
    const comments = 8 + (i % 5) * 3;
    return {
      id: `demo-${i}`,
      caption: `Post demo #${i + 1} — aura content`,
      media_type: i % 3 === 0 ? "VIDEO" : "IMAGE",
      timestamp: new Date(now - daysAgo * 86400000).toISOString(),
      like_count: likes,
      comments_count: comments,
      impressions: likes * 12,
      reach: likes * 9,
      saved: Math.round(likes * 0.08),
      permalink: "https://instagram.com",
    };
  });

  const profile: IgProfile = {
    id: "demo-ig",
    username,
    name: "Alpha Radar Demo",
    followers_count: 12840,
    follows_count: 420,
    media_count: 156,
    biography: "Demo Creator — Settimana 1 Instant",
    profile_picture_url: undefined,
  };

  return { profile, media };
}
