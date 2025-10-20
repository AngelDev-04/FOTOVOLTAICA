import { useState, useEffect, useRef } from "react";
import { BarraLateral } from "./components/solar-es/BarraLateral";
import { Encabezado } from "./components/solar-es/Encabezado";
import { TarjetaMetrica } from "./components/solar-es/TarjetaMetrica";
import { PanelCargaDatos } from "./components/solar-es/PanelCargaDatos";
import { GraficoCurvaCarga, GraficoCurvaCargaHandle } from "./components/solar-es/GraficoCurvaCarga";
import { MapaCalor } from "./components/solar-es/MapaCalor";
import { ControlesPerfil } from "./components/solar-es/ControlesPerfil";
import { PanelExportacion } from "./components/solar-es/PanelExportacion";
import ErrorBoundary from "./components/ErrorBoundary";
import { Zap, Activity, Gauge, TrendingUp } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { useMetrics } from "./hooks/useApi";
import { useChartCapture } from "./hooks/useChartCapture";
import { ReportePDF } from "./components/solar-es/ReportePDF";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export default function App() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [darkMode, setDarkMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { data: metricsData, loading: metricsLoading, fetchMetrics } = useMetrics();
  const { captureChart, capturing } = useChartCapture();

  // Referencias para capturar gráficas
  const graficoCurvaCargaRef = useRef<GraficoCurvaCargaHandle>(null);

  // Fetch metrics when data is loaded
  useEffect(() => {
    if (dataLoaded) {
      fetchMetrics().catch((err) => {
        console.error('Error fetching metrics:', err);
        // Don't throw, just log the error to prevent blank page
      });
    }
  }, [dataLoaded]);

  const handleDataLoaded = () => {
    setDataLoaded(true);
  };

  const handleExportPDF = async () => {
    if (!dataLoaded || !metricsData) {
      toast.error('No hay datos cargados para generar el reporte');
      return;
    }

    if (capturing) {
      toast.warning('Ya se está generando un reporte, por favor espere...');
      return;
    }

    try {
      toast.info('Generando reporte PDF...', { duration: 3000 });

      // 1. Obtener elementos de las gráficas
      console.log('🔍 DEBUG App.tsx:');
      console.log('  graficoCurvaCargaRef.current:', graficoCurvaCargaRef.current);
      console.log('  Type of current:', typeof graficoCurvaCargaRef.current);
      
      if (graficoCurvaCargaRef.current) {
        console.log('  Keys in current:', Object.keys(graficoCurvaCargaRef.current));
        console.log('  getChartElements exists?', 'getChartElements' in graficoCurvaCargaRef.current);
        console.log('  Type of getChartElements:', typeof (graficoCurvaCargaRef.current as any).getChartElements);
      }
      
      const chartElements = graficoCurvaCargaRef.current?.getChartElements();

      if (!chartElements) {
        throw new Error('No se pudieron obtener las gráficas');
      }

      // 2. Capturar las 3 gráficas como imágenes
      toast.info('Capturando gráficas...', { duration: 2000 });

      // Validar que todas las gráficas existan
      if (!chartElements.ldcChart || !chartElements.horarioChart || !chartElements.diarioChart) {
        throw new Error('Una o más gráficas no están disponibles. Asegúrese de que los datos estén cargados.');
      }

      // Capturar LDC
      const ldcImg = await captureChart(chartElements.ldcChart, 2);

      // Capturar Por Hora (Consumo Horario Diario)
      const horarioImg = await captureChart(chartElements.horarioChart, 2);

      // Capturar Por Día (Consumo Diario Semanal)
      const diarioImg = await captureChart(chartElements.diarioChart, 2);

      // 3. Preparar datos del reporte
      const reportData = {
        metricas: {
          energiaTotal: (metricsData.total_energy_kwh / 1000).toFixed(1),
          potenciaPico: metricsData.peak_power_kw.toFixed(1),
          potenciaMedia: metricsData.average_power_kw.toFixed(1),
          factorCarga: (metricsData.load_factor * 100).toFixed(1),
        },
        graficas: {
          ldc: ldcImg.dataUrl,
          porHora: horarioImg.dataUrl,
          porDia: diarioImg.dataUrl,
        },
        fechaGeneracion: new Date().toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // 4. Generar PDF
      const pdfDoc = pdf(<ReportePDF {...reportData} />);
      const blob = await pdfDoc.toBlob();

      // 5. Descargar PDF
      const fileName = `reporte-fotovoltaico-${new Date().toISOString().split('T')[0]}.pdf`;
      saveAs(blob, fileName);

      toast.success('Reporte PDF generado exitosamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el reporte PDF. Intente nuevamente.');
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark bg-slate-950" : "bg-slate-50"}`}>
      <Toaster theme={darkMode ? "dark" : "light"} />
      
      <BarraLateral 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Encabezado darkMode={darkMode} />
        
        <main className={`flex-1 overflow-y-auto transition-colors ${
          darkMode ? "bg-slate-950" : "bg-slate-50"
        }`}>
          <div className="p-8 max-w-[1600px] mx-auto">
            {activeTab === "inicio" && (
              <div className="space-y-6">
                <div>
                  <h2 className={darkMode ? "text-white" : "text-slate-900"}>
                    Vista General del Sistema
                  </h2>
                  <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
                    Monitoreo en tiempo real de su sistema fotovoltaico
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <TarjetaMetrica
                    titulo="Energía Total"
                    valor={metricsLoading ? "..." : metricsData ? (metricsData.total_energy_kwh / 1000).toFixed(1) : "0.0"}
                    unidad="MWh"
                    icono={Zap}
                    color="amber"
                    darkMode={darkMode}
                  />
                  <TarjetaMetrica
                    titulo="Potencia Pico"
                    valor={metricsLoading ? "..." : metricsData ? metricsData.peak_power_kw.toFixed(1) : "0.0"}
                    unidad="kW"
                    icono={Activity}
                    color="blue"
                    darkMode={darkMode}
                  />
                  <TarjetaMetrica
                    titulo="Potencia Media"
                    valor={metricsLoading ? "..." : metricsData ? metricsData.average_power_kw.toFixed(1) : "0.0"}
                    unidad="kW"
                    icono={Gauge}
                    color="green"
                    darkMode={darkMode}
                  />
                  <TarjetaMetrica
                    titulo="Factor de Carga"
                    valor={metricsLoading ? "..." : metricsData ? (metricsData.load_factor * 100).toFixed(1) : "0.0"}
                    unidad="%"
                    icono={TrendingUp}
                    color="purple"
                    darkMode={darkMode}
                  />
                </div>

                <PanelCargaDatos darkMode={darkMode} onDataLoaded={handleDataLoaded} />

                <GraficoCurvaCarga ref={graficoCurvaCargaRef} darkMode={darkMode} dataLoaded={dataLoaded} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <MapaCalor darkMode={darkMode} dataLoaded={dataLoaded} />
                  </div>
                  <div className="space-y-6">
                    <ErrorBoundary>
                      <ControlesPerfil darkMode={darkMode} dataLoaded={dataLoaded} />
                    </ErrorBoundary>
                    <PanelExportacion darkMode={darkMode} onExportPDF={handleExportPDF} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curvas" && (
              <div className="space-y-6">
                <div>
                  <h2 className={darkMode ? "text-white" : "text-slate-900"}>
                    Análisis de Curvas de Carga
                  </h2>
                  <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
                    Visualización detallada de patrones de consumo y generación
                  </p>
                </div>

                {/* Referencia para capturar gráficas en el PDF */}
                <GraficoCurvaCarga 
                  ref={graficoCurvaCargaRef}
                  darkMode={darkMode} 
                  dataLoaded={dataLoaded} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ErrorBoundary>
                    <ControlesPerfil darkMode={darkMode} dataLoaded={dataLoaded} />
                  </ErrorBoundary>
                  <PanelExportacion darkMode={darkMode} onExportPDF={handleExportPDF} />
                </div>
              </div>
            )}

            {activeTab === "mapa-calor" && (
              <div className="space-y-6">
                <div>
                  <h2 className={darkMode ? "text-white" : "text-slate-900"}>
                    Mapa de Calor de Consumo
                  </h2>
                  <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
                    Análisis visual de patrones horarios y semanales
                  </p>
                </div>

                <MapaCalor darkMode={darkMode} dataLoaded={dataLoaded} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ErrorBoundary>
                    <ControlesPerfil darkMode={darkMode} dataLoaded={dataLoaded} />
                  </ErrorBoundary>
                  <PanelExportacion darkMode={darkMode} onExportPDF={handleExportPDF} />
                </div>
              </div>
            )}
            
            {activeTab === "reportes" && (
              <div className="space-y-6">
                <div>
                  <h2 className={darkMode ? "text-white" : "text-slate-900"}>
                    Reportes y Exportación
                  </h2>
                  <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
                    Genere y descargue reportes técnicos completos
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PanelExportacion darkMode={darkMode} onExportPDF={handleExportPDF} />
                  
                  <div className={`p-6 rounded-lg border ${
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                  }`}>
                    <h3 className={`mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
                      Resumen Ejecutivo
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b" style={{
                        borderColor: darkMode ? "#475569" : "#e2e8f0"
                      }}>
                        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                          Energía Total (Mes)
                        </span>
                        <span className={darkMode ? "text-white" : "text-slate-900"}>
                          4,374 kWh
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b" style={{
                        borderColor: darkMode ? "#475569" : "#e2e8f0"
                      }}>
                        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                          Ahorro Estimado
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          $523.00
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b" style={{
                        borderColor: darkMode ? "#475569" : "#e2e8f0"
                      }}>
                        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                          CO₂ Evitado
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          2.18 ton
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                          Rendimiento Promedio
                        </span>
                        <span className={darkMode ? "text-white" : "text-slate-900"}>
                          85.3%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "configuracion" && (
              <div className="space-y-6">
                <div>
                  <h2 className={darkMode ? "text-white" : "text-slate-900"}>
                    Configuración del Sistema
                  </h2>
                  <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
                    Ajustes y parámetros del sistema de monitoreo
                  </p>
                </div>
                
                <div className={`rounded-lg p-12 text-center border ${
                  darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}>
                  <p className={darkMode ? "text-slate-400" : "text-slate-400"}>
                    Panel de configuración en desarrollo...
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
