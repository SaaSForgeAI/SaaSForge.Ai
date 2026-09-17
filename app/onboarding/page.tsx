import { completeOnboardingAction } from '@/services/workspace-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormMessage } from '@/components/form-message';
import { requireSession } from '@/lib/auth';

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSession();
  const params = await searchParams;
  const welcome = typeof params.welcome === 'string' ? params.welcome : undefined;

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 lg:px-8">
      <div className="space-y-4 text-center">
        <Badge tone="info">Onboarding</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Generate your first SaaS</h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-white/60">Tell SaaSForge AI what to build, how mature it should be and what visual direction to follow.</p>
      </div>
      <Card className="mx-auto mt-10 max-w-3xl space-y-6">
        <FormMessage success={welcome} />
        <form action={completeOnboardingAction} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white/60">Step 1 — Project name</label>
            <Input name="projectName" placeholder="EstateFlow CRM" required aria-label="Project name" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Step 1 — What do you want to build?</label>
            <Textarea name="idea" placeholder="Describe your SaaS idea…" required aria-label="Describe your SaaS idea" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/60">Step 2 — Category</label>
            <Select name="category" aria-label="Category">
              {['B2B', 'B2C', 'Internal tool', 'Marketplace', 'Productivity', 'CRM', 'Analytics', 'E-commerce', 'AI tool', 'Other'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/60">Step 3 — Level</label>
              <Select name="maturity" aria-label="Level">
                {['MVP', 'Production ready', 'Enterprise'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/60">Step 4 — Style</label>
              <Select name="style" aria-label="Style">
                {['Minimal', 'Modern', 'Corporate', 'Creative', 'Dark', 'Custom'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
          </div>
          <Button type="submit" fullWidth className="py-3 text-base">Generate my SaaS</Button>
        </form>
      </Card>
    </main>
  );
}
