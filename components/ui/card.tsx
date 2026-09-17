import type { PropsWithChildren } from 'react';
import { cn } from '@/utils/format';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-panel backdrop-blur-md', className)}>
      {children}
    </div>
  );
}
