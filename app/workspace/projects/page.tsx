import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';
import { formatCurrency, formatNumber } from '@/utils/format';

export default async function ProjectsPage() {
  const { session, db } = await getWorkspaceData();
  const projects = db.projects.filter((item) => item.organizationId === session.organization.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="Manage your SaaS portfolio"
        description="Track status, performance, revenue, pages and deployment environments for every generated product."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">{project.category}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{project.name}</h2>
                <p className="mt-3 text-sm leading-7 text-white/55">{project.description}</p>
              </div>
              <Badge tone={project.stage === 'live' ? 'success' : project.stage === 'building' ? 'info' : 'default'}>{project.stage}</Badge>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['Users', formatNumber(project.users)],
                ['Visitors', formatNumber(project.visitors)],
                ['MRR', formatCurrency(project.revenueMrr)]
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{String(value)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/workspace/builder?project=${project.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Open builder</Link>
              <Link href={`/workspace/my-saas?project=${project.id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">View project</Link>
              <Link href="/workspace/deployments" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Deployments</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
