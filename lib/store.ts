import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createSeedData } from '@/database/seed';
import type { PlatformData } from '@/types';

const DB_PATH = path.join(process.cwd(), 'database', 'demo-db.json');
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDb(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const seed = createSeedData();
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
  }
}

export async function readDb(): Promise<PlatformData> {
  await ensureDb();
  const content = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(content) as PlatformData;
}

export async function writeDb(data: PlatformData): Promise<void> {
  await ensureDb();
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  });
  await writeQueue;
}

export async function updateDb(mutator: (data: PlatformData) => PlatformData | void): Promise<PlatformData> {
  const current = await readDb();
  const result = mutator(current) || current;
  await writeDb(result);
  return result;
}
