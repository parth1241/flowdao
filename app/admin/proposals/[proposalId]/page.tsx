"use client";

import { useEffect, useState } from "react";
import { ProposalCard } from "@/components/shared/ProposalCard";
import { VotePanel } from "@/components/shared/VotePanel";
import { toast } from "@/components/shared/Toast";
import { Confetti } from "@/components/shared/Confetti";

export const dynamic = "force-dynamic";

interface Proposal {
  _id: string;
  status: string;
  type: string;
  title: string;
  description: string;
  amount: number;
  recipient: string;
  txHash?: string;
  closesAt: string | Date;
  votesFor: number;
  votesAgainst: number;
}

export default function AdminProposalDetail({ params }: { params: { proposalId: string } }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(0);

  useEffect(() => {
    fetch(`/api/proposals/${params.proposalId}`)
      .then(res => res.json())
      .then(data => {
        if (data.proposal) setProposal(data.proposal);
        setLoading(false);
      });
  }, [params.proposalId]);

  if (loading) return null;
  if (!proposal) return <div>Proposal not found</div>;

  const handlePublish = async () => {
    const res = await fetch(`/api/proposals/${proposal._id}/publish`, { method: "POST" });
    if (res.ok) {
      toast.success("Proposal published!");
      setTriggerConfetti(Date.now());
      setProposal({ ...proposal, status: "active" });
    }
  };

  const handleCancel = async () => {
    const res = await fetch(`/api/proposals/${proposal._id}/cancel`, { method: "POST" });
    if (res.ok) {
      toast.success("Proposal cancelled");
      setProposal({ ...proposal, status: "cancelled" });
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    const res = await fetch(`/api/proposals/${proposal._id}/execute`, { method: "POST" });
    const data = await res.json();
    setExecuting(false);
    if (!res.ok) {
       toast.error(data.error || "Failed to execute");
    } else {
       toast.success("Executed on chain!");
       setTriggerConfetti(Date.now());
       setProposal({ ...proposal, status: "executed", txHash: data.txHash });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl relative">
      <Confetti trigger={triggerConfetti} />
      <h1 className="text-3xl font-bold gradient-text mb-8">Manage Proposal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProposalCard 
            proposal={proposal} 
            showActions 
            onPublish={handlePublish}
            onCancel={handleCancel}
            onExecute={handleExecute}
          />
          
          <div className="card-surface p-6">
             <h2 className="text-xl font-bold mb-4">Details</h2>
             <div className="prose prose-invert max-w-none mb-6">
                {proposal.description}
             </div>
             
             {proposal.type === "treasury_spend" && (
                <div className="bg-sky-500/10 p-4 border border-sky-500/20 rounded-md">
                   <p className="font-bold text-sky-400 mb-1">Treasury Payout</p>
                   <p className="font-mono-hash text-sm">Amount: {proposal.amount} XLM</p>
                   <p className="font-mono-hash text-sm break-all">Recipient: {proposal.recipient}</p>
                </div>
             )}
          </div>
        </div>

        <div className="space-y-6">
          <VotePanel proposalId={proposal._id} initialProposal={proposal} />
          
          {proposal.txHash && (
            <div className="card-surface p-4">
               <h3 className="text-sm font-semibold mb-2">Execution Transaction</h3>
               <a href={`https://stellar.expert/explorer/testnet/tx/${proposal.txHash}`} target="_blank" rel="noreferrer" className="text-xs text-sky-400 break-all hover:underline font-mono-hash block">
                 {proposal.txHash}
               </a>
            </div>
          )}
        </div>
      </div>
      
      {executing && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="card-elevated p-8 text-center flex flex-col items-center">
               <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
               <h3 className="text-xl font-bold mb-2">Signing treasury transaction...</h3>
               <p className="text-muted-foreground text-sm">Broadcasting to Stellar Horizon</p>
            </div>
         </div>
      )}
    </div>
  );
}
