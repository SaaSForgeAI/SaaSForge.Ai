import { FormMessage } from '@/components/form-message';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getWorkspaceData } from '@/lib/workspace';
import { domainAction } from '@/services/workspace-actions';

export default async function DomainsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const projects = db.projects.filter((item) => item.organizationId === session.organization.id);
  const domains = db.domains.filter((item) => projects.some((project) => project.id === item.projectId));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Domains"
        title="Connect domains and enable SSL"
        description="Map production or staging apps to customer domains, surface DNS instructions and verify SSL provisioning."
      />
      <FormMessage success={typeof params.success === 'string' ? params.success : undefined} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <p className="text-sm text-white/45">Add domain</p>
          <form action={domainAction} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/60">Project</label>
              <Select name="projectId">{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</Select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Domain or subdomain</label>
              <Input name="host" placeholder="app.client.com" required />
            </div>
            <Button type="submit" fullWidth>Connect domain</Button>
          </form>
        </Card>
        <div className="space-y-5">
          {domains.map((domain) => {
            const project = projects.find((item) => item.id === domain.projectId);
            return (
              <Card key={domain.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-white/45">{project?.name}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{domain.host}</h3>
                    <p className="mt-2 text-sm text-white/55">{domain.instructions}</p>
                  </div>
                  <Badge tone={domain.sslActive ? 'success' : domain.status === 'DNS issue' ? 'danger' : 'warning'}>{domain.status}</Badge>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">SSL</p><p className="mt-2 text-sm text-white">{domain.sslActive ? 'Active' : 'Pending'}</p></div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Verification</p><p className="mt-2 text-sm text-white">Automatic</p></div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Actions</p><p className="mt-2 text-sm text-white">Verify · Remove</p></div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
