# SaaSForge AI

SaaSForge AI is a premium AI-powered SaaS generator built with Next.js, React, TypeScript and Tailwind CSS.

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
- PostgreSQL production schema
- seeded demo workspace

## Demo account

- Email: `demo@saasforge.ai`
- Password: `demo12345`

## Local stack

This sandbox demo persists data in `database/demo-db.json` for a zero-config experience.
Production should swap the store adapter to PostgreSQL using `database/schema.sql`.

## Install

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local`.

Important variables:

- `AUTH_SECRET`
- `APP_URL`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

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
services/
database/
api/
types/
utils/
```

### Separation of concerns

- `components`: reusable UI and layout
- `services`: business logic and server actions
- `lib`: persistence, auth and environment helpers
- `database`: production schema and seed source
- `app/api`: API endpoints

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

## Production deployment notes

1. Replace the local file store with PostgreSQL + ORM.
2. Connect Stripe and a transactional email provider.
3. Implement full OAuth provider flows.
4. Add secret vault encryption and queue workers.
5. Attach object storage for project assets and build artifacts.

## Seed database

The initial dataset is generated from `database/seed.ts` and written automatically to `database/demo-db.json` at first run.

## API documentation

See:
- `docs/api.md`
- `docs/integrations.md`

## Demo scope note

This project is a functional premium platform prototype with real navigation, auth flows, persistence and workspace actions.
For production, the integration adapters and data store should be connected to real services.
