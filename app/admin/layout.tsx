"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/shared/WalletButton";
import { LogOut, Home, FileText, Landmark, Users, Coins, Settings, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { signOut } from "next-auth/react";
import WalletStatusBar from '@/components/shared/WalletStatusBar';
import Level1StatusBadge from '@/components/shared/Level1StatusBadge';
import { Networks } from '@stellar/stellar-sdk';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
    { name: "Dashboard", href: "/admin/dashboard", icon: <Home size={18} />, color: "text-emerald-400 border-emerald-400" },
    { name: "New Proposal", href: "/admin/proposals/new", icon: <FileText size={18} />, color: "text-indigo-400 border-indigo-400" },
    { name: "Treasury", href: "/admin/treasury", icon: <Landmark size={18} />, color: "text-violet-400 border-violet-400" },
    { name: "Members", href: "/admin/members", icon: <Users size={18} />, color: "text-fuchsia-400 border-fuchsia-400" },
    { name: "Token", href: "/admin/token", icon: <Coins size={18} />, color: "text-amber-400 border-amber-400" },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={18} />, color: "text-slate-400 border-slate-400" },
  ];

  return (
    <div className="flex min-h-screen bg-base relative overflow-hidden">
      <aside className="w-64 bg-[#000d1a] border-r border-emerald-500/10 flex flex-col fixed h-full z-[101] hidden md:flex shrink-0 transition-all">
         <div className="h-16 flex items-center px-6 border-b border-emerald-500/10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
                 <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase group-hover:text-emerald-400 transition-colors">FlowDAO</span>
            </Link>
         </div>

         <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const active = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard");
              const activeColor = item.color.split(" ")[0];
              const activeBorder = item.color.split(" ")[1];

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group border-l-2 ${active ? `bg-emerald-500/5 ${activeColor} ${activeBorder}` : "text-muted-foreground hover:bg-white/5 hover:text-white border-transparent"}`}
                >
                  <div className={`${active ? activeColor : "text-muted-foreground group-hover:text-white"} transition-colors`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
         </nav>

         <div className="p-4 border-t border-emerald-500/10 space-y-4 bg-black/20">
            <div className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">SysAdmin Active</span>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors w-full px-4 py-3 rounded-xl hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 group" onClick={() => signOut()}>
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" /> 
              Purge Session
            </button>
         </div>
      </aside>

      <main className="flex-1 w-full md:pl-64 flex flex-col relative z-10 min-w-0">
         {wrongNetwork && (
           <div className="w-full bg-rose-600 text-white py-2 px-4 flex items-center justify-center gap-2 z-[100] animate-in slide-in-from-top duration-300">
             <AlertTriangle className="h-4 w-4" />
             <span className="text-xs font-bold uppercase tracking-wider text-center">
               Network Mismatch: Switch Freighter to Stellar Testnet for FlowDAO
             </span>
           </div>
         )}
         <WalletStatusBar />
         <div className="md:hidden h-16 border-b border-emerald-500/10 flex items-center justify-between px-6 bg-[#000d1a] top-0 sticky z-50">
            <span className="text-emerald-500 font-black italic tracking-tighter uppercase">FlowDAO <span className="text-[10px] not-italic text-white/50">Admin</span></span>
            <WalletButton />
         </div>
         <div className="p-6 md:p-12 flex-1 relative">
            <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
            {children}
         </div>
         <Level1StatusBadge />
      </main>
    </div>
  );
}
