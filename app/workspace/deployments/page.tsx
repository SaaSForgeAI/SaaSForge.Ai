import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { FormMessage } from '@/components/form-message';
import { getWorkspaceData } from '@/lib/workspace';
import { deployAction } from '@/services/workspace-actions';
import { formatDate } from '@/utils/format';

export default async function DeploymentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const deployments = db.deployments.filter((item) => db.projects.some((project) => project.organizationId === session.organization.id && project.id === item.projectId));
  const projects = db.projects.filter((item) => item.organizationId === session.organization.id);

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects ready for deployment"
        description="Generate a SaaS first, then launch preview, staging and production releases from this control center."
        href="/workspace/create"
        cta="Create SaaS"
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Deployments"
        title="Build, test, deploy and rollback"
        description="Ship preview, staging or production releases with status-aware logs, environment surfaces and one-click redeploy actions."
      />
      <FormMessage success={typeof params.success === 'string' ? params.success : undefined} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <p className="text-sm text-white/45">Create deployment</p>
          <form action={deployAction} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/60">Project</label>
              <Select name="projectId">
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Environment</label>
              <Select name="environment">
                {['preview', 'staging', 'production'].map((env) => <option key={env}>{env}</option>)}
              </Select>
            </div>
            <Button type="submit" fullWidth>Deploy</Button>
          </form>
          <div className="mt-5 space-y-3 text-sm text-white/55">
            <p>Build → Tests → Deploy → Live</p>
            <p>Retry, view logs and ask AI to fix are available on every deployment state.</p>
          </div>
        </Card>
        <div className="space-y-5">
          {deployments.map((deployment) => {
            const project = projects.find((item) => item.id === deployment.projectId);
            return (
              <Card key={deployment.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">{deployment.environment}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{project?.name || deployment.projectId}</h3>
                    <p className="mt-1 text-sm text-white/45">{deployment.url}</p>
                  </div>
                  <Badge tone={deployment.status === 'ready' ? 'success' : deployment.status === 'building' ? 'info' : deployment.status === 'failed' ? 'danger' : 'default'}>{deployment.status}</Badge>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Created</p><p className="mt-2 text-sm text-white">{formatDate(deployment.createdAt)}</p></div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Duration</p><p className="mt-2 text-sm text-white">{deployment.durationSeconds}s</p></div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Actions</p><p className="mt-2 text-sm text-white">Redeploy · Rollback · Logs</p></div>
                </div>
                <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-4 font-mono text-xs text-white/50">
                  {deployment.logs.map((line) => <p key={line}>&gt; {line}</p>)}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
