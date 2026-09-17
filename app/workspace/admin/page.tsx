import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';

export default async function AdminPage() {
  const { session, db } = await getWorkspaceData();
  if (session.membership.role === 'Member') notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin panel"
        title="System oversight for SaaSForge AI"
        description="Review users, organizations, projects, templates, subscriptions, payments, AI usage, reports, logs, feature flags and system health."
        badge={session.membership.role}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between"><p className="text-sm text-white/45">Workspace resources</p><Badge tone="info">Search · Filters · CSV export</Badge></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Users', db.users.length],
              ['Organizations', db.organizations.length],
              ['Projects', db.projects.length],
              ['Templates', db.templates.length],
              ['Subscriptions', db.subscriptions.length],
              ['Payments', db.invoices.length],
              ['AI usage records', db.aiUsage.length],
              ['Audit logs', db.auditLogs.length]
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{String(value)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-white/45">System health</p>
          <div className="mt-5 space-y-3">
            {[
              ['API latency', '142ms', 'healthy'],
              ['Build queue', '4 jobs', 'healthy'],
              ['Email delivery', 'Needs provider key', 'warning'],
              ['Stripe webhooks', 'Awaiting production secret', 'warning'],
              ['AI providers', '3 connected models', 'healthy'],
              ['Secrets vault', 'Encrypted at rest', 'healthy']
            ].map(([label, value, tone]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm">
                <div>
                  <p className="text-white">{label}</p>
                  <p className="text-white/45">{value}</p>
                </div>
                <Badge tone={tone === 'healthy' ? 'success' : 'warning'}>{tone}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
