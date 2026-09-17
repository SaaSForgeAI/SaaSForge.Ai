import type { PrismaClient } from '@prisma/client';
import { randomId } from '@/lib/crypto';
import type { BillingInterval, BillingPlan, BuildTask, Project, Role } from '@/types';
import { DEFAULT_BUILD_STEPS } from '@/utils/constants';
import { slugify } from '@/utils/format';

function buildAssistantResponse(prompt: string): string {
  const actions = ['Updated UI hierarchy', 'Refined schema', 'Synced API contracts', 'Added premium states'];
  const detail = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  return `${detail}. ${actions.join('. ')}.`;
}

export async function createProjectInPostgres(prisma: PrismaClient, input: {
  organizationId: string;
  name: string;
  prompt: string;
  category: string;
  maturity: Project['maturity'];
  style: Project['style'];
}): Promise<Project> {
  const timestamp = new Date();
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
    createdAt: timestamp.toISOString(),
    updatedAt: timestamp.toISOString()
  };

  const tasks: BuildTask[] = DEFAULT_BUILD_STEPS.map((label, index) => ({
    id: randomId('task'),
    projectId: project.id,
    label,
    status: index < 6 ? 'completed' : index === 6 ? 'running' : 'pending',
    createdAt: timestamp.toISOString()
  }));

  await prisma.$transaction(async (tx) => {
    await tx.project.create({
      data: {
        id: project.id,
        organizationId: project.organizationId,
        name: project.name,
        slug: project.slug,
        description: project.description,
        category: project.category,
        prompt: project.prompt,
        maturity: project.maturity,
        style: project.style,
        stage: project.stage,
        status: project.status,
        themeAccent: project.themeAccent,
        visitors: project.visitors,
        users: project.users,
        revenueMrr: project.revenueMrr,
        deploymentEnvironment: project.deploymentEnvironment,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    await tx.projectVersion.create({
      data: {
        id: randomId('ver'),
        projectId: project.id,
        name: 'Version 1',
        summary: 'Initial AI-generated project scaffold.',
        createdAt: timestamp
      }
    });

    await tx.projectPage.createMany({
      data: [
        {
          id: randomId('page'),
          projectId: project.id,
          name: 'Landing page',
          path: '/',
          type: 'marketing',
          status: 'ready',
          description: 'Public marketing entrypoint.'
        },
        {
          id: randomId('page'),
          projectId: project.id,
          name: 'Dashboard',
          path: '/workspace',
          type: 'app',
          status: 'ready',
          description: 'Workspace overview and usage metrics.'
        },
        {
          id: randomId('page'),
          projectId: project.id,
          name: 'Billing',
          path: '/workspace/billing',
          type: 'settings',
          status: 'ready',
          description: 'Subscription and usage management.'
        }
      ]
    });

    await tx.aIConversation.create({
      data: {
        id: randomId('conv'),
        projectId: project.id,
        title: 'Initial generation',
        agent: 'Product Agent',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    await tx.buildTask.createMany({
      data: tasks.map((task) => ({
        id: task.id,
        projectId: task.projectId,
        label: task.label,
        status: task.status,
        createdAt: timestamp
      }))
    });

    await tx.aIUsage.create({
      data: {
        id: randomId('usage'),
        organizationId: input.organizationId,
        projectId: project.id,
        action: 'Initial generation',
        model: 'Claude Sonnet',
        credits: input.maturity === 'Enterprise' ? 2200 : input.maturity === 'Production ready' ? 1500 : 900,
        createdAt: timestamp
      }
    });

    await tx.deployment.create({
      data: {
        id: randomId('dep'),
        projectId: project.id,
        environment: 'preview',
        status: 'building',
        url: `https://${project.slug}.preview.saasforge.app`,
        createdAt: timestamp,
        durationSeconds: 54,
        logs: ['Queued AI generation', 'Scaffolding project structure', 'Preparing preview deployment']
      }
    });

    await tx.auditLog.create({
      data: {
        id: randomId('audit'),
        organizationId: input.organizationId,
        actor: 'Product Agent',
        action: 'generated',
        target: `Project ${project.name}`,
        createdAt: timestamp,
        metadata: input.prompt
      }
    });
  });

  return project;
}

export async function submitBuilderMessageInPostgres(prisma: PrismaClient, input: {
  organizationId: string;
  projectId: string;
  prompt: string;
}): Promise<void> {
  const timestamp = new Date();

  await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: {
        id: input.projectId,
        organizationId: input.organizationId
      }
    });

    if (!project) return;

    let conversation = await tx.aIConversation.findFirst({
      where: { projectId: input.projectId },
      orderBy: { updatedAt: 'desc' }
    });

    if (!conversation) {
      conversation = await tx.aIConversation.create({
        data: {
          id: randomId('conv'),
          projectId: input.projectId,
          title: 'Builder session',
          agent: 'UI Agent',
          createdAt: timestamp,
          updatedAt: timestamp
        }
      });
    } else {
      conversation = await tx.aIConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: timestamp }
      });
    }

    await tx.aIMessage.createMany({
      data: [
        {
          id: randomId('msg'),
          conversationId: conversation.id,
          role: 'user',
          content: input.prompt,
          createdAt: timestamp
        },
        {
          id: randomId('msg'),
          conversationId: conversation.id,
          role: 'assistant',
          content: buildAssistantResponse(input.prompt),
          createdAt: timestamp
        }
      ]
    });

    const promptLower = input.prompt.toLowerCase();
    const updateData: { themeAccent?: string; style?: string; stage: string; updatedAt: Date } = {
      stage: 'live',
      updatedAt: timestamp
    };

    if (promptLower.includes('blue')) updateData.themeAccent = '#33a8ff';
    if (promptLower.includes('dark')) updateData.style = 'Dark';

    await tx.project.update({
      where: { id: input.projectId },
      data: updateData
    });

    if (promptLower.includes('customer') || promptLower.includes('contact')) {
      const existingPage = await tx.projectPage.findFirst({
        where: {
          projectId: input.projectId,
          path: '/workspace/customers'
        }
      });

      if (!existingPage) {
        await tx.projectPage.create({
          data: {
            id: randomId('page'),
            projectId: input.projectId,
            name: 'Customer management',
            path: '/workspace/customers',
            type: 'app',
            status: 'ready',
            description: 'List, filter and manage customers with lifecycle tags.'
          }
        });
      }
    }

    await tx.buildTask.createMany({
      data: [
        'Analyzing request',
        'Planning changes',
        'Updating database',
        'Updating API',
        'Updating UI',
        'Running tests'
      ].map((label) => ({
        id: randomId('task'),
        projectId: input.projectId,
        label,
        status: 'completed',
        createdAt: timestamp
      }))
    });

    await tx.aIUsage.create({
      data: {
        id: randomId('usage'),
        organizationId: input.organizationId,
        projectId: input.projectId,
        action: input.prompt,
        model: 'GPT-5',
        credits: Math.min(2400, Math.max(240, input.prompt.length * 8)),
        createdAt: timestamp
      }
    });

    await tx.auditLog.create({
      data: {
        id: randomId('audit'),
        organizationId: input.organizationId,
        actor: 'Builder Agent',
        action: 'modified',
        target: `Project ${input.projectId}`,
        createdAt: timestamp,
        metadata: input.prompt
      }
    });
  });
}

