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
