import Link from 'next/link';
import { Bell, BookOpen, Menu, Search } from 'lucide-react';
import { CommandPalette } from '@/components/command-palette';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Notification, Project, Template, User } from '@/types';

export function Topbar({ user, notifications, projects, templates }: { user: User; notifications: Notification[]; projects: Project[]; templates: Template[] }) {
  const items = [
    ...projects.map((project) => ({ href: `/workspace/builder?project=${project.id}`, title: project.name, type: 'Project' })),
    ...templates.map((template) => ({ href: `/templates/${template.category.toLowerCase().replace(/\s+/g, '-')}`, title: template.name, type: 'Template' })),
    { href: '/docs', title: 'Documentation', type: 'Docs' },
    { href: '/workspace/settings', title: 'Settings', type: 'Settings' },
    { href: '/workspace/billing', title: 'Billing', type: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090b10]/85 px-4 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-white/60">
            <Menu className="h-4 w-4" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-white/60">
            <Search className="h-4 w-4" />
          </div>
        </div>
        <CommandPalette items={items} />
        <div className="ml-auto flex items-center gap-3">
          <Link href="/docs" className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-white/60 transition hover:bg-white/10 hover:text-white sm:block">
            <BookOpen className="h-4 w-4" />
          </Link>
          <Link href="/workspace/notifications" className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-white/60 transition hover:bg-white/10 hover:text-white">
            <Bell className="h-4 w-4" />
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-xs font-semibold text-white">
              {user.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/45">{user.title}</p>
                {notifications.some((item) => !item.readAt) && <Badge tone="info">{notifications.filter((item) => !item.readAt).length} new</Badge>}
              </div>
            </div>
          </div>
          <Button className="hidden sm:inline-flex">Preview live</Button>
        </div>
      </div>
    </header>
  );
}
