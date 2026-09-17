'use server';

import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import {
  updateOnboardingState,
  updateOrganizationProfile,
  updateUserProfile
} from '@/lib/postgres-auth';
import { getPrismaClient, shouldUsePostgresStorage } from '@/lib/prisma';
import { updateDb } from '@/lib/store';
import {
  addDomain,
  connectIntegration,
  createApiKey,
  createDeployment,
  createProject,
  disconnectIntegration,
  inviteMember,
  revokeApiKey,
  submitBuilderMessage,
  updateSubscription
} from '@/services/platform';
import { randomId } from '@/lib/crypto';
import type { BillingInterval, BillingPlan, Role } from '@/types';

export async function completeOnboardingAction(formData: FormData): Promise<void> {
  const { user, organization } = await requireSession();
  const idea = String(formData.get('idea') || '').trim();
  const category = String(formData.get('category') || 'Other');
  const maturity = String(formData.get('maturity') || 'MVP') as 'MVP' | 'Production ready' | 'Enterprise';
  const style = String(formData.get('style') || 'Modern') as 'Minimal' | 'Modern' | 'Corporate' | 'Creative' | 'Dark' | 'Custom';
  const projectName = String(formData.get('projectName') || 'My AI SaaS').trim();

  const project = await createProject({
    organizationId: organization.id,
    name: projectName,
    prompt: idea,
    category,
    maturity,
    style
  });

  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await updateOnboardingState(prisma, {
      userId: user.id,
      projectId: project.id,
      projectName: project.name
    });
  } else {
    await updateDb((db) => {
      const currentUser = db.users.find((item) => item.id === user.id);
      if (currentUser) currentUser.onboardingCompleted = true;
      db.notifications.unshift({
        id: randomId('not'),
        userId: user.id,
        title: 'Your SaaS is generating',
        body: `${project.name} is now available in the AI Builder with a live preview.`,
        type: 'build',
        createdAt: new Date().toISOString(),
        cta: `/workspace/builder?project=${project.id}`
      });
    });
  }

  redirect(`/workspace/builder?project=${project.id}`);
}

export async function createProjectAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const name = String(formData.get('name') || '').trim() || 'Untitled SaaS';
  const prompt = String(formData.get('prompt') || '').trim() || 'Create a premium SaaS product.';
  const category = String(formData.get('category') || 'Other');
  const maturity = String(formData.get('maturity') || 'MVP') as 'MVP' | 'Production ready' | 'Enterprise';
  const style = String(formData.get('style') || 'Modern') as 'Minimal' | 'Modern' | 'Corporate' | 'Creative' | 'Dark' | 'Custom';

  const project = await createProject({ organizationId: organization.id, name, prompt, category, maturity, style });
  redirect(`/workspace/builder?project=${project.id}`);
}

export async function builderPromptAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const projectId = String(formData.get('projectId') || '');
  const prompt = String(formData.get('prompt') || '').trim();
  if (!projectId || !prompt) redirect('/workspace/builder?error=Missing project or prompt');
  await submitBuilderMessage({ organizationId: organization.id, projectId, prompt });
  redirect(`/workspace/builder?project=${projectId}&success=${encodeURIComponent('AI changes applied to the project context.')}`);
}

export async function deployAction(formData: FormData): Promise<void> {
  await requireSession();
  const projectId = String(formData.get('projectId') || '');
  const environment = String(formData.get('environment') || 'preview') as 'preview' | 'staging' | 'production';
  await createDeployment(projectId, environment);
  redirect(`/workspace/deployments?success=${encodeURIComponent('Deployment created successfully.')}`);
}

export async function domainAction(formData: FormData): Promise<void> {
  await requireSession();
  const projectId = String(formData.get('projectId') || '');
  const host = String(formData.get('host') || '').trim();
  if (projectId && host) await addDomain(projectId, host);
  redirect('/workspace/domains?success=Domain added. DNS verification instructions generated.');
}

export async function integrationAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const key = String(formData.get('key') || '');
  const action = String(formData.get('action') || 'connect');
  if (action === 'disconnect') await disconnectIntegration(organization.id, key);
  else await connectIntegration(organization.id, key);
  redirect('/workspace/integrations');
}

export async function subscriptionAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const plan = String(formData.get('plan') || 'Free') as BillingPlan;
  const interval = String(formData.get('interval') || 'monthly') as BillingInterval;
  await updateSubscription(organization.id, plan, interval);
  redirect('/workspace/billing?success=Subscription updated. Stripe checkout can be connected via environment variables.');
}

export async function inviteMemberAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const role = String(formData.get('role') || 'Member') as Role;
  if (email) await inviteMember(organization.id, email, role);
  redirect('/workspace/team?success=Invitation logged and ready for email delivery integration.');
}

export async function createApiKeyAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const name = String(formData.get('name') || '').trim() || 'New API key';
  const permissions = String(formData.get('permissions') || 'projects:read')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const secret = await createApiKey(organization.id, name, permissions);
  redirect(`/workspace/settings?tab=api&created=${encodeURIComponent(secret)}`);
}

export async function revokeApiKeyAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const keyId = String(formData.get('keyId') || '');
  await revokeApiKey(organization.id, keyId);
  redirect('/workspace/settings?tab=api&success=API key revoked.');
}

export async function updateAccountAction(formData: FormData): Promise<void> {
  const { user } = await requireSession();
  const name = String(formData.get('name') || '').trim();
  const title = String(formData.get('title') || '').trim();
  await updateDb((db) => {
    const current = db.users.find((item) => item.id === user.id);
    if (current) {
      current.name = name || current.name;
      current.title = title || current.title;
      current.updatedAt = new Date().toISOString();
    }
  });
  redirect('/workspace/settings?tab=account&success=Profile updated.');
}

export async function updateWorkspaceAction(formData: FormData): Promise<void> {
  const { organization } = await requireSession();
  const name = String(formData.get('name') || '').trim();
  const industry = String(formData.get('industry') || '').trim();
  await updateDb((db) => {
    const current = db.organizations.find((item) => item.id === organization.id);
    if (current) {
      current.name = name || current.name;
      current.industry = industry || current.industry;
      current.updatedAt = new Date().toISOString();
    }
  });
  redirect('/workspace/settings?tab=workspace&success=Workspace updated.');
}
