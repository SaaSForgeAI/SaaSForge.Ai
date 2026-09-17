import { FormMessage } from '@/components/form-message';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getWorkspaceData } from '@/lib/workspace';
import { logoutAction } from '@/services/auth-actions';
import { createApiKeyAction, revokeApiKeyAction, updateAccountAction, updateWorkspaceAction } from '@/services/workspace-actions';
import { formatDate, maskSecret } from '@/utils/format';

const tabs = ['account', 'workspace', 'appearance', 'notifications', 'security', 'billing', 'integrations', 'api'] as const;

type Tab = typeof tabs[number];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const tab = (typeof params.tab === 'string' ? params.tab : 'account') as Tab;
  const created = typeof params.created === 'string' ? params.created : undefined;
  const success = typeof params.success === 'string' ? params.success : undefined;
  const apiKeys = db.apiKeys.filter((item) => item.organizationId === session.organization.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Account, workspace and security controls"
        description="Manage profile, workspace identity, appearance, notifications, API keys, sessions, integrations and billing settings from one coherent surface."
      />
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <a key={item} href={`/workspace/settings?tab=${item}`} className={`rounded-full px-3 py-1.5 text-sm capitalize ${tab === item ? 'bg-white/10 text-white' : 'border border-white/10 text-white/50 hover:text-white'}`}>
            {item}
          </a>
        ))}
      </div>
      <FormMessage success={success} info={created ? `Store this API key now. It will not be shown again: ${maskSecret(created)}` : undefined} />

      {tab === 'account' && (
        <Card className="max-w-3xl">
          <form action={updateAccountAction} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/60">Name</label>
              <Input name="name" defaultValue={session.user.name} required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Title</label>
              <Input name="title" defaultValue={session.user.title} required />
            </div>
            <Button type="submit">Save account</Button>
          </form>
          <form action={logoutAction} className="mt-6"><Button type="submit" variant="secondary">Sign out</Button></form>
        </Card>
      )}

      {tab === 'workspace' && (
        <Card className="max-w-3xl">
          <form action={updateWorkspaceAction} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/60">Workspace name</label>
              <Input name="name" defaultValue={session.organization.name} required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Industry</label>
              <Input name="industry" defaultValue={session.organization.industry} required />
            </div>
            <Button type="submit">Save workspace</Button>
          </form>
        </Card>
      )}

      {tab === 'appearance' && (
        <Card className="max-w-3xl space-y-4">
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {['light', 'dark', 'system'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-medium capitalize text-white">{item}</p>
                <p className="mt-2 text-sm text-white/50">Preview theme option ready for persistence.</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card className="max-w-3xl space-y-4">
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          {['In-app product updates', 'Deployment alerts', 'Billing notices', 'Security warnings'].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-white/70">{item}</span>
              <Badge tone="success">Enabled</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === 'security' && (
        <Card className="max-w-4xl space-y-4">
          <h2 className="text-xl font-semibold text-white">Security</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Email verification', session.user.verified ? 'Verified' : 'Pending'],
              ['2FA', 'Ready for authenticator integration'],
              ['Rate limiting', 'Enabled on mutation endpoints'],
              ['Secret handling', 'Server-side only']
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-white/45">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'billing' && (
        <Card className="max-w-4xl space-y-4">
          <h2 className="text-xl font-semibold text-white">Billing shortcut</h2>
          <p className="text-sm text-white/55">Open the dedicated billing page to change plans, inspect invoices and configure production Stripe secrets.</p>
          <a href="/workspace/billing" className="inline-flex rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Go to billing</a>
        </Card>
      )}

      {tab === 'integrations' && (
        <Card className="max-w-4xl space-y-4">
          <h2 className="text-xl font-semibold text-white">Integration status</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {db.integrations.filter((item) => item.organizationId === session.organization.id).map((integration) => (
              <div key={integration.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{integration.name}</p>
                  <Badge tone={integration.status === 'Connected' ? 'success' : integration.status === 'Needs configuration' ? 'warning' : 'default'}>{integration.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'api' && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="text-xl font-semibold text-white">Create API key</h2>
            <form action={createApiKeyAction} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/60">Key name</label>
                <Input name="name" placeholder="CI deploy worker" required />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/60">Permissions</label>
                <Select name="permissions" defaultValue="projects:read,deployments:write">
                  <option value="projects:read,deployments:write">projects:read, deployments:write</option>
                  <option value="analytics:read,billing:read">analytics:read, billing:read</option>
                  <option value="projects:read,projects:write">projects:read, projects:write</option>
                </Select>
              </div>
              <Button type="submit" fullWidth>Generate API key</Button>
            </form>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-white">Existing keys</h2>
            <div className="mt-5 space-y-3">
              {apiKeys.map((key) => (
                <div key={key.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">{key.name}</p>
                      <p className="text-sm text-white/45">{key.prefix}••••</p>
                      <p className="mt-1 text-xs text-white/35">Created {formatDate(key.createdAt)} {key.lastUsedAt ? `· Last used ${formatDate(key.lastUsedAt)}` : ''}</p>
                    </div>
                    <form action={revokeApiKeyAction}>
                      <input type="hidden" name="keyId" value={key.id} />
                      <Button type="submit" variant="danger" disabled={Boolean(key.revokedAt)}>{key.revokedAt ? 'Revoked' : 'Revoke'}</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
