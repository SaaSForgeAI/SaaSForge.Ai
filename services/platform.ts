import { DEFAULT_BUILD_STEPS } from '@/utils/constants';
import { randomId } from '@/lib/crypto';
import { getPrismaClient, shouldUsePostgresStorage } from '@/lib/prisma';
import { readDb, updateDb } from '@/lib/store';
import {
  addDomainInPostgres,
  connectIntegrationInPostgres,
  createApiKeyInPostgres,
  createDeploymentInPostgres,
  createProjectInPostgres,
  disconnectIntegrationInPostgres,
  inviteMemberInPostgres,
  revokeApiKeyInPostgres,
  submitBuilderMessageInPostgres,
  updateSubscriptionInPostgres
} from '@/services/platform-postgres';
import { slugify } from '@/utils/format';
import type { BillingInterval, BillingPlan, BuildTask, PlatformData, Project, Role } from '@/types';

export async function getOrganizationBundle(organizationId: string): Promise<PlatformData> {
  const db = await readDb();
  return db;
}

export async function getWorkspaceSummary(organizationId: string): Promise<{
  activeProjects: number;
  productionDeployments: number;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
  users: number;
  mrr: number;
}> {
  const db = await readDb();
  const projects = db.projects.filter((item) => item.organizationId === organizationId);
  const subscription = db.subscriptions.find((item) => item.organizationId === organizationId);
  const creditsUsed = db.aiUsage
    .filter((item) => item.organizationId === organizationId)
    .reduce((sum, item) => sum + item.credits, 0);

  return {
    activeProjects: projects.filter((item) => item.stage !== 'draft').length,
    productionDeployments: db.deployments.filter((item) => projects.some((project) => project.id === item.projectId) && item.environment === 'production').length,
    aiCreditsUsed: creditsUsed,
    aiCreditsLimit: subscription?.creditsLimit ?? 10000,
    users: db.memberships.filter((item) => item.organizationId === organizationId).length,
    mrr: projects.reduce((sum, item) => sum + item.revenueMrr, 0)
  };
}

export async function createProject(input: {
  organizationId: string;
  name: string;
  prompt: string;
  category: string;
  maturity: Project['maturity'];
  style: Project['style'];
}): Promise<Project> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    return createProjectInPostgres(prisma, input);
  }

  const timestamp = new Date().toISOString();
  const project: Project = {
    id: randomId('proj'),
    organizationId: input.organizationId,
    name: input.name,
    slug: slugify(input.name),
    description: input.prompt,
    category: input.category,
    prompt: input.prompt,
    maturity: input.maturity,
    style: input.style,
    stage: 'building',
    status: 'healthy',
    themeAccent: input.style === 'Dark' ? '#7c5cff' : '#33a8ff',
    visitors: 0,
    users: 0,
    revenueMrr: 0,
    deploymentEnvironment: 'preview',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await updateDb((db) => {
    db.projects.unshift(project);
    db.projectVersions.unshift({
      id: randomId('ver'),
      projectId: project.id,
      name: 'Version 1',
      summary: 'Initial AI-generated project scaffold.',
      createdAt: timestamp
    });
    db.projectPages.push(
      { id: randomId('page'), projectId: project.id, name: 'Landing page', path: '/', type: 'marketing', status: 'ready', description: 'Public marketing entrypoint.' },
      { id: randomId('page'), projectId: project.id, name: 'Dashboard', path: '/workspace', type: 'app', status: 'ready', description: 'Workspace overview and usage metrics.' },
      { id: randomId('page'), projectId: project.id, name: 'Billing', path: '/workspace/billing', type: 'settings', status: 'ready', description: 'Subscription and usage management.' }
    );
    db.aiConversations.unshift({
      id: randomId('conv'),
      projectId: project.id,
      title: 'Initial generation',
      agent: 'Product Agent',
      createdAt: timestamp,
      updatedAt: timestamp
    });
    const tasks: BuildTask[] = DEFAULT_BUILD_STEPS.map((label, index) => ({
      id: randomId('task'),
      projectId: project.id,
      label,
      status: index < 6 ? 'completed' : index === 6 ? 'running' : 'pending',
      createdAt: timestamp
    }));
    db.buildTasks.unshift(...tasks);
    db.aiUsage.unshift({
      id: randomId('usage'),
      organizationId: input.organizationId,
      projectId: project.id,
      action: 'Initial generation',
      model: 'Claude Sonnet',
      credits: input.maturity === 'Enterprise' ? 2200 : input.maturity === 'Production ready' ? 1500 : 900,
      createdAt: timestamp
    });
    db.deployments.unshift({
      id: randomId('dep'),
      projectId: project.id,
      environment: 'preview',
      status: 'building',
      url: `https://${project.slug}.preview.saasforge.app`,
      createdAt: timestamp,
      durationSeconds: 54,
      logs: ['Queued AI generation', 'Scaffolding project structure', 'Preparing preview deployment']
    });
    db.auditLogs.unshift({
      id: randomId('audit'),
      organizationId: input.organizationId,
      actor: 'Product Agent',
      action: 'generated',
      target: `Project ${project.name}`,
      createdAt: timestamp,
      metadata: input.prompt
    });
  });

  return project;
}

