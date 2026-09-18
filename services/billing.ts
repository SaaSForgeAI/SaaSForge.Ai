import { randomId } from '@/lib/crypto';
import {
  getCreditsLimitForPlan,
  getInternalPlanPrice,
  getStripeClient,
  getStripePriceId,
  normalizeStripeSubscriptionStatus
} from '@/lib/billing';
import { getPrismaClient, shouldUsePostgresStorage } from '@/lib/prisma';
import { readDb, updateDb } from '@/lib/store';
import type { BillingInterval, BillingPlan, Invoice, Subscription } from '@/types';

export async function getOrganizationStripeCustomerId(organizationId: string): Promise<string | null> {
  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { stripeCustomerId: true }
    });
    return organization?.stripeCustomerId ?? null;
  }

  const db = await readDb();
  return db.organizations.find((item) => item.id === organizationId)?.stripeCustomerId ?? null;
}

export async function findOrganizationIdByStripeCustomerId(customerId: string): Promise<string | null> {
  if (!customerId) return null;

  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    const organization = await prisma.organization.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true }
    });
    return organization?.id ?? null;
  }

  const db = await readDb();
  return db.organizations.find((item) => item.stripeCustomerId === customerId)?.id ?? null;
}

export async function syncStripeCustomerForOrganization(organizationId: string, customerId: string): Promise<void> {
  if (!organizationId || !customerId) return;

  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');

    await prisma.$transaction([
      prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: customerId }
      }),
      prisma.integration.updateMany({
        where: { organizationId, key: 'stripe' },
        data: {
          status: 'Connected',
          configured: true,
          connectedAt: new Date()
        }
      })
    ]);
    return;
  }

  await updateDb((db) => {
    const organization = db.organizations.find((item) => item.id === organizationId);
    if (organization) {
      organization.stripeCustomerId = customerId;
      organization.updatedAt = new Date().toISOString();
    }

    const integration = db.integrations.find((item) => item.organizationId === organizationId && item.key === 'stripe');
    if (integration) {
      integration.status = 'Connected';
      integration.configured = true;
      integration.connectedAt = new Date().toISOString();
    }
  });
}

export async function findOrCreateStripeCustomer(input: {
  organizationId: string;
  organizationName: string;
  email: string;
}): Promise<string> {
  const existingCustomerId = await getOrganizationStripeCustomerId(input.organizationId);
  if (existingCustomerId) return existingCustomerId;

  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email: input.email,
    name: input.organizationName,
    metadata: {
      organizationId: input.organizationId
    }
  });

  await syncStripeCustomerForOrganization(input.organizationId, customer.id);
  return customer.id;
}

export async function createStripeCheckoutUrl(input: {
  organizationId: string;
  organizationName: string;
  userId: string;
  email: string;
  plan: BillingPlan;
  interval: BillingInterval;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  if (input.plan === 'Free') {
    throw new Error('Free plan does not require Stripe Checkout.');
  }

  const priceId = getStripePriceId(input.plan, input.interval);
  if (!priceId) {
    throw new Error(`Stripe price is missing for ${input.plan} ${input.interval}.`);
  }

  const stripe = getStripeClient();
  const customerId = await findOrCreateStripeCustomer({
    organizationId: input.organizationId,
    organizationName: input.organizationName,
    email: input.email
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    client_reference_id: input.organizationId,
    allow_promotion_codes: true,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      organizationId: input.organizationId,
      userId: input.userId,
      plan: input.plan,
      interval: input.interval
    },
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    subscription_data: {
      metadata: {
        organizationId: input.organizationId,
        userId: input.userId,
        plan: input.plan,
        interval: input.interval
      }
    }
  });

  if (!session.url) {
    throw new Error('Stripe Checkout did not return a session URL.');
  }

  return session.url;
}

export async function createStripeCustomerPortalUrl(input: {
  organizationId: string;
  returnUrl: string;
}): Promise<string> {
  const customerId = await getOrganizationStripeCustomerId(input.organizationId);
  if (!customerId) {
    throw new Error('No Stripe customer is connected for this workspace yet.');
  }

  const stripe = getStripeClient();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: input.returnUrl
  });

  return portalSession.url;
}

