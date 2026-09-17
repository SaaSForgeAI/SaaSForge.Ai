import { AuthShell } from '@/components/auth-shell';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { verifyEmailAction } from '@/services/auth-actions';

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Verify your email" description="Confirm ownership of your email address before enabling higher-risk actions such as billing, deploy tokens and production domains.">
      <Card className="mx-auto max-w-xl space-y-5">
        <FormMessage error={typeof params.error === 'string' ? params.error : undefined} success={typeof params.success === 'string' ? params.success : undefined} info="New signups receive a sandbox verification token in the notification center." />
        <form action={verifyEmailAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/60">Verification token</label>
            <Input name="token" type="text" placeholder="tok_..." required aria-label="Verification token" />
          </div>
          <Button type="submit" fullWidth>Verify email</Button>
        </form>
      </Card>
    </AuthShell>
  );
}
