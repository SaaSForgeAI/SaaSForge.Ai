'use server';

import { redirect } from 'next/navigation';
import { createPublicToken, createSession, destroySession, hashPassword, verifyPassword } from '@/lib/auth';
import { randomId } from '@/lib/crypto';
import { readDb, updateDb } from '@/lib/store';
import { slugify } from '@/utils/format';

function qs(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/workspace');

  const db = await readDb();
  const user = db.users.find((item) => item.email === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    redirect(`/auth/login?${qs({ error: 'Invalid email or password.', next })}`);
  }

  const membership = db.memberships.find((item) => item.userId === user.id && item.organizationId === user.primaryOrganizationId);
  if (!membership) {
    redirect('/auth/login?error=No workspace membership found.');
  }

  await createSession({
    userId: user.id,
    organizationId: user.primaryOrganizationId,
    role: membership.role,
    email: user.email
  });

  redirect(user.onboardingCompleted ? next : '/onboarding');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/');
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!name || !email || password.length < 8) {
    redirect('/auth/register?error=Please provide a valid name, email and 8+ character password.');
  }

  const existing = await readDb();
  if (existing.users.some((item) => item.email === email)) {
    redirect('/auth/register?error=An account already exists for this email.');
  }

  const orgId = randomId('org');
  const userId = randomId('user');
  const timestamp = new Date().toISOString();
  const token = createPublicToken();

  await updateDb((db) => {
    db.organizations.push({
      id: orgId,
      name: `${name.split(' ')[0] || 'New'} Studio`,
      slug: slugify(`${name.split(' ')[0] || 'studio'} studio`),
      logo: name.slice(0, 2).toUpperCase(),
      industry: 'Software',
      createdAt: timestamp,
      updatedAt: timestamp
    });
    db.users.push({
      id: userId,
      email,
      passwordHash: hashPassword(password),
      name,
      avatar: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
      title: 'Workspace Owner',
      verified: false,
      verificationToken: token,
      primaryOrganizationId: orgId,
      onboardingCompleted: false,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    db.memberships.push({
      id: randomId('mem'),
      organizationId: orgId,
      userId,
      role: 'Owner',
      presence: 'online',
      createdAt: timestamp
    });
    db.subscriptions.push({
      id: randomId('sub'),
      organizationId: orgId,
      plan: 'Free',
      interval: 'monthly',
      status: 'trialing',
      seats: 1,
      price: 0,
      creditsLimit: 10000,
      renewalDate: timestamp
    });
    db.notifications.push({
      id: randomId('not'),
      userId,
      title: 'Verify your email',
      body: `Use token ${token} to verify your account in the sandbox environment.`,
      type: 'security',
      createdAt: timestamp,
      cta: '/auth/verify-email'
    });
    db.auditLogs.unshift({
      id: randomId('audit'),
      organizationId: orgId,
      actor: name,
      action: 'registered',
      target: email,
      createdAt: timestamp,
      metadata: 'Self-serve signup'
    });
  });

  const db = await readDb();
  const user = db.users.find((item) => item.email === email);
  const membership = db.memberships.find((item) => item.userId === user?.id && item.organizationId === user?.primaryOrganizationId);
  if (user && membership) {
    await createSession({
      userId: user.id,
      organizationId: user.primaryOrganizationId,
      role: membership.role,
      email: user.email
    });
  }

  redirect(`/onboarding?welcome=${encodeURIComponent('Account created. Finish onboarding to generate your first SaaS.')}`);
}

export async function forgotPasswordAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const token = createPublicToken();

  await updateDb((db) => {
    const user = db.users.find((item) => item.email === email);
    if (user) {
      user.resetToken = token;
      user.updatedAt = new Date().toISOString();
      db.notifications.push({
        id: randomId('not'),
        userId: user.id,
        title: 'Password reset requested',
        body: `Use the secure sandbox token ${token} to reset your password.`,
        type: 'security',
        createdAt: new Date().toISOString(),
        cta: '/auth/reset-password'
      });
    }
  });

  redirect(`/auth/forgot-password?success=${encodeURIComponent('If this email exists, a reset token has been prepared for the sandbox demo.')}`);
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') || '').trim();
  const password = String(formData.get('password') || '');

  if (password.length < 8) {
    redirect(`/auth/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent('Password must be at least 8 characters.')}`);
  }

  let updated = false;
  await updateDb((db) => {
    const user = db.users.find((item) => item.resetToken === token);
    if (user) {
      user.passwordHash = hashPassword(password);
      user.resetToken = undefined;
      user.updatedAt = new Date().toISOString();
      updated = true;
    }
  });

  redirect(updated ? '/auth/login?success=Password updated. Please sign in.' : '/auth/reset-password?error=Invalid or expired reset token.');
}

export async function verifyEmailAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') || '').trim();
  let updated = false;
  await updateDb((db) => {
    const user = db.users.find((item) => item.verificationToken === token);
    if (user) {
      user.verificationToken = undefined;
      user.verified = true;
      user.updatedAt = new Date().toISOString();
      updated = true;
    }
  });

  redirect(updated ? '/auth/login?success=Email verified. You can now sign in.' : '/auth/verify-email?error=Verification token is invalid.');
}
