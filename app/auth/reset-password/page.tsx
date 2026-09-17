import { AuthShell } from '@/components/auth-shell';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { resetPasswordAction } from '@/services/auth-actions';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : '';
  return (
    <AuthShell title="Reset password" description="Set a new password using your verification token. This flow is sandbox-friendly and production-ready to connect with email delivery.">
      <Card className="mx-auto max-w-xl space-y-5">
        <FormMessage error={typeof params.error === 'string' ? params.error : undefined} success={typeof params.success === 'string' ? params.success : undefined} info="For the seeded demo account, request a token from the forgot password page first." />
        <form action={resetPasswordAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">Reset token</label>
            <Input name="token" type="text" defaultValue={token} placeholder="tok_..." required aria-label="Reset token" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">New password</label>
            <Input name="password" type="password" placeholder="At least 8 characters" required minLength={8} aria-label="New password" />
          </div>
          <Button type="submit" fullWidth>Update password</Button>
        </form>
      </Card>
    </AuthShell>
  );
}
