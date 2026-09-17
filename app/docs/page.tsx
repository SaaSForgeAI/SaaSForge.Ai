import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { Card } from '@/components/ui/card';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export default async function DocsPage() {
  const docsPath = path.join(process.cwd(), 'docs', 'api.md');
  const integrationsPath = path.join(process.cwd(), 'docs', 'integrations.md');
  const [apiDocs, integrationsDocs] = await Promise.all([
    readFile(docsPath, 'utf8'),
    readFile(integrationsPath, 'utf8')
  ]);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <h1 className="text-3xl font-semibold text-white">Documentation</h1>
            <pre className="mt-6 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-white/60">{apiDocs}</pre>
          </Card>
          <Card>
            <h2 className="text-3xl font-semibold text-white">Integrations</h2>
            <pre className="mt-6 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-white/60">{integrationsDocs}</pre>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
