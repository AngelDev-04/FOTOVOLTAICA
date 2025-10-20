import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Cloud, Sun, Wind, Droplets, Eye, Gauge } from "lucide-react";

export function WeatherWidget() {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-3xl font-bold text-gray-900">24°C</p>
                <p className="text-sm text-gray-600">Partly Cloudy</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Optimal for Solar
            </Badge>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Wind Speed</p>
                <p className="font-medium">12 km/h</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="font-medium">68%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Visibility</p>
                <p className="font-medium">10 km</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Pressure</p>
                <p className="font-medium">1013 hPa</p>
              </div>
            </div>
          </div>

          {/* UV Index and Air Quality */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-100">
              <p className="text-sm text-gray-600">UV Index</p>
              <p className="text-xl font-bold text-orange-600">6</p>
              <p className="text-xs text-orange-600">High</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-100">
              <p className="text-sm text-gray-600">Air Quality</p>
              <p className="text-xl font-bold text-green-600">35</p>
              <p className="text-xs text-green-600">Good</p>
            </div>
          </div>

          {/* 3-Day Forecast */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">3-Day Forecast</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-600">Tomorrow</p>
                <Sun className="h-4 w-4 text-yellow-500 mx-auto my-1" />
                <p className="text-sm font-medium">26°C</p>
              </div>
              <div className="text-center p-2 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-600">Sunday</p>
                <Cloud className="h-4 w-4 text-gray-500 mx-auto my-1" />
                <p className="text-sm font-medium">22°C</p>
              </div>
              <div className="text-center p-2 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-600">Monday</p>
                <Sun className="h-4 w-4 text-yellow-500 mx-auto my-1" />
                <p className="text-sm font-medium">25°C</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}