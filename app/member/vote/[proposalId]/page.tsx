"use client";

import { useEffect, useState } from "react";
import { VotePanel } from "@/components/shared/VotePanel";
import { ProposalTypeBadge, StatusBadge } from "@/components/shared/ProposalCard";
import { Confetti } from "@/components/shared/Confetti";
import { useSession } from "next-auth/react";
import { toast } from "@/components/shared/Toast";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useProposalCountdown } from "@/hooks/useProposalCountdown";
import Link from "next/link";
import { isConnected, getAddress } from "@stellar/freighter-api"; // Needed for Freighter signing integration logic

export const dynamic = "force-dynamic";

interface Proposal {
  _id: string;
  closesAt: string | Date;
  status: string;
  type: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
}

export default function MemberVotePage({ params }: { params: { proposalId: string } }) {
  const { data: session } = useSession();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedVote, setSelectedVote] = useState<"for" | "against" | "abstain" | "">("");
  const [votingPhase, setVotingPhase] = useState(0); // 0: select, 1: prep, 2: sign, 3: broadcast, 4: success
  const [txHash, setTxHash] = useState("");
  const [triggerConfetti, setTriggerConfetti] = useState(0);
  
  const timeLeft = useProposalCountdown(proposal?.closesAt);

  useEffect(() => {
    fetch(`/api/proposals/${params.proposalId}`)
      .then(r => r.json())
      .then(d => {
        if (d.proposal) setProposal(d.proposal);
        setLoading(false);
      });
  }, [params.proposalId]);

  if (loading) return null;
  if (!proposal) return <div>Proposal not found</div>;

  const handleCastVote = async () => {
    if (!selectedVote || !session?.user?.linkedWallet) return;
    
    try {
      setVotingPhase(1);
      
      const freigherConnected = await isConnected();
      if (!freigherConnected) {
         toast.error("Freighter wallet not connected");
         setVotingPhase(0);
         return;
      }
      
      const { address } = await getAddress();
      if (address !== session.user.linkedWallet) {
         toast.error("Connected wallet does not match registered wallet");
         setVotingPhase(0);
         return;
      }
      
      setVotingPhase(2);
      
      // Dynamic import to use the client-side Soroban logic
      const { castVote } = await import("@/lib/soroban");
      
      // Real contract call via Freighter
      const { txHash: resultTxHash } = await castVote(
        address, 
        proposal._id, 
        selectedVote, 
        session.user.votingPower || 0
      );
      
      setTxHash(resultTxHash);
      setVotingPhase(3);
      
      // Record in our DB for tracking
      const res = await fetch(`/api/proposals/${proposal._id}/vote`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ vote: selectedVote, txHash: resultTxHash, voterWallet: address })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setVotingPhase(4);
      setTriggerConfetti(Date.now());
      toast.success("Vote recorded on-chain!");
      
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Voting failed";
      toast.error(msg);
      setVotingPhase(0);
    }
  };

  const isActive = proposal.status === "active";
  const userTokens = session?.user?.tokenBalance || 0;

  return (
    <div className="max-w-4xl mx-auto relative">
      <Confetti trigger={triggerConfetti} />
      
      <Link href="/member/dashboard" className="text-sm text-sky-400 hover:underline mb-8 inline-block">
        ← Back to Dashboard
      </Link>
      
      <div className="card-surface p-8 mb-8 border-sky-500/20">
         <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
               <StatusBadge status={proposal.status} />
               <ProposalTypeBadge type={proposal.type} />
            </div>
            {isActive && <div className="text-sky-400 font-mono-hash text-sm">{timeLeft}</div>}
         </div>
         
         <h1 className="text-3xl font-black mb-4 leading-tight gradient-text">{proposal.title}</h1>
         
         <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
            {proposal.description}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <VotePanel proposalId={proposal._id} initialProposal={proposal} />
         
         <div>
            {votingPhase === 4 ? (
               <div className="card-surface p-8 border-sky-500/40 text-center animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto mb-4 text-sky-400 border border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                     ✓
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Vote Recorded!</h3>
                  <p className="text-muted-foreground text-sm mb-6">Your vote has been secured on the Stellar network.</p>
                  <p className="font-mono-hash text-xs text-sky-400 bg-sky-500/10 p-2 rounded truncate border border-sky-500/20">
                     {txHash}
                  </p>
               </div>
            ) : votingPhase > 0 ? (
               <div className="card-surface p-8 text-center bg-base flex flex-col items-center justify-center min-h-[350px]">
                  <div className="relative mb-6">
                     <div className="w-16 h-16 rounded-full border-[3px] border-sky-500/20"></div>
                     <div className="w-16 h-16 rounded-full border-[3px] border-sky-500 border-t-transparent animate-spin ring-0 absolute top-0 left-0"></div>
                  </div>
                  <h3 className="text-lg font-bold gradient-text">
                     {votingPhase === 1 && "Preparing vote transaction..."}
                     {votingPhase === 2 && "Awaiting wallet signature..."}
                     {votingPhase === 3 && "Broadcasting to Soroban..."}
                  </h3>
               </div>
            ) : (
               <div className="card-surface p-6 h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Cast Your Vote</h3>
                  <p className="text-sm text-muted-foreground mb-6">You are voting with <span className="font-bold text-sky-400">{userTokens.toLocaleString()} FLOW</span></p>

                  <div className="space-y-3 mb-6 flex-1">
                     <button
                        onClick={() => setSelectedVote("for")}
                        disabled={!isActive || userTokens === 0}
                        className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${selectedVote === "for" ? "border-sky-500 bg-sky-500/10 shadow-[0_0_15px_rgba(14,165,233,0.2)]" : "border-base bg-base hover:border-sky-500/30"} disabled:opacity-50 disabled:cursor-not-allowed`}
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                              <ThumbsUp size={18} />
                           </div>
                           <span className="font-bold text-foreground text-lg">FOR</span>
                        </div>
                        {selectedVote === "for" && <span className="text-sky-400 font-bold">✓</span>}
                     </button>

                     <button
                        onClick={() => setSelectedVote("against")}
                        disabled={!isActive || userTokens === 0}
                        className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${selectedVote === "against" ? "border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.2)]" : "border-base bg-base hover:border-rose-500/30"} disabled:opacity-50 disabled:cursor-not-allowed`}
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                              <ThumbsDown size={18} />
                           </div>
                           <span className="font-bold text-foreground text-lg">AGAINST</span>
                        </div>
                        {selectedVote === "against" && <span className="text-rose-400 font-bold">✓</span>}
                     </button>

                     <button
                        onClick={() => setSelectedVote("abstain")}
                        disabled={!isActive || userTokens === 0}
                        className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${selectedVote === "abstain" ? "border-slate-500 bg-slate-500/10 shadow-[0_0_15px_rgba(100,116,139,0.2)]" : "border-base bg-base hover:border-slate-500/30"} disabled:opacity-50 disabled:cursor-not-allowed`}
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-400">
                              <Minus size={18} />
                           </div>
                           <span className="font-bold text-foreground text-lg">ABSTAIN</span>
                        </div>
                        {selectedVote === "abstain" && <span className="text-slate-400 font-bold">✓</span>}
                     </button>
                  </div>

                  {!session?.user?.linkedWallet ? (
                     <div className="bg-amber-500/10 text-amber-500 text-center p-3 rounded text-sm mb-4">
                        You must connect a wallet to vote.
                     </div>
                  ) : userTokens === 0 ? (
                     <div className="bg-rose-500/10 text-rose-500 text-center p-3 rounded text-sm mb-4">
                        You have 0 FLOW. Contact admin.
                     </div>
                  ) : !isActive ? (
                     <div className="bg-slate-500/10 text-slate-400 text-center p-3 rounded text-sm mb-4 font-bold">
                        Voting is closed
                     </div>
                  ) : null}

                  <button 
                     onClick={handleCastVote} 
                     disabled={!selectedVote || !isActive || userTokens === 0 || !session?.user?.linkedWallet} 
                     className="btn-primary w-full py-4 text-lg"
                  >
                     Submit Vote
                  </button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
