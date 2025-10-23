import { Trash2, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Dispositivo, DiaSemana } from "../../types/dispositivo";

interface ListaDispositivosProps {
  dispositivos: Dispositivo[];
  darkMode: boolean;
  onEliminar: (id: string) => void;
}

const DIAS_ABREV: Record<DiaSemana, string> = {
  lunes: "L",
  martes: "M",
  miercoles: "M",
  jueves: "J",
  viernes: "V",
  sabado: "S",
  domingo: "D",
};

export function ListaDispositivos({ dispositivos, darkMode, onEliminar }: ListaDispositivosProps) {
  if (dispositivos.length === 0) {
    return (
      <div className={`p-6 rounded-lg border text-center ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          No hay dispositivos agregados. Agregue al menos un dispositivo para generar datos.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg border ${
      darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
    }`}>
      <h4 className={`mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
        📋 Dispositivos Agregados ({dispositivos.length})
      </h4>

      <div className="space-y-3">
        {dispositivos.map((dispositivo, index) => (
          <div
            key={dispositivo.id}
            className={`p-4 rounded-lg border transition-all ${
              darkMode
                ? "bg-slate-700 border-slate-600 hover:border-slate-500"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {index + 1}. {dispositivo.nombre}
                  </span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>

                <div className={`space-y-1 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Días:</span>
                    <div className="flex gap-1">
                      {dispositivo.dias.map(dia => (
                        <span
                          key={dia}
                          className={`px-2 py-0.5 rounded text-xs ${
                            darkMode
                              ? "bg-slate-600 text-slate-200"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {DIAS_ABREV[dia]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Horario:</span> {dispositivo.horaInicio} - {dispositivo.horaFin}
                  </div>

                  <div>
                    <span className="font-medium">Potencia:</span> {dispositivo.potenciaKw.toFixed(3)} kW
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEliminar(dispositivo.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                title="Eliminar dispositivo"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