export async function submitBuilderMessage(input: {
  organizationId: string;
  projectId: string;
  prompt: string;
}): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await submitBuilderMessageInPostgres(prisma, input);
    return;
  }

  const timestamp = new Date().toISOString();

  await updateDb((db) => {
    const targetProject = db.projects.find((item) => item.id === input.projectId && item.organizationId === input.organizationId);
    if (!targetProject) return db;

    const conversation =
      db.aiConversations.find((item) => item.projectId === input.projectId) ||
      (() => {
        const created = {
          id: randomId('conv'),
          projectId: input.projectId,
          title: 'Builder session',
          agent: 'UI Agent',
          createdAt: timestamp,
          updatedAt: timestamp
        };
        db.aiConversations.unshift(created);
        return created;
      })();

    conversation.updatedAt = timestamp;
    db.aiMessages.push(
      { id: randomId('msg'), conversationId: conversation.id, role: 'user', content: input.prompt, createdAt: timestamp },
      {
        id: randomId('msg'),
        conversationId: conversation.id,
        role: 'assistant',
        content: buildAssistantResponse(input.prompt),
        createdAt: timestamp
      }
    );

    const promptLower = input.prompt.toLowerCase();
    const project = targetProject;
    if (promptLower.includes('blue')) project.themeAccent = '#33a8ff';
    if (promptLower.includes('dark')) project.style = 'Dark';
    if (promptLower.includes('customer') || promptLower.includes('contact')) {
      db.projectPages.push({
        id: randomId('page'),
        projectId: project.id,
        name: 'Customer management',
        path: '/workspace/customers',
        type: 'app',
        status: 'ready',
        description: 'List, filter and manage customers with lifecycle tags.'
      });
    }
    project.updatedAt = timestamp;
    project.stage = 'live';

    db.buildTasks.unshift(
      { id: randomId('task'), projectId: input.projectId, label: 'Analyzing request', status: 'completed', createdAt: timestamp },
      { id: randomId('task'), projectId: input.projectId, label: 'Planning changes', status: 'completed', createdAt: timestamp },
      { id: randomId('task'), projectId: input.projectId, label: 'Updating database', status: 'completed', createdAt: timestamp },
      { id: randomId('task'), projectId: input.projectId, label: 'Updating API', status: 'completed', createdAt: timestamp },
      { id: randomId('task'), projectId: input.projectId, label: 'Updating UI', status: 'completed', createdAt: timestamp },
      { id: randomId('task'), projectId: input.projectId, label: 'Running tests', status: 'completed', createdAt: timestamp }
    );

    db.aiUsage.unshift({
      id: randomId('usage'),
      organizationId: input.organizationId,
      projectId: input.projectId,
      action: input.prompt,
      model: 'GPT-5',
      credits: Math.min(2400, Math.max(240, input.prompt.length * 8)),
      createdAt: timestamp
    });

    db.auditLogs.unshift({
      id: randomId('audit'),
      organizationId: input.organizationId,
      actor: 'Builder Agent',
      action: 'modified',
      target: `Project ${input.projectId}`,
      createdAt: timestamp,
      metadata: input.prompt
    });
  });
}

function buildAssistantResponse(prompt: string): string {
  const actions = ['Updated UI hierarchy', 'Refined schema', 'Synced API contracts', 'Added premium states'];
  const detail = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  return `${detail}. ${actions.join('. ')}.`;
}

export async function createDeployment(projectId: string, environment: 'preview' | 'staging' | 'production'): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await createDeploymentInPostgres(prisma, projectId, environment);
    return;
  }

  const timestamp = new Date().toISOString();
  await updateDb((db) => {
    const project = db.projects.find((item) => item.id === projectId);
    if (!project) return db;

    project.stage = environment === 'production' ? 'live' : 'building';
    project.deploymentEnvironment = environment;
    db.deployments.unshift({
      id: randomId('dep'),
      projectId,
      environment,
      status: 'ready',
      url: `https://${project.slug}.${environment}.saasforge.app`,
      createdAt: timestamp,
      durationSeconds: 93,
      logs: ['Installing dependencies', 'Running tests', 'Publishing assets', 'Deployment ready']
    });
  });
}

