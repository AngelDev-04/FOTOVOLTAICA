import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Zap, Battery, Home } from "lucide-react";

interface EnergyCardProps {
  title: string;
  value: string;
  unit: string;
  progress: number;
  trend: "up" | "down";
  trendValue: string;
  icon: "solar" | "battery" | "grid";
  status: "good" | "warning" | "excellent";
}

export function EnergyCard({ title, value, unit, progress, trend, trendValue, icon, status }: EnergyCardProps) {
  const iconComponents = {
    solar: <Zap className="h-5 w-5" />,
    battery: <Battery className="h-5 w-5" />,
    grid: <Home className="h-5 w-5" />
  };

  const statusColors = {
    excellent: "bg-green-100 text-green-800 border-green-200",
    good: "bg-blue-100 text-blue-800 border-blue-200", 
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200"
  };

  const progressColors = {
    excellent: "bg-green-500",
    good: "bg-blue-500",
    warning: "bg-yellow-500"
  };

  return (
    <Card className="relative overflow-hidden border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {iconComponents[icon]}
            {title}
          </CardTitle>
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Efficiency</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              style={{
                background: 'rgb(229 231 235)',
              }}
            />
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
              {trendValue} from yesterday
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}