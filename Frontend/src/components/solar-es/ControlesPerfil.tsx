import { useState, useEffect, useMemo } from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sun, Moon, Cloud, Calendar } from "lucide-react";
import { useProfile, useStatus } from "../../hooks/useApi";

interface ControlesPerfilProps {
  darkMode: boolean;
  dataLoaded?: boolean;
}

export function ControlesPerfil({ darkMode, dataLoaded = false }: ControlesPerfilProps) {
  const [temporada, setTemporada] = useState("seca");
  const [selectedYear, setSelectedYear] = useState<number>(2016);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [datesInitialized, setDatesInitialized] = useState<boolean>(false);

  const { data: profileData, loading: profileLoading, fetchProfile } = useProfile();
  const { data: statusData, fetchStatus } = useStatus();

  // Inicializar fechas desde el dataset
  useEffect(() => {
    if (dataLoaded && !datesInitialized) {
      fetchStatus().then((status) => {
        if (status && status.date_range) {
          setSelectedYear(status.date_range.start_year);
          setSelectedMonth(status.date_range.start_month);
          setDatesInitialized(true);
        }
      }).catch((err) => {
        console.error('Error obteniendo status:', err);
      });
    }
  }, [dataLoaded, datesInitialized, fetchStatus]);

  // Fetch profile data when data is loaded or when year/month changes
  useEffect(() => {
    if (dataLoaded && datesInitialized) {
      // Llamar con los horarios configurados: día 7-20 (6:01am-8:59pm) y filtro por mes/año
      fetchProfile(7, 20, selectedYear, selectedMonth).catch((err) => {
        console.error('Error obteniendo perfil:', err);
      });
    }
  }, [dataLoaded, datesInitialized, selectedYear, selectedMonth, fetchProfile]);

  const diurno = profileData?.diurnal_percentage || 0;
  const nocturno = profileData?.nocturnal_percentage || 0;

  // Generar lista de años disponibles - memoizado para evitar re-renders
  const availableYears = useMemo(() => {
    if (statusData?.date_range) {
      const startYear = new Date(statusData.date_range.start).getFullYear();
      const endYear = new Date(statusData.date_range.end).getFullYear();
      return Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
      );
    }
    return [2016, 2017, 2018, 2019, 2020];
  }, [statusData?.date_range]);

  // Lista de meses - memoizada
  const meses = useMemo(() => [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ], []);

  return (
    <Card className={`p-6 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
      <div className="mb-6">
        <h3 className={darkMode ? "text-white" : "text-slate-900"}>
          Controles de Perfil de Consumo
        </h3>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Ajuste los parámetros de análisis
        </p>
      </div>

      <div className="space-y-6">
        {/* Selector de Período (Mes/Año) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="profile-year" className={`flex items-center gap-2 ${darkMode ? "text-slate-200" : ""}`}>
              <Calendar className="w-4 h-4" />
              Año
            </Label>
            <Select
              key={`year-${selectedYear}`}
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger
                id="profile-year"
                className={`mt-2 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profile-month" className={darkMode ? "text-slate-200" : ""}>
              Mes
            </Label>
            <Select
              key={`month-${selectedMonth}`}
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger
                id="profile-month"
                className={`mt-2 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}>
                {meses.map((mes) => (
                  <SelectItem key={mes.value} value={mes.value.toString()}>
                    {mes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Proporción Diurna/Nocturna */}
        <div>
          <Label className={darkMode ? "text-slate-200" : ""}>
            Proporción Diurna / Nocturna (6:01am - 8:59pm / 9:00pm - 6:00am)
          </Label>
          <div className="flex items-center gap-4 mt-3">
            <Sun className="w-5 h-5 text-amber-500" />
            <div className="flex-1">
              {/* Barra de progreso visual (solo lectura) */}
              <div className={`h-3 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                  style={{ width: `${diurno.toFixed(1)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                   {diurno.toFixed(1)}%
                </span>
                <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                   {nocturno.toFixed(1)}%
                </span>
              </div>
              {profileLoading && (
                <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Cargando datos del perfil...
                </p>
              )}
            </div>
            <Moon className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        {/* Selector de Temporada */}
        <div>
          <Label htmlFor="temporada" className={darkMode ? "text-slate-200" : ""}>
            Escenario Estacional
          </Label>
          <Select key={`temporada-${temporada}`} value={temporada} onValueChange={setTemporada}>
            <SelectTrigger
              id="temporada"
              className={`mt-2 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}>
              <SelectItem value="seca">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Temporada Seca
                </div>
              </SelectItem>
              <SelectItem value="lluviosa">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  Temporada Lluviosa
                </div>
              </SelectItem>
              <SelectItem value="transicion">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-orange-400" />
                  Período de Transición
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resumen de Configuración */}
        <div className={`p-4 rounded-lg ${
          darkMode ? "bg-slate-700/50" : "bg-amber-50"
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              darkMode ? "bg-amber-900/30" : "bg-amber-100"
            }`}>
              <Sun className={`w-4 h-4 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
            </div>
            <div>
              <p className={`text-sm mb-1 ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                Configuración Actual
              </p>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Período: <strong>{meses.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>
                <br />
                Temporada: <strong>{temporada === "seca" ? "Seca" : temporada === "lluviosa" ? "Lluviosa" : "Transición"}</strong>
                <br />
                Distribución: <strong>{diurno.toFixed(1)}% día / {nocturno.toFixed(1)}% noche</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
