import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';

export default async function ApiPage() {
  const { session } = await getWorkspaceData();
  const baseUrl = '/api';
  const endpoints = [
    ['GET', `${baseUrl}/projects`, 'List projects in the workspace'],
    ['POST', `${baseUrl}/projects`, 'Create a new SaaS project'],
    ['GET', `${baseUrl}/templates`, 'Browse templates'],
    ['GET', `${baseUrl}/analytics`, 'Return KPI summaries'],
    ['POST', `${baseUrl}/builder`, 'Submit an AI Builder instruction']
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="API"
        title="Secure API surface and key management"
        description="Use scoped API keys to automate project creation, sync data, trigger builds and connect external services. Secrets stay server-side and are never fully re-displayed after creation."
        badge={session.membership.role}
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-sm text-white/45">Reference endpoints</p>
          <div className="mt-5 space-y-3">
            {endpoints.map(([method, path, description]) => (
              <div key={path} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={method === 'GET' ? 'info' : 'success'}>{method}</Badge>
                  <code className="text-sm text-white">{path}</code>
                </div>
                <p className="mt-2 text-sm text-white/55">{description}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Security notes</p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-white/60">
            <p>• Session cookies are HTTP-only and routes under /workspace are protected.</p>
            <p>• API keys are scoped by permissions such as projects:read or deployments:write.</p>
            <p>• Inputs are validated server-side before mutating project or billing state.</p>
            <p>• OAuth, Stripe and email providers plug into the same service abstraction layer.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
