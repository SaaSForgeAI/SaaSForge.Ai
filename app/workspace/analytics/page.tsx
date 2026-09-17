import { AnalyticsOverview, MiniBarChart, StatCard } from '@/components/charts';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';
import { formatCurrency, formatNumber } from '@/utils/format';

export default async function AnalyticsPage() {
  const { session, db } = await getWorkspaceData();
  const projects = db.projects.filter((item) => item.organizationId === session.organization.id);
  const revenueSeries = projects.map((project) => Math.max(project.revenueMrr, 1000));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="Usage, revenue and product health"
        description="Track visitors, users, sessions, conversions, MRR, churn, ARPU, retention and activation with premium chart surfaces and clear filters."
        badge="24h · 7d · 30d · 90d · custom"
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitors" value={formatNumber(48920)} hint="Across preview, staging and production environments" />
        <StatCard label="Sessions" value={formatNumber(75640)} hint="Healthy repeat usage across active products" />
        <StatCard label="Conversions" value="12.3%" hint="Visitor to generated-project conversion rate" />
        <StatCard label="MRR" value={formatCurrency(projects.reduce((sum, item) => sum + item.revenueMrr, 0))} hint="Consolidated recurring revenue" />
      </div>
      <AnalyticsOverview />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/45">Revenue by project</p>
              <h3 className="mt-1 text-lg font-semibold text-white">MRR comparison</h3>
            </div>
            <Badge tone="info">Line, bar and area ready</Badge>
          </div>
          <div className="mt-6"><MiniBarChart values={revenueSeries} labels={projects.map((project) => project.name.slice(0, 4))} /></div>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Retention, ARPU and churn</p>
          <div className="mt-5 space-y-3">
            {[
              ['Retention', '82.1%', 'Strong weekly revisit rate'],
              ['Activation', '31.6%', 'Visitors reaching their first generated project'],
              ['ARPU', '$182', 'Healthy blended average revenue per user'],
              ['Churn', '2.7%', 'Below target threshold for the quarter']
            ].map(([label, value, description]) => (
              <div key={String(label)} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{label}</p>
                  <p className="text-lg font-semibold text-white">{value}</p>
                </div>
                <p className="mt-2 text-sm text-white/55">{description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
