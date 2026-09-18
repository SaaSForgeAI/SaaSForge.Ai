import Stripe from 'stripe';
import { env } from '@/lib/env';
import type { BillingInterval, BillingPlan, Subscription } from '@/types';

type PaidPlan = Exclude<BillingPlan, 'Free'>;

const planCredits: Record<BillingPlan, number> = {
  Free: 10000,
  Pro: 100000,
  Business: 500000,
  Enterprise: 2000000
};

const internalPlanPricing: Record<BillingPlan, Record<BillingInterval, number>> = {
  Free: { monthly: 0, yearly: 0 },
  Pro: { monthly: 39, yearly: 372 },
  Business: { monthly: 129, yearly: 1236 },
  Enterprise: { monthly: 399, yearly: 3828 }
};

export function getCreditsLimitForPlan(plan: BillingPlan): number {
  return planCredits[plan];
}

export function getInternalPlanPrice(plan: BillingPlan, interval: BillingInterval): number {
  return internalPlanPricing[plan][interval];
}

export function getStripePriceId(plan: BillingPlan, interval: BillingInterval): string | null {
  if (plan === 'Free') return null;
  return env.stripePrices[plan][interval] || null;
}

export function getPlanFromStripePriceId(priceId: string | null | undefined): { plan: PaidPlan; interval: BillingInterval } | null {
  if (!priceId) return null;

  const entries = Object.entries(env.stripePrices) as Array<[PaidPlan, { monthly: string; yearly: string }]>;
  for (const [plan, prices] of entries) {
    if (prices.monthly === priceId) return { plan, interval: 'monthly' };
    if (prices.yearly === priceId) return { plan, interval: 'yearly' };
  }

  return null;
}

export function getStripeConfigStatus(): {
  enabled: boolean;
  missing: string[];
  hasPortal: boolean;
} {
  const missing: string[] = [];

  if (!env.appUrl) missing.push('APP_URL');
  if (!env.stripeSecretKey) missing.push('STRIPE_SECRET_KEY');
  if (!env.stripeWebhookSecret) missing.push('STRIPE_WEBHOOK_SECRET');
  if (!env.stripePrices.Pro.monthly) missing.push('STRIPE_PRICE_PRO_MONTHLY');
  if (!env.stripePrices.Pro.yearly) missing.push('STRIPE_PRICE_PRO_YEARLY');
  if (!env.stripePrices.Business.monthly) missing.push('STRIPE_PRICE_BUSINESS_MONTHLY');
  if (!env.stripePrices.Business.yearly) missing.push('STRIPE_PRICE_BUSINESS_YEARLY');
  if (!env.stripePrices.Enterprise.monthly) missing.push('STRIPE_PRICE_ENTERPRISE_MONTHLY');
  if (!env.stripePrices.Enterprise.yearly) missing.push('STRIPE_PRICE_ENTERPRISE_YEARLY');

  return {
    enabled: missing.length === 0,
    hasPortal: Boolean(env.stripeSecretKey),
    missing
  };
}

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!env.stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is missing.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey, {
      typescript: true
    });
  }

  return stripeClient;
}

export function normalizeStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
  cancelAtPeriodEnd = false
): Subscription['status'] {
  if (status === 'trialing') return 'trialing';
  if (status === 'past_due' || status === 'unpaid' || status === 'incomplete') return 'past_due';
  if (status === 'canceled' || status === 'incomplete_expired' || cancelAtPeriodEnd) return 'canceled';
  return 'active';
}

export function buildAbsoluteUrl(path: string): string {
  return new URL(path, env.appUrl).toString();
}
