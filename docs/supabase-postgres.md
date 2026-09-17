# Supabase / PostgreSQL migration guide

SaaSForge AI now supports two storage modes:

- `demo`: local JSON persistence for zero-config previews
- `postgres`: Prisma + PostgreSQL persistence for production, including Supabase Postgres

## Recommended production configuration

In Vercel set:

```env
DEMO_MODE=false
STORAGE_PROVIDER=postgres
DATABASE_URL=postgresql://POOLER-URL
DIRECT_URL=postgresql://DIRECT-DB-URL
APP_URL=https://your-vercel-domain.vercel.app
AUTH_SECRET=your-long-random-secret
```

## Supabase setup

1. Create a Supabase project.
2. Open **Project Settings → Database**.
3. Copy the **Connection pooling** string for `DATABASE_URL`.
4. Copy the **Direct connection** string for `DIRECT_URL`.
5. Add both to Vercel.
6. Set `STORAGE_PROVIDER=postgres`.
7. Set `DEMO_MODE=false`.
8. Set `ENABLE_DEMO_SEED=true` if you want the seeded demo workspace on an empty production database. Set it to `false` for a clean production install.

If a direct `db.<project>.supabase.co:5432` hostname only resolves to IPv6 in your environment, use the pooler URL for app runtime. This is the recommended path for Vercel anyway.

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
