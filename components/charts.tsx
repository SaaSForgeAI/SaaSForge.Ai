import { Card } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/utils/format';

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/40">{hint}</p>
    </Card>
  );
}

export function MiniBarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-44 items-end gap-3">
      {values.map((value, index) => (
        <div key={`${labels[index]}-${value}`} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end rounded-2xl border border-white/10 bg-white/[0.03] p-1">
            <div
              className="w-full rounded-xl bg-gradient-to-t from-accent to-accent2 transition-all duration-500"
              style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-white/40">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${100 - (value / max) * 88}`)
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-24 w-full overflow-visible">
      <defs>
        <linearGradient id="spark" x1="0" x2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#33a8ff" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#spark)" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AnalyticsOverview() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">Revenue growth</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{formatCurrency(68400)} annualized</h3>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">+18.4%</span>
        </div>
        <div className="mt-6">
          <Sparkline values={[22, 28, 31, 30, 38, 42, 45, 44, 51, 54, 57, 61]} />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm text-white/55">
          <div>
            <p>Visitors</p>
            <p className="mt-2 text-lg font-semibold text-white">{formatNumber(48920)}</p>
          </div>
          <div>
            <p>Activation</p>
            <p className="mt-2 text-lg font-semibold text-white">31.6%</p>
          </div>
          <div>
            <p>Retention</p>
            <p className="mt-2 text-lg font-semibold text-white">82.1%</p>
          </div>
        </div>
      </Card>
      <Card>
        <p className="text-sm text-white/50">Conversion funnel</p>
        <div className="mt-6 space-y-3">
          {[
            ['Visitors', 100],
            ['Started onboarding', 68],
            ['Generated project', 47],
            ['Activated workspace', 29],
            ['Paid subscription', 12]
          ].map(([label, width]) => (
            <div key={String(label)}>
              <div className="mb-1 flex items-center justify-between text-sm text-white/55">
                <span>{label}</span>
                <span>{width}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2" style={{ width: `${width}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
