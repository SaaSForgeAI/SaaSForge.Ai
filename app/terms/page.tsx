import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Card>
          <h1 className="text-3xl font-semibold text-white">Terms</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/60">
            <p>Use SaaSForge AI responsibly and do not expose production secrets in prompts, files or frontend code.</p>
            <p>OAuth, payments, email delivery and third-party AI providers require separate credentials and service agreements before production launch.</p>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
