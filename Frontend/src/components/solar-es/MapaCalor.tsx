import { Card } from "../ui/card";
import { useEffect, useState, useMemo } from "react";
import { useHeatmap } from "../../hooks/useApi";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MapaCalorProps {
  darkMode: boolean;
  dataLoaded?: boolean;
}

const horas = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Función para obtener el color basado en el valor
const getColor = (valor: number, darkMode: boolean) => {
  if (valor < 2) return darkMode ? "#1e3a8a" : "#dbeafe";
  if (valor < 4) return darkMode ? "#1e40af" : "#bfdbfe";
  if (valor < 6) return darkMode ? "#3b82f6" : "#93c5fd";
  if (valor < 8) return darkMode ? "#f59e0b" : "#fcd34d";
  return darkMode ? "#dc2626" : "#f87171";
};

export function MapaCalor({ darkMode, dataLoaded = false }: MapaCalorProps) {
  const { data: heatmapData, loading: heatmapLoading, fetchHeatmap } = useHeatmap();
  const [weekIndex, setWeekIndex] = useState(0);

  // Fetch heatmap data only when data is loaded
  useEffect(() => {
    if (dataLoaded) {
      fetchHeatmap();
    }
  }, [dataLoaded]);

  // Calculate total weeks and current week data
  const { totalWeeks, currentWeekData, weekDates } = useMemo(() => {
    if (!heatmapData || !heatmapData.values || heatmapData.values.length === 0) {
      return { totalWeeks: 0, currentWeekData: [], weekDates: [] };
    }

    const totalDays = heatmapData.values.length;
    const totalWeeks = Math.ceil(totalDays / 7);

    // Get 7 days for current week
    const startIdx = weekIndex * 7;
    const endIdx = Math.min(startIdx + 7, totalDays);
    const currentWeekData = heatmapData.values.slice(startIdx, endIdx);
    const weekDates = heatmapData.dates.slice(startIdx, endIdx);

    return { totalWeeks, currentWeekData, weekDates };
  }, [heatmapData, weekIndex]);

  // Transform week data for display
  const datosCalor = currentWeekData.map((hourData, dayIndex) => {
    // Parse date as local time to avoid timezone issues
    const dateString = weekDates[dayIndex];
    let dayOfWeek = 0;
    if (dateString) {
      // Split date string and create date in local timezone
      const parts = dateString.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const day = parseInt(parts[2]);
      const date = new Date(year, month, day);
      dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ...
    }
    return {
      dia: diasSemana[dayOfWeek],
      fecha: weekDates[dayIndex],
      horas: hourData,
    };
  });

  const handlePrevWeek = () => {
    if (weekIndex > 0) {
      setWeekIndex(weekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    if (weekIndex < totalWeeks - 1) {
      setWeekIndex(weekIndex + 1);
    }
  };

  const formatDateRange = () => {
    if (weekDates.length === 0) return '';

    // Parse first date in local timezone
    const firstParts = weekDates[0].split('-');
    const firstDate = new Date(
      parseInt(firstParts[0]),
      parseInt(firstParts[1]) - 1,
      parseInt(firstParts[2])
    ).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Parse last date in local timezone
    const lastDateStr = weekDates[weekDates.length - 1];
    const lastParts = lastDateStr.split('-');
    const lastDate = new Date(
      parseInt(lastParts[0]),
      parseInt(lastParts[1]) - 1,
      parseInt(lastParts[2])
    ).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return `${firstDate} - ${lastDate}`;
  };

  return (
    <Card className={`p-6 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={darkMode ? "text-white" : "text-slate-900"}>
              Mapa de Calor de Consumo
            </h3>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Consumo horario por día de la semana (kW)
            </p>
          </div>

          {datosCalor.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevWeek}
                disabled={weekIndex === 0}
                className={darkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : ""}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center min-w-[200px]">
                <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {formatDateRange()}
                </p>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Semana {weekIndex + 1} de {totalWeeks}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextWeek}
                disabled={weekIndex >= totalWeeks - 1}
                className={darkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : ""}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {heatmapLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className={darkMode ? "text-slate-400" : "text-slate-500"}>Cargando mapa de calor...</p>
        </div>
      ) : datosCalor.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className={darkMode ? "text-slate-400" : "text-slate-500"}>No hay datos disponibles. Por favor, cargue un archivo primero.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex gap-2">
              <div className="flex flex-col justify-between py-8">
                {datosCalor.map((d) => (
                  <div
                    key={d.dia}
                    className={`h-8 flex items-center justify-end pr-3 text-sm ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {d.dia}
                  </div>
                ))}
              </div>

              <div className="flex-1">
                <div className="flex gap-1 mb-2">
                  {horas.map((h, i) => (
                    i % 3 === 0 && (
                      <div
                        key={h}
                        className={`flex-1 text-center text-xs ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                        style={{ minWidth: '40px' }}
                      >
                        {h}
                      </div>
                    )
                  ))}
                </div>

                <div className="space-y-1">
                  {datosCalor.map((dia) => (
                    <div key={dia.dia} className="flex gap-1">
                      {dia.horas.map((valor, i) => (
                        <div
                          key={i}
                          className="h-8 flex-1 rounded transition-all hover:scale-110 hover:shadow-lg cursor-pointer relative group"
                          style={{
                            backgroundColor: getColor(valor, darkMode),
                            minWidth: '40px'
                          }}
                          title={`${dia.dia} ${horas[i]}: ${valor.toFixed(1)} kW`}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {valor.toFixed(1)} kW
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t" style={{
              borderColor: darkMode ? "#475569" : "#e2e8f0"
            }}>
              <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Bajo
              </span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-4 rounded"
                    style={{
                      backgroundColor: getColor(i * 2.5, darkMode)
                    }}
                  />
                ))}
              </div>
              <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Alto
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
