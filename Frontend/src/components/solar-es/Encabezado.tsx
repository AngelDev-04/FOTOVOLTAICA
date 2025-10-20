import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface EncabezadoProps {
  darkMode: boolean;
}

export function Encabezado({ darkMode }: EncabezadoProps) {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={`px-8 py-5 flex items-center justify-between border-b transition-colors ${
      darkMode 
        ? "bg-slate-900 border-slate-800" 
        : "bg-white border-slate-200"
    }`}>
      <div>
        <h1 className={darkMode ? "text-white" : "text-slate-900"}>
          Panel de Análisis Fotovoltaico
        </h1>
        <p className={`text-sm capitalize ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {currentDate}
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            Sistema Activo
          </Badge>
          <div className="relative">
            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              darkMode 
                ? "bg-slate-800 hover:bg-slate-700" 
                : "bg-slate-100 hover:bg-slate-200"
            }`}>
              <Bell className={`w-5 h-5 ${darkMode ? "text-slate-300" : "text-slate-600"}`} />
            </button>
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>
              GRUPO FV4
            </p>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              GF-JA-MJ
            </p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              GF4
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
