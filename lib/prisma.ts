import { PrismaClient } from '@prisma/client';
import { env } from '@/lib/env';

declare global {
  // eslint-disable-next-line no-var
  var __saasforgePrisma: PrismaClient | undefined;
}

export function isPostgresStorageEnabled(): boolean {
  return env.storageProvider === 'postgres' && Boolean(process.env.DATABASE_URL);
}

export function getPrismaClient(): PrismaClient | null {
  if (!isPostgresStorageEnabled()) return null;

  if (!global.__saasforgePrisma) {
    global.__saasforgePrisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
    });
  }

  return global.__saasforgePrisma;
}
