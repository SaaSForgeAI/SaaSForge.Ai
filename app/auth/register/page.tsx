import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { registerAction } from '@/services/auth-actions';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === 'string' ? params.error : undefined;

  return (
    <AuthShell title="Create your workspace" description="Start from a blank idea or a template, then let SaaSForge AI generate architecture, auth, database, pages and deployments.">
      <Card className="mx-auto max-w-xl space-y-5">
        <FormMessage error={error} info="OAuth providers are ready for configuration. In sandbox mode, email verification uses local tokens." />
        <form action={registerAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">Full name</label>
            <Input name="name" type="text" placeholder="Ava Laurent" required aria-label="Full name" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Work email</label>
            <Input name="email" type="email" placeholder="you@company.com" required aria-label="Email" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Password</label>
            <Input name="password" type="password" placeholder="At least 8 characters" required minLength={8} aria-label="Password" />
          </div>
          <Button type="submit" fullWidth>Get started</Button>
        </form>
        <p className="text-sm text-white/50">Already have an account? <Link href="/auth/login" className="text-white hover:underline">Sign in</Link></p>
      </Card>
    </AuthShell>
  );
}
