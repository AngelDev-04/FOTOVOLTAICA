import { useState } from "react";
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const dailyData = [
  { time: "00:00", production: 0, consumption: 1.2 },
  { time: "03:00", production: 0, consumption: 0.8 },
  { time: "06:00", production: 2.5, consumption: 1.5 },
  { time: "09:00", production: 8.2, consumption: 3.2 },
  { time: "12:00", production: 12.5, consumption: 4.8 },
  { time: "15:00", production: 10.8, consumption: 5.2 },
  { time: "18:00", production: 4.2, consumption: 6.5 },
  { time: "21:00", production: 0, consumption: 3.8 },
  { time: "23:59", production: 0, consumption: 2.1 },
];

const monthlyData = [
  { day: "1", production: 145, consumption: 98 },
  { day: "5", production: 168, consumption: 105 },
  { day: "10", production: 152, consumption: 92 },
  { day: "15", production: 178, consumption: 110 },
  { day: "20", production: 165, consumption: 102 },
  { day: "25", production: 172, consumption: 108 },
  { day: "30", production: 158, consumption: 95 },
];

export function LoadChart() {
  const [view, setView] = useState<"daily" | "monthly">("daily");
  
  const data = view === "daily" ? dailyData : monthlyData;
  const xKey = view === "daily" ? "time" : "day";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-900 mb-1">Energy Overview</h3>
          <p className="text-slate-500 text-sm">Production vs Consumption</p>
        </div>
        
        <Tabs value={view} onValueChange={(v) => setView(v as "daily" | "monthly")}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey={xKey} 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            label={{ value: view === "daily" ? 'kW' : 'kWh', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="production" 
            stroke="#f59e0b" 
            strokeWidth={2}
            fill="url(#productionGradient)"
            name="Production"
          />
          <Area 
            type="monotone" 
            dataKey="consumption" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#consumptionGradient)"
            name="Consumption"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
