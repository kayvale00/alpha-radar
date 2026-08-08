import type { IgMediaItem, IgProfile } from "./meta";

export type AuraMetrics = {
  auraScore: number;
  engagementRate: number;
  consistencyScore: number;
  avgLikes: number;
  avgComments: number;
  bestPostHour: number | null;
  toneKeywords: string[];
  contentMix: { image: number; video: number; carousel: number };
  engagementSeries: { label: string; value: number }[];
  topPosts: {
    id: string;
    caption: string;
    score: number;
    likes: number;
    comments: number;
    type: string;
  }[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function computeAuraMetrics(
  profile: IgProfile | null,
  media: IgMediaItem[]
): AuraMetrics {
  if (!profile || media.length === 0) {
    return {
      auraScore: profile ? 35 : 0,
      engagementRate: 0,
      consistencyScore: 0,
      avgLikes: 0,
      avgComments: 0,
      bestPostHour: null,
      toneKeywords: [],
      contentMix: { image: 0, video: 0, carousel: 0 },
      engagementSeries: [],
      topPosts: [],
    };
  }

  const followers = Math.max(profile.followers_count, 1);
  const avgLikes =
    media.reduce((s, m) => s + (m.like_count || 0), 0) / media.length;
  const avgComments =
    media.reduce((s, m) => s + (m.comments_count || 0), 0) / media.length;
  const engagementRate = Number(
    (((avgLikes + avgComments * 3) / followers) * 100).toFixed(2)
  );

  // Consistency: media post negli ultimi N giorni
  const timestamps = media
    .map((m) => new Date(m.timestamp).getTime())
    .sort((a, b) => b - a);
  let gaps = 0;
  for (let i = 1; i < timestamps.length; i++) {
    gaps += (timestamps[i - 1] - timestamps[i]) / 86400000;
  }
  const avgGap = timestamps.length > 1 ? gaps / (timestamps.length - 1) : 7;
  const consistencyScore = Math.round(clamp(100 - avgGap * 8, 10, 100));

  const hourBuckets = new Array(24).fill(0);
  for (const m of media) {
    const h = new Date(m.timestamp).getHours();
    hourBuckets[h] += (m.like_count || 0) + (m.comments_count || 0) * 3;
  }
  const bestPostHour = hourBuckets.indexOf(Math.max(...hourBuckets));

  let image = 0;
  let video = 0;
  let carousel = 0;
  for (const m of media) {
    if (m.media_type === "VIDEO" || m.media_type === "REELS") video++;
    else if (m.media_type === "CAROUSEL_ALBUM") carousel++;
    else image++;
  }
  const total = Math.max(media.length, 1);
  const contentMix = {
    image: Math.round((image / total) * 100),
    video: Math.round((video / total) * 100),
    carousel: Math.round((carousel / total) * 100),
  };

  const words = media
    .flatMap((m) => (m.caption || "").toLowerCase().split(/[^a-zàèéìòù0-9]+/i))
    .filter((w) => w.length > 4);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const toneKeywords = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);

  const engagementSeries = [...media]
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .slice(-10)
    .map((m) => ({
      label: new Date(m.timestamp).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
      }),
      value: (m.like_count || 0) + (m.comments_count || 0) * 3,
    }));

  const topPosts = [...media]
    .map((m) => ({
      id: m.id,
      caption: (m.caption || "Senza caption").slice(0, 90),
      score: (m.like_count || 0) + (m.comments_count || 0) * 3,
      likes: m.like_count || 0,
      comments: m.comments_count || 0,
      type: m.media_type,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const auraScore = Math.round(
    clamp(
      engagementRate * 12 +
        consistencyScore * 0.35 +
        Math.min(avgLikes / 20, 25) +
        (contentMix.video > 20 ? 8 : 0),
      5,
      100
    )
  );

  return {
    auraScore,
    engagementRate,
    consistencyScore,
    avgLikes: Math.round(avgLikes),
    avgComments: Number(avgComments.toFixed(1)),
    bestPostHour: bestPostHour >= 0 ? bestPostHour : null,
    toneKeywords,
    contentMix,
    engagementSeries,
    topPosts,
  };
}
