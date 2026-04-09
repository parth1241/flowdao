"use client";

import { useEffect, useState } from "react";
import { MemberCard } from "@/components/shared/MemberCard";
import { toast } from "@/components/shared/Toast";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Member {
  _id: string;
  userId: string;
  name?: string;
  email: string;
  role: string;
  tokenBalance: number;
  linkedWallet?: string;
  joinedAt: string | Date;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    fetch("/api/members")
      .then(r => r.json())
      .then(d => {
        setMembers(d.members || []);
        setLoading(false);
      });
  };

  const handleAdjustRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateRole", role })
      });
      if (res.ok) {
         toast.success("Role updated");
         fetchMembers();
      } else throw new Error();
    } catch (err) {
      void err;
      toast.error("Failed to update role");
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`/api/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove" })
      });
      if (res.ok) {
         toast.success("Member removed");
         fetchMembers();
      } else throw new Error();
    } catch (err) {
      void err;
      toast.error("Failed to remove member");
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
         <div>
            <h1 className="text-3xl font-bold gradient-text">Members</h1>
            <p className="text-muted-foreground mt-1">{members.length} total members in DAO</p>
         </div>
         <Link href="/admin/token" className="btn-primary">
            Distribute Tokens
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {members.map(m => (
            <MemberCard 
               key={m._id} 
               member={m} 
               showActions 
               onAdjustRole={handleAdjustRole} 
               onRemove={handleRemove} 
            />
         ))}
      </div>
    </div>
  );
}
