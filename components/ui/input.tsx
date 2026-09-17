import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/format';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-accent/60 focus:ring-2 focus:ring-accent/20',
        props.className
      )}
    />
  );
}
