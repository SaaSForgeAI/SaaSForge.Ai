# Supabase / PostgreSQL migration guide

SaaSForge AI now supports two storage modes:

- `demo`: local JSON persistence for zero-config previews
- `postgres`: Prisma + PostgreSQL persistence for production, including Supabase Postgres

## Recommended production configuration

In Vercel set:

```env
DEMO_MODE=false
STORAGE_PROVIDER=postgres
DATABASE_URL=postgresql://...
APP_URL=https://your-vercel-domain.vercel.app
AUTH_SECRET=your-long-random-secret
```

## Supabase setup

1. Create a Supabase project.
2. Open **Project Settings → Database**.
3. Copy the **connection string** in transaction mode.
4. Add it to Vercel as `DATABASE_URL`.
5. Set `STORAGE_PROVIDER=postgres`.
6. Set `DEMO_MODE=false`.

## Apply the schema

From a local machine connected to the repo:

```bash
npm install
npm run db:generate
npm run db:push
```

Or, if you prefer migrations:

```bash
npm run db:migrate
```

## What gets persisted in PostgreSQL

All platform entities are stored in Postgres through Prisma:

- users
- organizations
- memberships
- projects
- project versions
- project files
- project pages
- AI conversations
- AI messages
- AI usage
- templates
- deployments
- domains
- integrations
- subscriptions
- invoices
- notifications
- API keys
- audit logs
- comments
- build tasks

## Seeding behavior

On first startup with an empty database, SaaSForge AI automatically seeds the default demo workspace so the product remains usable immediately.

## Important note

The Prisma schema in `prisma/schema.prisma` is now the source of truth for database structure.
