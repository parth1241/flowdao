"use client";

import { formatDistanceToNowStrict } from "date-fns";

interface MemberProps {
  member: {
    avatarColor?: string;
    name?: string;
    linkedWallet?: string;
    votingPowerPercent?: number;
    joinedAt: string | Date;
    role: string;
    userId: string;
  };
  showActions?: boolean;
  onAdjustRole?: (userId: string, role: string) => void;
  onRemove?: (userId: string) => void;
}

export function MemberCard({ member, showActions, onAdjustRole, onRemove }: MemberProps) {
  return (
    <div className="card-surface p-4 flex items-center gap-4">
      <div 
        className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-base shadow-lg"
        style={{ backgroundColor: member.avatarColor || '#0ea5e9' }}
      />
      <div className="flex-grow min-w-0">
        <h4 className="font-medium text-foreground truncate">{member.name || 'Anonymous User'}</h4>
        <p className="text-xs text-muted-foreground font-mono-hash truncate">
          {member.linkedWallet ? `${member.linkedWallet.slice(0,6)}...${member.linkedWallet.slice(-4)}` : 'No wallet linked'}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs">
          <span className="text-sky-400 font-medium">{(member.votingPowerPercent || 0).toFixed(1)}% Power</span>
          <span className="text-slate-500">Joined {formatDistanceToNowStrict(new Date(member.joinedAt))} ago</span>
        </div>
      </div>
      
      {showActions && (
        <div className="flex flex-col gap-2">
          {member.role !== "admin" && (
            <button 
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              onClick={() => onAdjustRole && onAdjustRole(member.userId, "admin")}
            >
              Make Admin
            </button>
          )}
          {member.role === "admin" && (
            <button 
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
              onClick={() => onAdjustRole && onAdjustRole(member.userId, "member")}
            >
              Make Member
            </button>
          )}
          <button 
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
            onClick={() => onRemove && onRemove(member.userId)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
