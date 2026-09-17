import type { PrismaClient } from '@prisma/client';
import { randomId } from '@/lib/crypto';
import type { SessionPayload, SessionUserContext } from '@/types';
import { slugify } from '@/utils/format';

function toSessionContext(result: {
  user: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    avatar: string;
    title: string;
    verified: boolean;
    verificationToken: string | null;
    resetToken: string | null;
    primaryOrganizationId: string;
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    memberships: Array<{
      id: string;
      organizationId: string;
      userId: string;
      role: string;
      presence: string;
      createdAt: Date;
      organization: {
        id: string;
        name: string;
        slug: string;
        logo: string;
        industry: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }>;
  };
}): SessionUserContext | null {
  const membership = result.user.memberships[0];
  if (!membership) return null;

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      passwordHash: result.user.passwordHash,
      name: result.user.name,
      avatar: result.user.avatar,
      title: result.user.title,
      verified: result.user.verified,
      verificationToken: result.user.verificationToken ?? undefined,
      resetToken: result.user.resetToken ?? undefined,
      primaryOrganizationId: result.user.primaryOrganizationId,
      onboardingCompleted: result.user.onboardingCompleted,
      createdAt: result.user.createdAt.toISOString(),
      updatedAt: result.user.updatedAt.toISOString()
    },
    organization: {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      logo: membership.organization.logo,
      industry: membership.organization.industry,
      createdAt: membership.organization.createdAt.toISOString(),
      updatedAt: membership.organization.updatedAt.toISOString()
    },
    membership: {
      id: membership.id,
      organizationId: membership.organizationId,
      userId: membership.userId,
      role: membership.role as 'Owner' | 'Admin' | 'Member',
      presence: membership.presence as 'online' | 'away' | 'offline',
      createdAt: membership.createdAt.toISOString()
    }
  };
}

export async function getSessionContextFromPostgres(prisma: PrismaClient, payload: SessionPayload): Promise<SessionUserContext | null> {
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      memberships: {
        where: { organizationId: payload.organizationId },
        include: { organization: true },
        take: 1
      }
    }
  });

  if (!user) return null;
  return toSessionContext({ user });
}

export async function findLoginCandidate(prisma: PrismaClient, email: string): Promise<SessionUserContext | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: { organization: true }
      }
    }
  });

  if (!user) return null;
  const primaryMembership = user.memberships.find((membership) => membership.organizationId === user.primaryOrganizationId);
  if (!primaryMembership) return null;

  return toSessionContext({ user: { ...user, memberships: [primaryMembership] } });
}

