import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export function AuthShell({ children, title, description }: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.18),transparent_28%),linear-gradient(180deg,#090b10,#0b0d14)] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-white/55 transition hover:text-white">Back to home</Link>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.26em] text-white/35">Authentication</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="max-w-xl text-base leading-7 text-white/60">{description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Secure sessions', 'HTTP-only session cookies and route protection.'],
                ['Email verification', 'Token-based verification flow for sandbox demo.'],
                ['Password recovery', 'Forgot and reset password workflow.'],
                ['OAuth ready', 'Google and GitHub providers can be enabled via env vars.']
              ].map(([label, body]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-white/55">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
