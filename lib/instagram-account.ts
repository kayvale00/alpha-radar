import { getSupabaseAdmin } from "./supabase";
import type { IgProfile } from "./meta";
import { upsertCache } from "./instagram-cache";

/**
 * Salvataggio account + seed cache profilo — usato nel callback OAuth.
 * Deve completare in < ~1.5s insieme alle chiamate Graph.
 */
export async function saveInstagramAccountFast(params: {
  userId: string;
  profile: IgProfile;
  accessToken: string;
  tokenExpiresAt?: Date | null;
}) {
  const { userId, profile, accessToken, tokenExpiresAt } = params;
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  await supabase.from("instagram_accounts").upsert(
    {
      user_id: userId,
      ig_user_id: profile.id,
      username: profile.username,
      name: profile.name || null,
      profile_picture_url: profile.profile_picture_url || null,
      followers_count: profile.followers_count,
      follows_count: profile.follows_count,
      media_count: profile.media_count,
      access_token: accessToken,
      token_expires_at: tokenExpiresAt?.toISOString() || null,
      connected_at: now,
      updated_at: now,
    },
    { onConflict: "user_id" }
  );

  // Seed cache IMMEDIATO con profilo (media arriveranno in background)
  await upsertCache(userId, profile, []);
}
