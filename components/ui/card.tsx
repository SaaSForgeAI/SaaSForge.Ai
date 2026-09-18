import type { PropsWithChildren } from 'react';
import { cn } from '@/utils/format';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-panel backdrop-blur-md sm:p-5', className)}>
      {children}
    </div>
  );
}
