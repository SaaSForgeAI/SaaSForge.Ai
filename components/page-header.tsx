import { Badge } from '@/components/ui/badge';

export function PageHeader({ eyebrow, title, description, badge }: { eyebrow: string; title: string; description: string; badge?: string }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-white/35">{eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="max-w-3xl text-sm leading-7 text-white/60 sm:text-base">{description}</p>
      </div>
      {badge ? <Badge tone="info">{badge}</Badge> : null}
    </div>
  );
}
