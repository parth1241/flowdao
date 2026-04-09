"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/shared/Toast";

export const dynamic = "force-dynamic";

export default function MemberProfile() {
  const { data: session, update } = useSession();
  
  const [name, setName] = useState(session?.user?.name || "");
  const [avatarColor, setAvatarColor] = useState(session?.user?.avatarColor || "#0ea5e9");
  const [saving, setSaving] = useState(false);

  const NO_GREEN_COLORS = ["#0ea5e9", "#38bdf8", "#6366f1", "#8b5cf6", "#d946ef", "#06b6d4", "#f59e0b", "#f43f5e"];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
       const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, avatarColor })
       });
       if (!res.ok) throw new Error();
       
       await update({ ...session, user: { ...session?.user, name, avatarColor } });
       toast.success("Profile updated");
    } catch (err) {
       void err;
       toast.error("Failed to update profile");
    } finally {
       setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
         <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
         <p className="text-muted-foreground mt-1">Manage your identity and preferences</p>
      </div>

      <form onSubmit={handleSave} className="card-surface p-8 space-y-8">
         <div className="flex items-center gap-6">
            <div 
               className="w-24 h-24 rounded-full border-4 border-base shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors duration-300"
               style={{ backgroundColor: avatarColor }}
            />
            <div className="flex-1">
               <label className="block text-sm font-medium text-muted-foreground mb-3">Avatar Color</label>
               <div className="flex flex-wrap gap-2">
                  {NO_GREEN_COLORS.map(c => (
                     <button
                        key={c} type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${avatarColor === c ? "border-white scale-110 shadow-lg" : "border-transparent"}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setAvatarColor(c)}
                     />
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-4 pt-4 border-t border-sky-500/10">
            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
               <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="input-field max-w-md" 
               />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
               <input 
                  type="email" 
                  disabled 
                  value={session?.user?.email || ""} 
                  className="input-field max-w-md opacity-50 cursor-not-allowed" 
               />
            </div>
         </div>

         <div className="pt-4 flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary w-32">
               {saving ? "Saving..." : "Save"}
            </button>
         </div>
      </form>
    </div>
  );
}
