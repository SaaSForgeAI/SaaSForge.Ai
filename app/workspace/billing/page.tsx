import Link from 'next/link';
import { FormMessage } from '@/components/form-message';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { getWorkspaceData } from '@/lib/workspace';
import { getStripeConfigStatus } from '@/lib/billing';
import { manageBillingPortalAction, startCheckoutAction, subscriptionAction } from '@/services/workspace-actions';
import { PLAN_OPTIONS } from '@/utils/constants';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';

export default async function BillingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, db } = await getWorkspaceData();
  const params = await searchParams;
  const stripe = getStripeConfigStatus();
  const subscription = db.subscriptions.find((item) => item.organizationId === session.organization.id);
  const usage = db.aiUsage.filter((item) => item.organizationId === session.organization.id).reduce((sum, item) => sum + item.credits, 0);
  const invoices = db.invoices.filter((item) => item.organizationId === session.organization.id);
  const stripeIntegration = db.integrations.find((item) => item.organizationId === session.organization.id && item.key === 'stripe');
  const canManagePortal = Boolean(stripe.hasPortal && (session.organization.stripeCustomerId || subscription?.stripeCustomerId));
  const success = typeof params.success === 'string' ? params.success : undefined;
  const error = typeof params.error === 'string' ? params.error : undefined;
  const currentPlanValueLabel = subscription?.interval === 'yearly' ? '/ year' : '/ month';

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Billing"
        title="Plans, invoices and subscription controls"
        description="Connect Stripe Checkout and the customer portal to run real subscriptions, or keep the internal billing mode for local/demo usage."
      />
      <FormMessage success={success} error={error} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-white/45">Current subscription</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{subscription?.plan ?? 'Free'} · {subscription?.interval ?? 'monthly'}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={subscription?.status === 'past_due' ? 'warning' : subscription?.status === 'canceled' ? 'default' : 'success'}>{subscription?.status ?? 'inactive'}</Badge>
              <Badge tone={subscription?.provider === 'stripe' ? 'info' : 'default'}>{subscription?.provider === 'stripe' ? 'Stripe' : 'Internal'}</Badge>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Renewal</p><p className="mt-2 text-sm text-white">{subscription ? formatDate(subscription.renewalDate) : '—'}</p></div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">AI credits</p><p className="mt-2 text-sm text-white">{formatNumber(usage)} / {formatNumber(subscription?.creditsLimit || 0)}</p></div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Seats</p><p className="mt-2 text-sm text-white">{subscription?.seats ?? 1}</p></div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"><p className="text-xs text-white/40">Plan value</p><p className="mt-2 text-sm text-white">{formatCurrency(subscription?.price || 0)} {currentPlanValueLabel}</p></div>
          </div>

          <form action={stripe.enabled ? startCheckoutAction : subscriptionAction} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select name="plan" defaultValue={subscription?.plan ?? 'Free'}>{PLAN_OPTIONS.map((plan) => <option key={plan.name}>{plan.name}</option>)}</Select>
              <Select name="interval" defaultValue={subscription?.interval ?? 'monthly'}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></Select>
            </div>
            <Button type="submit" fullWidth>{stripe.enabled ? 'Continue to Stripe Checkout' : 'Update subscription'}</Button>
          </form>

          {canManagePortal ? (
            <form action={manageBillingPortalAction} className="mt-3">
              <Button type="submit" variant="secondary" fullWidth>Open Stripe customer portal</Button>
            </form>
          ) : null}

          <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/55">
            {stripe.enabled ? (
              <>
                Stripe is fully configured for this environment. Paid plans redirect to hosted Stripe Checkout, and existing customers can manage payment methods, invoices and cancellations through the customer portal.
              </>
            ) : (
              <>
                Stripe is not fully configured yet. The page still works in internal demo mode, but real payments need your Stripe secret, webhook secret and all recurring price IDs.
              </>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/45">Stripe connection</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Checkout, portal and webhook readiness</h3>
              </div>
              <Badge tone={stripe.enabled ? 'success' : 'warning'}>{stripe.enabled ? 'Ready' : 'Setup required'}</Badge>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Workspace connection</p>
                <p className="mt-2 text-sm text-white/75">{stripeIntegration?.status ?? 'Available'} {session.organization.stripeCustomerId ? `· customer ${session.organization.stripeCustomerId}` : '· no customer linked yet'}</p>
              </div>
              {!stripe.enabled ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                  <p className="text-sm font-medium text-amber-100">Missing environment variables</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-amber-100/85">
                    {stripe.missing.map((item) => (
                      <span key={item} className="rounded-full border border-amber-200/15 bg-black/20 px-3 py-1.5">{item}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/55">
                Webhook endpoint to configure in Stripe:
                <div className="mt-2 break-all rounded-2xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-white/70">
                  /api/stripe/webhook
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-sm text-white/45">Plan comparison</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {PLAN_OPTIONS.map((plan) => {
                const yearlyMonthlyEquivalent = plan.price.yearly / 12;
                const yearlySavings = Math.max(0, plan.price.monthly * 12 - plan.price.yearly);
                const isCurrentPlan = subscription?.plan === plan.name;

                return (
                  <div key={plan.name} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{plan.name}</p>
                        <p className="mt-2 text-sm text-white/50">{formatNumber(plan.credits)} credits</p>
                      </div>
                      {isCurrentPlan ? <Badge tone="info">Current</Badge> : null}
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">Monthly</p>
                        <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(plan.price.monthly)}<span className="text-sm text-white/40"> / mo</span></p>
                      </div>
                      <div className="rounded-2xl border border-violet-400/15 bg-violet-500/5 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">Yearly</p>
                        <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(plan.price.yearly)}<span className="text-sm text-white/40"> / yr</span></p>
                        <p className="mt-1 text-xs text-white/45">{formatCurrency(yearlyMonthlyEquivalent)} / mo billed annually</p>
                      </div>
                    </div>
                    {yearlySavings > 0 ? <p className="mt-3 text-xs uppercase tracking-[0.18em] text-emerald-200/90">Save {formatCurrency(yearlySavings)} per year</p> : null}
                    <div className="mt-4 space-y-2 text-sm text-white/55">
                      {plan.features.map((feature) => <p key={feature}>• {feature}</p>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/45">Invoices</p>
              <Badge tone="info">Customer portal ready</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{invoice.number}</p>
                    <p className="text-sm text-white/45">{formatDate(invoice.issuedAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-white">{formatCurrency(invoice.amount)}</p>
                    <Badge tone={invoice.status === 'paid' ? 'success' : invoice.status === 'open' ? 'warning' : 'default'}>{invoice.status}</Badge>
                    {invoice.hostedInvoiceUrl ? (
                      <Link href={invoice.hostedInvoiceUrl} target="_blank" className="text-sm text-sky-200 transition hover:text-white">
                        View
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
              {invoices.length === 0 ? <p className="text-sm text-white/45">No invoices yet. They will sync here after Stripe webhook events arrive.</p> : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
