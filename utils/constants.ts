export const PLAN_OPTIONS = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    credits: 10000,
    features: ['2 projects', 'Sandbox preview', 'AI builder', 'Subdomain hosting']
  },
  {
    name: 'Pro',
    price: { monthly: 39, yearly: 372 },
    credits: 100000,
    features: ['Unlimited projects', 'Custom domains', 'Analytics', 'GitHub sync', 'Collaboration']
  },
  {
    name: 'Business',
    price: { monthly: 129, yearly: 1236 },
    credits: 500000,
    features: ['Advanced permissions', 'Priority builds', 'Usage controls', 'Team workflows']
  },
  {
    name: 'Enterprise',
    price: { monthly: 399, yearly: 3828 },
    credits: 2000000,
    features: ['SSO', 'Audit logs', 'Dedicated support', 'Private deployment options']
  }
] as const;

export const DEFAULT_BUILD_STEPS = [
  'Understanding idea',
  'Planning architecture',
  'Designing database',
  'Generating backend',
  'Generating frontend',
  'Connecting services',
  'Testing',
  'Deploying'
] as const;

export const TEMPLATE_CATEGORIES = [
  'CRM',
  'SaaS B2B',
  'AI SaaS',
  'Finance',
  'Marketing',
  'HR',
  'Project management',
  'E-commerce',
  'Education',
  'Analytics',
  'Real estate',
  'Healthcare',
  'Productivity'
] as const;
