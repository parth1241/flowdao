"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/shared/Toast";
import { Coins } from "lucide-react";

export const dynamic = "force-dynamic";

interface Member {
  _id: string;
  name?: string;
  linkedWallet?: string;
  tokenBalance: number;
}

interface DAO {
  name: string;
  governanceToken: {
    assetCode: string;
    totalSupply: number;
    distributed: number;
  };
}

export default function AdminToken() {
  const [dao, setDao] = useState<DAO | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Mint state
  const [mintUserId, setMintUserId] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/dao").then(r => r.json()),
      fetch("/api/members").then(r => r.json())
    ]).then(([d, m]) => {
      setDao(d.dao);
      setMembers(m.members || []);
      setLoading(false);
    });
  }, []);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setMinting(true);
    try {
      const res = await fetch("/api/token/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientUserId: mintUserId, amount: Number(mintAmount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Tokens minted and sent successfully!");
      setMintAmount("");
      
      // Refresh Data
      const mRes = await fetch("/api/members");
      const mData = await mRes.json();
      setMembers(mData.members || []);
      
      const dRes = await fetch("/api/dao");
      const dData = await dRes.json();
      setDao(dData.dao);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(msg);
    } finally {
      setMinting(false);
    }
  };

  if (loading || !dao) return null;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
         <h1 className="text-3xl font-bold gradient-text">Governance Token</h1>
         <p className="text-muted-foreground mt-1">Manage, mint, and distribute tokens</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="card-surface p-6 border-amber-500/20 text-center">
            <Coins className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{dao.governanceToken?.assetCode}</p>
            <p className="text-xs text-muted-foreground uppercase">Asset Code</p>
         </div>
         <div className="card-surface p-6 text-center">
            <p className="text-2xl font-bold text-sky-400 font-mono-hash mb-1">{dao.governanceToken?.totalSupply.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground uppercase">Total Supply Limit</p>
         </div>
         <div className="card-surface p-6 text-center">
            <p className="text-2xl font-bold text-indigo-400 font-mono-hash mb-1">{dao.governanceToken?.distributed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground uppercase">Distributed</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="card-surface p-6 border-sky-500/20">
            <h2 className="text-xl font-bold mb-6">Mint & Send Tokens</h2>
            <form onSubmit={handleMint} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Select Member</label>
                  <select 
                     required 
                     className="input-field" 
                     value={mintUserId} 
                     onChange={e => setMintUserId(e.target.value)}
                  >
                     <option value="" disabled>-- Select member --</option>
                     {members.map(m => (
                        <option key={m._id} value={m._id}>
                           {m.name || "Anonymous"} {m.linkedWallet ? `(${m.linkedWallet.slice(0,6)}...)` : '(No wallet)'}
                        </option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Amount</label>
                  <input 
                     type="number" 
                     required min="1" 
                     className="input-field font-mono-hash" 
                     placeholder="e.g. 1000" 
                     value={mintAmount} 
                     onChange={e => setMintAmount(e.target.value)}
                  />
               </div>
               <button 
                  type="submit" 
                  disabled={minting} 
                  className="btn-primary w-full flex justify-center items-center gap-2"
               >
                  {minting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {minting ? "Issuing FLOW tokens..." : "Mint & Send"}
               </button>
            </form>
         </div>

         <div className="card-elevated p-6">
            <h2 className="text-xl font-bold mb-4">Bulk Distribute</h2>
            <p className="text-sm text-muted-foreground mb-6">Upload a CSV mapped with user IDs and amounts to distribute tokens to multiple members at once.</p>
            
            <label className="border-2 border-dashed border-sky-500/30 hover:border-sky-500 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer">
               <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (!file) return;
                     
                     const Papa = await import("papaparse");
                     Papa.parse(file, {
                        header: true,
                        skipEmptyLines: true,
                        complete: async (results) => {
                           const distributions = (results.data as { userId?: string, id?: string, amount: string }[])
                              .map((row) => ({
                                 userId: row.userId || row.id,
                                 amount: Number(row.amount)
                              }))
                              .filter(d => d.userId && !isNaN(d.amount));
                           
                           if (distributions.length === 0) {
                              toast.error("No valid distribution data found in CSV");
                              return;
                           }

                           try {
                              const res = await fetch("/api/token/distribute", {
                                 method: "POST",
                                 headers: { "Content-Type": "application/json" },
                                 body: JSON.stringify({ distributions })
                              });
                              const data = await res.json();
                              
                              const successCount = (data.results as { success: boolean }[]).filter((r) => r.success).length;
                              toast.success(`Successfully distributed to ${successCount} members.`);
                              
                              // Refresh Data
                              fetch("/api/members").then(r => r.json()).then(m => setMembers(m.members || []));
                              fetch("/api/dao").then(r => r.json()).then(d => setDao(d.dao));
                           } catch (err: unknown) {
                              void err;
                              toast.error("Failed to process bulk distribution");
                           }
                        }
                     });
                  }}
               />
               <p className="text-sky-400 mb-2 font-bold">Click to Upload CSV</p>
               <p className="text-xs text-muted-foreground">Expected columns: userId, amount</p>
            </label>
         </div>
      </div>
    </div>
  );
}
