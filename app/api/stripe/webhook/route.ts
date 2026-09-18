import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  getPlanFromStripePriceId,
  getStripeClient,
  normalizeStripeSubscriptionStatus
} from '@/lib/billing';
import { env } from '@/lib/env';
import {
  downgradeSubscriptionToFree,
  findOrganizationIdByStripeCustomerId,
  syncStripeCustomerForOrganization,
  syncStripeEventSubscription,
  syncStripeInvoiceRecord
} from '@/services/billing';

export const runtime = 'nodejs';

function getCustomerId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

async function syncSubscriptionObject(subscription: Stripe.Subscription): Promise<void> {
  const customerId = getCustomerId(subscription.customer);
  if (!customerId) return;

  const firstItem = subscription.items.data[0];
  const price = firstItem?.price;
  const priceId = typeof price === 'string' ? price : price?.id ?? null;
  const mapping = getPlanFromStripePriceId(priceId);
  if (!mapping) return;

  const organizationId = subscription.metadata.organizationId || await findOrganizationIdByStripeCustomerId(customerId);
  if (!organizationId) return;

  await syncStripeCustomerForOrganization(organizationId, customerId);
  await syncStripeEventSubscription({
    organizationId,
    customerId,
    subscriptionId: subscription.id,
    priceId,
    interval: mapping.interval,
    plan: mapping.plan,
    status: normalizeStripeSubscriptionStatus(subscription.status, subscription.cancel_at_period_end),
    seats: subscription.items.data.reduce((sum, item) => sum + (item.quantity || 1), 0),
    unitAmountCents: typeof price === 'string' ? 0 : price?.unit_amount ?? 0,
    currentPeriodStart: firstItem?.current_period_start ?? subscription.start_date,
    currentPeriodEnd: firstItem?.current_period_end ?? subscription.start_date,
    cancelAtPeriodEnd: subscription.cancel_at_period_end
  });
}

async function syncInvoiceObject(invoice: Stripe.Invoice): Promise<void> {
  const customerId = getCustomerId(invoice.customer);
  if (!customerId) return;

  const organizationId = await findOrganizationIdByStripeCustomerId(customerId);
  if (!organizationId) return;

  await syncStripeInvoiceRecord({
    organizationId,
    stripeInvoiceId: invoice.id,
    number: String(invoice.number ?? invoice.id),
    status:
      invoice.status === 'paid'
        ? 'paid'
        : invoice.status === 'void'
          ? 'void'
          : invoice.status === 'draft'
            ? 'draft'
            : invoice.status === 'uncollectible'
              ? 'uncollectible'
              : 'open',
    amount: Math.round((invoice.amount_paid || invoice.amount_due || invoice.total || 0) / 100),
    currency: invoice.currency || 'usd',
    issuedAt: new Date(invoice.created * 1000).toISOString(),
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    invoicePdfUrl: invoice.invoice_pdf
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!env.stripeWebhookSecret || !env.stripeSecretKey) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  }

  const stripe = getStripeClient();
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid Stripe webhook signature.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;
        const customerId = getCustomerId(session.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null);

        if (organizationId && customerId) {
          await syncStripeCustomerForOrganization(organizationId, customerId);
        }

        if (typeof session.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await syncSubscriptionObject(subscription);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        await syncSubscriptionObject(event.data.object as Stripe.Subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = getCustomerId(subscription.customer);
        if (!customerId) break;
        const organizationId = subscription.metadata.organizationId || await findOrganizationIdByStripeCustomerId(customerId);
        if (!organizationId) break;
        await downgradeSubscriptionToFree({ organizationId, customerId });
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await syncInvoiceObject(invoice);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe webhook handling failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
