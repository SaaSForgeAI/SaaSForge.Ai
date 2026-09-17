import Link from 'next/link';
import { SiteHeader } from '@/components/marketing/site-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 py-16 lg:px-8">
        <Card className="w-full text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-white/35">404</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">This route does not exist.</h1>
          <p className="mt-4 text-base leading-7 text-white/55">Return to the landing page or open the workspace to continue building your SaaS.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/"><Button>Back to home</Button></Link>
            <Link href="/workspace"><Button variant="secondary">Open workspace</Button></Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
