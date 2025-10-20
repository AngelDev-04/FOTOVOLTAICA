import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const airQualityData = [
  { time: "00:00", aqi: 45, pm25: 12, co2: 380 },
  { time: "04:00", aqi: 42, pm25: 10, co2: 375 },
  { time: "08:00", aqi: 38, pm25: 8, co2: 370 },
  { time: "12:00", aqi: 35, pm25: 7, co2: 365 },
  { time: "16:00", aqi: 32, pm25: 6, co2: 360 },
  { time: "20:00", aqi: 38, pm25: 9, co2: 368 },
];

const carbonOffsetData = [
  { month: "Jan", offset: 120, target: 150 },
  { month: "Feb", offset: 135, target: 150 },
  { month: "Mar", offset: 148, target: 150 },
  { month: "Apr", offset: 162, target: 150 },
  { month: "May", offset: 175, target: 150 },
  { month: "Jun", offset: 188, target: 150 },
];

export function EnvironmentalChart() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            Air Quality Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={airQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="aqi" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">AQI</p>
              <p className="font-semibold text-green-600">35</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">PM2.5</p>
              <p className="font-semibold text-blue-600">6 μg/m³</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CO₂</p>
              <p className="font-semibold text-purple-600">360 ppm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            Carbon Offset Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={carbonOffsetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="offset" 
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.2}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#ef4444" 
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">This month: <span className="font-semibold text-blue-600">188 kg CO₂</span></span>
            <span className="text-gray-500">Target: <span className="font-semibold text-red-600">150 kg CO₂</span></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}