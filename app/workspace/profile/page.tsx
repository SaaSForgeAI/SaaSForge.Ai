import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';
import { formatDate } from '@/utils/format';

export default async function ProfilePage() {
  const { session } = await getWorkspaceData();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title={session.user.name}
        description="Review your identity, verification status, role and workspace membership."
      />
      <Card className="max-w-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-lg font-semibold text-white">{session.user.avatar}</div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{session.user.name}</h2>
            <p className="text-white/50">{session.user.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Role</p><p className="mt-2 text-sm text-white">{session.membership.role}</p></div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Verification</p><div className="mt-2"><Badge tone={session.user.verified ? 'success' : 'warning'}>{session.user.verified ? 'Verified' : 'Pending'}</Badge></div></div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Workspace</p><p className="mt-2 text-sm text-white">{session.organization.name}</p></div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Member since</p><p className="mt-2 text-sm text-white">{formatDate(session.user.createdAt)}</p></div>
        </div>
      </Card>
    </div>
  );
}