export async function createWorkspaceUser(prisma: PrismaClient, input: {
  name: string;
  email: string;
  passwordHash: string;
  verificationToken: string;
}): Promise<SessionUserContext> {
  const orgId = randomId('org');
  const userId = randomId('user');
  const membershipId = randomId('mem');
  const subscriptionId = randomId('sub');
  const timestamp = new Date();
  const initials = input.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const firstName = input.name.split(' ')[0] || 'New';

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        id: orgId,
        name: `${firstName} Studio`,
        slug: slugify(`${firstName} studio`),
        logo: input.name.slice(0, 2).toUpperCase(),
        industry: 'Software',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    const user = await tx.user.create({
      data: {
        id: userId,
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name,
        avatar: initials,
        title: 'Workspace Owner',
        verified: false,
        verificationToken: input.verificationToken,
        primaryOrganizationId: orgId,
        onboardingCompleted: false,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    const membership = await tx.membership.create({
      data: {
        id: membershipId,
        organizationId: orgId,
        userId,
        role: 'Owner',
        presence: 'online',
        createdAt: timestamp
      }
    });

    await tx.subscription.create({
      data: {
        id: subscriptionId,
        organizationId: orgId,
        plan: 'Free',
        interval: 'monthly',
        status: 'trialing',
        seats: 1,
        price: 0,
        creditsLimit: 10000,
        renewalDate: timestamp
      }
    });

    await tx.integration.createMany({
      data: [
        {
          id: randomId('int'),
          organizationId: orgId,
          key: 'stripe',
          name: 'Stripe',
          description: 'Subscriptions, invoices and customer portal.',
          status: 'Available',
          configured: false,
          scopes: ['Billing', 'Webhooks']
        },
        {
          id: randomId('int'),
          organizationId: orgId,
          key: 'github',
          name: 'GitHub',
          description: 'Repository sync and deployment automation.',
          status: 'Available',
          configured: false,
          scopes: ['Repos', 'Actions']
        },
        {
          id: randomId('int'),
          organizationId: orgId,
          key: 'google',
          name: 'Google',
          description: 'OAuth, calendar sync and workspace import.',
          status: 'Needs configuration',
          configured: false,
          scopes: ['OAuth', 'Calendar']
        },
        {
          id: randomId('int'),
          organizationId: orgId,
          key: 'resend',
          name: 'Resend',
          description: 'Transactional email delivery.',
          status: 'Available',
          configured: false,
          scopes: ['Email']
        },
        {
          id: randomId('int'),
          organizationId: orgId,
          key: 'openai',
          name: 'OpenAI',
          description: 'Premium generation models for UI and code.',
          status: 'Available',
          configured: false,
          scopes: ['Completions', 'Embeddings']
        }
      ]
    });

    await tx.notification.create({
      data: {
        id: randomId('not'),
        userId,
        title: 'Verify your email',
        body: `Use token ${input.verificationToken} to verify your account in the sandbox environment.`,
        type: 'security',
        createdAt: timestamp,
        cta: '/auth/verify-email'
      }
    });

    await tx.auditLog.create({
      data: {
        id: randomId('audit'),
        organizationId: orgId,
        actor: input.name,
        action: 'registered',
        target: input.email,
        createdAt: timestamp,
        metadata: 'Self-serve signup'
      }
    });

    return { organization, user, membership };
  });

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      passwordHash: result.user.passwordHash,
      name: result.user.name,
      avatar: result.user.avatar,
      title: result.user.title,
      verified: result.user.verified,
      verificationToken: result.user.verificationToken ?? undefined,
      resetToken: result.user.resetToken ?? undefined,
      primaryOrganizationId: result.user.primaryOrganizationId,
      onboardingCompleted: result.user.onboardingCompleted,
      createdAt: result.user.createdAt.toISOString(),
      updatedAt: result.user.updatedAt.toISOString()
    },
    organization: {
      id: result.organization.id,
      name: result.organization.name,
      slug: result.organization.slug,
      logo: result.organization.logo,
      industry: result.organization.industry,
      createdAt: result.organization.createdAt.toISOString(),
      updatedAt: result.organization.updatedAt.toISOString()
    },
    membership: {
      id: result.membership.id,
      organizationId: result.membership.organizationId,
      userId: result.membership.userId,
      role: result.membership.role as 'Owner' | 'Admin' | 'Member',
      presence: result.membership.presence as 'online' | 'away' | 'offline',
      createdAt: result.membership.createdAt.toISOString()
    }
  };
}

export async function setResetToken(prisma: PrismaClient, email: string, token: string): Promise<{ userId: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      updatedAt: new Date()
    }
  });

  await prisma.notification.create({
    data: {
      id: randomId('not'),
      userId: updated.id,
      title: 'Password reset requested',
      body: `Use the secure sandbox token ${token} to reset your password.`,
      type: 'security',
      createdAt: new Date(),
      cta: '/auth/reset-password'
    }
  });

  return { userId: updated.id };
}

export async function resetPasswordByToken(prisma: PrismaClient, token: string, passwordHash: string): Promise<boolean> {
  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if (!user) return false;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      updatedAt: new Date()
    }
  });

  return true;
}

export async function verifyEmailByToken(prisma: PrismaClient, token: string): Promise<boolean> {
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) return false;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: null,
      verified: true,
      updatedAt: new Date()
    }
  });

  return true;
}

export async function updateOnboardingState(prisma: PrismaClient, input: {
  userId: string;
  projectId: string;
  projectName: string;
}): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: input.userId },
      data: {
        onboardingCompleted: true,
        updatedAt: new Date()
      }
    }),
    prisma.notification.create({
      data: {
        id: randomId('not'),
        userId: input.userId,
        title: 'Your SaaS is generating',
        body: `${input.projectName} is now available in the AI Builder with a live preview.`,
        type: 'build',
        createdAt: new Date(),
        cta: `/workspace/builder?project=${input.projectId}`
      }
    })
  ]);
}

export async function updateUserProfile(prisma: PrismaClient, userId: string, input: { name: string; title: string }): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      title: input.title,
      updatedAt: new Date()
    }
  });
}

export async function updateOrganizationProfile(prisma: PrismaClient, organizationId: string, input: { name: string; industry: string }): Promise<void> {
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      name: input.name,
      industry: input.industry,
      updatedAt: new Date()
    }
  });
}