export async function createDeploymentInPostgres(prisma: PrismaClient, projectId: string, environment: 'preview' | 'staging' | 'production'): Promise<void> {
  const timestamp = new Date();

  await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({ where: { id: projectId } });
    if (!project) return;

    await tx.project.update({
      where: { id: projectId },
      data: {
        stage: environment === 'production' ? 'live' : 'building',
        deploymentEnvironment: environment,
        updatedAt: timestamp
      }
    });

    await tx.deployment.create({
      data: {
        id: randomId('dep'),
        projectId,
        environment,
        status: 'ready',
        url: `https://${project.slug}.${environment}.saasforge.app`,
        createdAt: timestamp,
        durationSeconds: 93,
        logs: ['Installing dependencies', 'Running tests', 'Publishing assets', 'Deployment ready']
      }
    });
  });
}

export async function connectIntegrationInPostgres(prisma: PrismaClient, organizationId: string, key: string): Promise<void> {
  await prisma.integration.updateMany({
    where: { organizationId, key },
    data: {
      status: 'Connected',
      configured: true,
      connectedAt: new Date()
    }
  });
}

export async function disconnectIntegrationInPostgres(prisma: PrismaClient, organizationId: string, key: string): Promise<void> {
  await prisma.integration.updateMany({
    where: { organizationId, key },
    data: {
      status: 'Available',
      configured: false,
      connectedAt: null
    }
  });
}

export async function updateSubscriptionInPostgres(prisma: PrismaClient, organizationId: string, plan: BillingPlan, interval: BillingInterval): Promise<void> {
  const pricing = {
    Free: { monthly: 0, yearly: 0, credits: 10000 },
    Pro: { monthly: 39, yearly: 31, credits: 100000 },
    Business: { monthly: 129, yearly: 103, credits: 500000 },
    Enterprise: { monthly: 399, yearly: 319, credits: 2000000 }
  } as const;

  const value = pricing[plan][interval];
  const credits = pricing[plan].credits;
  const existing = await prisma.subscription.findFirst({ where: { organizationId } });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        plan,
        interval,
        price: value,
        creditsLimit: credits,
        status: 'active'
      }
    });
    return;
  }

  await prisma.subscription.create({
    data: {
      id: randomId('sub'),
      organizationId,
      plan,
      interval,
      status: 'active',
      seats: 1,
      price: value,
      creditsLimit: credits,
      renewalDate: new Date()
    }
  });
}

export async function inviteMemberInPostgres(prisma: PrismaClient, organizationId: string, email: string, role: Role): Promise<void> {
  await prisma.auditLog.create({
    data: {
      id: randomId('audit'),
      organizationId,
      actor: 'Workspace Admin',
      action: 'invited',
      target: email,
      createdAt: new Date(),
      metadata: role
    }
  });
}

export async function addDomainInPostgres(prisma: PrismaClient, projectId: string, host: string): Promise<void> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;

  await prisma.domain.create({
    data: {
      id: randomId('dom'),
      projectId,
      host,
      status: 'Pending verification',
      sslActive: false,
      instructions: 'Create a CNAME to cname.saasforge.app and add the verification TXT token.',
      createdAt: new Date()
    }
  });
}

export async function createApiKeyInPostgres(prisma: PrismaClient, input: {
  organizationId: string;
  name: string;
  permissions: string[];
  prefix: string;
  secretHash: string;
}): Promise<void> {
  await prisma.apiKey.create({
    data: {
      id: randomId('key'),
      organizationId: input.organizationId,
      name: input.name,
      prefix: input.prefix,
      secretHash: input.secretHash,
      permissions: input.permissions,
      createdAt: new Date()
    }
  });
}

export async function revokeApiKeyInPostgres(prisma: PrismaClient, organizationId: string, keyId: string): Promise<void> {
  await prisma.apiKey.updateMany({
    where: {
      id: keyId,
      organizationId
    },
    data: {
      revokedAt: new Date()
    }
  });
}
