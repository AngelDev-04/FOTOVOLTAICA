import { Home, BarChart3, Activity, Settings } from "lucide-react";
import { cn } from "../ui/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "load-charts", label: "Load Charts", icon: BarChart3 },
    { id: "performance", label: "Performance", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-20 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center py-8 shadow-xl">
      <div className="mb-12 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
        <div className="w-6 h-6 border-2 border-white rounded-full" />
      </div>
      
      <nav className="flex flex-col gap-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center transition-all relative group",
                isActive
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                  : "bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white"
              )}
            >
              <Icon className="w-6 h-6" />
              
              <div className="absolute left-20 bg-slate-700 text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg text-sm">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
