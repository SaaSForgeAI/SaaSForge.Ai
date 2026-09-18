import Link from 'next/link';
import { Bot, Home, Layers3, Rocket, Settings } from 'lucide-react';
import { cn } from '@/utils/format';

const items = [
  { href: '/workspace', label: 'Home', icon: Home },
  { href: '/workspace/projects', label: 'Projects', icon: Layers3 },
  { href: '/workspace/builder', label: 'Builder', icon: Bot },
  { href: '/workspace/deployments', label: 'Deploy', icon: Rocket },
  { href: '/workspace/settings', label: 'Settings', icon: Settings }
] as const;

export function MobileNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 lg:hidden">
      <div className="mx-auto max-w-xl rounded-[30px] border border-white/10 bg-[#090b10]/95 px-2 py-2 shadow-panel backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-[10px] font-medium transition',
                  active ? 'bg-white/10 text-white shadow-glow' : 'text-white/45 hover:bg-white/[0.04] hover:text-white'
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
