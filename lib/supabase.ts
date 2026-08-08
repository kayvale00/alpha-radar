import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminClient;
}

export type UserRow = {
  id: string;
  email: string;
  password: string;
  nome: string;
  categoria: string;
  piano: string;
  created_at: string;
};

export type ConversationRow = {
  id: string;
  user_id: string;
  skill_id: string;
  user_message: string;
  ai_response: string | null;
  created_at: string;
};

export type InstagramAccountRow = {
  id: string;
  user_id: string;
  ig_user_id: string;
  username: string;
  name: string | null;
  profile_picture_url: string | null;
  followers_count: number;
  follows_count: number;
  media_count: number;
  access_token: string;
  token_expires_at: string | null;
  connected_at: string;
  updated_at: string;
};

export type InstagramCacheRow = {
  id: string;
  user_id: string;
  profile: Record<string, unknown>;
  media: unknown[];
  metrics: Record<string, unknown>;
  fetched_at: string;
  expires_at: string;
};
