import type { ReactNode } from 'react';
import { cn } from '@/utils/format';

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const tones = {
    default: 'border-white/10 bg-white/5 text-white/70',
    success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
    warning: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
    danger: 'border-red-400/20 bg-red-500/10 text-red-200',
    info: 'border-sky-400/20 bg-sky-500/10 text-sky-200'
  } as const;

  return <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone])}>{children}</span>;
}
