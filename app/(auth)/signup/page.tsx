"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Building } from "lucide-react";
import { toast } from "@/components/shared/Toast";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"member" | "admin">("member");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [daoName, setDaoName] = useState("");
  const [daoId, setDaoId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, daoName, daoId: daoId || undefined })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to sign up");
      
      toast.success("Account created successfully. Please log in.");
      router.push(`/login`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center py-20 px-4">
      <Link href="/" className="mb-12">
        <h1 className="text-3xl font-black gradient-text">FlowDAO</h1>
      </Link>

      <div className="w-full max-w-2xl">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-bold text-center mb-2">How do you want to participate?</h2>
            <p className="text-muted-foreground text-center mb-10">Choose your role in the ecosystem</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                type="button"
                onClick={() => { setRole("admin"); handleNext(); }}
                className="card-surface p-8 text-left hover:border-sky-500/40 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                  <Building size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">I&apos;m founding a DAO</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">✓ Deploy governance token</li>
                  <li className="flex gap-2">✓ Create proposals</li>
                  <li className="flex gap-2">✓ Manage treasury</li>
                </ul>
              </button>

              <button 
                type="button"
                onClick={() => { setRole("member"); handleNext(); }}
                className="card-surface p-8 text-left hover:border-indigo-500/40 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">I&apos;m joining a DAO</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">✓ Vote on proposals</li>
                  <li className="flex gap-2">✓ Hold governance tokens</li>
                  <li className="flex gap-2">✓ Shape the community</li>
                </ul>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card-elevated p-8 max-w-md mx-auto animate-in fade-in slide-in-from-right-8">
            <button type="button" onClick={() => setStep(1)} className="text-xs text-sky-400 mb-6 hover:underline">← Back</button>
            <h2 className="text-2xl font-bold mb-6">
              {role === "admin" ? "Create your DAO" : "Join a DAO"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {role === "admin" ? (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">DAO Name</label>
                  <input type="text" required value={daoName} onChange={e => setDaoName(e.target.value)} className="input-field border-sky-500/30" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">DAO ID (Invite code)</label>
                  <input type="text" value={daoId} onChange={e => setDaoId(e.target.value)} className="input-field border-indigo-500/30" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Your Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field" />
              </div>

              <button type="submit" disabled={loading} className={`btn-primary w-full mt-6 ${role==='admin' ? 'from-sky-500 to-indigo-500' : 'from-indigo-500 to-violet-500'}`}>
                {loading ? "Deploying..." : (role === "admin" ? "Deploy DAO Contracts" : "Join DAO")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
