import Link from 'next/link';
import { BuilderTaskList } from '@/components/builder-task-list';
import { EmptyState } from '@/components/empty-state';
import { FormMessage } from '@/components/form-message';
import { PageHeader } from '@/components/page-header';
import { ProjectPreview } from '@/components/project-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/format';
import { getWorkspaceData } from '@/lib/workspace';
import { builderPromptAction } from '@/services/workspace-actions';

const inspectorItems = (pageCount: number, style: string, accent: string) => [
  ['Components', 'Cards, forms, tables, charts, navigation'],
  ['Pages', `${pageCount} generated routes`],
  ['Theme', style],
  ['Typography', 'System sans, premium spacing'],
  ['Colors', accent],
  ['Layout', 'Responsive dashboard shell'],
  ['Spacing', 'Large whitespace and soft density'],
  ['Animations', 'Smooth transitions and progress cues']
] as const;

const suggestions = [
  'Make the dashboard more premium',
  'Add Stripe subscriptions',
  'Create an admin panel',
  'Add dark mode',
  'Add team permissions'
] as const;

const panelOptions = ['preview', 'chat', 'inspector'] as const;
const deviceOptions = ['desktop', 'tablet', 'mobile'] as const;

type BuilderPanel = (typeof panelOptions)[number];
type BuilderDevice = (typeof deviceOptions)[number];

