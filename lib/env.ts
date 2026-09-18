export const env = {
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  authSecret: process.env.AUTH_SECRET || 'development-secret-change-me',
  demoMode: process.env.DEMO_MODE !== 'false',
  enableDemoSeed: process.env.ENABLE_DEMO_SEED !== 'false',
  storageProvider: process.env.STORAGE_PROVIDER === 'postgres' ? 'postgres' : 'demo',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  stripePrices: {
    Pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY || ''
    },
    Business: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '',
      yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || ''
    },
    Enterprise: {
      monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
      yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || ''
    }
  }
} as const;
