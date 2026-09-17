export function Progress({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
      <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-500" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
