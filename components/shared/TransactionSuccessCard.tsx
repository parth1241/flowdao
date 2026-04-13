"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink, X, Wallet, Clock, Hash, Activity } from 'lucide-react';
import { Confetti } from './Confetti';

interface TransactionSuccessCardProps {
  title: string;
  subtitle: string;
  txHash: string;
  amount?: string;
  walletAddress?: string;
  walletBalance?: string;
  network?: string;
  timestamp?: string;
  extraDetails?: { label: string; value: string }[];
  onClose?: () => void;
  onViewExplorer?: () => void;
}

export function TransactionSuccessCard({
  title,
  subtitle,
  txHash,
  amount,
  walletAddress,
  walletBalance,
  network = "Stellar Testnet",
  timestamp = new Date().toLocaleString(),
  extraDetails,
  onClose,
  onViewExplorer
}: TransactionSuccessCardProps) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const copyHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {showConfetti && <Confetti />}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0d0d1f] border border-white/10 shadow-2xl"
      >
        <div className="relative p-8 flex flex-col items-center">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}

          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <Check className="text-emerald-500" size={40} />
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent mb-2 text-center uppercase tracking-tight italic">{title}</h2>
          <p className="text-muted-foreground mb-6 text-center text-sm font-medium">{subtitle}</p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-8">
            <Check size={10} /> {network}
          </div>

          {/* Wallet Section */}
          <div className="w-full bg-white/5 rounded-2xl p-5 mb-4 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Wallet size={14} />
                <span>Connected Wallet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-white uppercase">{truncateAddress(walletAddress || "")}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wallet Balance</div>
              <div className="text-xl font-black text-emerald-400 italic">
                {walletBalance || "0.00"} <span className="text-[10px] font-bold not-italic text-muted-foreground uppercase">XLM</span>
              </div>
            </div>
          </div>

          {/* Transaction Section */}
          <div className="w-full space-y-3 mb-8 px-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
              <span className="text-muted-foreground flex items-center gap-2"><Hash size={12} /> Hash</span>
              <button 
                onClick={copyHash}
                className="font-mono text-[10px] text-white/60 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-2 py-1 rounded normal-case tracking-normal"
              >
                {txHash.slice(0, 8)}...{txHash.slice(-8)}
                {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
              </button>
            </div>

            {amount && (
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                <span className="text-muted-foreground flex items-center gap-2"><Activity size={12} /> Amount</span>
                <span className="text-white font-black">{amount} XLM</span>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
              <span className="text-muted-foreground flex items-center gap-2"><Clock size={12} /> Timestamp</span>
              <span className="text-white/80 lowercase">{timestamp}</span>
            </div>

            {extraDetails?.map((detail, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="text-white">{detail.value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full font-sans">
            <button 
              onClick={onClose}
              className="rounded-xl border border-white/10 hover:bg-white/5 py-3 text-xs font-black uppercase tracking-widest transition-all"
            >
              Dismiss
            </button>
            <button 
              onClick={() => {
                window.open(`https://stellar.expert/explorer/testnet/tx/${txHash}`, '_blank')
                onViewExplorer?.()
              }}
              className="rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-[#0d0d1f] py-3 text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl"
            >
              Explorer <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
