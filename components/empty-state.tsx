import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function EmptyState({ title, description, href, cta }: { title: string; description: string; href?: string; cta?: string }) {
  return (
    <Card className="border-dashed border-white/15 p-8 text-center">
      <div className="mx-auto max-w-md">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/55">{description}</p>
        {href && cta ? (
          <Link href={href} className="mt-6 inline-flex">
            <Button>{cta}</Button>
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
