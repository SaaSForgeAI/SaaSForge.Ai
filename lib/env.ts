export const env = {
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  authSecret: process.env.AUTH_SECRET || 'development-secret-change-me',
  demoMode: process.env.DEMO_MODE !== 'false',
  storageProvider: process.env.STORAGE_PROVIDER === 'postgres' ? 'postgres' : 'demo'
} as const;
