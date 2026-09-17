import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Template } from '@/types';

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Card className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className={`h-36 bg-gradient-to-br ${template.previewGradient}`} />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">{template.category}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{template.name}</h3>
          </div>
          <Badge tone="info">{template.rating.toFixed(1)}</Badge>
        </div>
        <p className="text-sm leading-6 text-white/55">{template.description}</p>
        <div className="flex flex-wrap gap-2">
          {template.features.map((feature) => (
            <span key={feature} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 text-sm">
          <span className="text-white/40">{template.uses.toLocaleString('en-US')} uses</span>
          <Link href={`/templates/${template.category.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center gap-2 text-white/75 transition group-hover:text-white">
            Use template <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
