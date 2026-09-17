import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/format';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export function Button({ children, className, variant = 'primary', fullWidth, ...props }: PropsWithChildren<ButtonProps>) {
  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-gradient-to-r from-accent to-accent2 text-white shadow-glow hover:brightness-110',
    secondary: 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
    ghost: 'text-white/70 hover:bg-white/5 hover:text-white',
    danger: 'border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
