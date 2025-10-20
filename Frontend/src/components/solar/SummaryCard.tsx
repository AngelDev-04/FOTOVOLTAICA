import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: "amber" | "blue" | "green" | "slate";
}

export function SummaryCard({ title, value, unit, icon: Icon, trend, color }: SummaryCardProps) {
  const colorClasses = {
    amber: {
      bg: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconBg: "bg-amber-100",
      iconText: "text-amber-600",
      trendBg: "bg-amber-50",
      trendText: "text-amber-700",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-400 to-cyan-500",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
      trendBg: "bg-blue-50",
      trendText: "text-blue-700",
    },
    green: {
      bg: "bg-gradient-to-br from-green-400 to-emerald-500",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
      trendBg: "bg-green-50",
      trendText: "text-green-700",
    },
    slate: {
      bg: "bg-gradient-to-br from-slate-400 to-slate-600",
      iconBg: "bg-slate-100",
      iconText: "text-slate-600",
      trendBg: "bg-slate-50",
      trendText: "text-slate-700",
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.iconBg)}>
          <Icon className={cn("w-6 h-6", colors.iconText)} />
        </div>
        {trend && (
          <div className={cn("px-2.5 py-1 rounded-full text-xs", colors.trendBg, colors.trendText)}>
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
      
      <p className="text-slate-500 text-sm mb-2">{title}</p>
      
      <div className="flex items-baseline gap-2">
        <span className="text-slate-900">{value}</span>
        <span className="text-slate-400 text-sm">{unit}</span>
      </div>
    </Card>
  );
}
