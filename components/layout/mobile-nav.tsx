import Link from 'next/link';
import { Bot, LayoutDashboard, Layers3, Rocket, Settings } from 'lucide-react';
import { cn } from '@/utils/format';

const items = [
  { href: '/workspace', label: 'Overview', icon: LayoutDashboard },
  { href: '/workspace/projects', label: 'Projects', icon: Layers3 },
  { href: '/workspace/builder', label: 'Builder', icon: Bot },
  { href: '/workspace/deployments', label: 'Deploy', icon: Rocket },
  { href: '/workspace/settings', label: 'Settings', icon: Settings }
] as const;

export function MobileNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#090b10]/92 px-3 py-2 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition',
                active ? 'bg-white/10 text-white' : 'text-white/45 hover:bg-white/[0.04] hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
