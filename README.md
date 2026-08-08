# Alpha Radar

Il Radar per le tue Opportunità — piattaforma AI con skill specializzate per Creator, E-commerce, Trader, Startup e Consulenti.

## Stack

- Next.js 14 (App Router)
- TailwindCSS (dark cyberpunk)
- Supabase (PostgreSQL)
- Anthropic Claude (claude-sonnet-4-6)
- JWT session cookies (jose + bcryptjs)

## Setup

1. Installa dipendenze:

```bash
npm install
```

2. Copia le variabili d'ambiente:

```bash
cp .env.example .env.local
```

Compila:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `JWT_SECRET` (stringa lunga e casuale)

3. Esegui lo schema SQL in Supabase (`supabase/schema.sql`).

4. Avvia:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Flusso

Landing → Checkout (standard/pro) → Registrazione → Dashboard → Chat skill

## Deploy

Pronto per Vercel: collega il repo, imposta le env vars e deploya.
