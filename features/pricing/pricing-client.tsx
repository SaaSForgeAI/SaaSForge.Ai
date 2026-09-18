'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PLAN_OPTIONS } from '@/utils/constants';
import { formatCurrency } from '@/utils/format';

export function PricingClient() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-white/35">Pricing</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">Premium plans for every stage</h1>
        <p className="mt-5 text-lg leading-8 text-white/60">Save 20% with annual billing. Start for free, scale with collaboration, governance and production controls.</p>
        <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {(['monthly', 'yearly'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setInterval(item)}
              className={`rounded-full px-4 py-2 text-sm transition ${interval === item ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
            >
              {item === 'monthly' ? 'Monthly' : 'Yearly'}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-4">
        {PLAN_OPTIONS.map((plan) => {
          const yearlyMonthlyEquivalent = plan.price.yearly / 12;
          const yearlySavings = Math.max(0, plan.price.monthly * 12 - plan.price.yearly);

          return (
            <Card key={plan.name} className={plan.name === 'Business' ? 'border-violet-400/25 shadow-glow' : ''}>
              <p className="text-sm text-white/45">{plan.name}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-semibold text-white">{formatCurrency(plan.price[interval])}</span>
                <span className="pb-1 text-sm text-white/40">{interval === 'monthly' ? '/ month' : '/ year'}</span>
              </div>
              <p className="mt-2 text-sm text-white/55">
                {interval === 'monthly'
                  ? 'Billed monthly'
                  : `${formatCurrency(yearlyMonthlyEquivalent)} / month billed annually${yearlySavings > 0 ? ` · save ${formatCurrency(yearlySavings)} / year` : ''}`}
              </p>
              <p className="mt-3 text-sm text-white/55">{plan.credits.toLocaleString('en-US')} AI credits included</p>
              <div className="mt-6 space-y-3 text-sm text-white/60">
                {plan.features.map((feature) => (
                  <p key={feature}>• {feature}</p>
                ))}
              </div>
              <Link href="/auth/register" className="mt-8 block">
                <Button fullWidth variant={plan.name === 'Business' ? 'primary' : 'secondary'}>
                  {plan.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
