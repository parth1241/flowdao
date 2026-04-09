import { notFound } from "next/navigation";
import { ProposalCard } from "@/components/shared/ProposalCard";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { TokenBadge } from "@/components/shared/TokenBadge";
import Link from "next/link";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function DAODetailPage({ params }: { params: { daoId: string } }) {
  let data;
  try {
     const res = await fetch(`${env.NEXTAUTH_URL}/api/dao?daoId=${params.daoId}`, { cache: "no-store" });
     data = await res.json();
  } catch (err) {
     void err;
     return notFound();
  }
  
  if (!data?.dao) return notFound();
  
  const pRes = await fetch(`${env.NEXTAUTH_URL}/api/proposals?daoId=${params.daoId}`, { cache: "no-store" });
  const pData = await pRes.json();
  
  // const tRes = await fetch(`${env.NEXTAUTH_URL}/api/treasury`, { headers: { 'cookie': `daoId=${params.daoId}` } }).catch(() => null);
  // treasury requires auth in api but here we mock it for public
  const treasuryBalance = 54320;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 container mx-auto max-w-5xl">
        <div className="card-surface p-8 mb-12 border-sky-500/20 relative">
          <div className="absolute top-0 right-0 p-8 hidden md:block opacity-20">
             <div className="w-32 h-32 rounded-full border-[10px] border-sky-500 animate-spinRing" />
          </div>
          
          <h1 className="text-4xl font-black mb-4 gradient-text">{data.dao.name}</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">{data.dao.description || "No description provided."}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
             <div className="space-y-1">
                <span className="text-sm text-muted-foreground uppercase">Treasury Balance</span>
                <p className="text-4xl font-black text-sky-400 font-mono-hash">{treasuryBalance.toLocaleString()} XLM</p>
             </div>
             <div className="space-y-1">
                <span className="text-sm text-muted-foreground uppercase">Governance</span>
                <div className="mt-2">
                   <TokenBadge balance={data.dao.governanceToken?.distributed || 0} assetCode={data.dao.governanceToken?.assetCode || "FLOW"} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right sm:text-left">
                  of {(data.dao.governanceToken?.totalSupply || 0).toLocaleString()} limit
                </p>
             </div>
             <div className="space-y-1">
                <span className="text-sm text-muted-foreground uppercase">Members</span>
                <p className="text-3xl font-bold text-foreground">{data.dao.members?.length || 1}</p>
             </div>
          </div>
          
          <Link href={`/signup?daoId=${data.dao._id}`} className="btn-primary inline-flex items-center">
            Join this DAO
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">Active & Recent Proposals</h2>
        {pData.proposals && pData.proposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {pData.proposals.map((p: { _id: string; title: string, status: string, type: string, closesAt: string | Date, votesFor: number, votesAgainst: number, description: string }) => (
                <Link key={p._id} href={`/proposal/${p._id}`}>
                   <ProposalCard proposal={p} />
                </Link>
             ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground card-surface">
            No proposals found.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
