import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { forgotPasswordAction } from '@/services/auth-actions';

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Recover access" description="Request a reset token to set a new password. In sandbox mode the token appears in notifications and can be used immediately.">
      <Card className="mx-auto max-w-xl space-y-5">
        <FormMessage success={typeof params.success === 'string' ? params.success : undefined} error={typeof params.error === 'string' ? params.error : undefined} />
        <form action={forgotPasswordAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">Email</label>
            <Input name="email" type="email" placeholder="demo@saasforge.ai" required aria-label="Email" />
          </div>
          <Button type="submit" fullWidth>Send reset instructions</Button>
        </form>
        <Link href="/auth/reset-password" className="block text-sm text-white/50 hover:text-white">Already have a token? Reset password.</Link>
      </Card>
    </AuthShell>
  );
}
