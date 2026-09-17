import Link from 'next/link';

export function Logo({ withLink = true }: { withLink?: boolean }) {
  const content = (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent2 text-sm font-semibold text-white shadow-glow">
        SF
      </div>
      <div>
        <div className="text-sm font-semibold tracking-wide text-white">SaaSForge AI</div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-white/45">AI SaaS generator</div>
      </div>
    </div>
  );

  return withLink ? <Link href="/">{content}</Link> : content;
}
