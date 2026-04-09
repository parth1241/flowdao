"use client";

import { useState, useEffect } from "react";
import { isConnected, getAddress } from "@stellar/freighter-api";
import { Loader2, Wallet } from "lucide-react";

export function WalletButton() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if connected on mount
    isConnected().then((connected) => {
      if (connected) getAddress().then(w => setWallet(w.address));
    });
  }, []);

  const connect = async () => {
    try {
      setLoading(true);
      if (await isConnected()) {
        const { address } = await getAddress();
        setWallet(address);
        
        // Link to user if logged in
        await fetch("/api/user/link-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address })
        });
      } else {
        alert("Please install Freighter wallet");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (wallet) {
    return (
      <button className="badge badge-sky" onClick={connect}>
        <Wallet className="w-3 h-3 mr-1" />
        {wallet.slice(0, 4)}...{wallet.slice(-4)}
      </button>
    );
  }

  return (
    <button className="btn-secondary flex items-center text-sm py-1.5" onClick={connect} disabled={loading}>
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wallet className="w-4 h-4 mr-2" />}
      Connect Wallet
    </button>
  );
}
