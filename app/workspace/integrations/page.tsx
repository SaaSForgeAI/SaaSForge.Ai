import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';
import { integrationAction } from '@/services/workspace-actions';

export default async function IntegrationsPage() {
  const { session, db } = await getWorkspaceData();
  const integrations = db.integrations.filter((item) => item.organizationId === session.organization.id);

  if (integrations.length === 0) {
    return (
      <EmptyState
        title="No integrations provisioned yet"
        description="Create a project or finish onboarding to seed your workspace with Stripe, GitHub, Google, email and model providers."
        href="/workspace/create"
        cta="Create SaaS"
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Integrations"
        title="Connect the services behind your SaaS"
        description="Manage OAuth, billing, email, source control, AI models, storage and database providers from one clean interface."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">{integration.key}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{integration.name}</h2>
              </div>
              <Badge tone={integration.status === 'Connected' ? 'success' : integration.status === 'Needs configuration' ? 'warning' : 'default'}>{integration.status}</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/55">{integration.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {integration.scopes.map((scope) => <span key={scope} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/55">{scope}</span>)}
            </div>
            <form action={integrationAction} className="mt-6">
              <input type="hidden" name="key" value={integration.key} />
              <input type="hidden" name="action" value={integration.status === 'Connected' ? 'disconnect' : 'connect'} />
              <Button type="submit" fullWidth variant={integration.status === 'Connected' ? 'secondary' : 'primary'}>
                {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
