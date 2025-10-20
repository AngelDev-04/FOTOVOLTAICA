import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Leaf, Sun, Droplets, Wind } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b bg-gradient-to-r from-green-50 to-emerald-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">EcoHub</h1>
            <p className="text-sm text-green-600">Sustainable Living Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Solar: Active
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Wind: 12 mph
            </Badge>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            Settings
          </Button>
        </div>
      </div>
    </header>
  );
}