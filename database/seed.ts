import { hashSecret } from '@/lib/crypto';
import type { PlatformData } from '@/types';

const now = new Date().toISOString();

export function createSeedData(): PlatformData {
  const demoOrgId = 'org_demo';
  const demoUserId = 'user_demo';
  const demoPassword = hashSecret('demo12345');
  const ownerPassword = hashSecret('founder12345');

  return {
    users: [
      {
        id: demoUserId,
        email: 'demo@saasforge.ai',
        passwordHash: demoPassword,
        name: 'Ava Laurent',
        avatar: 'AL',
        title: 'Founder & Product Lead',
        verified: true,
        primaryOrganizationId: demoOrgId,
        onboardingCompleted: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'user_admin',
        email: 'owner@saasforge.ai',
        passwordHash: ownerPassword,
        name: 'Noah Rivera',
        avatar: 'NR',
        title: 'Operations Director',
        verified: true,
        primaryOrganizationId: demoOrgId,
        onboardingCompleted: true,
        createdAt: now,
        updatedAt: now
      }
    ],
    organizations: [
      {
        id: demoOrgId,
        name: 'Forge Labs',
        slug: 'forge-labs',
        logo: 'FL',
        industry: 'AI SaaS',
        createdAt: now,
        updatedAt: now
      }
    ],
    memberships: [
      {
        id: 'mem_demo_owner',
        organizationId: demoOrgId,
        userId: demoUserId,
        role: 'Owner',
        presence: 'online',
        createdAt: now
      },
      {
        id: 'mem_demo_admin',
        organizationId: demoOrgId,
        userId: 'user_admin',
        role: 'Admin',
        presence: 'away',
        createdAt: now
      }
    ],
    projects: [
      {
        id: 'proj_ai_crm',
        organizationId: demoOrgId,
        name: 'AI CRM',
        slug: 'ai-crm',
        description: 'A premium CRM for real estate agencies with lead tracking, pipeline management, appointments, email cadences and revenue analytics.',
        category: 'CRM',
        prompt: 'Build a modern CRM for real estate agencies with leads, pipeline, calendar, emails and analytics.',
        maturity: 'Production ready',
        style: 'Dark',
        stage: 'live',
        status: 'healthy',
        themeAccent: '#7c5cff',
        visitors: 14892,
        users: 326,
        revenueMrr: 18400,
        deploymentEnvironment: 'production',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'proj_invoiceflow',
        organizationId: demoOrgId,
        name: 'InvoiceFlow',
        slug: 'invoiceflow',
        description: 'Automated invoicing SaaS with client portals, reminders, VAT support and financial dashboards.',
        category: 'Finance',
        prompt: 'Create a billing and invoicing SaaS for agencies with subscriptions and usage tracking.',
        maturity: 'MVP',
        style: 'Minimal',
        stage: 'building',
        status: 'warning',
        themeAccent: '#33a8ff',
        visitors: 4821,
        users: 91,
        revenueMrr: 6200,
        deploymentEnvironment: 'staging',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'proj_teampulse',
        organizationId: demoOrgId,
        name: 'TeamPulse',
        slug: 'teampulse',
        description: 'Internal performance and engagement workspace with pulse surveys and org insights.',
        category: 'HR',
        prompt: 'Build an internal tool for people ops with employee feedback and analytics.',
        maturity: 'Enterprise',
        style: 'Corporate',
        stage: 'draft',
        status: 'healthy',
        themeAccent: '#8d7eff',
        visitors: 2120,
        users: 47,
        revenueMrr: 3100,
        deploymentEnvironment: 'preview',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'proj_marketlens',
        organizationId: demoOrgId,
        name: 'MarketLens',
        slug: 'marketlens',
        description: 'Analytics SaaS for campaign attribution, funnel analysis and weekly executive reports.',
        category: 'Analytics',
        prompt: 'Create an analytics SaaS with funnels, MRR, retention, and executive dashboards.',
        maturity: 'Production ready',
        style: 'Modern',
        stage: 'live',
        status: 'healthy',
        themeAccent: '#4bb7ff',
        visitors: 9914,
        users: 188,
        revenueMrr: 12600,
        deploymentEnvironment: 'production',
        createdAt: now,
        updatedAt: now
      }
    ],
    projectVersions: [
      { id: 'ver_ai_1', projectId: 'proj_ai_crm', name: 'Version 1', summary: 'Initial MVP generation with contacts, pipeline and dashboard.', createdAt: now },
      { id: 'ver_ai_2', projectId: 'proj_ai_crm', name: 'Version 2', summary: 'Added billing, team permissions and analytics expansion.', createdAt: now },
      { id: 'ver_ai_3', projectId: 'proj_ai_crm', name: 'Version 3', summary: 'UI refresh with premium dark theme and deployment controls.', createdAt: now },
      { id: 'ver_invoice_1', projectId: 'proj_invoiceflow', name: 'Version 1', summary: 'Seeded invoices, subscriptions and reminders.', createdAt: now }
    ],
    projectFiles: [
      { id: 'file_1', projectId: 'proj_ai_crm', path: 'app/(app)/contacts/page.tsx', kind: 'page', updatedAt: now },
      { id: 'file_2', projectId: 'proj_ai_crm', path: 'components/pipeline-board.tsx', kind: 'component', updatedAt: now },
      { id: 'file_3', projectId: 'proj_ai_crm', path: 'app/api/leads/route.ts', kind: 'api', updatedAt: now },
      { id: 'file_4', projectId: 'proj_ai_crm', path: 'database/schema.sql', kind: 'schema', updatedAt: now },
      { id: 'file_5', projectId: 'proj_invoiceflow', path: 'services/billing.ts', kind: 'config', updatedAt: now }
    ],
    projectPages: [
      { id: 'page_1', projectId: 'proj_ai_crm', name: 'Landing page', path: '/', type: 'marketing', status: 'ready', description: 'Homepage with value proposition and social proof.' },
      { id: 'page_2', projectId: 'proj_ai_crm', name: 'Login', path: '/auth/login', type: 'auth', status: 'ready', description: 'Secure sign-in flow with local auth and OAuth placeholders.' },
      { id: 'page_3', projectId: 'proj_ai_crm', name: 'Dashboard', path: '/workspace', type: 'app', status: 'ready', description: 'Overview with KPIs, projects and AI credit usage.' },
      { id: 'page_4', projectId: 'proj_ai_crm', name: 'Billing', path: '/workspace/billing', type: 'settings', status: 'ready', description: 'Subscription management, invoices and checkout flows.' },
      { id: 'page_5', projectId: 'proj_ai_crm', name: 'Admin panel', path: '/workspace/admin', type: 'admin', status: 'ready', description: 'Internal console for users, projects and AI usage.' }
    ],
    aiConversations: [
      { id: 'conv_ai_1', projectId: 'proj_ai_crm', title: 'Refine dashboard and add subscriptions', agent: 'Product Agent', createdAt: now, updatedAt: now },
      { id: 'conv_inv_1', projectId: 'proj_invoiceflow', title: 'Improve invoice generator', agent: 'Backend Agent', createdAt: now, updatedAt: now }
    ],
    aiMessages: [
      { id: 'msg_1', conversationId: 'conv_ai_1', role: 'user', content: 'Add Stripe subscriptions and a more premium overview dashboard.', createdAt: now },
      { id: 'msg_2', conversationId: 'conv_ai_1', role: 'assistant', content: 'Planned billing routes, updated usage cards, added invoices and customer portal placeholders.', createdAt: now },
      { id: 'msg_3', conversationId: 'conv_inv_1', role: 'user', content: 'Add payment reminders and overdue status.', createdAt: now },
      { id: 'msg_4', conversationId: 'conv_inv_1', role: 'assistant', content: 'Database schema updated, cron job planned and reminder notifications prepared.', createdAt: now }
    ],
    aiUsage: [
      { id: 'usage_1', organizationId: demoOrgId, projectId: 'proj_ai_crm', action: 'Generate CRM dashboard', model: 'Claude Sonnet', credits: 1640, createdAt: now },
      { id: 'usage_2', organizationId: demoOrgId, projectId: 'proj_ai_crm', action: 'Add billing module', model: 'GPT-5', credits: 980, createdAt: now },
      { id: 'usage_3', organizationId: demoOrgId, projectId: 'proj_invoiceflow', action: 'Create invoicing flows', model: 'Gemini 2.5 Pro', credits: 1320, createdAt: now },
      { id: 'usage_4', organizationId: demoOrgId, projectId: 'proj_marketlens', action: 'Refine analytics', model: 'Claude Sonnet', credits: 760, createdAt: now }
    ],
    templates: [
      { id: 'tpl_1', slug: 'crm-pro', name: 'CRM Pro', category: 'CRM', description: 'Sales pipeline, contacts, scoring, reminders and deal analytics.', features: ['Contacts', 'Pipeline', 'Reminders', 'Analytics'], stack: ['Next.js', 'PostgreSQL', 'Stripe'], rating: 4.9, uses: 2814, previewGradient: 'from-violet-500/30 to-sky-500/20' },
      { id: 'tpl_2', slug: 'ai-content-platform', name: 'AI Content Platform', category: 'AI SaaS', description: 'Prompt workspaces, usage metering, templates and publishing flows.', features: ['Prompt editor', 'Credits', 'Team roles', 'Publishing'], stack: ['Next.js', 'Queue jobs', 'OpenAI'], rating: 4.8, uses: 1956, previewGradient: 'from-fuchsia-500/20 to-indigo-500/30' },
      { id: 'tpl_3', slug: 'analytics-saas', name: 'Analytics SaaS', category: 'Analytics', description: 'Funnel dashboards, custom filters and executive reporting.', features: ['Funnels', 'MRR', 'Retention', 'Exports'], stack: ['Next.js', 'PostgreSQL', 'Webhooks'], rating: 4.7, uses: 1632, previewGradient: 'from-cyan-500/20 to-blue-500/30' },
      { id: 'tpl_4', slug: 'project-manager', name: 'Project Manager', category: 'Project management', description: 'Kanban, roadmap, docs, comments and client sharing.', features: ['Tasks', 'Roadmaps', 'Comments', 'Permissions'], stack: ['Next.js', 'Storage', 'Auth'], rating: 4.8, uses: 2489, previewGradient: 'from-emerald-500/20 to-teal-500/20' },
      { id: 'tpl_5', slug: 'estate-pulse', name: 'Estate Pulse', category: 'Real estate', description: 'Lead intake, viewing calendar, documents and broker dashboards.', features: ['Leads', 'Calendar', 'Documents', 'Dashboards'], stack: ['Next.js', 'Email', 'Analytics'], rating: 4.9, uses: 1128, previewGradient: 'from-orange-500/20 to-pink-500/20' }
    ],
    deployments: [
      {
        id: 'dep_1',
        projectId: 'proj_ai_crm',
        environment: 'production',
        status: 'ready',
        url: 'https://ai-crm.saasforge.app',
        createdAt: now,
        durationSeconds: 142,
        logs: ['Installing dependencies', 'Running lint checks', 'Applying migrations', 'Deployment ready']
      },
      {
        id: 'dep_2',
        projectId: 'proj_ai_crm',
        environment: 'preview',
        status: 'ready',
        url: 'https://preview-ai-crm.saasforge.app',
        createdAt: now,
        durationSeconds: 88,
        logs: ['Provisioning sandbox', 'Building app', 'Seeding sample data', 'Preview ready']
      },
      {
        id: 'dep_3',
        projectId: 'proj_invoiceflow',
        environment: 'staging',
        status: 'building',
        url: 'https://invoiceflow-staging.saasforge.app',
        createdAt: now,
        durationSeconds: 64,
        logs: ['Queued by Growth Agent', 'Running integration tests', 'Preparing deployment']
      }
    ],
    domains: [
      {
        id: 'dom_1',
        projectId: 'proj_ai_crm',
        host: 'app.realestate-crm.io',
        status: 'SSL Active',
        sslActive: true,
        instructions: 'Point your CNAME to cname.saasforge.app and wait for SSL provisioning.',
        createdAt: now
      },
      {
        id: 'dom_2',
        projectId: 'proj_invoiceflow',
        host: 'billing.invoiceflow.app',
        status: 'Pending verification',
        sslActive: false,
        instructions: 'Create a TXT verification record with token sf-verify-5412.',
        createdAt: now
      }
    ],
    integrations: [
      { id: 'int_1', organizationId: demoOrgId, key: 'stripe', name: 'Stripe', description: 'Subscriptions, invoices and customer portal.', status: 'Connected', configured: true, connectedAt: now, scopes: ['Billing', 'Webhooks'] },
      { id: 'int_2', organizationId: demoOrgId, key: 'github', name: 'GitHub', description: 'Repository sync and deployment automation.', status: 'Connected', configured: true, connectedAt: now, scopes: ['Repos', 'Actions'] },
      { id: 'int_3', organizationId: demoOrgId, key: 'google', name: 'Google', description: 'OAuth, calendar sync and workspace import.', status: 'Needs configuration', configured: false, scopes: ['OAuth', 'Calendar'] },
      { id: 'int_4', organizationId: demoOrgId, key: 'slack', name: 'Slack', description: 'Build alerts and team notifications.', status: 'Available', configured: false, scopes: ['Alerts', 'Activity'] },
      { id: 'int_5', organizationId: demoOrgId, key: 'resend', name: 'Resend', description: 'Transactional email delivery.', status: 'Available', configured: false, scopes: ['Email'] },
      { id: 'int_6', organizationId: demoOrgId, key: 'openai', name: 'OpenAI', description: 'Premium generation models for UI and code.', status: 'Connected', configured: true, connectedAt: now, scopes: ['Completions', 'Embeddings'] },
      { id: 'int_7', organizationId: demoOrgId, key: 'anthropic', name: 'Anthropic', description: 'Long-context architecture and code generation.', status: 'Connected', configured: true, connectedAt: now, scopes: ['Messages'] },
      { id: 'int_8', organizationId: demoOrgId, key: 'supabase', name: 'Supabase', description: 'Managed Postgres and object storage.', status: 'Available', configured: false, scopes: ['Database', 'Storage'] }
    ],
    subscriptions: [
      {
        id: 'sub_1',
        organizationId: demoOrgId,
        plan: 'Business',
        interval: 'yearly',
        status: 'active',
        seats: 8,
        price: 1236,
        creditsLimit: 500000,
        renewalDate: '2027-04-12T00:00:00.000Z'
      }
    ],
    invoices: [
      { id: 'inv_1', organizationId: demoOrgId, number: 'INV-2026-014', status: 'paid', amount: 1236, currency: 'USD', issuedAt: '2026-08-02T00:00:00.000Z' },
      { id: 'inv_2', organizationId: demoOrgId, number: 'INV-2026-015', status: 'open', amount: 129, currency: 'USD', issuedAt: '2026-09-02T00:00:00.000Z' }
    ],
    notifications: [
      { id: 'not_1', userId: demoUserId, title: 'Production deployment succeeded', body: 'AI CRM is live with the latest analytics and billing updates.', type: 'build', createdAt: now, cta: 'View deployment' },
      { id: 'not_2', userId: demoUserId, title: 'Usage alert', body: '74% of your monthly AI credits have been consumed. Budget guardrails remain active.', type: 'billing', createdAt: now, cta: 'Open billing' },
      { id: 'not_3', userId: demoUserId, title: 'Security review completed', body: 'Security Agent found no critical issues in the latest release.', type: 'security', createdAt: now, cta: 'Open audit log' }
    ],
    apiKeys: [
      { id: 'key_1', organizationId: demoOrgId, name: 'Production webhook worker', prefix: 'sf_live_83f2', secretHash: hashSecret('sf_live_83f2_demo_secret'), permissions: ['deployments:write', 'projects:read'], lastUsedAt: now, createdAt: now },
      { id: 'key_2', organizationId: demoOrgId, name: 'Analytics exporter', prefix: 'sf_live_98ad', secretHash: hashSecret('sf_live_98ad_demo_secret'), permissions: ['analytics:read', 'billing:read'], createdAt: now }
    ],
    auditLogs: [
      { id: 'audit_1', organizationId: demoOrgId, actor: 'Ava Laurent', action: 'created', target: 'Project AI CRM', createdAt: now, metadata: 'Prompt-based generation initiated from onboarding.' },
      { id: 'audit_2', organizationId: demoOrgId, actor: 'Product Agent', action: 'updated', target: 'Project version 3', createdAt: now, metadata: 'Added settings screens and audit log support.' },
      { id: 'audit_3', organizationId: demoOrgId, actor: 'Noah Rivera', action: 'invited', target: 'New admin member', createdAt: now, metadata: 'Invitation sent to ops+admin@forge.ai.' }
    ],
    comments: [
      { id: 'comment_1', projectId: 'proj_ai_crm', authorId: demoUserId, resource: 'dashboard', body: 'The hero metrics feel balanced. Keep the darker gradient treatment.', createdAt: now },
      { id: 'comment_2', projectId: 'proj_ai_crm', authorId: 'user_admin', resource: 'billing', body: 'Need invoice export and a cleaner renewal reminder.', createdAt: now }
    ],
    buildTasks: [
      { id: 'task_1', projectId: 'proj_ai_crm', label: 'Understanding idea', status: 'completed', createdAt: now },
      { id: 'task_2', projectId: 'proj_ai_crm', label: 'Planning architecture', status: 'completed', createdAt: now },
      { id: 'task_3', projectId: 'proj_ai_crm', label: 'Designing database', status: 'completed', createdAt: now },
      { id: 'task_4', projectId: 'proj_ai_crm', label: 'Generating backend', status: 'completed', createdAt: now },
      { id: 'task_5', projectId: 'proj_ai_crm', label: 'Generating frontend', status: 'completed', createdAt: now },
      { id: 'task_6', projectId: 'proj_ai_crm', label: 'Connecting services', status: 'completed', createdAt: now },
      { id: 'task_7', projectId: 'proj_ai_crm', label: 'Testing', status: 'completed', createdAt: now },
      { id: 'task_8', projectId: 'proj_ai_crm', label: 'Deploying', status: 'completed', createdAt: now },
      { id: 'task_9', projectId: 'proj_invoiceflow', label: 'Understanding idea', status: 'completed', createdAt: now },
      { id: 'task_10', projectId: 'proj_invoiceflow', label: 'Planning architecture', status: 'completed', createdAt: now },
      { id: 'task_11', projectId: 'proj_invoiceflow', label: 'Designing database', status: 'running', createdAt: now },
      { id: 'task_12', projectId: 'proj_invoiceflow', label: 'Generating backend', status: 'pending', createdAt: now }
    ]
  };
}