export async function syncStripeSubscriptionRecord(input: {
  organizationId: string;
  customerId?: string | null;
  subscriptionId?: string | null;
  priceId?: string | null;
  plan: BillingPlan;
  interval: BillingInterval;
  status: Subscription['status'];
  seats: number;
  price: number;
  renewalDate: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}): Promise<void> {
  const data = {
    plan: input.plan,
    interval: input.interval,
    status: input.status,
    seats: input.seats,
    price: input.price,
    creditsLimit: getCreditsLimitForPlan(input.plan),
    renewalDate: input.renewalDate,
    provider: input.customerId ? 'stripe' : 'internal',
    stripeCustomerId: input.customerId ?? undefined,
    stripeSubscriptionId: input.subscriptionId ?? undefined,
    stripePriceId: input.priceId ?? undefined,
    cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
    currentPeriodStart: input.currentPeriodStart,
    currentPeriodEnd: input.currentPeriodEnd
  } satisfies Omit<Subscription, 'id' | 'organizationId'>;

  if (input.customerId) {
    await syncStripeCustomerForOrganization(input.organizationId, input.customerId);
  }

  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');
    const existing = await prisma.subscription.findFirst({ where: { organizationId: input.organizationId } });

    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          plan: data.plan,
          interval: data.interval,
          status: data.status,
          seats: data.seats,
          price: data.price,
          creditsLimit: data.creditsLimit,
          renewalDate: new Date(data.renewalDate),
          provider: data.provider,
          stripeCustomerId: data.stripeCustomerId ?? null,
          stripeSubscriptionId: data.stripeSubscriptionId ?? null,
          stripePriceId: data.stripePriceId ?? null,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          currentPeriodStart: data.currentPeriodStart ? new Date(data.currentPeriodStart) : null,
          currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null
        }
      });
      return;
    }

    await prisma.subscription.create({
      data: {
        id: randomId('sub'),
        organizationId: input.organizationId,
        plan: data.plan,
        interval: data.interval,
        status: data.status,
        seats: data.seats,
        price: data.price,
        creditsLimit: data.creditsLimit,
        renewalDate: new Date(data.renewalDate),
        provider: data.provider,
        stripeCustomerId: data.stripeCustomerId ?? null,
        stripeSubscriptionId: data.stripeSubscriptionId ?? null,
        stripePriceId: data.stripePriceId ?? null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        currentPeriodStart: data.currentPeriodStart ? new Date(data.currentPeriodStart) : null,
        currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null
      }
    });
    return;
  }

  await updateDb((db) => {
    const existing = db.subscriptions.find((item) => item.organizationId === input.organizationId);
    if (existing) {
      Object.assign(existing, data);
      return;
    }

    db.subscriptions.push({
      id: randomId('sub'),
      organizationId: input.organizationId,
      ...data
    });
  });
}

export async function syncStripeInvoiceRecord(input: {
  organizationId: string;
  stripeInvoiceId?: string | null;
  number: string;
  status: Invoice['status'];
  amount: number;
  currency: string;
  issuedAt: string;
  hostedInvoiceUrl?: string | null;
  invoicePdfUrl?: string | null;
}): Promise<void> {
  const payload = {
    number: input.number,
    status: input.status,
    amount: input.amount,
    currency: input.currency.toUpperCase(),
    issuedAt: input.issuedAt,
    stripeInvoiceId: input.stripeInvoiceId ?? undefined,
    hostedInvoiceUrl: input.hostedInvoiceUrl ?? undefined,
    invoicePdfUrl: input.invoicePdfUrl ?? undefined
  } satisfies Omit<Invoice, 'id' | 'organizationId'>;

  if (shouldUsePostgresStorage()) {
    const prisma = getPrismaClient();
    if (!prisma) throw new Error('PostgreSQL storage is enabled but Prisma client is unavailable.');

    const existing = input.stripeInvoiceId
      ? await prisma.invoice.findFirst({ where: { stripeInvoiceId: input.stripeInvoiceId } })
      : null;

    if (existing) {
      await prisma.invoice.update({
        where: { id: existing.id },
        data: {
          number: payload.number,
          status: payload.status,
          amount: payload.amount,
          currency: payload.currency,
          issuedAt: new Date(payload.issuedAt),
          hostedInvoiceUrl: payload.hostedInvoiceUrl ?? null,
          invoicePdfUrl: payload.invoicePdfUrl ?? null
        }
      });
      return;
    }

    await prisma.invoice.create({
      data: {
        id: randomId('inv'),
        organizationId: input.organizationId,
        number: payload.number,
        status: payload.status,
        amount: payload.amount,
        currency: payload.currency,
        issuedAt: new Date(payload.issuedAt),
        stripeInvoiceId: payload.stripeInvoiceId ?? null,
        hostedInvoiceUrl: payload.hostedInvoiceUrl ?? null,
        invoicePdfUrl: payload.invoicePdfUrl ?? null
      }
    });
    return;
  }

  await updateDb((db) => {
    const existing = input.stripeInvoiceId
      ? db.invoices.find((item) => item.stripeInvoiceId === input.stripeInvoiceId)
      : undefined;

    if (existing) {
      Object.assign(existing, payload);
      return;
    }

    db.invoices.unshift({
      id: randomId('inv'),
      organizationId: input.organizationId,
      ...payload
    });
  });
}

export async function downgradeSubscriptionToFree(input: {
  organizationId: string;
  customerId?: string | null;
}): Promise<void> {
  await syncStripeSubscriptionRecord({
    organizationId: input.organizationId,
    customerId: input.customerId ?? null,
    subscriptionId: null,
    priceId: null,
    plan: 'Free',
    interval: 'monthly',
    status: 'canceled',
    seats: 1,
    price: getInternalPlanPrice('Free', 'monthly'),
    renewalDate: new Date().toISOString(),
    cancelAtPeriodEnd: false,
    currentPeriodStart: undefined,
    currentPeriodEnd: undefined
  });
}

export async function syncStripeEventSubscription(input: {
  organizationId: string;
  customerId: string;
  subscriptionId: string;
  priceId: string | null;
  interval: BillingInterval;
  plan: BillingPlan;
  status: Subscription['status'];
  seats: number;
  unitAmountCents: number;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}): Promise<void> {
  await syncStripeSubscriptionRecord({
    organizationId: input.organizationId,
    customerId: input.customerId,
    subscriptionId: input.subscriptionId,
    priceId: input.priceId,
    plan: input.plan,
    interval: input.interval,
    status: input.status,
    seats: input.seats,
    price: Math.round(input.unitAmountCents / 100),
    renewalDate: new Date(input.currentPeriodEnd * 1000).toISOString(),
    cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    currentPeriodStart: new Date(input.currentPeriodStart * 1000).toISOString(),
    currentPeriodEnd: new Date(input.currentPeriodEnd * 1000).toISOString()
  });
}

export { normalizeStripeSubscriptionStatus };
