export default function Loading() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <div className="flex gap-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
        <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse delay-150" />
        <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse delay-300" />
      </div>
      <h2 className="text-2xl font-black gradient-text mb-2 text-center">FlowDAO</h2>
      <p className="text-muted-foreground font-mono-hash text-sm text-center">Connecting to Soroban...</p>
    </div>
  );
}
