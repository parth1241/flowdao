"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/shared/WalletButton";
import { LogOut, Home, FileText, Landmark, Users, Coins, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <Home size={18} />, color: "text-sky-400 border-sky-400" },
    { name: "New Proposal", href: "/admin/proposals/new", icon: <FileText size={18} />, color: "text-indigo-400 border-indigo-400" },
    { name: "Treasury", href: "/admin/treasury", icon: <Landmark size={18} />, color: "text-violet-400 border-violet-400" },
    { name: "Members", href: "/admin/members", icon: <Users size={18} />, color: "text-fuchsia-400 border-fuchsia-400" },
    { name: "Token", href: "/admin/token", icon: <Coins size={18} />, color: "text-amber-400 border-amber-400" },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={18} />, color: "text-slate-400 border-slate-400" },
  ];

  return (
    <div className="flex min-h-screen bg-base">
      <aside className="w-64 bg-[#000d1a] border-r border-sky-500/10 flex flex-col fixed h-full z-20 hidden md:flex">
         <div className="h-16 flex items-center px-6 border-b border-sky-500/10">
            <Link href="/" className="font-bold text-xl tracking-tight hidden md:inline-block">
              <span className="gradient-text">FlowDAO</span>
            </Link>
         </div>

         <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const active = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? `bg-sky-500/10 ${item.color.split(" ")[0]} border-l-2 ${item.color.split(" ")[1]}` : "text-muted-foreground hover:bg-white/5 hover:text-foreground border-l-2 border-transparent"}`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
         </nav>

         <div className="p-4 border-t border-sky-500/10 space-y-4">
            <WalletButton />
            <button className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 transition-colors w-full px-3 py-2" onClick={() => signOut()}>
              <LogOut size={16} /> Sign out
            </button>
         </div>
      </aside>

      <main className="flex-1 w-full md:pl-64 flex flex-col">
         {/* Mobile nav placeholder and header */}
         <div className="md:hidden h-16 border-b border-sky-500/10 flex items-center justify-between px-4 bg-[#000d1a] top-0 sticky z-20">
            <span className="gradient-text font-bold">FlowDAO Admin</span>
         </div>
         <div className="p-4 md:p-8 flex-1 animate-in fade-in">
            {children}
         </div>
      </main>
    </div>
  );
}
