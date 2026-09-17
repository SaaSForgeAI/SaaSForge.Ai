import Link from 'next/link';
import { ArrowRight, Blocks, Bot, Check, Database, Play, Rocket, Shield, Sparkles, Workflow } from 'lucide-react';
import { HeroSimulator } from '@/components/marketing/hero-simulator';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { TemplateCard } from '@/components/template-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { readDb } from '@/lib/store';

export default async function HomePage() {
  const db = await readDb();
  const templates = db.templates.slice(0, 4);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-grid-fade opacity-80" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge tone="info">Premium AI SaaS generator</Badge>
            <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Build your SaaS with AI.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-white/60 sm:text-xl">
              Describe your idea. SaaSForge AI designs, builds and deploys the product for you.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button className="px-6 py-3 text-base">Start building — Free</Button>
              </Link>
              <Link href="#examples">
                <Button variant="secondary" className="px-6 py-3 text-base">
                  Explore examples
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/45">
              {['No-code + code generation', 'Auth + billing included', 'Live preview sandbox', 'Deploy to production'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-16">
            <HeroSimulator />
          </div>
        </section>

        <section id="product" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Product workflow"
            title="From prompt to production-ready SaaS"
            description="SaaSForge AI combines the fluidity of an AI app builder, the structure of a premium cloud IDE and the reliability of a modern SaaS control plane."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Bot, title: 'Product Agent', description: 'Turns ideas into specs, information architecture and implementation plans.' },
              { icon: Database, title: 'Database Agent', description: 'Designs schema, relationships, indexes, migrations and realistic seed data.' },
              { icon: Blocks, title: 'UI Agent', description: 'Builds premium pages, layouts, forms, dashboards and responsive interactions.' },
              { icon: Rocket, title: 'Deploy Agent', description: 'Tests, versions, previews and ships your project to staging or production.' }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="transition hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/30 to-accent2/20 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
            <Card className="space-y-6">
              <SectionHeading
                eyebrow="AI Builder"
                title="Natural language editing with project memory"
                description="Ask for a customer management page, a premium dashboard refresh or Stripe subscriptions. SaaSForge AI updates the right files, schema and UI without losing context."
              />
              <div className="space-y-3">
                {[
                  'Add a customer management page.',
                  'Make the dashboard more premium.',
                  'Add Stripe subscriptions.',
                  'Create an admin panel.',
                  'Add dark mode.',
                  'Add team permissions.'
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Authentication', items: ['Register', 'Login', 'Forgot password', 'Email verification', 'Google OAuth ready', 'GitHub OAuth ready'] },
                  { title: 'Billing', items: ['Pricing page', 'Checkout abstraction', 'Invoices', 'Customer portal', 'Usage caps', 'AI credits guardrails'] },
                  { title: 'Collaboration', items: ['Roles', 'Comments', 'Presence', 'Activity log', 'Sharing', 'Versioning'] },
                  { title: 'Platform', items: ['Templates', 'Analytics', 'Domains', 'Deployments', 'API keys', 'Integrations'] }
                ].map((block) => (
                  <div key={block.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="text-lg font-semibold text-white">{block.title}</h3>
                    <div className="mt-4 space-y-3 text-sm text-white/55">
                      {block.items.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-emerald-300" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="examples" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Template library"
              title="Start faster with polished vertical templates"
              description="CRM, AI SaaS, finance, marketing, analytics, real estate and more — each template includes realistic flows, clean information architecture and deploy-ready building blocks."
            />
            <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
              Browse all templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="space-y-6">
              <Badge tone="info">Build timeline</Badge>
              <h2 className="text-3xl font-semibold text-white">A visual build mode with transparent progress</h2>
              <div className="space-y-3">
                {[
                  '01 — Understanding idea',
                  '02 — Planning architecture',
                  '03 — Designing database',
                  '04 — Generating backend',
                  '05 — Generating frontend',
                  '06 — Connecting services',
                  '07 — Testing',
                  '08 — Deploying'
                ].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
                    <span className="text-white/72">{item}</span>
                    <Badge tone={index < 6 ? 'success' : index === 6 ? 'info' : 'default'}>{index < 6 ? 'completed' : index === 6 ? 'running' : 'pending'}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="space-y-6">
              <Badge tone="info">Enterprise-minded foundations</Badge>
              <div className="grid gap-4">
                {[
                  { icon: Shield, title: 'Secure by design', description: 'Server-side secrets, audit logs, route protection, input validation and role-based isolation.' },
                  { icon: Workflow, title: 'Version checkpoints', description: 'Create, compare, restore and duplicate versions with AI modification history.' },
                  { icon: Play, title: 'Immediate demo mode', description: 'Sign in with a seeded workspace and explore a realistic AI CRM instantly.' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/55">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-8">
          <Card className="overflow-hidden p-0">
            <div className="grid gap-8 bg-gradient-to-br from-violet-500/15 via-white/[0.03] to-sky-500/10 px-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge tone="success">Ready to launch</Badge>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Generate your next SaaS in minutes, not months.</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
                  Start with the free plan, explore the demo workspace instantly, then connect production services when you are ready to ship.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/auth/register">
                  <Button className="w-full px-6 py-3">Start building</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="secondary" className="w-full px-6 py-3">Open demo workspace</Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
