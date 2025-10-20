import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FileSpreadsheet, Image, FileText, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PanelExportacionProps {
  darkMode: boolean;
  onExportPDF?: () => void;
}

export function PanelExportacion({ darkMode, onExportPDF }: PanelExportacionProps) {
  const handleExport = (tipo: string) => {
    toast.success(`Exportando datos en formato ${tipo}...`);
  };

  return (
    <Card className={`p-6 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
      <div className="mb-6">
        <h3 className={darkMode ? "text-white" : "text-slate-900"}>
          Exportación de Datos
        </h3>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Descargue tablas, gráficos o reportes completos
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className={`h-auto py-4 flex-col gap-2 ${
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200" 
              : "bg-slate-50 hover:bg-slate-100"
          }`}
          onClick={() => handleExport("CSV")}
        >
          <FileSpreadsheet className="w-6 h-6 text-green-600" />
          <span className="text-sm">Exportar CSV</span>
        </Button>
        
        <Button
          variant="outline"
          className={`h-auto py-4 flex-col gap-2 ${
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200" 
              : "bg-slate-50 hover:bg-slate-100"
          }`}
          onClick={() => handleExport("Excel")}
        >
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          <span className="text-sm">Exportar Excel</span>
        </Button>
        
        <Button
          variant="outline"
          className={`h-auto py-4 flex-col gap-2 ${
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200" 
              : "bg-slate-50 hover:bg-slate-100"
          }`}
          onClick={() => handleExport("PNG")}
        >
          <Image className="w-6 h-6 text-purple-600" />
          <span className="text-sm">Gráficos PNG</span>
        </Button>
        
        <Button
          variant="outline"
          className={`h-auto py-4 flex-col gap-2 ${
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200" 
              : "bg-slate-50 hover:bg-slate-100"
          }`}
          onClick={() => handleExport("SVG")}
        >
          <Image className="w-6 h-6 text-indigo-600" />
          <span className="text-sm">Gráficos SVG</span>
        </Button>
      </div>
      
      <div className="mt-4">
        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          onClick={() => {
            if (onExportPDF) {
              onExportPDF();
              toast.success("Generando reporte PDF...");
            } else {
              handleExport("PDF");
            }
          }}
        >
          <FileText className="w-5 h-5 mr-2" />
          Generar Reporte Completo (PDF)
        </Button>
      </div>
      
      <div className={`mt-4 p-3 rounded-lg text-xs ${
        darkMode ? "bg-slate-700/50 text-slate-300" : "bg-blue-50 text-blue-800"
      }`}>
        💾 Los archivos se descargarán automáticamente a su dispositivo
      </div>
    </Card>
  );
}
