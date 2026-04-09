"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { WalletButton } from "./WalletButton";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-base/80 border-b border-sky-500/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white">
            <span className="font-bold leading-none -mt-0.5">F</span>
          </div>
          <span className="gradient-text text-2xl font-black">FlowDAO</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-sky-400 transition-colors">About</Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-sky-400 transition-colors">Blog</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-sky-400 transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href={session.user.role === "admin" ? "/admin/dashboard" : "/member/dashboard"} className="text-sm font-medium text-muted-foreground hover:text-sky-400">
                Dashboard
              </Link>
              <WalletButton />
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-sky-400">Log In</Link>
              <Link href="/signup" className="btn-primary text-sm">Launch DAO</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
