"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/shared/Toast";

export const dynamic = "force-dynamic";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quorumPercent, setQuorumPercent] = useState(51);
  const [timelockHours, setTimelockHours] = useState(48);

  useEffect(() => {
    fetch("/api/dao").then(res => res.json()).then(data => {
      setName(data.dao?.name || "");
      setDescription(data.dao?.description || "");
      setQuorumPercent(data.dao?.quorumPercent || 51);
      setTimelockHours(data.dao?.timelockHours || 48);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dao/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, quorumPercent, timelockHours })
      });
      if (res.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
         <h1 className="text-3xl font-bold gradient-text">Settings</h1>
         <p className="text-muted-foreground mt-1">Manage global DAO parameters</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
         <div className="card-surface p-6 space-y-4">
            <h2 className="text-xl font-bold border-b border-sky-500/10 pb-2 mb-4">General Information</h2>
            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-1">DAO Name</label>
               <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="input-field max-w-full" 
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
               <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="input-field h-24" 
               />
            </div>
         </div>

         <div className="card-surface p-6 space-y-6 border-indigo-500/20">
            <h2 className="text-xl font-bold border-b border-sky-500/10 pb-2">Governance Parameters</h2>
            
            <div>
               <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-muted-foreground">Quorum Requirement</label>
                  <span className="text-sm font-bold text-sky-400">{quorumPercent}%</span>
               </div>
               <input 
                  type="range" 
                  min="1" max="100" 
                  value={quorumPercent} 
                  onChange={e => setQuorumPercent(parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer" 
               />
               <p className="text-xs text-muted-foreground mt-2">Percentage of total distributed tokens that must participate for a proposal to pass.</p>
            </div>

            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-2">Timelock Period (Hours)</label>
               <div className="flex bg-base rounded-md p-1 border border-sky-500/20 w-max">
                  {[0, 24, 48, 72].map(hrs => (
                     <button
                        key={hrs}
                        type="button"
                        className={`px-4 py-1 rounded text-sm transition-colors ${timelockHours === hrs ? "bg-indigo-500 text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setTimelockHours(hrs)}
                     >
                        {hrs}h
                     </button>
                  ))}
               </div>
               <p className="text-xs text-muted-foreground mt-2">Delay between a proposal passing and being eligible for execution.</p>
            </div>
         </div>

         <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary w-48">
               {saving ? "Saving..." : "Save Changes"}
            </button>
         </div>
      </form>

      <div className="mt-12 pt-8 border-t border-rose-500/20">
         <div className="card-surface p-6 border-rose-500/20 bg-rose-500/5">
            <h2 className="text-xl font-bold text-rose-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">Once you archive a DAO, it cannot be undone. All active proposals will be cancelled.</p>
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
               Archive DAO
            </button>
         </div>
      </div>
    </div>
  );
}
