-- SaaSForge AI production schema (PostgreSQL-oriented)
-- Source of truth: prisma/schema.prisma
-- Use this SQL as a readable reference, or run `npm run db:push` to sync the Prisma schema directly to Supabase/Postgres.

create table organizations (
  id text primary key,
  name text not null,
  slug text not null unique,
  logo text not null,
  industry text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  name text not null,
  avatar text not null,
  title text not null,
  verified boolean not null default false,
  verification_token text,
  reset_token text,
  primary_organization_id text not null references organizations(id) on delete cascade,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  role text not null check (role in ('Owner', 'Admin', 'Member')),
  presence text not null default 'offline',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table projects (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null,
  category text not null,
  prompt text not null,
  maturity text not null,
  style text not null,
  stage text not null,
  status text not null,
  theme_accent text not null,
  visitors integer not null default 0,
  users integer not null default 0,
  revenue_mrr integer not null default 0,
  deployment_environment text not null default 'preview',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index projects_org_slug_idx on projects (organization_id, slug);

create table project_versions (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  name text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table project_files (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  path text not null,
  kind text not null,
  updated_at timestamptz not null default now()
);

create table project_pages (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  name text not null,
  path text not null,
  type text not null,
  status text not null,
  description text not null
);

create table ai_conversations (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  title text not null,
  agent text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ai_messages (
  id text primary key,
  conversation_id text not null references ai_conversations(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table ai_usage (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  project_id text not null references projects(id) on delete cascade,
  action text not null,
  model text not null,
  credits integer not null,
  created_at timestamptz not null default now()
);
create index ai_usage_org_created_idx on ai_usage (organization_id, created_at desc);

create table templates (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  features jsonb not null,
  stack jsonb not null,
  rating numeric(2,1) not null,
  uses integer not null,
  preview_gradient text not null
);

create table deployments (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  environment text not null,
  status text not null,
  url text not null,
  created_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  logs jsonb not null default '[]'::jsonb
);

create table domains (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  host text not null,
  status text not null,
  ssl_active boolean not null default false,
  instructions text not null,
  created_at timestamptz not null default now()
);

create table integrations (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  key text not null,
  name text not null,
  description text not null,
  status text not null,
  configured boolean not null default false,
  connected_at timestamptz,
  scopes jsonb not null default '[]'::jsonb
);
create unique index integrations_org_key_idx on integrations (organization_id, key);

create table subscriptions (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  plan text not null,
  interval text not null,
  status text not null,
  seats integer not null default 1,
  price integer not null default 0,
  credits_limit integer not null default 10000,
  renewal_date timestamptz not null
);

create table invoices (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  number text not null,
  status text not null,
  amount integer not null,
  currency text not null,
  issued_at timestamptz not null
);

create table notifications (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  cta text
);

create table api_keys (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  prefix text not null,
  secret_hash text not null,
  permissions jsonb not null default '[]'::jsonb,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  actor text not null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now(),
  metadata text
);

create table comments (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  author_id text not null references users(id) on delete cascade,
  resource text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table build_tasks (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  label text not null,
  status text not null,
  created_at timestamptz not null default now()
);
