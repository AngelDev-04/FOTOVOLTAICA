import { Home, TrendingUp, Map, FileText, Settings, Sun, Moon } from "lucide-react";
import { cn } from "../ui/utils";

interface BarraLateralProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function BarraLateral({ activeTab, onTabChange, darkMode, onToggleDarkMode }: BarraLateralProps) {
  const menuItems = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "curvas", label: "Curvas de Carga", icon: TrendingUp },
    { id: "mapa-calor", label: "Mapa de Calor", icon: Map },
    { id: "reportes", label: "Reportes", icon: FileText },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className={cn(
      "w-64 flex flex-col shadow-xl transition-colors",
      darkMode 
        ? "bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800" 
        : "bg-gradient-to-b from-slate-800 to-slate-900"
    )}>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white">Sistema FV</h2>
            <p className="text-slate-400 text-xs">Análisis Solar</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-sm">{darkMode ? "Modo Claro" : "Modo Oscuro"}</span>
        </button>
      </div>
    </div>
  );
}
