import { requireSession } from '@/lib/auth';
import { readDb } from '@/lib/store';

export async function getWorkspaceData(): Promise<{
  session: Awaited<ReturnType<typeof requireSession>>;
  db: Awaited<ReturnType<typeof readDb>>;
}> {
  const session = await requireSession();
  const db = await readDb();
  return { session, db };
}
