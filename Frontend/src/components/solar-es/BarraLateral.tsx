import { useState } from "react";
import { Home, TrendingUp, Map, FileText, Settings, Sun, Moon, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "../ui/utils";

interface BarraLateralProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function BarraLateral({ activeTab, onTabChange, darkMode, onToggleDarkMode }: BarraLateralProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "curvas", label: "Curvas de Carga", icon: TrendingUp },
    { id: "mapa-calor", label: "Mapa de Calor", icon: Map },
    { id: "reportes", label: "Reportes", icon: FileText },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className={cn(
      "flex flex-col shadow-xl transition-all duration-300 ease-in-out relative",
      isExpanded ? "w-64" : "w-20",
      darkMode
        ? "bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800"
        : "bg-gradient-to-b from-slate-800 to-slate-900"
    )}>
      {/* Botón para expandir/colapsar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "absolute -right-3 top-8 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-lg",
          "bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600",
          "text-white hover:scale-110"
        )}
        title={isExpanded ? "Colapsar menú" : "Expandir menú"}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Sun className="w-6 h-6 text-white" />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <h2 className="text-white whitespace-nowrap">Sistema FV</h2>
              <p className="text-slate-400 text-xs whitespace-nowrap">Análisis Solar</p>
            </div>
          )}
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
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
                !isExpanded && "justify-center"
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onToggleDarkMode}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all",
            !isExpanded && "justify-center"
          )}
          title={!isExpanded ? (darkMode ? "Modo Claro" : "Modo Oscuro") : undefined}
        >
          {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {isExpanded && <span className="text-sm whitespace-nowrap">{darkMode ? "Modo Claro" : "Modo Oscuro"}</span>}
        </button>
      </div>
    </div>
  );
}
