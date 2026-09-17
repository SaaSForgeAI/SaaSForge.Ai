import type { PrismaClient } from '@prisma/client';
import { createSeedData } from '@/database/seed';
import type { PlatformData } from '@/types';

let seedPromise: Promise<void> | null = null;

function toIso(value: Date | null | undefined): string | undefined {
  return value ? value.toISOString() : undefined;
}

function toDate(value: string | undefined): Date | null {
  return value ? new Date(value) : null;
}

export async function ensurePostgresSeed(prisma: PrismaClient): Promise<void> {
  if (seedPromise) {
    await seedPromise;
    return;
  }

  seedPromise = (async () => {
    const organizationCount = await prisma.organization.count();
    if (organizationCount === 0) {
      await writePostgresSnapshot(prisma, createSeedData());
    }
  })();

  try {
    await seedPromise;
  } finally {
    seedPromise = null;
  }
}

export async function readPostgresSnapshot(prisma: PrismaClient): Promise<PlatformData> {
  const [
    users,
    organizations,
    memberships,
    projects,
    projectVersions,
    projectFiles,
    projectPages,
    aiConversations,
    aiMessages,
    aiUsage,
    templates,
    deployments,
    domains,
    integrations,
    subscriptions,
    invoices,
    notifications,
    apiKeys,
    auditLogs,
    comments,
    buildTasks
  ] = await prisma.$transaction([
    prisma.user.findMany(),
    prisma.organization.findMany(),
    prisma.membership.findMany(),
    prisma.project.findMany(),
    prisma.projectVersion.findMany(),
    prisma.projectFile.findMany(),
    prisma.projectPage.findMany(),
    prisma.aIConversation.findMany(),
    prisma.aIMessage.findMany(),
    prisma.aIUsage.findMany(),
    prisma.template.findMany(),
    prisma.deployment.findMany(),
    prisma.domain.findMany(),
    prisma.integration.findMany(),
    prisma.subscription.findMany(),
    prisma.invoice.findMany(),
    prisma.notification.findMany(),
    prisma.apiKey.findMany(),
    prisma.auditLog.findMany(),
    prisma.comment.findMany(),
    prisma.buildTask.findMany()
  ]);

  return {
    users: users.map((item) => ({
      id: item.id,
      email: item.email,
      passwordHash: item.passwordHash,
      name: item.name,
      avatar: item.avatar,
      title: item.title,
      verified: item.verified,
      verificationToken: item.verificationToken ?? undefined,
      resetToken: item.resetToken ?? undefined,
      primaryOrganizationId: item.primaryOrganizationId,
      onboardingCompleted: item.onboardingCompleted,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    })),
    organizations: organizations.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      logo: item.logo,
      industry: item.industry,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    })),
    memberships: memberships.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      userId: item.userId,
      role: item.role as 'Owner' | 'Admin' | 'Member',
      presence: item.presence as 'online' | 'away' | 'offline',
      createdAt: item.createdAt.toISOString()
    })),
    projects: projects.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      name: item.name,
      slug: item.slug,
      description: item.description,
      category: item.category,
      prompt: item.prompt,
      maturity: item.maturity as 'MVP' | 'Production ready' | 'Enterprise',
      style: item.style as 'Minimal' | 'Modern' | 'Corporate' | 'Creative' | 'Dark' | 'Custom',
      stage: item.stage as 'draft' | 'building' | 'live',
      status: item.status as 'healthy' | 'warning' | 'critical',
      themeAccent: item.themeAccent,
      visitors: item.visitors,
      users: item.users,
      revenueMrr: item.revenueMrr,
      deploymentEnvironment: item.deploymentEnvironment as 'preview' | 'staging' | 'production',
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    })),
    projectVersions: projectVersions.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      name: item.name,
      summary: item.summary,
      createdAt: item.createdAt.toISOString()
    })),
    projectFiles: projectFiles.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      path: item.path,
      kind: item.kind as 'page' | 'component' | 'api' | 'schema' | 'config',
      updatedAt: item.updatedAt.toISOString()
    })),
    projectPages: projectPages.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      name: item.name,
      path: item.path,
      type: item.type as 'marketing' | 'auth' | 'app' | 'settings' | 'admin',
      status: item.status as 'ready' | 'draft',
      description: item.description
    })),
    aiConversations: aiConversations.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      title: item.title,
      agent: item.agent,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    })),
    aiMessages: aiMessages.map((item) => ({
      id: item.id,
      conversationId: item.conversationId,
      role: item.role as 'user' | 'assistant' | 'system',
      content: item.content,
      createdAt: item.createdAt.toISOString()
    })),
    aiUsage: aiUsage.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      projectId: item.projectId,
      action: item.action,
      model: item.model,
      credits: item.credits,
      createdAt: item.createdAt.toISOString()
    })),
    templates: templates.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      category: item.category,
      description: item.description,
      features: item.features,
      stack: item.stack,
      rating: item.rating,
      uses: item.uses,
      previewGradient: item.previewGradient
    })),
    deployments: deployments.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      environment: item.environment as 'preview' | 'staging' | 'production',
      status: item.status as 'queued' | 'building' | 'ready' | 'failed',
      url: item.url,
      createdAt: item.createdAt.toISOString(),
      durationSeconds: item.durationSeconds,
      logs: item.logs
    })),
    domains: domains.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      host: item.host,
      status: item.status as 'Pending verification' | 'SSL Active' | 'DNS issue',
      sslActive: item.sslActive,
      instructions: item.instructions,
      createdAt: item.createdAt.toISOString()
    })),
    integrations: integrations.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      key: item.key,
      name: item.name,
      description: item.description,
      status: item.status as 'Connected' | 'Needs configuration' | 'Available',
      configured: item.configured,
      connectedAt: toIso(item.connectedAt),
      scopes: item.scopes
    })),
    subscriptions: subscriptions.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      plan: item.plan as 'Free' | 'Pro' | 'Business' | 'Enterprise',
      interval: item.interval as 'monthly' | 'yearly',
      status: item.status as 'active' | 'trialing' | 'past_due',
      seats: item.seats,
      price: item.price,
      creditsLimit: item.creditsLimit,
      renewalDate: item.renewalDate.toISOString()
    })),
    invoices: invoices.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      number: item.number,
      status: item.status as 'paid' | 'open',
      amount: item.amount,
      currency: item.currency,
      issuedAt: item.issuedAt.toISOString()
    })),
    notifications: notifications.map((item) => ({
      id: item.id,
      userId: item.userId,
      title: item.title,
      body: item.body,
      type: item.type as 'build' | 'billing' | 'security' | 'product',
      readAt: toIso(item.readAt),
      createdAt: item.createdAt.toISOString(),
      cta: item.cta ?? undefined
    })),
    apiKeys: apiKeys.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      name: item.name,
      prefix: item.prefix,
      secretHash: item.secretHash,
      permissions: item.permissions,
      lastUsedAt: toIso(item.lastUsedAt),
      revokedAt: toIso(item.revokedAt),
      createdAt: item.createdAt.toISOString()
    })),
    auditLogs: auditLogs.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      actor: item.actor,
      action: item.action,
      target: item.target,
      createdAt: item.createdAt.toISOString(),
      metadata: item.metadata ?? undefined
    })),
    comments: comments.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      authorId: item.authorId,
      resource: item.resource,
      body: item.body,
      createdAt: item.createdAt.toISOString()
    })),
    buildTasks: buildTasks.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      label: item.label,
      status: item.status as 'pending' | 'running' | 'completed' | 'error',
      createdAt: item.createdAt.toISOString()
    }))
  };
}

