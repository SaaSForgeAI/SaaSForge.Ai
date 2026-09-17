import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getWorkspaceData } from '@/lib/workspace';
import { formatDate } from '@/utils/format';

export default async function NotificationsPage() {
  const { session, db } = await getWorkspaceData();
  const notifications = db.notifications.filter((item) => item.userId === session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Notifications"
        title="A premium notification center"
        description="Track deployments, billing, security and product changes. Every state explains what happened and what you can do next."
      />
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">{notification.title}</h2>
                  <Badge tone={notification.type === 'build' ? 'success' : notification.type === 'billing' ? 'warning' : notification.type === 'security' ? 'danger' : 'info'}>{notification.type}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/55">{notification.body}</p>
              </div>
              <div className="text-sm text-white/40">{formatDate(notification.createdAt)}</div>
            </div>
            {notification.cta ? <p className="mt-4 text-sm text-white/45">Suggested action: {notification.cta}</p> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
