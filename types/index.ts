export type Role = 'Owner' | 'Admin' | 'Member';
export type BuildStatus = 'pending' | 'running' | 'completed' | 'error';
export type ProjectStage = 'draft' | 'building' | 'live';
export type BillingPlan = 'Free' | 'Pro' | 'Business' | 'Enterprise';
export type BillingInterval = 'monthly' | 'yearly';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar: string;
  title: string;
  verified: boolean;
  verificationToken?: string;
  resetToken?: string;
  primaryOrganizationId: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  organizationId: string;
  userId: string;
  role: Role;
  presence: 'online' | 'away' | 'offline';
  createdAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  prompt: string;
  maturity: 'MVP' | 'Production ready' | 'Enterprise';
  style: 'Minimal' | 'Modern' | 'Corporate' | 'Creative' | 'Dark' | 'Custom';
  stage: ProjectStage;
  status: 'healthy' | 'warning' | 'critical';
  themeAccent: string;
  visitors: number;
  users: number;
  revenueMrr: number;
  deploymentEnvironment: 'preview' | 'staging' | 'production';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  name: string;
  summary: string;
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  path: string;
  kind: 'page' | 'component' | 'api' | 'schema' | 'config';
  updatedAt: string;
}

export interface ProjectPage {
  id: string;
  projectId: string;
  name: string;
  path: string;
  type: 'marketing' | 'auth' | 'app' | 'settings' | 'admin';
  status: 'ready' | 'draft';
  description: string;
}

export interface AIConversation {
  id: string;
  projectId: string;
  title: string;
  agent: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface AIUsage {
  id: string;
  organizationId: string;
  projectId: string;
  action: string;
  model: string;
  credits: number;
  createdAt: string;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  stack: string[];
  rating: number;
  uses: number;
  previewGradient: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  environment: 'preview' | 'staging' | 'production';
  status: 'queued' | 'building' | 'ready' | 'failed';
  url: string;
  createdAt: string;
  durationSeconds: number;
  logs: string[];
}

export interface Domain {
  id: string;
  projectId: string;
  host: string;
  status: 'Pending verification' | 'SSL Active' | 'DNS issue';
  sslActive: boolean;
  instructions: string;
  createdAt: string;
}

export interface Integration {
  id: string;
  organizationId: string;
  key: string;
  name: string;
  description: string;
  status: 'Connected' | 'Needs configuration' | 'Available';
  configured: boolean;
  connectedAt?: string;
  scopes: string[];
}

export interface Subscription {
  id: string;
  organizationId: string;
  plan: BillingPlan;
  interval: BillingInterval;
  status: 'active' | 'trialing' | 'past_due';
  seats: number;
  price: number;
  creditsLimit: number;
  renewalDate: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  number: string;
  status: 'paid' | 'open';
  amount: number;
  currency: string;
  issuedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'build' | 'billing' | 'security' | 'product';
  readAt?: string;
  createdAt: string;
  cta?: string;
}

export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  prefix: string;
  secretHash: string;
  permissions: string[];
  lastUsedAt?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
  metadata?: string;
}

export interface Comment {
  id: string;
  projectId: string;
  authorId: string;
  resource: string;
  body: string;
  createdAt: string;
}

export interface BuildTask {
  id: string;
  projectId: string;
  label: string;
  status: BuildStatus;
  createdAt: string;
}

export interface PlatformData {
  users: User[];
  organizations: Organization[];
  memberships: Membership[];
  projects: Project[];
  projectVersions: ProjectVersion[];
  projectFiles: ProjectFile[];
  projectPages: ProjectPage[];
  aiConversations: AIConversation[];
  aiMessages: AIMessage[];
  aiUsage: AIUsage[];
  templates: Template[];
  deployments: Deployment[];
  domains: Domain[];
  integrations: Integration[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  notifications: Notification[];
  apiKeys: ApiKey[];
  auditLogs: AuditLog[];
  comments: Comment[];
  buildTasks: BuildTask[];
}

export interface SessionPayload {
  userId: string;
  organizationId: string;
  role: Role;
  email: string;
}

export interface SessionUserContext {
  user: User;
  organization: Organization;
  membership: Membership;
}
