'use client';

import { usePathname } from 'next/navigation';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import type { Notification, Project, Template, User } from '@/types';

export function AppFrame({
  children,
  user,
  notifications,
  projects,
  templates
}: {
  children: React.ReactNode;
  user: User;
  notifications: Notification[];
  projects: Project[];
  templates: Template[];
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar currentPath={pathname} />
      <div className="min-w-0 flex-1 pb-32 lg:pb-0">
        <Topbar user={user} notifications={notifications} projects={projects} templates={templates} />
        <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">{children}</main>
      </div>
      <MobileNav currentPath={pathname} />
    </div>
  );
}
