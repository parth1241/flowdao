"use client";

import { useEffect, useState } from "react";
import { ProposalCard } from "@/components/shared/ProposalCard";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Coins, AlertCircle, Activity } from "lucide-react";
import WalletManager from '@/components/shared/WalletManager';
import SendXLMPanel from '@/components/shared/SendXLMPanel';

export const dynamic = "force-dynamic";

interface Proposal {
  _id: string;
  status: string;
  title: string;
  type: string;
  description: string;
  closesAt: string | Date;
  votesFor: number;
  votesAgainst: number;
  totalVotingPower?: number;
}

interface DashboardData {
  dao: {
    name: string;
    governanceToken?: {
      distributed: number;
    }
  } | null;
  proposals: Proposal[];
}

export default function MemberDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dao").then(r => r.json()),
      fetch("/api/proposals").then(r => r.json())
    ]).then(([daoRes, propRes]) => {
      setData({ dao: daoRes.dao, proposals: propRes.proposals || [] });
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <DashboardSkeleton />;

  const activeProposals = data.proposals.filter((p: Proposal) => p.status === "active");
  const recentProposals = data.proposals.filter((p: Proposal) => p.status !== "active").slice(0, 3);
  
  const tokenBal = session?.user?.tokenBalance || 0;
  const power = (data.dao?.governanceToken?.distributed ?? 0) > 0 ? (tokenBal / data.dao!.governanceToken!.distributed) * 100 : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Member Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to {data.dao?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 card-elevated p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Coins size={120} className="text-sky-400" />
            </div>
            <p className="text-sm font-medium text-sky-400 uppercase tracking-widest mb-2">Voting Power</p>
            <p className="text-5xl font-black mb-2 flex items-baseline gap-3">
               <span className="font-mono-hash text-foreground">{tokenBal.toLocaleString()}</span>
               <span className="text-xl text-muted-foreground font-sans">FLOW</span>
            </p>
            <p className="text-sm text-slate-400 font-medium">You control {power.toFixed(2)}% of the DAO</p>
            
            {(!session?.user?.linkedWallet) && (
               <div className="mt-6 flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 max-w-sm">
                  <AlertCircle size={16} /> Link your wallet to receive tokens
               </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="card-surface p-6 border-indigo-500/20">
               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Proposals</p>
               <p className="text-3xl font-bold text-indigo-400">{data.proposals.length}</p>
            </div>
            <div className="card-surface p-6 border-violet-500/20">
               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Participation Rate</p>
               <p className="text-3xl font-bold text-violet-400">100%</p>
            </div>
         </div>
        </div>
      </div>

      {/* Stellar Wallet Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WalletManager />
        </div>
        <div className="lg:col-span-1">
          <SendXLMPanel compact />
        </div>
        <div className="lg:col-span-1">
          <div className="card-surface bg-emerald-500/5 hover:bg-emerald-500/10 p-8 flex flex-col items-center justify-center text-center space-y-5 h-full relative overflow-hidden group">
             <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10 transition-transform group-hover:scale-110">
                <Activity size={32} className="animate-pulse" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Governance Pulse</h3>
                <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest leading-relaxed">Identity Verified on Ledger<br/>Consensus Authority Active</p>
             </div>
             <div className="w-full h-px bg-white/5" />
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol: Operational</span>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Proposals</h2>
            <span className="badge badge-sky px-3 py-1">{activeProposals.length}</span>
         </div>
         
         {activeProposals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {activeProposals.map((p: Proposal) => (
                  <Link key={p._id} href={`/member/vote/${p._id}`}>
                     <ProposalCard proposal={p} showActions={false} />
                  </Link>
               ))}
            </div>
         ) : (
            <div className="card-surface p-12 text-center border-dashed border-2 border-sky-500/20 text-muted-foreground">
               There are no active proposals at the moment.
            </div>
         )}
      </div>

      <div className="mt-12">
         <h2 className="text-2xl font-bold mb-6 text-muted-foreground">Recent Activity</h2>
         {recentProposals.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
               {recentProposals.map((p: Proposal) => (
                  <Link key={p._id} href={`/proposal/${p._id}`}>
                     <div className="card-surface p-4 hover:bg-white/5 transition-colors flex justify-between items-center sm:hidden">
                        <span className="font-medium truncate max-w-[200px]">{p.title}</span>
                        <span className="text-xs badge bg-base">{p.status}</span>
                     </div>
                     <div className="card-surface p-4 hover:bg-white/5 transition-colors justify-between items-center hidden sm:flex">
                        <div className="flex items-center gap-4">
                           <span className={`w-2 h-2 rounded-full ${p.status==='passed'?'bg-indigo-400':p.status==='executed'?'bg-violet-400':'bg-rose-400'}`} />
                           <span className="font-medium text-foreground">{p.title}</span>
                        </div>
                        <span className="text-sm text-slate-500 capitalize">{p.type.replace("_", " ")}</span>
                     </div>
                  </Link>
               ))}
            </div>
         ) : (
            <p className="text-muted-foreground text-sm">No recent activity.</p>
         )}
      </div>
    </div>
  );
}
