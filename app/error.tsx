'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6">
      <Card className="w-full text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-white/35">Error handling</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Something interrupted the build flow.</h1>
        <p className="mt-4 text-sm leading-7 text-white/55">Retry the action, inspect logs or ask AI to fix the issue from the builder workspace.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => reset()}>Retry</Button>
          <a href="/workspace/builder"><Button variant="secondary">Ask AI to fix</Button></a>
        </div>
      </Card>
    </main>
  );
}
