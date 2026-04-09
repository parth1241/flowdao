import { notFound } from "next/navigation";
import { ProposalTypeBadge, StatusBadge } from "@/components/shared/ProposalCard";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { VotePanel } from "@/components/shared/VotePanel";
import Link from "next/link";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProposalDetailPage({ params }: { params: { proposalId: string } }) {
  let data;
  try {
     const res = await fetch(`${env.NEXTAUTH_URL}/api/proposals/${params.proposalId}`, { cache: "no-store" });
     data = await res.json();
  } catch (err) {
     void err;
     return notFound();
  }
  
  if (!data?.proposal) return notFound();
  
  const { proposal, daoName } = data;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 container mx-auto max-w-4xl">
         <Link href={`/dao/${proposal.daoId}`} className="text-sm text-sky-400 hover:underline mb-8 inline-block">
            ← Back to {daoName || "DAO"}
         </Link>

         <div className="card-surface p-8 mb-8">
            <div className="flex gap-2 mb-6">
               <StatusBadge status={proposal.status} />
               <ProposalTypeBadge type={proposal.type} />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{proposal.title}</h1>
            
            {proposal.type === "treasury_spend" && proposal.amount && (
               <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-mono-hash text-sm">
                  <span className="font-bold">Transaction Request:</span> Pay {proposal.amount} XLM to {proposal.recipient}
               </div>
            )}
            
            <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
               {proposal.description}
            </div>
            
            {proposal.status === "passed" && proposal.updatedAt && (
               <div className="mt-8 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                     <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-timelockSpin" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-indigo-400 mb-0.5">Timelock Active</p>
                     <p className="text-xs text-muted-foreground">Executes automatically once timelock expires</p>
                  </div>
               </div>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
               <VotePanel proposalId={proposal._id} initialProposal={proposal} />
            </div>
            <div>
               <div className="card-surface p-6 sticky top-24">
                  <h3 className="font-bold mb-4">Cast your vote</h3>
                  <p className="text-sm text-muted-foreground mb-6">You must connect your wallet and log in to vote on this proposal.</p>
                  <Link href={`/login?returnUrl=/proposal/${proposal._id}`} className="btn-primary w-full text-center block">
                     Log in to Vote
                  </Link>
               </div>
            </div>
         </div>
      </main>
      <Footer />
    </div>
  );
}
