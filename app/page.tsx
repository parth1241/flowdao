"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { env } from "@/lib/env";

export default function LandingPage() {
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const headlines = [
    "Your Community, Your Treasury",
    "On-Chain Governance",
    "Token-Weighted Voting",
    "Execute Proposals On-Chain"
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setHeadlineIdx(i => (i + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(id);
  }, [headlines.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Section 1 - Hero */}
        <section className="pt-24 pb-32 px-4 relative overflow-hidden">
          <div className="container mx-auto text-center max-w-6xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-sky mb-8 animate-bob1">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              Governance Powered by Soroban
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight min-h-[1.2em] md:min-h-[1.2em]">
              <span className="gradient-text transition-all duration-500">{headlines[headlineIdx]}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Create a DAO, issue governance tokens, vote on proposals, execute treasury spending — all enforced by Soroban smart contracts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/signup" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
                Launch Your DAO
              </Link>
              <Link href={`/dao/${env.NEXT_PUBLIC_DAO_ID}`} className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto">
                Explore Demo DAO
              </Link>
            </div>

            <div className="relative mx-auto max-w-5xl group">
               <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative card-surface rounded-2xl overflow-hidden border-sky-500/20 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/images/hero_dashboard.png" 
                    alt="FlowDAO Dashboard Mockup" 
                    className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Live Activity Ticker */}
        <div className="border-y border-sky-500/10 bg-base w-full overflow-hidden flex whitespace-nowrap py-3">
          <div className="animate-marquee flex gap-12 font-mono-hash text-sm text-muted-foreground">
            <span className="text-sky-400">Proposal #12 passed: &apos;Fund developer bounty 500 XLM&apos; — 78% voted FOR</span>
            <span className="text-indigo-400">New member joined: 0x4f2a...8b1c received 100 FLOW tokens</span>
            <span className="text-violet-400">Treasury executed: 250 XLM → 0x9c3b...2d7a</span>
            {/* Repeat for seamless loop */}
            <span className="text-sky-400">Proposal #12 passed: &apos;Fund developer bounty 500 XLM&apos; — 78% voted FOR</span>
            <span className="text-indigo-400">New member joined: 0x4f2a...8b1c received 100 FLOW tokens</span>
            <span className="text-violet-400">Treasury executed: 250 XLM → 0x9c3b...2d7a</span>
          </div>
        </div>

        {/* Section 3 - How It Works */}
        <section className="py-24 px-4 bg-surface/50">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-24 gradient-text">Built for Speed & Trust</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 border-t-2 border-dashed border-sky-500/30 z-0"></div>
              
              <div className="relative z-10 text-center space-y-6 group">
                <div className="w-24 h-24 mx-auto rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] group-hover:scale-110 transition-all duration-500">
                   <div className="text-sky-400">
                      <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                   </div>
                </div>
                <div>
                   <h3 className="font-bold text-xl text-sky-400 mb-2">1. Create DAO</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Instantly initialize your community treasury and core governance rules.</p>
                </div>
              </div>

              <div className="relative z-10 text-center space-y-6 group">
                <div className="w-24 h-24 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-all duration-500">
                   <div className="text-indigo-400">
                      <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="12" x2="12" y2="8"></line><line x1="12" y1="12" x2="16" y2="12"></line></svg>
                   </div>
                </div>
                <div>
                   <h3 className="font-bold text-xl text-indigo-400 mb-2">2. Issue Tokens</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Distribute weighted voting power to your members with Soroban assets.</p>
                </div>
              </div>

              <div className="relative z-10 text-center space-y-6 group">
                <div className="w-24 h-24 mx-auto rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] group-hover:scale-110 transition-all duration-500">
                   <div className="text-violet-400">
                      <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   </div>
                </div>
                <div>
                   <h3 className="font-bold text-xl text-violet-400 mb-2">3. Vote</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Submit proposals and cast votes. All signatures secured by Freighter.</p>
                </div>
              </div>

              <div className="relative z-10 text-center space-y-6 group">
                <div className="w-24 h-24 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-all duration-500">
                   <div className="text-amber-400">
                      <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                   </div>
                </div>
                <div>
                   <h3 className="font-bold text-xl text-amber-400 mb-2">4. Auto Execute</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Approved transactions fire automatically. On-chain, trustless execution.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 - Stats Banner */}
        <section className="py-24 px-4 bg-gradient-to-b from-surface/50 to-base">
          <div className="container mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-surface p-12 text-center border-sky-500/20 shadow-xl group hover:border-sky-500/50 transition-all duration-500">
                  <p className="text-6xl font-black text-sky-400 mb-4 group-hover:scale-110 transition-transform">47</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Proposals Passed</p>
                </div>
                <div className="card-surface p-12 text-center border-indigo-500/20 shadow-xl group hover:border-indigo-500/50 transition-all duration-500">
                  <p className="text-6xl font-black text-indigo-400 mb-4 group-hover:scale-110 transition-transform">892K</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">XLM Governed</p>
                </div>
                <div className="card-surface p-12 text-center border-violet-500/20 shadow-xl group hover:border-violet-500/50 transition-all duration-500">
                  <p className="text-6xl font-black text-violet-400 mb-4 group-hover:scale-110 transition-transform">100%</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">On-Chain Safety</p>
                </div>
             </div>
          </div>
        </section>

        {/* Section 5 - Features Grid */}
        <section className="py-24 px-4 bg-surface/50 border-y border-sky-500/10">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Enterprise Grade Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Token-Weighted Voting", color: "text-sky-400 border-sky-500/20", desc: "More tokens = more voting power" },
                { title: "Timelock Protection", color: "text-indigo-400 border-indigo-500/20", desc: "48hr delay prevents rushed execution" },
                { title: "Treasury Control", color: "text-violet-400 border-violet-500/20", desc: "Smart contract holds + releases funds" },
                { title: "Soroban Enforced", color: "text-fuchsia-400 border-fuchsia-500/20", desc: "Rules in code, not promises" },
                { title: "Full Audit Trail", color: "text-amber-400 border-amber-500/20", desc: "Every vote a Stellar transaction" },
                { title: "Quorum Required", color: "text-rose-400 border-rose-500/20", desc: "Majority must participate" },
              ].map((f, i) => (
                <div key={i} className={`card-hover card-surface p-6 ${f.color.split(" ")[1]}`}>
                  <h3 className={`font-semibold text-lg mb-2 ${f.color.split(" ")[0]}`}>{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
