import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { TemplateCard } from '@/components/template-card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import { readDb } from '@/lib/store';
import { TEMPLATE_CATEGORIES } from '@/utils/constants';

export default async function TemplatesPage() {
  const db = await readDb();
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Template marketplace"
          title="Curated SaaS blueprints for every category"
          description="Explore production-minded templates with realistic data, premium UX and a stack designed for scaling from MVP to enterprise."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {TEMPLATE_CATEGORIES.map((category) => (
            <Badge key={category} tone="default">{category}</Badge>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {db.templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
