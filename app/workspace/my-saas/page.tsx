import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { ProjectPreview } from '@/components/project-preview';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';
import { formatCurrency, formatNumber } from '@/utils/format';

export default async function MySaasPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const organizationProjects = db.projects.filter((item) => item.organizationId === session.organization.id);
  const projectId = typeof params.project === 'string' ? params.project : organizationProjects[0]?.id;
  const project = organizationProjects.find((item) => item.id === projectId) || organizationProjects[0];

  if (!project) {
    return (
      <EmptyState
        title="No SaaS generated yet"
        description="Create your first product to unlock the live preview, generated pages, versions and deployment controls."
        href="/workspace/create"
        cta="Create SaaS"
      />
    );
  }

  const pages = db.projectPages.filter((item) => item.projectId === project.id);
  const versions = db.projectVersions.filter((item) => item.projectId === project.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My SaaS"
        title={project.name}
        description={project.description}
        badge={`${project.category} · ${project.maturity}`}
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ProjectPreview project={project} pages={pages} />
        <div className="space-y-6">
          <Card>
            <p className="text-sm text-white/45">Project summary</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Users', formatNumber(project.users)],
                ['MRR', formatCurrency(project.revenueMrr)],
                ['Visitors', formatNumber(project.visitors)],
                ['Environment', project.deploymentEnvironment]
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">Generated pages</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Ready routes</h3>
              </div>
              <Link href={`/workspace/builder?project=${project.id}`} className="text-sm text-white/65 hover:text-white">Edit in builder</Link>
            </div>
            <div className="mt-5 space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{page.name}</p>
                    <p className="text-xs text-white/40">{page.path}</p>
                  </div>
                  <Badge tone={page.status === 'ready' ? 'success' : 'default'}>{page.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-sm text-white/45">Version history</p>
            <div className="mt-5 space-y-3">
              {versions.map((version) => (
                <div key={version.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{version.name}</p>
                    <Badge tone="info">Checkpoint</Badge>
                  </div>
                  <p className="mt-2 text-sm text-white/50">{version.summary}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
