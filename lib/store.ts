import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createSeedData } from '@/database/seed';
import { env } from '@/lib/env';
import { getPrismaClient, isPostgresStorageEnabled } from '@/lib/prisma';
import { ensurePostgresSeed, readPostgresSnapshot, writePostgresSnapshot } from '@/lib/store-postgres';
import type { PlatformData } from '@/types';

const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'saasforge-demo-db.json')
  : path.join(process.cwd(), 'database', 'demo-db.json');

let mutationQueue: Promise<unknown> = Promise.resolve();
let memoryDb: PlatformData | null = null;

async function persistDemoSnapshot(data: PlatformData): Promise<void> {
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

async function ensureDemoDb(): Promise<void> {
  if (memoryDb) return;

  try {
    await fs.access(DB_PATH);
  } catch {
    await persistDemoSnapshot(createSeedData());
  }
}

async function readDemoDb(): Promise<PlatformData> {
  await ensureDemoDb();

  if (memoryDb) {
    return structuredClone(memoryDb);
  }

  try {
    const content = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(content) as PlatformData;
  } catch {
    const seed = createSeedData();
    await persistDemoSnapshot(seed);
    return structuredClone(seed);
  }
}

async function writeDemoDb(data: PlatformData): Promise<void> {
  await persistDemoSnapshot(data);
}

function shouldUsePostgres(): boolean {
  return isPostgresStorageEnabled() && !env.demoMode;
}

export async function readDb(): Promise<PlatformData> {
  if (shouldUsePostgres()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    await ensurePostgresSeed(prisma);
    return readPostgresSnapshot(prisma);
  }

  return readDemoDb();
}

export async function writeDb(data: PlatformData): Promise<void> {
  const task = mutationQueue.then(async () => {
    if (shouldUsePostgres()) {
      const prisma = getPrismaClient();
      if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
      await ensurePostgresSeed(prisma);
      await writePostgresSnapshot(prisma, data);
      return;
    }

    await writeDemoDb(data);
  });

  mutationQueue = task.catch(() => undefined);
  await task;
}

export async function updateDb(mutator: (data: PlatformData) => PlatformData | void): Promise<PlatformData> {
  const task = mutationQueue.then(async () => {
    const current = await readDb();
    const result = mutator(current) || current;

    if (shouldUsePostgres()) {
      const prisma = getPrismaClient();
      if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
      await writePostgresSnapshot(prisma, result);
      return result;
    }

    await writeDemoDb(result);
    return result;
  });

  mutationQueue = task.catch(() => undefined);
  return task;
}
