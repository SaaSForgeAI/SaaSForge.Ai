import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { Card } from '@/components/ui/card';

export default function HelpPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <h1 className="text-4xl font-semibold text-white">Help center</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ['Getting started', 'Create an account, finish onboarding and generate your first SaaS from a prompt.'],
            ['Authentication', 'Use local auth in sandbox mode and configure OAuth providers for production.'],
            ['Billing', 'Choose a plan, track credits and connect Stripe to enable live payments.'],
            ['Deployments', 'Push preview, staging or production releases and connect custom domains.']
          ].map(([title, description]) => (
            <Card key={title}>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/55">{description}</p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