export async function connectIntegration(organizationId: string, key: string): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await connectIntegrationInPostgres(prisma, organizationId, key);
    return;
  }

  const timestamp = new Date().toISOString();
  await updateDb((db) => {
    const integration = db.integrations.find((item) => item.organizationId === organizationId && item.key === key);
    if (integration) {
      integration.status = 'Connected';
      integration.configured = true;
      integration.connectedAt = timestamp;
    }
  });
}

export async function disconnectIntegration(organizationId: string, key: string): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await disconnectIntegrationInPostgres(prisma, organizationId, key);
    return;
  }

  await updateDb((db) => {
    const integration = db.integrations.find((item) => item.organizationId === organizationId && item.key === key);
    if (integration) {
      integration.status = 'Available';
      integration.configured = false;
      integration.connectedAt = undefined;
    }
  });
}

export async function updateSubscription(organizationId: string, plan: BillingPlan, interval: BillingInterval): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await updateSubscriptionInPostgres(prisma, organizationId, plan, interval);
    return;
  }

  const pricing = {
    Free: { monthly: 0, yearly: 0, credits: 10000 },
    Pro: { monthly: 39, yearly: 31, credits: 100000 },
    Business: { monthly: 129, yearly: 103, credits: 500000 },
    Enterprise: { monthly: 399, yearly: 319, credits: 2000000 }
  } as const;

  await updateDb((db) => {
    const subscription = db.subscriptions.find((item) => item.organizationId === organizationId);
    const value = pricing[plan][interval];
    const credits = pricing[plan].credits;

    if (subscription) {
      subscription.plan = plan;
      subscription.interval = interval;
      subscription.price = value;
      subscription.creditsLimit = credits;
      subscription.status = 'active';
      return db;
    }

    db.subscriptions.push({
      id: randomId('sub'),
      organizationId,
      plan,
      interval,
      status: 'active',
      seats: 1,
      price: value,
      creditsLimit: credits,
      renewalDate: new Date().toISOString()
    });
  });
}

export async function inviteMember(organizationId: string, email: string, role: Role): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await inviteMemberInPostgres(prisma, organizationId, email, role);
    return;
  }

  const timestamp = new Date().toISOString();
  await updateDb((db) => {
    db.auditLogs.unshift({
      id: randomId('audit'),
      organizationId,
      actor: 'Workspace Admin',
      action: 'invited',
      target: email,
      createdAt: timestamp,
      metadata: role
    });
  });
}

export async function addDomain(projectId: string, host: string): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await addDomainInPostgres(prisma, projectId, host);
    return;
  }

  const timestamp = new Date().toISOString();
  await updateDb((db) => {
    const project = db.projects.find((item) => item.id === projectId);
    if (!project) return db;

    db.domains.unshift({
      id: randomId('dom'),
      projectId,
      host,
      status: 'Pending verification',
      sslActive: false,
      instructions: 'Create a CNAME to cname.saasforge.app and add the verification TXT token.',
      createdAt: timestamp
    });
  });
}

export async function createApiKey(organizationId: string, name: string, permissions: string[]): Promise<string> {
  const { hashSecret } = await import('@/lib/crypto');
  const secret = `sf_live_${randomId('key').replace(/[^a-z0-9_]/gi, '').slice(0, 16)}_${randomId('sec').replace(/[^a-z0-9_]/gi, '').slice(0, 16)}`;
  const prefix = secret.slice(0, 12);
  const timestamp = new Date().toISOString();

  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await createApiKeyInPostgres(prisma, {
      organizationId,
      name,
      permissions,
      prefix,
      secretHash: hashSecret(secret)
    });
    return secret;
  }

  await updateDb((db) => {
    db.apiKeys.unshift({
      id: randomId('key'),
      organizationId,
      name,
      prefix,
      secretHash: hashSecret(secret),
      permissions,
      createdAt: timestamp
    });
  });

  return secret;
}

export async function revokeApiKey(organizationId: string, keyId: string): Promise<void> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await revokeApiKeyInPostgres(prisma, organizationId, keyId);
    return;
  }

  const timestamp = new Date().toISOString();
  await updateDb((db) => {
    const key = db.apiKeys.find((item) => item.organizationId === organizationId && item.id === keyId);
    if (key) key.revokedAt = timestamp;
  });
}
