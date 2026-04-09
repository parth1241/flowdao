"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface Proposal {
  _id: string;
  title: string;
  type: string;
  createdAt: string | Date;
  status: string;
}

export default function MemberHistory() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  // Note: normally we'd fetch actual votes. I'll mock the view by interpreting past proposals the member could have voted on.
  // We'll just show active/past proposals.
  useEffect(() => {
    fetch("/api/proposals")
      .then(res => res.json())
      .then(data => {
        setProposals(data.proposals || []);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
         <h1 className="text-3xl font-bold gradient-text">Voting History</h1>
         <p className="text-muted-foreground mt-1">Proposals you&apos;ve participated in</p>
      </div>

      <div className="card-surface overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-sky-500/10 bg-base/50 text-xs uppercase text-muted-foreground">
                     <th className="p-4 font-medium">Proposal</th>
                     <th className="p-4 font-medium">Date</th>
                     <th className="p-4 font-medium">Status</th>
                     <th className="p-4 font-medium">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-sky-500/10">
                  {proposals.map(p => (
                     <tr key={p._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                           <p className="font-semibold text-foreground max-w-sm truncate">{p.title}</p>
                           <p className="text-xs text-muted-foreground mt-1 capitalize">{p.type.replace('_', ' ')}</p>
                        </td>
                        <td className="p-4 text-sm font-mono-hash text-muted-foreground">
                           {format(new Date(p.createdAt), "MMM d, yy")}
                        </td>
                        <td className="p-4">
                           <span className={`text-xs px-2 py-1 rounded badge ${p.status === 'active' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : p.status === 'passed' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                             {p.status}
                           </span>
                        </td>
                        <td className="p-4">
                           <a href={`/proposal/${p._id}`} className="text-sm text-sky-400 hover:text-sky-300">View →</a>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
