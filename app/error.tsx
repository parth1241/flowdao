"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <div className="card-surface p-8 max-w-md w-full text-center border-rose-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-sky-500" />
        <AlertOctagon className="w-16 h-16 text-rose-400 mx-auto mb-4 animate-shake" />
        <h2 className="text-2xl font-black text-foreground mb-4">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-8">
           The operation failed or the Soroban network couldn&apos;t be reached.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-secondary" onClick={() => reset()}>Try Again</button>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
