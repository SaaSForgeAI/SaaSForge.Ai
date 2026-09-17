import { PageHeader } from '@/components/page-header';
import { SchemaGraph } from '@/components/schema-graph';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';

const entities = [
  'User',
  'Organization',
  'Membership',
  'Project',
  'ProjectVersion',
  'ProjectFile',
  'ProjectPage',
  'AIConversation',
  'AIMessage',
  'AIUsage',
  'Template',
  'Deployment',
  'Domain',
  'Integration',
  'Subscription',
  'Invoice',
  'Notification',
  'ApiKey',
  'AuditLog',
  'Comment'
];

export default async function DatabasePage() {
  const { db } = await getWorkspaceData();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Database"
        title="Schema, entities and generation context"
        description="Inspect the relational model behind SaaSForge AI. The production schema targets PostgreSQL while this demo workspace persists locally for sandbox use."
      />
      <SchemaGraph />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-sm text-white/45">Core entities</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {entities.map((entity) => (
              <div key={entity} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                {entity}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Seeded data snapshot</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Users', db.users.length],
              ['Organizations', db.organizations.length],
              ['Projects', db.projects.length],
              ['Deployments', db.deployments.length],
              ['Invoices', db.invoices.length],
              ['Notifications', db.notifications.length],
              ['AI messages', db.aiMessages.length],
              ['Templates', db.templates.length]
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-xs text-white/40">{label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{String(value)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
