-- Migrazione Settimana 1 — solo tabelle/indici nuovi
-- Usa questo se hai già eseguito lo schema base.

CREATE TABLE IF NOT EXISTS instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  ig_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  name TEXT,
  profile_picture_url TEXT,
  followers_count INTEGER DEFAULT 0,
  follows_count INTEGER DEFAULT 0,
  media_count INTEGER DEFAULT 0,
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instagram_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 minutes')
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_skill
  ON conversations(user_id, skill_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_created
  ON conversations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user ON instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_ig ON instagram_accounts(ig_user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_cache_user ON instagram_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_cache_expires ON instagram_cache(expires_at);

ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_cache ENABLE ROW LEVEL SECURITY;
