import Link from 'next/link';
import { Logo } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <Logo withLink={false} />
          <p className="max-w-xl text-sm leading-7 text-white/50">
            SaaSForge AI helps teams turn a product idea into a deployable SaaS with architecture, auth,
            billing, database design, live preview and premium UX baked in.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-white/55 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="font-medium text-white">Product</p>
            <Link href="/templates" className="block hover:text-white">Templates</Link>
            <Link href="/pricing" className="block hover:text-white">Pricing</Link>
            <Link href="/docs" className="block hover:text-white">Docs</Link>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-white">Company</p>
            <Link href="/changelog" className="block hover:text-white">Changelog</Link>
            <Link href="/privacy" className="block hover:text-white">Privacy</Link>
            <Link href="/terms" className="block hover:text-white">Terms</Link>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-white">Workspace</p>
            <Link href="/workspace" className="block hover:text-white">Dashboard</Link>
            <Link href="/workspace/builder" className="block hover:text-white">AI Builder</Link>
            <Link href="/workspace/settings" className="block hover:text-white">Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
