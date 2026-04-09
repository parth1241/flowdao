"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/shared/Toast";
import { Confetti } from "@/components/shared/Confetti";

export default function NewProposal() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [type, setType] = useState("treasury_spend");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [closesAt, setClosesAt] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(0);

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, type,
          amount: type === "treasury_spend" ? Number(amount) : undefined,
          recipient: type === "treasury_spend" ? recipient : undefined,
          closesAt: new Date(closesAt)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (publish) {
         const freighter = await import("@stellar/freighter-api");
         if (!await freighter.isConnected()) throw new Error("Wallet not connected");
         const { address } = await freighter.getAddress();
         
         const { createProposal } = await import("@/lib/soroban");
         const { txHash: resultTxHash } = await createProposal(address, {
            title, description, type, amount: Number(amount), recipient, closesAt
         });
         
         await fetch(`/api/proposals/${data.proposal._id}/publish`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ txHash: resultTxHash })
         });
         
         toast.success("Proposal published to Soroban!");
         setTriggerConfetti(Date.now());
      } else {
         toast.success("Draft saved");
      }

      setTimeout(() => {
         router.push(`/admin/proposals/${data.proposal._id}`);
      }, publish ? 1500 : 500);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl relative">
      <Confetti trigger={triggerConfetti} />
      <h1 className="text-3xl font-bold gradient-text mb-8">Create Proposal</h1>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold mb-6">Select Proposal Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
               className={`card-surface p-6 text-left border-2 transition-all ${type === "treasury_spend" ? "border-sky-500 bg-sky-500/5 shadow-[0_0_15px_rgba(14,165,233,0.3)]" : "border-sky-500/10 hover:border-sky-500/50"}`}
               onClick={() => setType("treasury_spend")}
            >
               <h3 className="font-bold text-sky-400 mb-2">Treasury Spend</h3>
               <p className="text-sm text-muted-foreground">Spend from DAO treasury</p>
            </button>
            <button 
               className={`card-surface p-6 text-left border-2 transition-all ${type === "text" ? "border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "border-amber-500/10 hover:border-amber-500/50"}`}
               onClick={() => setType("text")}
            >
               <h3 className="font-bold text-amber-400 mb-2">Text Proposal</h3>
               <p className="text-sm text-muted-foreground">General governance decision</p>
            </button>
            <button 
               className={`card-surface p-6 text-left border-2 transition-all ${type === "rate_change" ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "border-indigo-500/10 hover:border-indigo-500/50"}`}
               onClick={() => setType("rate_change")}
            >
               <h3 className="font-bold text-indigo-400 mb-2">Rate Change</h3>
               <p className="text-sm text-muted-foreground">Change DAO parameters</p>
            </button>
            <button 
               className={`card-surface p-6 text-left border-2 transition-all ${type === "member_add" ? "border-violet-500 bg-violet-500/5 shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "border-violet-500/10 hover:border-violet-500/50"}`}
               onClick={() => setType("member_add")}
            >
               <h3 className="font-bold text-violet-400 mb-2">Member Action</h3>
               <p className="text-sm text-muted-foreground">Add or remove a member</p>
            </button>
          </div>
          <div className="mt-8 flex justify-end">
             <button className="btn-primary" onClick={() => setStep(2)}>Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form className="animate-in fade-in slide-in-from-right-8 space-y-6">
          <div className="card-surface p-6 space-y-4 border-sky-500/20">
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="input-field text-lg font-semibold" placeholder="Title of proposal" />
             </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="input-field h-32" placeholder="Full details and rationale..." />
             </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Closes At</label>
                <input type="datetime-local" required value={closesAt} onChange={e => setClosesAt(e.target.value)} className="input-field font-mono-hash text-sm" />
             </div>
          </div>

          {type === "treasury_spend" && (
             <div className="card-surface p-6 space-y-4 border-rose-500/20">
                <h3 className="font-bold text-rose-400 mb-2">Treasury Parameters</h3>
                <div>
                   <label className="block text-sm font-medium text-muted-foreground mb-1">Amount (XLM)</label>
                   <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="input-field font-mono-hash" placeholder="e.g. 500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-muted-foreground mb-1">Recipient Stellar Address</label>
                   <input type="text" required value={recipient} onChange={e => setRecipient(e.target.value)} className="input-field font-mono-hash text-xs" placeholder="G..." />
                </div>
             </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-sky-500/10">
             <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
             <div className="flex gap-4">
                 <button type="button" disabled={loading} className="btn-secondary" onClick={e => handleSubmit(e, false)}>Save as Draft</button>
                 <button type="button" disabled={loading} className="btn-primary flex items-center gap-2" onClick={e => handleSubmit(e, true)}>
                    {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    Publish Now
                 </button>
             </div>
          </div>
        </form>
      )}
    </div>
  );
}
