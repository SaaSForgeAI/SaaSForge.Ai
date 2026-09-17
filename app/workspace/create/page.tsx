import { createProjectAction } from '@/services/workspace-actions';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreateSaasPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create SaaS"
        title="Describe the software you want to build"
        description="Create a new project from a natural-language brief. The Product, Database, Backend and UI agents will generate the first version automatically."
      />
      <Card className="max-w-4xl">
        <form action={createProjectAction} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white/60">Project name</label>
            <Input name="name" placeholder="EstateFlow CRM" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Describe your idea</label>
            <Textarea name="prompt" placeholder="I want a CRM for real estate agencies with lead management, pipeline, calendar, email sequences and analytics." required />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-white/60">Category</label>
              <Select name="category">
                {['CRM', 'AI tool', 'Analytics', 'Marketplace', 'Finance', 'Internal tool', 'Other'].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Level</label>
              <Select name="maturity">
                {['MVP', 'Production ready', 'Enterprise'].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Style</label>
              <Select name="style">
                {['Minimal', 'Modern', 'Corporate', 'Creative', 'Dark', 'Custom'].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </div>
          </div>
          <Button type="submit">Generate SaaS</Button>
        </form>
      </Card>
    </div>
  );
}
