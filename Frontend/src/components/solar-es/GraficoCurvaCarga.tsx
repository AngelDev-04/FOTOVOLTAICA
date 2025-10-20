import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useLDC, useHourlyData, useWeeklyData, useStatus } from "../../hooks/useApi";

const meses = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

interface GraficoCurvaCargaProps {
  darkMode: boolean;
  dataLoaded?: boolean;
}

// Interface para métodos expuestos
export interface GraficoCurvaCargaHandle {
  getChartElements: () => {
    ldcChart: HTMLElement | null;
    horarioChart: HTMLElement | null;
    diarioChart: HTMLElement | null;
  };
}

export const GraficoCurvaCarga = forwardRef<GraficoCurvaCargaHandle, GraficoCurvaCargaProps>(
  ({ darkMode, dataLoaded = false }, ref) => {
  const [vista, setVista] = useState<"ldc" | "horario" | "diario">("ldc");

  // Estados para LDC (por mes)
  const [selectedYear, setSelectedYear] = useState<number>(2016);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  // Estado para vista horaria (por día específico)
  const [selectedDay, setSelectedDay] = useState<string>("2016-01-06");

  // Estado para vista diaria (por semana específica)
  const [selectedWeek, setSelectedWeek] = useState<number>(1); // Semana del año

  // Estado para indicar si ya se inicializaron las fechas
  const [datesInitialized, setDatesInitialized] = useState<boolean>(false);

  // ✅ Hooks separados para las gráficas ocultas (siempre cargadas para PDF)
  const { data: ldcDataHidden, fetchLDC: fetchLDCHidden } = useLDC();
  const { data: hourlyDataHidden, fetchHourlyData: fetchHourlyHidden } = useHourlyData();
  const { data: weeklyDataHidden, fetchWeeklyData: fetchWeeklyHidden } = useWeeklyData();

  // Hooks para la vista visible (se actualizan según la selección del usuario)
  const { data: ldcData, loading: ldcLoading, fetchLDC } = useLDC();
  const { data: hourlyData, loading: hourlyLoading, fetchHourlyData } = useHourlyData();
  const { data: weeklyData, loading: weeklyLoading, fetchWeeklyData } = useWeeklyData();
  const { data: statusData, fetchStatus } = useStatus();

  // Referencias para capturar gráficas OCULTAS (para PDF)
  const ldcChartHiddenRef = useRef<HTMLDivElement>(null);
  const horarioChartHiddenRef = useRef<HTMLDivElement>(null);
  const diarioChartHiddenRef = useRef<HTMLDivElement>(null);

  // Referencias para la gráfica visible (no se usan para exportación)
  const visibleChartRef = useRef<HTMLDivElement>(null);

  // Exponer métodos para acceso desde componente padre
  useImperativeHandle(ref, () => ({
    getChartElements: () => {
      console.log('🔍 getChartElements llamado');
      console.log('  LDC ref:', ldcChartHiddenRef.current);
      console.log('  Horario ref:', horarioChartHiddenRef.current);
      console.log('  Diario ref:', diarioChartHiddenRef.current);
      console.log('  LDC data:', ldcDataHidden);
      console.log('  Hourly data:', hourlyDataHidden);
      console.log('  Weekly data:', weeklyDataHidden);
      
      return {
        ldcChart: ldcChartHiddenRef.current,
        horarioChart: horarioChartHiddenRef.current,
        diarioChart: diarioChartHiddenRef.current,
      };
    }
  }));

  // Obtener información del dataset cuando se cargan datos
  useEffect(() => {
    if (dataLoaded && !datesInitialized) {
      fetchStatus().then((status) => {
        if (status && status.date_range) {
          // Inicializar con la primera fecha del dataset
          setSelectedYear(status.date_range.start_year);
          setSelectedMonth(status.date_range.start_month);
          setSelectedDay(status.date_range.start_date);
          setSelectedWeek(status.date_range.start_week);
          setDatesInitialized(true);
        }
      }).catch((err) => {
        console.error('Error obteniendo status:', err);
      });
    }
  }, [dataLoaded, datesInitialized]);

  // ✅ Cargar datos para las 3 gráficas ocultas (para PDF) cuando se inicialicen las fechas
  useEffect(() => {
    if (dataLoaded && datesInitialized) {
      console.log('📥 Cargando datos para gráficas ocultas (PDF)...');
      
      // Cargar LDC para el primer mes disponible
      fetchLDCHidden(selectedYear, selectedMonth).then(() => {
        console.log('✅ LDC data cargada para PDF');
      });
      
      // Cargar datos horarios para el primer día disponible
      fetchHourlyHidden(selectedDay).then(() => {
        console.log('✅ Hourly data cargada para PDF');
      });
      
      // Cargar datos semanales para la primera semana disponible
      fetchWeeklyHidden(selectedWeek, selectedYear).then(() => {
        console.log('✅ Weekly data cargada para PDF');
      });
    }
  }, [dataLoaded, datesInitialized, selectedYear, selectedMonth, selectedDay, selectedWeek]);

  // Fetch LDC data when data is loaded or month changes
  useEffect(() => {
    if (dataLoaded && vista === "ldc") {
      fetchLDC(selectedYear, selectedMonth);
    }
  }, [dataLoaded, vista, selectedYear, selectedMonth]);

  // Fetch hourly data when day changes
  useEffect(() => {
    if (dataLoaded && vista === "horario") {
      fetchHourlyData(selectedDay);
    }
  }, [dataLoaded, vista, selectedDay]);

  // Fetch weekly data when week changes
  useEffect(() => {
    if (dataLoaded && vista === "diario") {
      fetchWeeklyData(selectedWeek, selectedYear);
    }
  }, [dataLoaded, vista, selectedWeek, selectedYear]);

  // Transform LDC data for recharts
  const datosLDC = ldcData
    ? ldcData.power_values.map((power, index) => ({
        duracion: ldcData.duration_percentage[index].toFixed(1),
        potencia: power.toFixed(2),
      }))
    : [];

  // Transform hourly data for recharts
  const datosHorario = hourlyData
    ? hourlyData.hours.map((hour, index) => ({
        hora: `${hour.toString().padStart(2, '0')}:00`,
        consumo: hourlyData.consumption[index],
        generacion: 0, // Por ahora no tenemos datos de generación
      }))
    : [];

  // Transform weekly data for recharts
  const datosDiario = weeklyData
    ? weeklyData.days.map((day, index) => ({
        dia: day,
        consumo: weeklyData.consumption[index],
        generacion: 0, // Por ahora no tenemos datos de generación
      }))
    : [];

  // ✅ Transform data for HIDDEN charts (siempre disponibles para PDF)
  const datosLDCHidden = ldcDataHidden
    ? ldcDataHidden.power_values.map((power, index) => ({
        duracion: ldcDataHidden.duration_percentage[index].toFixed(1),
        potencia: power.toFixed(2),
      }))
    : [];

  const datosHorarioHidden = hourlyDataHidden
    ? hourlyDataHidden.hours.map((hour, index) => ({
        hora: `${hour.toString().padStart(2, '0')}:00`,
        consumo: hourlyDataHidden.consumption[index],
        generacion: 0,
      }))
    : [];

  const datosDiarioHidden = weeklyDataHidden
    ? weeklyDataHidden.days.map((day, index) => ({
        dia: day,
        consumo: weeklyDataHidden.consumption[index],
        generacion: 0,
      }))
    : [];

  // Log para debug
  useEffect(() => {
    if (dataLoaded) {
      console.log('📊 Datos transformados para gráficas ocultas:');
      console.log('  LDC:', datosLDCHidden.length, 'puntos');
      console.log('  Horario:', datosHorarioHidden.length, 'puntos');
      console.log('  Diario:', datosDiarioHidden.length, 'puntos');
    }
  }, [datosLDCHidden, datosHorarioHidden, datosDiarioHidden, dataLoaded]);

  // Generate list of available years from dataset
  const availableYears = statusData?.date_range
    ? Array.from(
        { length: new Date(statusData.date_range.end).getFullYear() - new Date(statusData.date_range.start).getFullYear() + 1 },
        (_, i) => new Date(statusData.date_range.start).getFullYear() + i
      )
    : [2016, 2017, 2018, 2019, 2020];

  return (
    <Card className={`p-6 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={darkMode ? "text-white" : "text-slate-900"}>
            Análisis de Curvas de Carga
          </h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Visualización de patrones de consumo y generación
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Selector para vista LDC (por mes) */}
          {vista === "ldc" && dataLoaded && (
            <div className="flex items-center gap-2">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className={`w-[140px] ${darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-slate-700 border-slate-600" : ""}>
                  {meses.map((mes) => (
                    <SelectItem
                      key={mes.value}
                      value={mes.value}
                      className={darkMode ? "text-white focus:bg-slate-600" : ""}
                    >
                      {mes.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className={`w-[100px] ${darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}>
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-slate-700 border-slate-600" : ""}>
                  {availableYears.map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className={darkMode ? "text-white focus:bg-slate-600" : ""}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selector para vista horaria (por día) */}
          {vista === "horario" && dataLoaded && (
            <div className="flex items-center gap-2">
              <label className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Día:
              </label>
              <input
                type="date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
                min={statusData?.date_range?.start_date || "2016-01-06"}
                max={statusData?.date_range?.end_date || "2020-12-31"}
              />
            </div>
          )}

          {/* Selector para vista diaria (por semana) */}
          {vista === "diario" && dataLoaded && (
            <div className="flex items-center gap-2">
              <Select
                value={selectedWeek.toString()}
                onValueChange={(value) => setSelectedWeek(parseInt(value))}
              >
                <SelectTrigger className={`w-[160px] ${darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}>
                  <SelectValue placeholder="Semana" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-slate-700 border-slate-600" : ""}>
                  {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
                    <SelectItem
                      key={week}
                      value={week.toString()}
                      className={darkMode ? "text-white focus:bg-slate-600" : ""}
                    >
                      Semana {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className={`w-[100px] ${darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}>
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-slate-700 border-slate-600" : ""}>
                  {availableYears.map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className={darkMode ? "text-white focus:bg-slate-600" : ""}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Tabs value={vista} onValueChange={(v) => setVista(v as any)}>
            <TabsList className={darkMode ? "bg-slate-700" : ""}>
              <TabsTrigger value="ldc" className={darkMode ? "data-[state=active]:bg-slate-600" : ""}>
                LDC
              </TabsTrigger>
              <TabsTrigger value="horario" className={darkMode ? "data-[state=active]:bg-slate-600" : ""}>
                Por Hora
              </TabsTrigger>
              <TabsTrigger value="diario" className={darkMode ? "data-[state=active]:bg-slate-600" : ""}>
                Por Día
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div ref={visibleChartRef} data-chart-id={`chart-${vista}`}>
        <ResponsiveContainer width="100%" height={360}>
          {/* Loading states */}
          {(ldcLoading && vista === "ldc") || (hourlyLoading && vista === "horario") || (weeklyLoading && vista === "diario") ? (
            <div className="flex items-center justify-center h-full">
              <p className={darkMode ? "text-slate-400" : "text-slate-500"}>Cargando datos...</p>
            </div>
          ) : vista === "ldc" ? (
            <AreaChart data={datosLDC}>
            <defs>
              <linearGradient id="ldcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e2e8f0"} />
            <XAxis 
              dataKey="duracion" 
              stroke={darkMode ? "#9ca3af" : "#94a3b8"}
              style={{ fontSize: '12px' }}
              label={{ value: 'Duración (%)', position: 'insideBottom', offset: -5, style: { fill: darkMode ? "#9ca3af" : "#64748b" } }}
            />
            <YAxis 
              stroke={darkMode ? "#9ca3af" : "#94a3b8"}
              style={{ fontSize: '12px' }}
              label={{ value: 'Potencia (kW)', angle: -90, position: 'insideLeft', style: { fill: darkMode ? "#9ca3af" : "#64748b" } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1e293b' : 'white', 
                border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: darkMode ? 'white' : 'black'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="potencia" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fill="url(#ldcGradient)"
              name="Potencia (kW)"
            />
          </AreaChart>
        ) : vista === "horario" ? (
          <LineChart data={datosHorario}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e2e8f0"} />
            <XAxis 
              dataKey="hora" 
              stroke={darkMode ? "#9ca3af" : "#94a3b8"}
              style={{ fontSize: '12px' }}
              label={{ value: 'Hora del día', position: 'insideBottom', offset: -5, style: { fill: darkMode ? "#9ca3af" : "#64748b" } }}
            />
            <YAxis 
              stroke={darkMode ? "#9ca3af" : "#94a3b8"}
              style={{ fontSize: '12px' }}
              label={{ value: 'Potencia (kW)', angle: -90, position: 'insideLeft', style: { fill: darkMode ? "#9ca3af" : "#64748b" } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1e293b' : 'white', 
                border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: darkMode ? 'white' : 'black'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="consumo" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Consumo (kW)"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="generacion" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Generación (kW)"
              dot={{ fill: '#f59e0b', r: 4 }}
            />
          </LineChart>
        ) : (
          <AreaChart data={datosDiario}>
            <defs>
              <linearGradient id="consumoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="generacionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e2e8f0"} />
            <XAxis 
              dataKey="dia" 
              stroke={darkMode ? "#9ca3af" : "#94a3b8"}
              style={{ fontSize: '12px' }}
              label={{ value: 'Día de la semana', position: 'insideBottom', offset: -5, style: { fill: darkMode ? "#9ca3af" : "#64748b" } }}
            />
            <YAxis 
              stroke={darkMode ? "#9ca3af" : "#94a3b8"}
              style={{ fontSize: '12px' }}
              label={{ value: 'Energía (kWh)', angle: -90, position: 'insideLeft', style: { fill: darkMode ? "#9ca3af" : "#64748b" } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1e293b' : 'white', 
                border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: darkMode ? 'white' : 'black'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="consumo" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#consumoGradient)"
              name="Consumo (kWh)"
            />
            <Area 
              type="monotone" 
              dataKey="generacion" 
              stroke="#f59e0b" 
              strokeWidth={2}
              fill="url(#generacionGradient)"
              name="Generación (kWh)"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
      </div>

      {/* Contenedor OCULTO para captura de PDF - Renderiza las 3 gráficas siempre */}
      {dataLoaded && (
        <div style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '800px',
          pointerEvents: 'none'
        }}>
          {/* Gráfica LDC oculta */}
          <div ref={ldcChartHiddenRef} data-chart-id="ldc-hidden" style={{ marginBottom: '20px' }}>
            <ResponsiveContainer width={800} height={400}>
              <AreaChart data={datosLDCHidden}>
                <defs>
                  <linearGradient id="ldcGradientHidden" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="duracion"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Duración (%)', position: 'insideBottom', offset: -5, style: { fill: "#64748b" } }}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Potencia (kW)', angle: -90, position: 'insideLeft', style: { fill: "#64748b" } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: 'black'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="potencia"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fill="url(#ldcGradientHidden)"
                  name="Potencia (kW)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica Por Hora oculta */}
          <div ref={horarioChartHiddenRef} data-chart-id="horario-hidden" style={{ marginBottom: '20px' }}>
            <ResponsiveContainer width={800} height={400}>
              <LineChart data={datosHorarioHidden}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="hora"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Hora del día', position: 'insideBottom', offset: -5, style: { fill: "#64748b" } }}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Potencia (kW)', angle: -90, position: 'insideLeft', style: { fill: "#64748b" } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: 'black'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="consumo"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Consumo (kW)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica Por Día oculta */}
          <div ref={diarioChartHiddenRef} data-chart-id="diario-hidden">
            <ResponsiveContainer width={800} height={400}>
              <AreaChart data={datosDiarioHidden}>
                <defs>
                  <linearGradient id="consumoGradientHidden" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="dia"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Día de la semana', position: 'insideBottom', offset: -5, style: { fill: "#64748b" } }}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Energía (kWh)', angle: -90, position: 'insideLeft', style: { fill: "#64748b" } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: 'black'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="consumo"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#consumoGradientHidden)"
                  name="Consumo (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
});

// Display name para debugging
GraficoCurvaCarga.displayName = 'GraficoCurvaCarga';
