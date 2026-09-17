import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { env } from '@/lib/env';
import { randomId, signPayload, verifySecret, hashSecret } from '@/lib/crypto';
import { readDb } from '@/lib/store';
import type { SessionPayload, SessionUserContext } from '@/types';

const COOKIE_NAME = 'sf_session';

function encode(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const data = Buffer.from(json).toString('base64url');
  const signature = signPayload(data, env.authSecret);
  return `${data}.${signature}`;
}

function decode(token: string): SessionPayload | null {
  const [data, signature] = token.split('.');
  if (!data || !signature) return null;
  const expected = signPayload(data, env.authSecret);
  if (expected !== signature) return null;

  try {
    const json = Buffer.from(data, 'base64url').toString('utf8');
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encode(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decode(raw);
}

export async function getSessionContext(): Promise<SessionUserContext | null> {
  const payload = await getSessionPayload();
  if (!payload) return null;
  const db = await readDb();
  const user = db.users.find((item) => item.id === payload.userId);
  const organization = db.organizations.find((item) => item.id === payload.organizationId);
  const membership = db.memberships.find(
    (item) => item.userId === payload.userId && item.organizationId === payload.organizationId
  );
  if (!user || !organization || !membership) return null;
  return { user, organization, membership };
}

export async function requireSession(): Promise<SessionUserContext> {
  const context = await getSessionContext();
  if (!context) redirect('/auth/login');
  return context;
}

export function hashPassword(password: string): string {
  return hashSecret(password);
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  return verifySecret(password, passwordHash);
}

export function createPublicToken(): string {
  return randomId('tok');
}
