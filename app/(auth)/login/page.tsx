"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { WalletButton } from "@/components/shared/WalletButton";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  
  const [role, setRole] = useState<"member" | "admin">("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      rememberMe: remember ? "true" : "false"
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      if (returnUrl) router.push(returnUrl);
      else router.push(`/${role}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8">
        <h1 className="text-4xl font-black gradient-text">FlowDAO</h1>
        <p className="text-muted-foreground text-sm text-center tracking-widest uppercase mt-2">On-Chain Governance</p>
      </Link>

      <div className={`card-elevated w-full max-w-md p-8 ${error ? 'animate-shake' : ''}`}>
        
        <div className="flex bg-surface rounded-lg p-1 border border-sky-500/20 mb-8">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === "member" ? "bg-sky-500 shadow-lg text-white" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setRole("member")}
          >
            Member
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === "admin" ? "bg-indigo-500 shadow-lg text-white" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm font-medium text-rose-400 bg-rose-500/10 p-3 rounded-md border border-rose-500/20">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="input-field" 
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input 
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="input-field" 
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded border-sky-500/50 bg-base text-sky-500 focus:ring-sky-500" />
              Remember me
            </label>
            <a href="#" className="text-sm text-sky-400 hover:text-sky-300">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} className={`btn-primary w-full mt-4 ${role==='admin' ? 'from-indigo-500 to-violet-500' : ''}`}>
            {loading ? "Signing in..." : (role === "admin" ? "Access Admin Portal" : "Log in to DAO")}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sky-500/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-elevated text-muted-foreground">Or connect with</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
           <WalletButton />
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Don&apos;t have an account? <Link href="/signup" className="text-sky-400 hover:underline font-bold">Sign up here</Link>
      </p>
    </div>
  );
}
