import { PageHeader } from '@/components/page-header';
import { TemplateCard } from '@/components/template-card';
import { getWorkspaceData } from '@/lib/workspace';

export default async function WorkspaceTemplateLibraryPage() {
  const { db } = await getWorkspaceData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Templates"
        title="Template library"
        description="Use curated templates as starting points for CRM, AI SaaS, finance, marketing, analytics, real estate and productivity products."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {db.templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
