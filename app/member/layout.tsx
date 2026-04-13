"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/shared/WalletButton";
import { LogOut, AlertTriangle, ShieldCheck, Zap, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import WalletStatusBar from '@/components/shared/WalletStatusBar';
import Level1StatusBadge from '@/components/shared/Level1StatusBadge';
import { MobilePreviewBanner } from '@/components/shared/MobilePreviewBanner';
import { Networks } from '@stellar/stellar-sdk';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    async function checkNetwork() {
      if (typeof window === 'undefined') return
      try {
        const { getNetworkDetails } = await import('@stellar/freighter-api')
        const details = await getNetworkDetails()
        if (details.networkPassphrase !== Networks.TESTNET) {
          setWrongNetwork(true)
        } else {
          setWrongNetwork(false)
        }
      } catch {
        // Freighter not installed
      }
    }
    checkNetwork()
    const interval = setInterval(checkNetwork, 10000)
    return () => clearInterval(interval)
  }, [])
  
  const navItems = [
    { name: "Dashboard", href: "/member/dashboard" },
    { name: "History", href: "/member/history" },
    { name: "Profile", href: "/member/profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-base relative overflow-hidden">
      <header className="sticky top-0 z-[100] w-full backdrop-blur-xl bg-base/80 border-b border-sky-500/10 h-16 shrink-0 h-16 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
               <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black italic tracking-tighter text-white uppercase group-hover:text-emerald-400 transition-colors">FlowDAO</span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
             {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${active ? "text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "text-muted-foreground hover:text-white"}`}
                  >
                    {item.name}
                  </Link>
                );
             })}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white p-2"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-6">
             <WalletButton />
             <div className="h-6 w-px bg-white/10" />
             <button onClick={() => signOut()} className="text-muted-foreground hover:text-rose-400 transition-colors group" title="Purge Session">
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
             </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {sidebarOpen && (
          <div className="absolute top-16 left-0 w-full bg-base border-b border-sky-500/10 p-4 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-300">
            {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2 border-b border-white/5 ${active ? "text-emerald-400" : "text-muted-foreground hover:text-white"}`}
                  >
                    {item.name}
                  </Link>
                );
             })}
          </div>
        )}
      </header>

      {wrongNetwork && (
        <div className="w-full bg-rose-600 text-white py-2 px-4 flex items-center justify-center gap-2 z-[100] animate-in slide-in-from-top duration-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider text-center">
            Network Mismatch: Switch Freighter to Stellar Testnet for FlowDAO
          </span>
        </div>
      )}
      <WalletStatusBar />

      <main className="flex-1 py-8 px-6 container mx-auto relative z-10">
         <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
         {children}
      </main>

      <Level1StatusBadge />
      <MobilePreviewBanner />
    </div>
  );
}
