import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const entries = [
  {
    version: 'v0.9.0',
    date: 'September 2026',
    notes: ['Launched AI Builder timeline and live sandbox preview.', 'Added domains, deployments and environment controls.', 'Introduced audit logs and premium notification center.']
  },
  {
    version: 'v0.8.0',
    date: 'August 2026',
    notes: ['Released billing workspace with plans, invoices and usage limits.', 'Added API key management and integrations hub.', 'Expanded analytics with MRR, retention and activation dashboards.']
  },
  {
    version: 'v0.7.0',
    date: 'July 2026',
    notes: ['Improved onboarding, auth flows and project generation.', 'Released template marketplace and category SEO pages.', 'Added version checkpoints and AI modification history.']
  }
];

export default function ChangelogPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <Badge tone="info">Product updates</Badge>
        <h1 className="mt-6 text-4xl font-semibold text-white">Changelog</h1>
        <div className="mt-10 space-y-5">
          {entries.map((entry) => (
            <Card key={entry.version}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-white">{entry.version}</h2>
                <p className="text-sm text-white/45">{entry.date}</p>
              </div>
              <div className="mt-5 space-y-3 text-sm leading-7 text-white/60">
                {entry.notes.map((note) => (
                  <p key={note}>• {note}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
