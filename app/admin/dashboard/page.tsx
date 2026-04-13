"use client";

import { useEffect, useState } from "react";
import { useTreasuryBalance } from "@/hooks/useTreasuryBalance";
import { TreasuryChart } from "@/components/shared/TreasuryChart";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import Link from "next/link";
import { Activity } from "lucide-react";
import WalletManager from '@/components/shared/WalletManager';
import SendXLMPanel from '@/components/shared/SendXLMPanel';

interface Proposal {
  _id: string;
  status: string;
  title: string;
  type: string;
}

interface AdminData {
  dao: {
    name: string;
    _id: string;
    governanceToken?: {
      distributed: number;
    };
  } | null;
  proposals: Proposal[];
  members: { _id: string }[];
}

export default function AdminDashboard() {
  const { balance, loading: tLoading } = useTreasuryBalance();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dao").then(res => res.json()),
      fetch("/api/proposals").then(res => res.json()),
      fetch("/api/members").then(res => res.json())
    ]).then(([daoRes, propRes, memRes]) => {
      setData({
        dao: daoRes.dao,
        proposals: propRes.proposals || [],
        members: memRes.members || []
      });
      setLoading(false);
    });
  }, []);

  if (loading || tLoading || !data) return <DashboardSkeleton />;

  const activeProposals = data.proposals.filter((p: Proposal) => p.status === "active");
  const passedNeedsExecution = data.proposals.filter((p: Proposal) => p.status === "passed");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">{data.dao?.name} Overview</p>
        </div>
        <div className="text-right">
           <p className="text-sm text-muted-foreground uppercase">Invite Code</p>
           <p className="font-mono-hash text-sky-400 font-bold bg-sky-500/10 px-3 py-1 rounded select-all">
             {data.dao?._id}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-surface p-6 border-sky-500/20">
          <p className="text-sm text-muted-foreground mb-1">Treasury Balance</p>
          <p className="text-3xl font-bold text-sky-400 font-mono-hash">{balance?.toLocaleString()} XLM</p>
        </div>
        <div className="card-surface p-6 border-indigo-500/20">
          <p className="text-sm text-muted-foreground mb-1">Active Proposals</p>
          <p className="text-3xl font-bold text-indigo-400">{activeProposals.length}</p>
        </div>
        <div className="card-surface p-6 border-violet-500/20">
          <p className="text-sm text-muted-foreground mb-1">Total Members</p>
          <p className="text-3xl font-bold text-violet-400">{data.members.length}</p>
        </div>
        <div className="card-surface p-6 border-amber-500/20">
          <p className="text-sm text-muted-foreground mb-1">Tokens Distributed</p>
          <p className="text-3xl font-bold text-amber-400 break-words font-mono-hash">
             {data.dao?.governanceToken?.distributed?.toLocaleString()} FLOW
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-surface p-6">
          <h2 className="text-xl font-bold mb-4">Treasury History</h2>
          <div className="h-64">
            <TreasuryChart data={[{ date: Date.now() - 864000000, balance: balance || 0 }, { date: Date.now(), balance: balance || 0 }]} />
          </div>
        </div>

        <div className="space-y-6">
          {passedNeedsExecution.length > 0 ? (
            passedNeedsExecution.map((p: Proposal) => (
              <Link key={p._id} href={`/admin/proposals/${p._id}`}>
                <div className="card-surface p-4 border-indigo-500/40 hover:border-indigo-400 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-indigo">Passed</span>
                    <span className="text-xs text-muted-foreground">Ready</span>
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors">{p.title}</h4>
                </div>
              </Link>
            ))
          ) : (
            <div className="card-surface p-6 text-center text-muted-foreground">
              All caught up! No proposals await execution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
