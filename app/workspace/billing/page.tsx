import { FormMessage } from '@/components/form-message';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { getWorkspaceData } from '@/lib/workspace';
import { subscriptionAction } from '@/services/workspace-actions';
import { PLAN_OPTIONS } from '@/utils/constants';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';

export default async function BillingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const subscription = db.subscriptions.find((item) => item.organizationId === session.organization.id);
  const usage = db.aiUsage.filter((item) => item.organizationId === session.organization.id).reduce((sum, item) => sum + item.credits, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Billing"
        title="Plans, invoices and AI credit controls"
        description="Choose a plan, monitor usage, keep billing transparent and prepare Stripe checkout and customer portal configuration for production."
      />
      <FormMessage success={typeof params.success === 'string' ? params.success : undefined} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/45">Current subscription</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{subscription?.plan} · {subscription?.interval}</h3>
            </div>
            <Badge tone="success">{subscription?.status}</Badge>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Renewal</p><p className="mt-2 text-sm text-white">{subscription ? formatDate(subscription.renewalDate) : '—'}</p></div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">AI credits</p><p className="mt-2 text-sm text-white">{formatNumber(usage)} / {formatNumber(subscription?.creditsLimit || 0)}</p></div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Seats</p><p className="mt-2 text-sm text-white">{subscription?.seats}</p></div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Plan value</p><p className="mt-2 text-sm text-white">{formatCurrency(subscription?.price || 0)}</p></div>
          </div>
          <form action={subscriptionAction} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select name="plan" defaultValue={subscription?.plan}>{PLAN_OPTIONS.map((plan) => <option key={plan.name}>{plan.name}</option>)}</Select>
              <Select name="interval" defaultValue={subscription?.interval}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></Select>
            </div>
            <Button type="submit" fullWidth>Update subscription</Button>
          </form>
          <p className="mt-4 text-sm leading-6 text-white/50">Stripe checkout and customer portal become production-ready once STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are configured.</p>
        </Card>
        <div className="space-y-5">
          <Card>
            <p className="text-sm text-white/45">Plan comparison</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {PLAN_OPTIONS.map((plan) => (
                <div key={plan.name} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-medium text-white">{plan.name}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">${plan.price.monthly}<span className="text-sm text-white/40"> / mo</span></p>
                  <p className="mt-2 text-sm text-white/50">{formatNumber(plan.credits)} credits</p>
                  <div className="mt-4 space-y-2 text-sm text-white/55">
                    {plan.features.map((feature) => <p key={feature}>• {feature}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/45">Invoices</p>
              <Badge tone="info">Customer portal ready</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {db.invoices.filter((item) => item.organizationId === session.organization.id).map((invoice) => (
                <div key={invoice.id} className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{invoice.number}</p>
                    <p className="text-sm text-white/45">{formatDate(invoice.issuedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-white">{formatCurrency(invoice.amount)}</p>
                    <Badge tone={invoice.status === 'paid' ? 'success' : 'warning'}>{invoice.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
