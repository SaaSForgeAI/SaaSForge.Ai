import { AppFrame } from '@/components/layout/app-frame';
import { getWorkspaceData } from '@/lib/workspace';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { session, db } = await getWorkspaceData();
  const projects = db.projects.filter((item) => item.organizationId === session.organization.id);
  const notifications = db.notifications.filter((item) => item.userId === session.user.id).slice(0, 8);
  const templates = db.templates;

  return <AppFrame user={session.user} notifications={notifications} projects={projects} templates={templates}>{children}</AppFrame>;
}
