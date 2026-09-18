import { Badge } from '@/components/ui/badge';

export function PageHeader({ eyebrow, title, description, badge }: { eyebrow: string; title: string; description: string; badge?: string }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/35 sm:text-xs">{eyebrow}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="max-w-3xl text-[15px] leading-7 text-white/60 sm:text-base sm:leading-7">{description}</p>
      </div>
      {badge ? <div className="self-start lg:self-auto"><Badge tone="info">{badge}</Badge></div> : null}
    </div>
  );
}
