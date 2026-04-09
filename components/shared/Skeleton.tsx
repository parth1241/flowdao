export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-sky-500/10 rounded-md ${className}`} />;
}
