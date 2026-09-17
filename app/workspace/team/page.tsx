import { FormMessage } from '@/components/form-message';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getWorkspaceData } from '@/lib/workspace';
import { inviteMemberAction } from '@/services/workspace-actions';

export default async function TeamPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const memberships = db.memberships.filter((item) => item.organizationId === session.organization.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Team"
        title="Collaborate with roles and activity tracking"
        description="Invite members, assign permissions, review comments and keep a complete activity log for project changes and security-sensitive actions."
      />
      <FormMessage success={typeof params.success === 'string' ? params.success : undefined} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <p className="text-sm text-white/45">Invite teammate</p>
          <form action={inviteMemberAction} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/60">Email</label>
              <Input name="email" placeholder="teammate@company.com" required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Role</label>
              <Select name="role">{['Owner', 'Admin', 'Member'].map((role) => <option key={role}>{role}</option>)}</Select>
            </div>
            <Button type="submit" fullWidth>Invite member</Button>
          </form>
        </Card>
        <div className="space-y-5">
          <Card>
            <p className="text-sm text-white/45">Members</p>
            <div className="mt-5 space-y-3">
              {memberships.map((membership) => {
                const user = db.users.find((item) => item.id === membership.userId);
                return (
                  <div key={membership.id} className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-xs font-semibold text-white">{user?.avatar}</div>
                      <div>
                        <p className="font-medium text-white">{user?.name}</p>
                        <p className="text-sm text-white/45">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={membership.role === 'Owner' ? 'success' : membership.role === 'Admin' ? 'info' : 'default'}>{membership.role}</Badge>
                      <span className="text-xs text-white/40">{membership.presence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card>
            <p className="text-sm text-white/45">Activity log and comments</p>
            <div className="mt-5 space-y-3">
              {db.auditLogs.filter((item) => item.organizationId === session.organization.id).slice(0, 6).map((log) => (
                <div key={log.id} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/60">
                  <p className="text-white">{log.actor} {log.action} {log.target}</p>
                  <p className="mt-1 text-xs text-white/40">{log.metadata}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
