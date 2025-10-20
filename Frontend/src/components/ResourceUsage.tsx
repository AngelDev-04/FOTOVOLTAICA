import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Droplets, Zap, Trash2, Recycle } from "lucide-react";

const resources = [
  {
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    title: "Water Usage",
    current: 180,
    limit: 250,
    unit: "L",
    trend: "down",
    percentage: 72,
    status: "good"
  },
  {
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    title: "Energy Consumption", 
    current: 12.5,
    limit: 15,
    unit: "kWh",
    trend: "stable",
    percentage: 83,
    status: "good"
  },
  {
    icon: <Trash2 className="h-5 w-5 text-gray-500" />,
    title: "Waste Generated",
    current: 3.2,
    limit: 5,
    unit: "kg",
    trend: "down",
    percentage: 64,
    status: "excellent"
  },
  {
    icon: <Recycle className="h-5 w-5 text-green-500" />,
    title: "Recycling Rate",
    current: 85,
    limit: 90,
    unit: "%",
    trend: "up",
    percentage: 94,
    status: "excellent"
  }
];

export function ResourceUsage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Resource Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {resources.map((resource, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {resource.icon}
                  <div>
                    <p className="font-medium text-gray-900">{resource.title}</p>
                    <p className="text-sm text-gray-600">
                      {resource.current} / {resource.limit} {resource.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={
                      resource.status === "excellent"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }
                  >
                    {resource.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{resource.percentage}%</p>
                    <p className="text-xs text-gray-500 capitalize">{resource.trend}</p>
                  </div>
                </div>
              </div>
              
              <Progress 
                value={resource.percentage} 
                className="h-2"
                style={{
                  background: 'rgb(229 231 235)',
                }}
              />
            </div>
          ))}
          
          {/* Summary Stats */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-green-50">
                <p className="text-sm text-gray-600">Carbon Saved</p>
                <p className="text-xl font-bold text-green-600">12.3 kg</p>
                <p className="text-xs text-green-600">This week</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Cost Savings</p>
                <p className="text-xl font-bold text-blue-600">$47</p>
                <p className="text-xs text-blue-600">This month</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}