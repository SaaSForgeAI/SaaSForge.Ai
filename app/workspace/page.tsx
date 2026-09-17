import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnalyticsOverview, MiniBarChart, StatCard } from '@/components/charts';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getWorkspaceSummary } from '@/services/platform';
import { getWorkspaceData } from '@/lib/workspace';
import { formatCurrency, formatNumber } from '@/utils/format';

export default async function WorkspaceOverviewPage() {
  const { session, db } = await getWorkspaceData();
  const summary = await getWorkspaceSummary(session.organization.id);
  const projects = db.projects.filter((item) => item.organizationId === session.organization.id);
  const usage = summary.aiCreditsLimit === 0 ? 0 : Math.round((summary.aiCreditsUsed / summary.aiCreditsLimit) * 100);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${session.user.name.split(' ')[0]}`}
        description="Monitor active builds, revenue, deployments, AI usage and adoption across your workspace from one premium control center."
        badge={`${session.membership.role} workspace role`}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={String(summary.activeProjects)} hint="Projects in build or live stages" />
        <StatCard label="AI credits" value={`${formatNumber(summary.aiCreditsUsed)} / ${formatNumber(summary.aiCreditsLimit)}`} hint="Guardrails prevent accidental overruns" />
        <StatCard label="Users" value={String(summary.users)} hint="Owners, admins and members across the workspace" />
        <StatCard label="MRR" value={formatCurrency(summary.mrr)} hint="Blended monthly recurring revenue across projects" />
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-white/45">AI Credits</p>
            <h2 className="mt-1 text-xl font-semibold text-white">{formatNumber(summary.aiCreditsUsed)} / {formatNumber(summary.aiCreditsLimit)} credits</h2>
          </div>
          <Badge tone={usage > 85 ? 'warning' : 'info'}>{usage}% used</Badge>
        </div>
        <div className="mt-5"><Progress value={usage} /></div>
        <div className="mt-4 grid gap-3 text-sm text-white/55 sm:grid-cols-3">
          <p>Latest models: Claude Sonnet, GPT-5, Gemini 2.5 Pro</p>
          <p>Budget guardrail: pause at 95% unless manually approved</p>
          <p>Average generation cost: 1,175 credits / build request</p>
        </div>
      </Card>

      <AnalyticsOverview />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/45">Deployments and adoption</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Project performance snapshot</h3>
            </div>
            <Link href="/workspace/projects" className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6"><MiniBarChart values={projects.map((project) => project.users || 1)} labels={projects.map((project) => project.name.slice(0, 3))} /></div>
          <div className="mt-6 space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">{project.name}</p>
                  <p className="text-sm text-white/45">{project.category} · {project.maturity} · {project.deploymentEnvironment}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/55">
                  <span>{formatNumber(project.users)} users</span>
                  <Badge tone={project.stage === 'live' ? 'success' : project.stage === 'building' ? 'info' : 'default'}>{project.stage}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/45">Recent AI usage</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Credit consumption history</h3>
            </div>
            <Badge tone="info">Protected by usage limits</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {db.aiUsage.filter((item) => item.organizationId === session.organization.id).slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{item.action}</p>
                    <p className="text-white/40">{item.model}</p>
                  </div>
                  <p className="text-white/65">{formatNumber(item.credits)} credits</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
