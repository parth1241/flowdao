import { Coins } from "lucide-react";

export function TokenBadge({ balance, assetCode = "FLOW", compact = false }: { balance: number, assetCode?: string, compact?: boolean }) {
  if (compact) {
    return (
      <span className="font-mono-hash text-sky-400 font-medium tracking-tight">
        {balance.toLocaleString()} {assetCode}
      </span>
    );
  }

  return (
    <div className="badge badge-sky px-3 py-1 flex items-center gap-2">
      <Coins className="w-4 h-4 text-sky-400" />
      <div className="flex flex-col">
        <span className="font-mono-hash gradient-text font-bold text-base leading-none">
          {balance.toLocaleString()} {assetCode}
        </span>
      </div>
    </div>
  );
}
