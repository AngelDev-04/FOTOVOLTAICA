import { useState } from "react";
import { FileSpreadsheet, Plus, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { useUploadFile } from "../../hooks/useApi";
import { Dispositivo } from "../../types/dispositivo";
import { FormularioDispositivo } from "./FormularioDispositivo";
import { ListaDispositivos } from "./ListaDispositivos";
import { generarDatosMensuales, obtenerDiasDelMes } from "../../utils/generadorDatosSinteticos";

interface PanelCargaDatosProps {
  darkMode: boolean;
  onDataLoaded?: () => void;
}

export function PanelCargaDatos({ darkMode, onDataLoaded }: PanelCargaDatosProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const { data: uploadData, loading, error, uploadFile } = useUploadFile();
  const cargaExitosa = uploadData?.success || false;

  // Estado para carga manual con dispositivos
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [mesSeleccionado, setMesSeleccionado] = useState<number>(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(new Date().getFullYear());
  const [diasDelMes, setDiasDelMes] = useState<number>(30);
  const [generando, setGenerando] = useState(false);
  const [dialogAbierto, setDialogAbierto] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv' || extension === 'xlsx' || extension === 'xls') {
        setArchivo(file);

        try {
          // Subir archivo al backend
          const result = await uploadFile(file);
          toast.success(`Archivo procesado: ${result.records_valid} registros válidos`);

          // Notificar que los datos se cargaron
          if (onDataLoaded) {
            onDataLoaded();
          }
        } catch (error) {
          console.error('Error subiendo archivo:', error);
          toast.error(error instanceof Error ? error.message : 'Error al procesar archivo');
          setArchivo(null);
        }
      } else {
        setArchivo(null);
        toast.error("Formato no válido. Use CSV o XLSX");
      }
    }
  };

  const handleAgregarDispositivo = (dispositivo: Dispositivo) => {
    setDispositivos(prev => [...prev, dispositivo]);
  };

  const handleEliminarDispositivo = (id: string) => {
    setDispositivos(prev => prev.filter(d => d.id !== id));
    toast.info("Dispositivo eliminado");
  };

  const handleActualizarMes = (mes: number) => {
    setMesSeleccionado(mes);
    const dias = obtenerDiasDelMes(mes, anioSeleccionado);
    setDiasDelMes(dias);
  };

  const handleGenerarDatosSinteticos = async () => {
    if (dispositivos.length === 0) {
      toast.error("Debe agregar al menos un dispositivo");
      return;
    }

    setGenerando(true);
    try {
      // Generar datos sintéticos
      const datosSinteticos = generarDatosMensuales(dispositivos, {
        mes: mesSeleccionado,
        anio: anioSeleccionado,
        diasDelMes: diasDelMes,
      });

      if (datosSinteticos.length === 0) {
        toast.error("No se generaron datos. Verifique la configuración de los dispositivos.");
        setGenerando(false);
        return;
      }

      // Convertir a CSV para enviar al backend
      const csvContent = [
        "timestamp,power_kw",
        ...datosSinteticos.map(d => `${d.timestamp},${d.power_kw}`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], `datos_sinteticos_${mesSeleccionado}_${anioSeleccionado}.csv`, { type: 'text/csv' });

      // Subir archivo al backend
      const result = await uploadFile(file);
      toast.success(`Datos sintéticos generados: ${result.records_valid} registros válidos`);

      // Notificar que los datos se cargaron
      if (onDataLoaded) {
        onDataLoaded();
      }

      // Cerrar el dialog y limpiar
      setDialogAbierto(false);
      setDispositivos([]);
    } catch (error) {
      console.error('Error generando datos sintéticos:', error);
      toast.error(error instanceof Error ? error.message : 'Error al generar datos sintéticos');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Card className={`p-6 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={darkMode ? "text-white" : "text-slate-900"}>
            Carga de Datos
          </h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Importe datos de consumo eléctrico
          </p>
        </div>
        
        {cargaExitosa && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">Datos cargados</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button variant="outline" className={`h-32 flex-col gap-3 ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
                : "bg-slate-50 hover:bg-slate-100"
            }`}>
              <Sparkles className="w-8 h-8 text-amber-500" />
              <div className="text-center">
                <p className="text-sm">Generación Sintética</p>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Basado en dispositivos
                </p>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`max-w-4xl !p-0 ${darkMode ? "bg-slate-900 border-slate-700 text-white" : ""}`}
            style={{
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <DialogHeader className="flex-shrink-0 px-6 pt-6">
              <DialogTitle className={darkMode ? "text-white" : ""}>
                Generación de Datos Sintéticos
              </DialogTitle>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Configure los electrodomésticos y sus patrones de uso para generar datos mensuales
              </p>
            </DialogHeader>

            {/* Contenido scrolleable */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-6">
              {/* Formulario para agregar dispositivos */}
              <FormularioDispositivo
                darkMode={darkMode}
                onAgregar={handleAgregarDispositivo}
              />

              {/* Lista de dispositivos agregados */}
              <ListaDispositivos
                dispositivos={dispositivos}
                darkMode={darkMode}
                onEliminar={handleEliminarDispositivo}
              />

              {/* Configuración del mes */}
              <div className={`p-6 rounded-lg border ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <h4 className={`mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
                  📅 Configuración del Mes
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mes" className={darkMode ? "text-slate-200" : ""}>
                      Mes
                    </Label>
                    <Select
                      value={mesSeleccionado.toString()}
                      onValueChange={(v) => handleActualizarMes(parseInt(v))}
                    >
                      <SelectTrigger className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Enero</SelectItem>
                        <SelectItem value="2">Febrero</SelectItem>
                        <SelectItem value="3">Marzo</SelectItem>
                        <SelectItem value="4">Abril</SelectItem>
                        <SelectItem value="5">Mayo</SelectItem>
                        <SelectItem value="6">Junio</SelectItem>
                        <SelectItem value="7">Julio</SelectItem>
                        <SelectItem value="8">Agosto</SelectItem>
                        <SelectItem value="9">Septiembre</SelectItem>
                        <SelectItem value="10">Octubre</SelectItem>
                        <SelectItem value="11">Noviembre</SelectItem>
                        <SelectItem value="12">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="diasDelMes" className={darkMode ? "text-slate-200" : ""}>
                      Días del mes
                    </Label>
                    <Select
                      value={diasDelMes.toString()}
                      onValueChange={(v) => setDiasDelMes(parseInt(v))}
                    >
                      <SelectTrigger className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="28">28 días</SelectItem>
                        <SelectItem value="29">29 días</SelectItem>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="31">31 días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-lg ${
                  darkMode ? "bg-slate-700/50" : "bg-blue-50"
                }`}>
                  <p className={`text-xs ${darkMode ? "text-slate-300" : "text-blue-800"}`}>
                    ℹ️ Se generarán datos sintéticos replicando el patrón semanal configurado
                    para todos los días del mes seleccionado. Las potencias de dispositivos que
                    operen simultáneamente se sumarán.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción - Siempre visibles */}
            <div className={`flex gap-3 px-6 pb-6 pt-4 border-t flex-shrink-0 ${
              darkMode ? "border-slate-700" : "border-slate-200"
            }`}>
              <Button
                onClick={handleGenerarDatosSinteticos}
                disabled={generando || dispositivos.length === 0}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {generando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Datos Sintéticos
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDispositivos([]);
                  toast.info("Dispositivos eliminados");
                }}
                disabled={generando || dispositivos.length === 0}
                className={darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""}
              >
                Limpiar Todo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <label className={`h-32 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
          darkMode
            ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            : "bg-slate-50 hover:bg-slate-100 border-slate-300"
        }`}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <FileSpreadsheet className="w-8 h-8 text-blue-500" />
          <div className="text-center">
            <p className="text-sm">Carga Masiva</p>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              CSV o XLSX
            </p>
          </div>
          {archivo && (
            <p className="text-xs text-green-600 dark:text-green-400">
              {archivo.name}
            </p>
          )}
        </label>
      </div>
      
      <div className={`mt-4 p-4 rounded-lg ${
        darkMode ? "bg-slate-700/50" : "bg-blue-50"
      }`}>
        <p className={`text-xs ${darkMode ? "text-slate-300" : "text-blue-800"}`}>
          💡 Los archivos deben contener columnas: Fecha, Hora, Potencia (kW)
        </p>
      </div>
    </Card>
  );
}