export async function writePostgresSnapshot(prisma: PrismaClient, data: PlatformData): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.template.deleteMany();
    await tx.organization.deleteMany();

    if (data.organizations.length > 0) {
      await tx.organization.createMany({
        data: data.organizations.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          logo: item.logo,
          industry: item.industry,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }))
      });
    }

    if (data.users.length > 0) {
      await tx.user.createMany({
        data: data.users.map((item) => ({
          id: item.id,
          email: item.email,
          passwordHash: item.passwordHash,
          name: item.name,
          avatar: item.avatar,
          title: item.title,
          verified: item.verified,
          verificationToken: item.verificationToken ?? null,
          resetToken: item.resetToken ?? null,
          primaryOrganizationId: item.primaryOrganizationId,
          onboardingCompleted: item.onboardingCompleted,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }))
      });
    }

    if (data.memberships.length > 0) {
      await tx.membership.createMany({
        data: data.memberships.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          userId: item.userId,
          role: item.role,
          presence: item.presence,
          createdAt: new Date(item.createdAt)
        }))
      });
    }

    if (data.projects.length > 0) {
      await tx.project.createMany({
        data: data.projects.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          name: item.name,
          slug: item.slug,
          description: item.description,
          category: item.category,
          prompt: item.prompt,
          maturity: item.maturity,
          style: item.style,
          stage: item.stage,
          status: item.status,
          themeAccent: item.themeAccent,
          visitors: item.visitors,
          users: item.users,
          revenueMrr: item.revenueMrr,
          deploymentEnvironment: item.deploymentEnvironment,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }))
      });
    }

    if (data.projectVersions.length > 0) {
      await tx.projectVersion.createMany({
        data: data.projectVersions.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          name: item.name,
          summary: item.summary,
          createdAt: new Date(item.createdAt)
        }))
      });
    }

    if (data.projectFiles.length > 0) {
      await tx.projectFile.createMany({
        data: data.projectFiles.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          path: item.path,
          kind: item.kind,
          updatedAt: new Date(item.updatedAt)
        }))
      });
    }

    if (data.projectPages.length > 0) {
      await tx.projectPage.createMany({
        data: data.projectPages.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          name: item.name,
          path: item.path,
          type: item.type,
          status: item.status,
          description: item.description
        }))
      });
    }

    if (data.aiConversations.length > 0) {
      await tx.aIConversation.createMany({
        data: data.aiConversations.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          title: item.title,
          agent: item.agent,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }))
      });
    }

    if (data.aiMessages.length > 0) {
      await tx.aIMessage.createMany({
        data: data.aiMessages.map((item) => ({
          id: item.id,
          conversationId: item.conversationId,
          role: item.role,
          content: item.content,
          createdAt: new Date(item.createdAt)
        }))
      });
    }

    if (data.aiUsage.length > 0) {
      await tx.aIUsage.createMany({
        data: data.aiUsage.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          projectId: item.projectId,
          action: item.action,
          model: item.model,
          credits: item.credits,
          createdAt: new Date(item.createdAt)
        }))
      });
    }

    if (data.templates.length > 0) {
      await tx.template.createMany({
        data: data.templates.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          category: item.category,
          description: item.description,
          features: item.features,
          stack: item.stack,
          rating: item.rating,
          uses: item.uses,
          previewGradient: item.previewGradient
        }))
      });
    }

    if (data.deployments.length > 0) {
      await tx.deployment.createMany({
        data: data.deployments.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          environment: item.environment,
          status: item.status,
          url: item.url,
          createdAt: new Date(item.createdAt),
          durationSeconds: item.durationSeconds,
          logs: item.logs
        }))
      });
    }

    if (data.domains.length > 0) {
      await tx.domain.createMany({
        data: data.domains.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          host: item.host,
          status: item.status,
          sslActive: item.sslActive,
          instructions: item.instructions,
          createdAt: new Date(item.createdAt)
        }))
      });
    }

    if (data.integrations.length > 0) {
      await tx.integration.createMany({
        data: data.integrations.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          key: item.key,
          name: item.name,
          description: item.description,
          status: item.status,
          configured: item.configured,
          connectedAt: toDate(item.connectedAt),
          scopes: item.scopes
        }))
      });
    }

    if (data.subscriptions.length > 0) {
      await tx.subscription.createMany({
        data: data.subscriptions.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          plan: item.plan,
          interval: item.interval,
          status: item.status,
          seats: item.seats,
          price: item.price,
          creditsLimit: item.creditsLimit,
          renewalDate: new Date(item.renewalDate)
        }))
      });
    }

    if (data.invoices.length > 0) {
      await tx.invoice.createMany({
        data: data.invoices.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          number: item.number,
          status: item.status,
          amount: item.amount,
          currency: item.currency,
          issuedAt: new Date(item.issuedAt)
        }))
      });
    }

    if (data.notifications.length > 0) {
      await tx.notification.createMany({
        data: data.notifications.map((item) => ({
          id: item.id,
          userId: item.userId,
          title: item.title,
          body: item.body,
          type: item.type,
          readAt: toDate(item.readAt),
          createdAt: new Date(item.createdAt),
          cta: item.cta ?? null
        }))
      });
    }

    if (data.apiKeys.length > 0) {
      await tx.apiKey.createMany({
        data: data.apiKeys.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          name: item.name,
          prefix: item.prefix,
          secretHash: item.secretHash,
          permissions: item.permissions,
          lastUsedAt: toDate(item.lastUsedAt),
          revokedAt: toDate(item.revokedAt),
          createdAt: new Date(item.createdAt)
        }))
      });
    }

    if (data.auditLogs.length > 0) {
      await tx.auditLog.createMany({
        data: data.auditLogs.map((item) => ({
          id: item.id,
          organizationId: item.organizationId,
          actor: item.actor,
          action: item.action,
          target: item.target,
          createdAt: new Date(item.createdAt),
          metadata: item.metadata ?? null
        }))
      });
    }

    if (data.comments.length > 0) {
      await tx.comment.createMany({
        data: data.comments.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          authorId: item.authorId,
          resource: item.resource,
          body: item.body,
          createdAt: new Date(item.createdAt)
        }))
      });
    }

    if (data.buildTasks.length > 0) {
      await tx.buildTask.createMany({
        data: data.buildTasks.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          label: item.label,
          status: item.status,
          createdAt: new Date(item.createdAt)
        }))
      });
    }
  });
}
