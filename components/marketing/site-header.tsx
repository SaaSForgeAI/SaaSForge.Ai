import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

const nav = [
  { href: '#product', label: 'Product' },
  { href: '#features', label: 'Features' },
  { href: '/templates', label: 'Templates' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/docs', label: 'Docs' }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090b10]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-white/55 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-white/65 transition hover:text-white">
            Sign in
          </Link>
          <Link href="/auth/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
