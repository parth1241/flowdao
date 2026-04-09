"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface ChartData {
  date: number | string | Date;
  balance: number;
}

export function TreasuryChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-muted-foreground">No treasury data available</div>;
  }

  // Formatting utility for tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: number | string | Date }) => {
    if (active && payload && payload.length && label) {
      return (
        <div className="card-surface p-3 text-sm">
          <p className="text-muted-foreground mb-1">{format(new Date(label), "MMM d, yyyy")}</p>
          <p className="text-sky-400 font-mono-hash font-bold">
            {payload[0].value.toLocaleString()} XLM
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.1)" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#475569" 
          tickFormatter={(val) => format(new Date(val), "MMM d")}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#475569" 
          tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="balance" 
          stroke="#6366f1" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorBalance)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
