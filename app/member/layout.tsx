"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/shared/WalletButton";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Dashboard", href: "/member/dashboard" },
    { name: "History", href: "/member/history" },
    { name: "Profile", href: "/member/profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-base">
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-base/80 border-b border-sky-500/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold flex items-center gap-2">
            <span className="gradient-text text-xl">FlowDAO</span>
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
             {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${active ? "text-sky-400" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.name}
                  </Link>
                );
             })}
          </nav>

          <div className="flex items-center gap-4">
             <WalletButton />
             <button onClick={() => signOut()} className="text-muted-foreground hover:text-rose-400" title="Sign Out">
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 container mx-auto">
         {children}
      </main>
    </div>
  );
}
