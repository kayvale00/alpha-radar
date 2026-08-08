-- Alpha Radar schema for Supabase
-- Run this in the SQL Editor of your Supabase project

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

CREATE INDEX IF NOT EXISTS idx_conversations_user_skill
  ON conversations(user_id, skill_id, created_at);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Service role bypasses RLS; keep tables locked for anon/authenticated
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
