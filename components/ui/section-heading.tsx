import { Badge } from '@/components/ui/badge';

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl space-y-4">
      <Badge tone="info">{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="text-base leading-7 text-white/60 sm:text-lg">{description}</p>
      </div>
    </div>
  );
}
