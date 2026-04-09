"use client";

import { useEffect, useState } from "react";

interface Proposal {
  votesFor: number;
  votesAgainst: number;
  totalVotingPower?: number;
  quorumReached?: boolean;
}

export function VotePanel({ proposalId, initialProposal }: { proposalId: string, initialProposal: Proposal }) {
  const [proposal, setProposal] = useState<Proposal>(initialProposal);

  useEffect(() => {
    // Poll every 30s
    let active = true;
    const interval = setInterval(() => {
      fetch(`/api/proposals/${proposalId}`)
        .then(res => res.json())
        .then(data => {
          if (active && data.proposal) setProposal(data.proposal);
        })
        .catch(() => {});
    }, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [proposalId]);

  const totalVotes = proposal.votesFor + proposal.votesAgainst; // Plus abstain if we tracked it in proposal
  const targetTokens = proposal.totalVotingPower || 1;
  const quorumPercentCalc = (totalVotes / targetTokens) * 100;
  
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  return (
    <div className="card-surface p-6">
      <h3 className="text-lg font-medium mb-4">Current Tally</h3>
      
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-sky-400 font-medium">FOR</span>
            <span className="font-mono-hash">{proposal.votesFor.toLocaleString()} ({forPercent.toFixed(1)}%)</span>
          </div>
          <div className="h-3 w-full bg-base rounded-full overflow-hidden border border-sky-500/20">
            <div className="bg-sky-500 h-full transition-all duration-1000" style={{ width: `${forPercent}%` }} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-rose-400 font-medium">AGAINST</span>
            <span className="font-mono-hash">{proposal.votesAgainst.toLocaleString()} ({againstPercent.toFixed(1)}%)</span>
          </div>
          <div className="h-3 w-full bg-base rounded-full overflow-hidden border border-rose-500/20">
            <div className="bg-rose-500 h-full transition-all duration-1000" style={{ width: `${againstPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-sky-500/10">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Quorum Reached</span>
          <span className="text-foreground">{quorumPercentCalc.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-base rounded-full overflow-hidden">
          <div className={`h-full ${proposal.quorumReached ? 'bg-indigo-500' : 'bg-slate-600'} transition-all`} style={{ width: `${Math.min(quorumPercentCalc, 100)}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {totalVotes.toLocaleString()} / {targetTokens.toLocaleString()} tokens voted
        </p>
      </div>
    </div>
  );
}
