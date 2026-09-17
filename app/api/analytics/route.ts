import { NextResponse } from 'next/server';
import { getSessionPayload } from '@/lib/auth';
import { readDb } from '@/lib/store';

export async function GET(): Promise<NextResponse> {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = await readDb();
  const projects = db.projects.filter((item) => item.organizationId === session.organizationId);
  const usage = db.aiUsage.filter((item) => item.organizationId === session.organizationId);
  return NextResponse.json({
    visitors: projects.reduce((sum, item) => sum + item.visitors, 0),
    users: projects.reduce((sum, item) => sum + item.users, 0),
    mrr: projects.reduce((sum, item) => sum + item.revenueMrr, 0),
    creditsUsed: usage.reduce((sum, item) => sum + item.credits, 0)
  });
}
