import { NextResponse } from 'next/server';
import { getSessionPayload } from '@/lib/auth';
import { readDb } from '@/lib/store';
import { createProject } from '@/services/platform';

export async function GET(): Promise<NextResponse> {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = await readDb();
  const projects = db.projects.filter((item) => item.organizationId === session.organizationId);
  return NextResponse.json({ projects });
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as { name?: string; prompt?: string; category?: string; maturity?: 'MVP' | 'Production ready' | 'Enterprise'; style?: 'Minimal' | 'Modern' | 'Corporate' | 'Creative' | 'Dark' | 'Custom' };
  const project = await createProject({
    organizationId: session.organizationId,
    name: body.name || 'Untitled SaaS',
    prompt: body.prompt || 'Generate a premium SaaS.',
    category: body.category || 'Other',
    maturity: body.maturity || 'MVP',
    style: body.style || 'Modern'
  });
  return NextResponse.json({ project }, { status: 201 });
}
