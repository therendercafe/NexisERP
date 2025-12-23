"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartProps {
  data?: any[];
}

export function RevenueChart({ data: propData }: ChartProps) {
  // Use revenue as dataKey to match the server action
  const data = propData || [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="h-[300px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: 'hsl(var(--primary))' }}
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            strokeWidth={4}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = ['#00f2ff', '#10b981', '#f59e0b', '#ef4444'];

export function InventoryVelocityPie({ healthy, lowStock, outOfStock }: { healthy: number, lowStock: number, outOfStock: number }) {
  const data = [
    { name: 'Healthy', value: healthy || 0 },
    { name: 'Low Stock', value: lowStock || 0 },
    { name: 'Critical', value: outOfStock || 0 },
  ];

  return (
    <div className="h-[200px] w-full relative group">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sync</span>
        <span className="text-2xl font-black">{healthy + lowStock + outOfStock}</span>
      </div>
    </div>
  );
}
