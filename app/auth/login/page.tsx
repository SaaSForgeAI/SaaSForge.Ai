import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loginAction } from '@/services/auth-actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === 'string' ? params.error : undefined;
  const success = typeof params.success === 'string' ? params.success : undefined;
  const next = typeof params.next === 'string' ? params.next : '/workspace';

  return (
    <AuthShell title="Welcome back" description="Sign in to continue building, reviewing deployments, managing billing and editing your SaaS with natural language prompts.">
      <Card className="mx-auto max-w-xl space-y-5">
        <FormMessage error={error} success={success} info="Demo account: demo@saasforge.ai / demo12345" />
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="mb-2 block text-sm text-white/60">Email</label>
            <Input name="email" type="email" defaultValue="demo@saasforge.ai" required aria-label="Email" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Password</label>
            <Input name="password" type="password" defaultValue="demo12345" required aria-label="Password" />
          </div>
          <Button type="submit" fullWidth>Sign in</Button>
        </form>
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55 transition hover:bg-white/10 hover:text-white" type="button" aria-label="Google OAuth placeholder">
            Continue with Google
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55 transition hover:bg-white/10 hover:text-white" type="button" aria-label="GitHub OAuth placeholder">
            Continue with GitHub
          </button>
        </div>
        <div className="flex flex-col justify-between gap-3 text-sm text-white/50 sm:flex-row">
          <Link href="/auth/forgot-password" className="hover:text-white">Forgot password?</Link>
          <Link href="/auth/register" className="hover:text-white">Create an account</Link>
        </div>
      </Card>
    </AuthShell>
  );
}
