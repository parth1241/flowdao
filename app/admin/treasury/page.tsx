"use client";

import { useEffect, useState } from "react";
import { useTreasuryBalance } from "@/hooks/useTreasuryBalance";
import { TreasuryChart } from "@/components/shared/TreasuryChart";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface DAO {
  name: string;
  treasuryWallet: string;
}

interface Proposal {
  _id: string;
  status: string;
  type: string;
  title: string;
  amount: number;
  recipient: string;
  executedAt?: string | Date;
  txHash?: string;
}

export default function AdminTreasury() {
  const { balance, loading: tLoading } = useTreasuryBalance();
  const [dao, setDao] = useState<DAO | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dao").then(res => res.json()),
      fetch("/api/proposals").then(res => res.json())
    ]).then(([daoRes, propRes]) => {
      setDao(daoRes.dao);
      setProposals(propRes.proposals || []);
      setLoading(false);
    });
  }, []);

  if (loading || tLoading) return <div className="animate-pulse h-full w-full bg-surface rounded-xl"></div>;

  const executed = proposals.filter(p => p.status === "executed" && p.type === "treasury_spend");
  const pending = proposals.filter(p => p.status === "passed" && p.type === "treasury_spend");

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
         <h1 className="text-3xl font-bold gradient-text">Treasury Management</h1>
         <p className="text-muted-foreground mt-1">Manage and track DAO funds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="card-surface p-8 lg:col-span-1 border-sky-500/20 text-center flex flex-col items-center justify-center min-h-[250px]">
            <p className="text-muted-foreground mb-4 uppercase tracking-widest text-sm">Target Balance</p>
            <p className="text-5xl font-black text-sky-400 font-mono-hash mb-4">{balance?.toLocaleString()} XLM</p>
            <div className="w-full bg-base p-3 rounded-lg border border-sky-500/10">
               <p className="text-xs text-muted-foreground mb-1">Treasury Wallet on Stellar</p>
               <a href={`https://stellar.expert/explorer/testnet/account/${dao?.treasuryWallet}`} target="_blank" rel="noreferrer" className="text-xs text-sky-400 font-mono-hash hover:underline break-all">
                 {dao?.treasuryWallet}
               </a>
            </div>
         </div>
         
         <div className="card-surface p-6 lg:col-span-2 min-h-[250px]">
            <h2 className="font-bold mb-4">30-Day History</h2>
            <div className="h-48">
              <TreasuryChart data={[{ date: Date.now() - 864000000, balance: balance || 0 }, { date: Date.now(), balance: balance || 0 }]} />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="card-surface overflow-hidden">
            <div className="p-4 border-b border-sky-500/10 bg-base/50">
               <h3 className="font-bold">Pending Executions</h3>
            </div>
            {pending.length > 0 ? (
               <ul className="divide-y divide-sky-500/10">
                  {pending.map(p => (
                     <li key={p._id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/5 transition-colors">
                        <div>
                           <p className="font-semibold text-foreground">{p.title}</p>
                           <p className="text-sm font-mono-hash text-rose-400 mt-1">-{p.amount} XLM → <span className="text-muted-foreground">{p.recipient.slice(0,8)}...</span></p>
                        </div>
                        <a href={`/admin/proposals/${p._id}`} className="btn-primary text-sm whitespace-nowrap text-center">Execute</a>
                     </li>
                  ))}
               </ul>
            ) : (
               <div className="p-8 text-center text-muted-foreground">No pending executions.</div>
            )}
         </div>

         <div className="card-surface overflow-hidden">
            <div className="p-4 border-b border-sky-500/10 bg-base/50">
               <h3 className="font-bold">Execution History</h3>
            </div>
            {executed.length > 0 ? (
               <ul className="divide-y divide-sky-500/10 max-h-[400px] overflow-y-auto">
                  {executed.map(p => (
                     <li key={p._id} className="p-4 hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <p className="font-semibold text-foreground truncate max-w-[70%]">{p.title}</p>
                           <span className="text-xs text-slate-500">{p.executedAt && format(new Date(p.executedAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <p className="text-sm font-mono-hash text-rose-400">-{p.amount} XLM</p>
                           <a href={`https://stellar.expert/explorer/testnet/tx/${p.txHash}`} target="_blank" rel="noreferrer" className="text-xs text-sky-400 font-mono-hash hover:underline">
                              Tx ↗
                           </a>
                        </div>
                     </li>
                  ))}
               </ul>
            ) : (
               <div className="p-8 text-center text-muted-foreground">No execution history found.</div>
            )}
         </div>
      </div>
    </div>
  );
}
