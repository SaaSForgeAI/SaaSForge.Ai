import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createSeedData } from '@/database/seed';
import type { PlatformData } from '@/types';

const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'saasforge-demo-db.json')
  : path.join(process.cwd(), 'database', 'demo-db.json');

let mutationQueue: Promise<unknown> = Promise.resolve();
let memoryDb: PlatformData | null = null;

async function persistDirect(data: PlatformData): Promise<void> {
  const snapshot = structuredClone(data);

  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const tempPath = `${DB_PATH}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(snapshot, null, 2), 'utf8');
    await fs.rename(tempPath, DB_PATH);
    memoryDb = null;
  } catch {
    memoryDb = snapshot;
  }
}

async function ensureDb(): Promise<void> {
  if (memoryDb) return;

  try {
    await fs.access(DB_PATH);
  } catch {
    await persistDirect(createSeedData());
  }
}

export async function readDb(): Promise<PlatformData> {
  await ensureDb();

  if (memoryDb) {
    return structuredClone(memoryDb);
  }

  try {
    const content = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(content) as PlatformData;
  } catch {
    const seed = createSeedData();
    await persistDirect(seed);
    return structuredClone(seed);
  }
}

export async function writeDb(data: PlatformData): Promise<void> {
  const task = mutationQueue.then(async () => {
    await persistDirect(data);
  });

  mutationQueue = task.catch(() => undefined);
  await task;
}

export async function updateDb(mutator: (data: PlatformData) => PlatformData | void): Promise<PlatformData> {
  const task = mutationQueue.then(async () => {
    const current = await readDb();
    const result = mutator(current) || current;
    await persistDirect(result);
    return result;
  });

  mutationQueue = task.catch(() => undefined);
  return task;
}
