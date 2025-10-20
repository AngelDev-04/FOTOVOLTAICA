import { useState } from "react";
import { FileSpreadsheet, Plus, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import { useUploadFile } from "../../hooks/useApi";

interface PanelCargaDatosProps {
  darkMode: boolean;
  onDataLoaded?: () => void;
}

export function PanelCargaDatos({ darkMode, onDataLoaded }: PanelCargaDatosProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const { data: uploadData, loading, error, uploadFile } = useUploadFile();
  const cargaExitosa = uploadData?.success || false;

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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className={`h-32 flex-col gap-3 ${
              darkMode 
                ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200" 
                : "bg-slate-50 hover:bg-slate-100"
            }`}>
              <Plus className="w-8 h-8 text-amber-500" />
              <div className="text-center">
                <p className="text-sm">Carga Manual</p>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Ingrese datos individualmente
                </p>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className={darkMode ? "bg-slate-800 border-slate-700 text-white" : ""}>
            <DialogHeader>
              <DialogTitle className={darkMode ? "text-white" : ""}>Ingreso Manual de Datos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="fecha" className={darkMode ? "text-slate-200" : ""}>Fecha</Label>
                <Input id="fecha" type="date" className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""} />
              </div>
              <div>
                <Label htmlFor="hora" className={darkMode ? "text-slate-200" : ""}>Hora</Label>
                <Input id="hora" type="time" className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""} />
              </div>
              <div>
                <Label htmlFor="potencia" className={darkMode ? "text-slate-200" : ""}>Potencia (kW)</Label>
                <Input id="potencia" type="number" step="0.01" placeholder="0.00" className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""} />
              </div>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                Guardar Registro
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
