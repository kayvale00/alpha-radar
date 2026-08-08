# Alpha Radar — Settimana 1 Instant

Il Radar per le tue Opportunità — Meta/Instagram + Aura Mirror fulmine + Claude con dati utente subito.

## Stack

- Next.js 14 (App Router)
- TailwindCSS (dark cyberpunk)
- Supabase (PostgreSQL + cache JSONB)
- Meta Instagram Graph API
- Anthropic Claude (`claude-sonnet-4-6`)
- JWT session (jose + bcryptjs)

## Speed (Week 1)

| Path | Target |
|------|--------|
| OAuth → Aura Mirror | < 2s (seed profilo + redirect, media in background) |
| Aura Mirror charts | Instant (cache DB + Suspense/Skeleton, SVG zero-deps) |
| Chat Claude + IG context | < 3s TTFT (cache only, no Meta in request) |
| Cache TTL | 30 min + auto-refresh bg + bottone Refresh |

Zero UI "Sincronizzazione in corso".

## Setup

```bash
npm install
cp .env.example .env.local
```

Env richieste:

- `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY` / `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- Opzionali Meta: `META_APP_ID`, `META_APP_SECRET`, `META_REDIRECT_URI`  
  (se assenti → `/api/meta/connect` usa demo seed istantaneo)

SQL:

1. Nuovo progetto → `supabase/schema.sql`
2. Già in produzione → `supabase/migration-week1.sql`

```bash
npm run dev
```

## Flusso Creator

1. Register come **Creator**
2. Dashboard → **Collega Instagram** (o demo)
3. Redirect Aura Mirror con grafici dalla cache
4. Background refresh media (silenzioso)
5. Chat skill → Claude riceve snapshot IG subito

## API

- `GET /api/meta/connect` — avvia OAuth (o demo)
- `GET /api/meta/callback` — callback veloce
- `GET/POST /api/instagram/refresh?force=1` — refresh cache
- `GET /api/instagram/snapshot` — lettura cache only
- `POST /api/chat` — Claude + contesto IG cached

## Deploy

Vercel: imposta env + redirect Meta `https://<domain>/api/meta/callback`.
