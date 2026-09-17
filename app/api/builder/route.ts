import { NextResponse } from 'next/server';
import { getSessionPayload } from '@/lib/auth';
import { submitBuilderMessage } from '@/services/platform';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as { projectId?: string; prompt?: string };
  if (!body.projectId || !body.prompt) return NextResponse.json({ error: 'Missing projectId or prompt' }, { status: 400 });
  await submitBuilderMessage({ organizationId: session.organizationId, projectId: body.projectId, prompt: body.prompt });
  return NextResponse.json({ ok: true });
}