export default async function BuilderPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const projects = db.projects.filter((item) => item.organizationId === session.organization.id);
  const projectId = typeof params.project === 'string' ? params.project : projects[0]?.id;
  const project = projects.find((item) => item.id === projectId);
  const success = typeof params.success === 'string' ? params.success : undefined;
  const requestedDevice = typeof params.device === 'string' ? params.device : 'desktop';
  const device: BuilderDevice = deviceOptions.includes(requestedDevice as BuilderDevice) ? (requestedDevice as BuilderDevice) : 'desktop';
  const requestedPanel = typeof params.panel === 'string' ? params.panel : 'preview';
  const panel: BuilderPanel = panelOptions.includes(requestedPanel as BuilderPanel) ? (requestedPanel as BuilderPanel) : 'preview';

  if (!project) {
    return <EmptyState title="No project selected" description="Create a new SaaS to unlock the AI Builder, sandbox preview and project memory." href="/workspace/create" cta="Create SaaS" />;
  }

  const conversation = db.aiConversations.find((item) => item.projectId === project.id);
  const messages = db.aiMessages.filter((item) => item.conversationId === conversation?.id).slice(-8);
  const tasks = db.buildTasks.filter((item) => item.projectId === project.id).slice(0, 8);
  const pages = db.projectPages.filter((item) => item.projectId === project.id);
  const inspector = inspectorItems(pages.length, project.style, project.themeAccent);

  return (
    <div className="space-y-7 sm:space-y-8">
      <PageHeader
        eyebrow="AI Builder"
        title="Natural language product editing"
        description="Chat with specialized AI agents, inspect generated pages and preview the product at desktop, tablet or mobile breakpoints."
        badge={project.name}
      />
      <FormMessage success={success} />

      <div className="xl:hidden">
        <Card className="p-4 sm:p-5">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-white/45">Mobile builder</p>
                <h2 className="text-xl font-semibold text-white">A calmer layout for smaller screens</h2>
                <p className="max-w-2xl text-sm leading-6 text-white/55">Move between preview, chat and inspector one surface at a time instead of squeezing the full desktop builder into a phone width.</p>
              </div>
              <Badge tone="success">{project.stage === 'live' ? 'Ready' : 'Updating'}</Badge>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {panelOptions.map((item) => (
                <Link
                  key={item}
                  href={`/workspace/builder?project=${project.id}&device=${device}&panel=${item}`}
                  className={cn(
                    'whitespace-nowrap rounded-full px-4 py-2.5 text-sm capitalize transition',
                    panel === item ? 'bg-white/10 text-white shadow-glow' : 'border border-white/10 text-white/55 hover:text-white'
                  )}
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2 rounded-[26px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Project</p>
                <p className="mt-2 text-base font-semibold text-white">{project.name}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Stage</p>
                <p className="mt-2 text-sm text-white/75">{project.maturity}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Pages</p>
                <p className="mt-2 text-sm text-white/75">{pages.length} generated</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6 xl:hidden">
        {panel === 'preview' && (
          <>
            <Card className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm text-white/45">Live preview</p>
                <h3 className="text-lg font-semibold text-white">Responsive sandbox</h3>
                <p className="text-sm leading-6 text-white/55">Choose the breakpoint you want to inspect. On a real phone, the mobile preview now uses the full available width instead of nesting a tiny phone inside your phone.</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {deviceOptions.map((item) => (
                  <Link
                    key={item}
                    href={`/workspace/builder?project=${project.id}&device=${item}&panel=preview`}
                    className={cn(
                      'whitespace-nowrap rounded-full px-4 py-2.5 capitalize transition',
                      device === item ? 'bg-white/10 text-white shadow-glow' : 'border border-white/10 text-white/50 hover:text-white'
                    )}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </Card>
            <ProjectPreview project={project} pages={pages} device={device} />
            <Card>
              <p className="text-sm text-white/45">Console logs</p>
              <div className="mt-4 space-y-2 rounded-3xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-white/50">
                <p>&gt; analyzing request for project context</p>
                <p>&gt; checking schema diffs and page registry</p>
                <p>&gt; generating UI refinements and route updates</p>
                <p>&gt; validating auth, billing and deployment surface</p>
                <p>&gt; ready for sandbox preview</p>
              </div>
            </Card>
          </>
        )}

        {panel === 'chat' && (
          <>
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-white/45">Builder chat</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Project memory enabled</h3>
                </div>
                <Badge tone="success">Context aware</Badge>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'max-w-[92%] rounded-[24px] px-4 py-3.5 text-sm leading-6',
                      message.role === 'user'
                        ? 'self-end border border-white/10 bg-white/[0.05] text-white'
                        : 'self-start border border-accent/15 bg-violet-500/10 text-white/80'
                    )}
                  >
                    <p className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-white/35">{message.role}</p>
                    {message.content}
                  </div>
                ))}
              </div>
              <form action={builderPromptAction} className="mt-6 space-y-4">
                <input type="hidden" name="projectId" value={project.id} />
                <Textarea name="prompt" defaultValue="Add a customer management page." aria-label="AI prompt" className="min-h-[160px] rounded-[28px] px-5 py-4" />
                <Button type="submit" fullWidth className="py-3">Apply changes</Button>
              </form>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/45">
                {suggestions.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
            <BuilderTaskList tasks={tasks} />
          </>
        )}

        {panel === 'inspector' && (
          <>
            <Card>
              <p className="text-sm text-white/45">Inspector</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Visual system</h3>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {inspector.map(([label, value]) => (
                  <div key={String(label)} className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/75">{String(value)}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <p className="text-sm text-white/45">Generated pages</p>
              <div className="mt-4 space-y-3">
                {pages.slice(0, 10).map((page) => (
                  <div key={page.id} className="rounded-[26px] border border-white/8 bg-black/20 px-4 py-4">
                    <p className="font-medium text-white">{page.name}</p>
                    <p className="mt-1 text-xs leading-5 text-white/40">{page.path}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="hidden gap-6 xl:grid xl:grid-cols-[0.9fr_1.3fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white/45">Builder chat</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Project memory enabled</h3>
              </div>
              <Badge tone="success">Context aware</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`rounded-3xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-6 border border-white/10 bg-white/[0.05] text-white' : 'mr-6 border border-accent/15 bg-violet-500/10 text-white/80'}`}>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{message.role}</p>
                  {message.content}
                </div>
              ))}
            </div>
            <form action={builderPromptAction} className="mt-5 space-y-4">
              <input type="hidden" name="projectId" value={project.id} />
              <Textarea name="prompt" defaultValue="Add a customer management page." aria-label="AI prompt" className="min-h-[140px]" />
              <Button type="submit" fullWidth>Apply changes</Button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/45">
              {suggestions.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">{item}</span>
              ))}
            </div>
          </Card>
          <BuilderTaskList tasks={tasks} />
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/45">Live preview</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Responsive sandbox</h3>
              </div>
              <div className="flex gap-2 text-sm">
                {deviceOptions.map((item) => (
                  <Link key={item} href={`/workspace/builder?project=${project.id}&device=${item}`} className={`rounded-full px-3 py-1.5 ${device === item ? 'bg-white/10 text-white' : 'border border-white/10 text-white/50 hover:text-white'}`}>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </Card>
          <ProjectPreview project={project} pages={pages} device={device} />
          <Card>
            <p className="text-sm text-white/45">Console logs</p>
            <div className="mt-4 space-y-2 rounded-3xl border border-white/10 bg-black/30 p-4 font-mono text-xs text-white/50">
              <p>&gt; analyzing request for project context</p>
              <p>&gt; checking schema diffs and page registry</p>
              <p>&gt; generating UI refinements and route updates</p>
              <p>&gt; validating auth, billing and deployment surface</p>
              <p>&gt; ready for sandbox preview</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <p className="text-sm text-white/45">Inspector</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Visual system</h3>
            <div className="mt-5 space-y-3">
              {inspector.map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="mt-2 text-sm text-white/75">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-sm text-white/45">Generated pages</p>
            <div className="mt-4 space-y-3">
              {pages.slice(0, 10).map((page) => (
                <div key={page.id} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <p className="font-medium text-white">{page.name}</p>
                  <p className="mt-1 text-xs text-white/40">{page.path}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
