import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Zap, Battery, Home, ArrowRight } from "lucide-react";

export function InverterPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-900">Inverter Status</h3>
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-slate-500 text-sm mb-1">DC Input</p>
              <p className="text-slate-900">485 V</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm mb-1">AC Output</p>
              <p className="text-slate-900">230 V</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Efficiency</span>
                <span className="text-slate-900">97.2%</span>
              </div>
              <Progress value={97.2} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Temperature</span>
                <span className="text-slate-900">42°C</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-600 text-xs mb-1">Frequency</p>
              <p className="text-blue-900">50.02 Hz</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-amber-600 text-xs mb-1">Power Factor</p>
              <p className="text-amber-900">0.98</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-900">Energy Flow</h3>
          <p className="text-slate-500 text-sm">Real-time</p>
        </div>
        
        <div className="flex items-center justify-between py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Solar</p>
              <p className="text-slate-900">8.2 kW</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-green-500" />
              <p className="text-slate-600 text-sm">4.5 kW</p>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-500" />
              <p className="text-slate-600 text-sm">3.7 kW</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-xs mb-1">Load</p>
                <p className="text-slate-900 text-sm">4.5 kW</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <Battery className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-xs mb-1">Battery</p>
                <p className="text-slate-900 text-sm">3.7 kW</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Grid Status</span>
            <Badge variant="outline" className="bg-slate-50 text-slate-700">
              Exporting 0 kW
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
