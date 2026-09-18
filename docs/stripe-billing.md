# Stripe billing setup

SaaSForge AI now supports hosted Stripe subscriptions with:

- Stripe Checkout for paid plans
- Stripe Customer Portal for self-serve billing management
- Stripe webhooks for subscription + invoice sync

## Required environment variables

Add these variables in local `.env` and in Vercel for production:

```env
APP_URL=https://your-app-domain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxx
STRIPE_PRICE_BUSINESS_YEARLY=price_xxx
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxx
```

## Stripe products and prices

Create recurring Stripe prices for:

- Pro monthly
- Pro yearly
- Business monthly
- Business yearly
- Enterprise monthly
- Enterprise yearly

Copy each Stripe `price_...` identifier into the matching environment variable.

## Webhook endpoint

Configure this webhook URL in Stripe:

```text
https://your-app-domain.com/api/stripe/webhook
```

Recommended events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

After creating the webhook, copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Local testing

You can test locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Then copy the generated webhook secret into your local `.env`.

## Data syncing behavior

When Stripe is configured:

- the billing page sends paid-plan upgrades to Stripe Checkout
- the customer portal opens from the billing page after a customer is linked
- webhook events sync the local subscription record and invoices
- workspaces keep their internal demo billing fallback when Stripe is not configured

## PostgreSQL deployments

If you use `STORAGE_PROVIDER=postgres`, apply the latest Prisma schema before deploying:

```bash
npm run db:generate
npm run db:push
```

This adds Stripe-related fields for customer IDs, subscription IDs and invoice links.
