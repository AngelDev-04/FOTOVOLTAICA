import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Droplets, Thermometer, Sun, Sprout } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const plants = [
  {
    name: "Basil Garden",
    health: 95,
    moisture: 78,
    temperature: 24,
    sunlight: 89,
    status: "thriving",
    image: "https://images.unsplash.com/photo-1624295885769-570803a3c650?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGdhcmRlbiUyMHBsYW50c3xlbnwxfHx8fDE3NTg4NDU3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Tomato Patch",
    health: 87,
    moisture: 65,
    temperature: 26,
    sunlight: 92,
    status: "good",
    image: "https://images.unsplash.com/photo-1624295885769-570803a3c650?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGdhcmRlbiUyMHBsYW50c3xlbnwxfHx8fDE3NTg4NDU3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Herb Spiral",
    health: 92,
    moisture: 72,
    temperature: 23,
    sunlight: 85,
    status: "thriving",
    image: "https://images.unsplash.com/photo-1624295885769-570803a3c650?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGdhcmRlbiUyMHBsYW50c3xlbnwxfHx8fDE3NTg4NDU3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function GardenMonitor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-600" />
          Garden Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {plants.map((plant, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={plant.image}
                  alt={plant.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{plant.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={
                      plant.status === "thriving" 
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }
                  >
                    {plant.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-blue-500" />
                      <span className="text-gray-600">Moisture</span>
                      <span className="font-medium ml-auto">{plant.moisture}%</span>
                    </div>
                    <Progress value={plant.moisture} className="h-1" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sun className="h-3 w-3 text-yellow-500" />
                      <span className="text-gray-600">Sunlight</span>
                      <span className="font-medium ml-auto">{plant.sunlight}%</span>
                    </div>
                    <Progress value={plant.sunlight} className="h-1" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">Temp:</span>
                    <span className="font-medium">{plant.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Health:</span>
                    <span className="font-medium text-green-600">{plant.health}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}