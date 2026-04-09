"use client";

import { useProposalCountdown } from "@/hooks/useProposalCountdown";

interface ProposalProps {
  proposal: {
    _id: string;
    closesAt: string | Date;
    votesFor: number;
    votesAgainst: number;
    totalVotingPower?: number;
    status: string;
    type: string;
    title: string;
    description: string;
  };
  daoName?: string;
  showActions?: boolean;
  onExecute?: (id: string) => void;
  onVote?: (id: string) => void;
  onCancel?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export function ProposalCard({ proposal, showActions, onExecute, onVote, onCancel, onPublish }: ProposalProps) {
  const timeLeft = useProposalCountdown(proposal.closesAt);
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const quorumPercent = proposal.totalVotingPower ? (totalVotes / proposal.totalVotingPower) * 100 : 0;
  
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  return (
    <div className={`card-surface p-5 relative overflow-hidden group ${proposal.status === "active" ? "border-sky-500/30" : ""}`}>
      {/* Top Status Border Indicator */}
      {proposal.status === "active" && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />}
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={proposal.status} />
          <ProposalTypeBadge type={proposal.type} />
        </div>
        {proposal.status === "active" && <span className="text-xs text-sky-400 font-mono-hash animate-pulse">{timeLeft}</span>}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">{proposal.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{proposal.description}</p>

      {proposal.status !== "draft" && (
        <div className="space-y-2 mb-4">
          <div className="flex h-2 w-full bg-base rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full" style={{ width: `${forPercent}%` }} />
            <div className="bg-rose-500 h-full" style={{ width: `${againstPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-sky-400">{forPercent.toFixed(0)}% FOR</span>
            <span>{totalVotes} FLOW voted · {quorumPercent.toFixed(0)}% quorum</span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-sky-500/10">
          {proposal.status === "active" && onVote && (
            <button className="btn-primary w-full" onClick={() => onVote(proposal._id)}>Vote Now</button>
          )}
          {proposal.status === "draft" && onPublish && (
            <button className="btn-primary w-full" onClick={() => onPublish(proposal._id)}>Publish</button>
          )}
          {["draft", "active"].includes(proposal.status) && onCancel && (
            <button className="btn-secondary w-full" onClick={() => onCancel(proposal._id)}>Cancel</button>
          )}
          {proposal.status === "passed" && onExecute && (
            <button className="btn-primary w-full shadow-[0_0_15px_rgba(139,92,246,0.5)] from-violet-500 to-indigo-500" onClick={() => onExecute(proposal._id)}>Execute On-Chain</button>
          )}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "active") return <span className="badge badge-sky"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse mr-1.5"/>Active</span>;
  if (s === "passed") return <span className="badge badge-indigo">Passed</span>;
  if (s === "executed") return <span className="badge badge-violet">Executed</span>;
  if (s === "failed") return <span className="badge badge-rose">Failed</span>;
  if (s === "cancelled") return <span className="badge badge-amber">Cancelled</span>;
  return <span className="badge bg-slate-500/10 text-slate-400 border-slate-500/20 capitalize">{status}</span>;
}

export function ProposalTypeBadge({ type }: { type: string }) {
  const t = type.replace("_", " ");
  if (type === "treasury_spend") return <span className="badge badge-sky capitalize">{t}</span>;
  if (type === "rate_change") return <span className="badge badge-indigo capitalize">{t}</span>;
  if (type === "member_add" || type === "member_remove") return <span className="badge badge-violet capitalize">{t}</span>;
  return <span className="badge badge-amber capitalize">{t}</span>;
}
