'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const steps = [
  'Analyzing idea…',
  'Designing architecture…',
  'Creating database…',
  'Generating UI…',
  'Connecting authentication…',
  'Building dashboard…',
  'Deploying…'
];

export function HeroSimulator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((value) => (value < steps.length ? value + 1 : value));
    }, 1200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden border-white/15 bg-black/30 p-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,92,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(51,168,255,0.12),transparent_40%)]" />
      <div className="relative grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="space-y-4">
          <Badge tone="info">Interactive generation preview</Badge>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">
            Build a modern CRM for real estate agencies.
          </div>
          <div className="space-y-3">
            {steps.map((step, stepIndex) => {
              const completed = stepIndex < index;
              const running = stepIndex === index && index < steps.length;
              return (
                <div key={step} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
                  <span className="text-white/70">{step}</span>
                  <span
                    className={
                      completed
                        ? 'text-emerald-300'
                        : running
                          ? 'animate-pulse text-sky-300'
                          : 'text-white/30'
                    }
                  >
                    {completed ? 'Completed' : running ? 'Running' : 'Pending'}
                  </span>
                </div>
              );
            })}
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {index >= steps.length ? 'Your SaaS is ready.' : 'Preparing live preview…'}
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-[#080a10] p-4 shadow-glow">
          <div className="rounded-[22px] border border-white/10 bg-gradient-to-b from-[#121621] to-[#090b10] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Generated app</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Estate CRM</h3>
              </div>
              <Badge tone="success">Live preview</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['New leads', '124'],
                ['Pipeline value', '$482K'],
                ['Appointments', '18'],
                ['Conversion', '24.8%']
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-white/40">
                <span>Sales pipeline</span>
                <span>Updated now</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  ['Incoming', 9],
                  ['Qualified', 14],
                  ['Visit booked', 6],
                  ['Won', 3]
                ].map(([label, count]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <p className="text-xs text-white/40">{label}</p>
                    <p className="mt-3 text-xl font-semibold text-white">{String(count)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
