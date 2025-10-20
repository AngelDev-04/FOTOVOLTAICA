import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

interface TarjetaMetricaProps {
  titulo: string;
  valor: string;
  unidad: string;
  icono: LucideIcon;
  tendencia?: {
    valor: string;
    esPositiva: boolean;
  };
  color: "amber" | "blue" | "green" | "purple";
  darkMode: boolean;
}

export function TarjetaMetrica({ titulo, valor, unidad, icono: Icon, tendencia, color, darkMode }: TarjetaMetricaProps) {
  const colorClasses = {
    amber: {
      bg: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconBg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
      iconText: darkMode ? "text-amber-400" : "text-amber-600",
      trendBg: darkMode ? "bg-amber-900/30" : "bg-amber-50",
      trendText: darkMode ? "text-amber-400" : "text-amber-700",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-400 to-cyan-500",
      iconBg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
      iconText: darkMode ? "text-blue-400" : "text-blue-600",
      trendBg: darkMode ? "bg-blue-900/30" : "bg-blue-50",
      trendText: darkMode ? "text-blue-400" : "text-blue-700",
    },
    green: {
      bg: "bg-gradient-to-br from-green-400 to-emerald-500",
      iconBg: darkMode ? "bg-green-900/30" : "bg-green-100",
      iconText: darkMode ? "text-green-400" : "text-green-600",
      trendBg: darkMode ? "bg-green-900/30" : "bg-green-50",
      trendText: darkMode ? "text-green-400" : "text-green-700",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-400 to-violet-500",
      iconBg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      iconText: darkMode ? "text-purple-400" : "text-purple-600",
      trendBg: darkMode ? "bg-purple-900/30" : "bg-purple-50",
      trendText: darkMode ? "text-purple-400" : "text-purple-700",
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className={cn(
      "p-6 hover:shadow-lg transition-all",
      darkMode ? "bg-slate-800 border-slate-700" : "bg-white"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.iconBg)}>
          <Icon className={cn("w-6 h-6", colors.iconText)} />
        </div>
        {tendencia && (
          <div className={cn("px-2.5 py-1 rounded-full text-xs", colors.trendBg, colors.trendText)}>
            {tendencia.esPositiva ? "↑" : "↓"} {tendencia.valor}
          </div>
        )}
      </div>
      
      <p className={`text-sm mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {titulo}
      </p>
      
      <div className="flex items-baseline gap-2">
        <span className={darkMode ? "text-white" : "text-slate-900"}>
          {valor}
        </span>
        <span className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          {unidad}
        </span>
      </div>
    </Card>
  );
}
