import { NextResponse } from 'next/server';
import { readDb } from '@/lib/store';

export async function GET(): Promise<NextResponse> {
  const db = await readDb();
  return NextResponse.json({ templates: db.templates });
}
