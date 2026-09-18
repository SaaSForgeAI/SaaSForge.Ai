import Link from 'next/link';
import { Bell, BookOpen } from 'lucide-react';
import { CommandPalette } from '@/components/command-palette';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Notification, Project, Template, User } from '@/types';

export function Topbar({ user, notifications, projects, templates }: { user: User; notifications: Notification[]; projects: Project[]; templates: Template[] }) {
  const unreadCount = notifications.filter((item) => !item.readAt).length;
  const items = [
    ...projects.map((project) => ({ href: `/workspace/builder?project=${project.id}`, title: project.name, type: 'Project' })),
    ...templates.map((template) => ({ href: `/templates/${template.category.toLowerCase().replace(/\s+/g, '-')}`, title: template.name, type: 'Template' })),
    { href: '/docs', title: 'Documentation', type: 'Docs' },
    { href: '/workspace/settings', title: 'Settings', type: 'Settings' },
    { href: '/workspace/billing', title: 'Billing', type: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090b10]/90 px-4 py-3 backdrop-blur-xl sm:px-5 sm:py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 lg:min-w-[240px]">
          <Link href="/workspace" className="min-w-0 flex-1 lg:flex-none">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.05]">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Workspace</p>
              <p className="mt-1 truncate text-base font-semibold text-white">SaaSForge AI</p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <Link href="/workspace/notifications" className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sky-400" /> : null}
            </Link>
            <Link href="/workspace/settings?tab=account" className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-xs font-semibold text-white">
                {user.avatar}
              </div>
            </Link>
          </div>
        </div>

        <div className="lg:min-w-0 lg:flex-1">
          <div className="flex items-center gap-2 lg:hidden">
            <CommandPalette items={items} compact className="w-full justify-start px-4 py-3" />
            <Link href="/docs" className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
          </div>
          <div className="hidden lg:block">
            <CommandPalette items={items} />
          </div>
        </div>

        <div className="hidden lg:ml-auto lg:flex lg:items-center lg:gap-3">
          <Link href="/docs" className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-white/60 transition hover:bg-white/10 hover:text-white">
            <BookOpen className="h-4 w-4" />
          </Link>
          <Link href="/workspace/notifications" className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-sky-400" /> : null}
          </Link>
          <Link href="/workspace/settings?tab=account" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5 sm:px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-xs font-semibold text-white">
              {user.avatar}
            </div>
            <div>
              <p className="max-w-[150px] truncate text-sm font-medium text-white">{user.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/45">{user.title}</p>
                {unreadCount > 0 ? <Badge tone="info">{unreadCount} new</Badge> : null}
              </div>
            </div>
          </Link>
          <Button className="hidden xl:inline-flex">Preview live</Button>
        </div>
      </div>
    </header>
  );
}
