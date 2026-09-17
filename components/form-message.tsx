import { Badge } from '@/components/ui/badge';

export function FormMessage({ success, error, info }: { success?: string; error?: string; info?: string }) {
  if (!success && !error && !info) return null;
  const tone = error ? 'danger' : success ? 'success' : 'info';
  const content = error || success || info || '';
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <Badge tone={tone}>{error ? 'Error' : success ? 'Success' : 'Info'}</Badge>
      <p className="mt-3 text-sm leading-6 text-white/70">{content}</p>
    </div>
  );
}
