import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

export function Header() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-slate-900 mb-1">Solar PV Dashboard</h1>
        <p className="text-slate-500 text-sm">{currentDate}</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            System Online
          </Badge>
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-slate-900 text-sm">John Carter</p>
            <p className="text-slate-500 text-xs">Administrator</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              JC
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
