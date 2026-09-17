export default function WorkspaceLoading() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
      ))}
    </div>
  );
}
