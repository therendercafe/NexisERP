"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from "recharts";

const COLORS = ['#00f2ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function RevenueDistribution({ data }: { data: any[] }) {
  return (
    <div className="h-full w-full bg-card/50 backdrop-blur-xl border border-border rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Category Market Share</h3>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
              itemStyle={{ color: '#00f2ff', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.slice(0, 4).map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
            <span className="text-[9px] font-black uppercase tracking-tighter truncate text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfitTrend({ data }: { data: any[] }) {
  return (
    <div className="h-full w-full bg-card/50 backdrop-blur-xl border border-border rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Profit vs Revenue Matrix</h3>
        <div className="flex gap-1">
          <div className="w-3 h-1 rounded-full bg-primary" />
          <div className="w-3 h-1 rounded-full bg-emerald-500" />
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#444" fontSize={9} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
              itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#00f2ff" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
            <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProf)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function EfficiencyBar({ data }: { data: any[] }) {
  return (
    <div className="h-full w-full bg-card/50 backdrop-blur-xl border border-border rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Operational Performance</h3>
        <span className="text-[8px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Real-time</span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#444" fontSize={9} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip 
               cursor={{ fill: 'rgba(255,255,255,0.05)' }}
               contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
               itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f2ff' }}
            />
            <Bar dataKey="revenue" fill="#00f2ff" radius={[6, 6, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

