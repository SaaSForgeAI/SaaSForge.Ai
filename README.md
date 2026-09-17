# SaaSForge AI

SaaSForge AI is a premium AI-powered SaaS generator built with Next.js, React, TypeScript, Tailwind CSS and a dual storage layer that supports both demo mode and PostgreSQL/Supabase production mode.

## What is included

- premium landing page
- functional local authentication
- onboarding flow
- responsive workspace dashboard
- AI Builder with project memory simulation
- project CRUD generation
- deployments, domains, integrations and billing surfaces
- notifications center
- admin panel
- API routes
- Prisma-powered PostgreSQL schema
- seeded demo workspace

## Demo account

- Email: `demo@saasforge.ai`
- Password: `demo12345`

## Storage modes

### 1. Demo mode
Zero-config local persistence for local preview and fallback sandbox usage.

```env
DEMO_MODE=true
STORAGE_PROVIDER=demo
```

### 2. PostgreSQL / Supabase mode
Production-ready persistence using Prisma and PostgreSQL.

```env
DEMO_MODE=false
STORAGE_PROVIDER=postgres
DATABASE_URL=postgresql://POOLER-URL
DIRECT_URL=postgresql://DIRECT-DB-URL
```

## Install

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local`.

Core variables:

- `AUTH_SECRET`
- `APP_URL`
- `DEMO_MODE`
- `STORAGE_PROVIDER`
- `DATABASE_URL`

Optional provider variables:

- `DIRECT_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `SUPABASE_PROJECT_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Database scripts

- `npm run db:generate`
- `npm run db:push`
- `npm run db:migrate`
- `npm run db:studio`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`

## Architecture

```text
app/
components/
features/
lib/
hooks/
prisma/
services/
database/
api/
types/
utils/
```

### Separation of concerns

- `components`: reusable UI and layout
- `services`: business logic and server actions
- `lib`: auth, persistence and environment helpers
- `prisma`: PostgreSQL source of truth schema
- `database`: seed source and SQL reference
- `app/api`: API endpoints

## Persistence architecture

The app now uses a storage adapter:

- `lib/store.ts`: unified storage entrypoint
- `lib/store-postgres.ts`: PostgreSQL/Prisma adapter
- `lib/prisma.ts`: Prisma client bootstrap
- `database/seed.ts`: initial platform seed data

If PostgreSQL is enabled, all application data is read from and written to Prisma models. If not, the app falls back to demo persistence.

## Functional areas

### Authentication
- register
- login
- logout
- forgot password
- reset password
- email verification
- session cookies
- route protection
- role-aware workspace

### AI Builder
- chat-style prompt submission
- build task timeline
- project memory simulation
- credit consumption tracking
- live preview panel
- responsive preview modes

### Billing
- free / pro / business / enterprise plans
- invoices
- usage tracking
- update plan flow
- Stripe-ready abstraction

### Deployment
- preview / staging / production deployments
- logs
- create deployment action
- domain connection

## Supabase / PostgreSQL setup

See:
- `docs/supabase-postgres.md`
- `prisma/schema.prisma`

Recommended Vercel settings:

```env
DEMO_MODE=false
STORAGE_PROVIDER=postgres
DATABASE_URL=postgresql://...
APP_URL=https://your-app.vercel.app
AUTH_SECRET=replace-with-a-long-random-secret
```

After setting the environment variables, apply the schema:

```bash
npm install
npm run db:push
```

## Seed database

The initial dataset is generated from `database/seed.ts`.

- in demo mode it is written to `database/demo-db.json` or `/tmp` on Vercel fallback mode
- in postgres mode it is inserted automatically into PostgreSQL on first startup when the database is empty

## API documentation

See:
- `docs/api.md`
- `docs/integrations.md`

## Production deployment notes

1. Use `STORAGE_PROVIDER=postgres` for Vercel production.
2. Point `DATABASE_URL` to Supabase Postgres.
3. Keep `DEMO_MODE=false` in production.
4. Connect Stripe and transactional email providers.
5. Implement full OAuth provider flows.
6. Attach object storage and background jobs for generated assets.

## Demo scope note

This project is a functional premium platform prototype with real navigation, auth flows, persistence and workspace actions.
It now includes a production-ready PostgreSQL/Supabase persistence path, while still keeping a safe demo fallback for previews and local testing.
