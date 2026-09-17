import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Card>
          <h1 className="text-3xl font-semibold text-white">Privacy</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/60">
            <p>SaaSForge AI stores workspace data server-side, keeps secrets away from the frontend and records audit events for sensitive actions.</p>
            <p>Demo mode uses seeded data and local file persistence for sandbox exploration. Production deployments should use PostgreSQL, managed object storage and a transactional email provider.</p>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
