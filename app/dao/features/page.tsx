"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Shield, Zap, Coins, Users, BarChart3, Clock, Database, FileJson } from "lucide-react";
import Link from "next/link";

const FEATURE_CARDS = [
  {
    icon: <Shield className="w-8 h-8 text-sky-400" />,
    title: "Soroban Protection",
    desc: "Every proposal execution is enforced directly by WASM-based smart contracts on the Stellar network. Code is law."
  },
  {
    icon: <Zap className="w-8 h-8 text-indigo-400" />,
    title: "Instant Settlement",
    desc: "No more waiting days for treasury releases. Approved proposals execute in seconds once the consensus is reached."
  },
  {
    icon: <Coins className="w-8 h-8 text-violet-400" />,
    title: "Multi-Asset Treasury",
    desc: "Manage XLM and any Stellar-native assets in a shared community vault secured by multi-signature protocols."
  },
  {
    icon: <Users className="w-8 h-8 text-fuchsia-400" />,
    title: "Custom Voting Models",
    desc: "From simple 1-token-1-vote to complex quadratic voting or delegated models, all configurable via contract parameters."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
    title: "Real-time Analytics",
    desc: "Track voter participation, treasury health, and proposal success rates with live on-chain data visualizations."
  },
  {
    icon: <Clock className="w-8 h-8 text-amber-400" />,
    title: "Programmable Timelocks",
    desc: "Add safety buffers to proposal execution. Give the community time to review passed votes before funds move."
  },
  {
    icon: <Database className="w-8 h-8 text-sky-500" />,
    title: "Immutable History",
    desc: "Every vote, proposal, and distribution is permanently etched into the Stellar ledger for full auditability."
  },
  {
    icon: <FileJson className="w-8 h-8 text-indigo-500" />,
    title: "Developer APIs",
    desc: "Hook your DAO into external apps. Use our pre-built SDKs to trigger DAO actions from your own software."
  }
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-24 px-4 container mx-auto">
        {/* Hero */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-sky mb-8">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            Empowering the next generation of DAOs
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 gradient-text leading-tight min-h-[1.2em] md:min-h-[1.2em]">
            Full-Spectrum Governance Control
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            FlowDAO provides the tools you need to launch, manage, and scale decentralized organizations on Stellar with institutional-grade security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {FEATURE_CARDS.map((f, i) => (
            <div key={i} className="card-hover card-surface p-8 group transition-all duration-500 hover:border-sky-500/50">
              <div className="mb-6 p-3 w-fit rounded-2xl bg-base border border-sky-500/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Section: Comparison */}
        <div className="card-elevated p-12 mb-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Soroban?</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Traditional multisig wallets rely on human trust. Soroban-based DAOs rely on mathematical proof. 
                With FlowDAO, the treasury cannot spend a single stroop unless the contract satisfies the exact 
                voting requirements defined in your governance rules.
              </p>
              <ul className="space-y-4">
                {[
                  "No single point of failure (admins cannot go rogue)",
                  "Automatic enforcement of meeting quorums",
                  "Trustless treasury distribution to any account",
                  "Standardized, audited smart contract templates"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <Zap className="w-3 h-3" fill="currentColor" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-sky-500/20 flex items-center justify-center p-8">
                 <div className="card-surface p-8 shadow-2xl relative z-10 w-full animate-bob1">
                    <div className="flex justify-between items-center mb-8 border-b border-sky-500/10 pb-4">
                       <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Smart Contract State</span>
                       <span className="badge badge-sky">Verified</span>
                    </div>
                    <div className="space-y-6">
                       <div className="h-2 w-3/4 bg-sky-500/20 rounded" />
                       <div className="h-2 w-1/2 bg-indigo-500/20 rounded" />
                       <div className="h-2 w-5/6 bg-violet-500/20 rounded" />
                    </div>
                    <div className="mt-12 p-4 rounded-xl bg-base border border-sky-500/20 flex flex-col items-center">
                       <BAR_CHART_STUB />
                       <p className="text-xs text-sky-400 font-mono-hash mt-2 uppercase">On-chain Participation: 84%</p>
                    </div>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-sky-500/20 blur-3xl animate-pulse" />
                 <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-surface border border-sky-500/10 rounded-3xl p-16 shadow-2xl">
           <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to lead your community?</h2>
           <p className="text-muted-foreground mb-10 text-lg max-w-2xl mx-auto">
             Join the growing ecosystem of DAOs managing assets and making decisions on the most efficient network in crypto.
           </p>
           <Link href="/signup" className="btn-primary text-lg px-12 py-4 shadow-[0_0_30px_rgba(14,165,233,0.4)]">
             Get Started for Free
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BAR_CHART_STUB() {
   return (
      <div className="flex items-end gap-1 h-20">
         <div className="w-3 bg-sky-500 rounded-t h-[40%] animate-pulse" />
         <div className="w-3 bg-indigo-500 rounded-t h-[70%] animate-pulse" style={{ animationDelay: '0.2s' }} />
         <div className="w-3 bg-violet-500 rounded-t h-[90%] animate-pulse" style={{ animationDelay: '0.4s' }} />
         <div className="w-3 bg-fuchsia-500 rounded-t h-[60%] animate-pulse" style={{ animationDelay: '0.6s' }} />
         <div className="w-3 bg-sky-500 rounded-t h-[80%] animate-pulse" style={{ animationDelay: '0.8s' }} />
      </div>
   );
}
