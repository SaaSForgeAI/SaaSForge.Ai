import Link from 'next/link';
import { Activity, Bot, Boxes, CreditCard, Database, Globe, LayoutDashboard, Layers3, Network, Rocket, Settings, Sparkles, Users2, Workflow } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/format';

const items = [
  { href: '/workspace', label: 'Overview', icon: LayoutDashboard },
  { href: '/workspace/my-saas', label: 'My SaaS', icon: Boxes },
  { href: '/workspace/create', label: 'Create SaaS', icon: Sparkles },
  { href: '/workspace/projects', label: 'Projects', icon: Layers3 },
  { href: '/workspace/template-library', label: 'Templates', icon: Workflow },
  { href: '/workspace/builder', label: 'AI Builder', icon: Bot },
  { href: '/workspace/database', label: 'Database', icon: Database },
  { href: '/workspace/api', label: 'API', icon: Network },
  { href: '/workspace/analytics', label: 'Analytics', icon: Activity },
  { href: '/workspace/deployments', label: 'Deployments', icon: Rocket },
  { href: '/workspace/domains', label: 'Domains', icon: Globe },
  { href: '/workspace/team', label: 'Team', icon: Users2 },
  { href: '/workspace/billing', label: 'Billing', icon: CreditCard },
  { href: '/workspace/settings', label: 'Settings', icon: Settings }
] as const;

export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="hidden w-[280px] flex-col border-r border-white/10 bg-black/20 px-4 py-5 lg:flex">
      <Logo />
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Build mode</p>
            <p className="mt-1 text-xs leading-5 text-white/45">Multi-agent generation, version checkpoints, live preview and deploy controls.</p>
          </div>
          <Badge tone="success">Live</Badge>
        </div>
      </div>
      <nav className="mt-6 flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition',
                active ? 'bg-white/10 text-white shadow-glow' : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-500/12 to-sky-500/8 p-4">
        <p className="text-sm font-medium text-white">Need a live launch?</p>
        <p className="mt-1 text-xs leading-5 text-white/50">Connect Stripe, GitHub and a custom domain to go from prompt to production.</p>
      </div>
    </aside>
  );
}
