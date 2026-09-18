import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Project, ProjectPage } from '@/types';

export function ProjectPreview({ project, pages, device = 'desktop' }: { project: Project; pages: ProjectPage[]; device?: 'desktop' | 'tablet' | 'mobile' }) {
  const frameClass =
    device === 'desktop'
      ? 'aspect-[16/10]'
      : device === 'tablet'
        ? 'mx-auto aspect-[4/5] w-full sm:max-w-md'
        : 'mx-auto aspect-[10/16] w-full sm:max-w-[360px]';

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/35">Live sandbox preview</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{project.name}</h3>
        </div>
        <Badge tone="success">{project.stage === 'live' ? 'Ready' : 'Updating'}</Badge>
      </div>
      <div className="p-3 sm:p-5">
        <div className={`rounded-[28px] border border-white/10 bg-gradient-to-b from-[#111522] to-[#090b10] p-3 sm:p-4 ${frameClass}`}>
          <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Dashboard</p>
                <h4 className="mt-1 truncate text-xl font-semibold text-white">{project.name}</h4>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-2xl" style={{ background: `linear-gradient(135deg, ${project.themeAccent}, #33a8ff)` }} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['Users', `${project.users}`],
                ['MRR', `$${project.revenueMrr.toLocaleString('en-US')}`],
                ['Visitors', `${project.visitors.toLocaleString('en-US')}`],
                ['Pages', `${pages.length}`]
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{String(value)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex-1 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-4 flex items-center justify-between gap-3 text-sm text-white/55">
                <span>Generated pages</span>
                <span>{project.maturity}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {pages.slice(0, 6).map((page) => (
                  <div key={page.id} className="rounded-2xl border border-white/8 bg-black/20 p-3.5">
                    <p className="font-medium text-white">{page.name}</p>
                    <p className="mt-1 text-xs leading-5 text-white/40">{page.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
