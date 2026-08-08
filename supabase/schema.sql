-- Alpha Radar — Settimana 1 (Instant Version)
-- Esegui DOPO schema.sql base, oppure l'intero file su progetto nuovo.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('Creator', 'E-commerce', 'Trader', 'Startup', 'Consulente')),
  piano TEXT NOT NULL CHECK (piano IN ('Standard', 'Pro')) DEFAULT 'Standard',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meta / Instagram account (token salvato server-side)
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

-- Cache snapshot Instagram (TTL 30 min) — lettura istantanea
CREATE TABLE IF NOT EXISTS instagram_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 minutes')
);

-- Indici ottimizzati (query veloci)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_conversations_user_skill
  ON conversations(user_id, skill_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_created
  ON conversations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user
  ON instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_ig
  ON instagram_accounts(ig_user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_cache_user
  ON instagram_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_cache_expires
  ON instagram_cache(expires_at);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_cache ENABLE ROW LEVEL SECURITY;
