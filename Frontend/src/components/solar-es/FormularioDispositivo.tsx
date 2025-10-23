import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dispositivo, DiaSemana } from "../../types/dispositivo";
import { validarDispositivo } from "../../utils/generadorDatosSinteticos";
import { toast } from "sonner";

interface FormularioDispositivoProps {
  darkMode: boolean;
  onAgregar: (dispositivo: Dispositivo) => void;
}

const DIAS_SEMANA: { label: string; value: DiaSemana }[] = [
  { label: "L", value: "lunes" },
  { label: "M", value: "martes" },
  { label: "M", value: "miercoles" },
  { label: "J", value: "jueves" },
  { label: "V", value: "viernes" },
  { label: "S", value: "sabado" },
  { label: "D", value: "domingo" },
];

export function FormularioDispositivo({ darkMode, onAgregar }: FormularioDispositivoProps) {
  const [nombre, setNombre] = useState("");
  const [diasSeleccionados, setDiasSeleccionados] = useState<DiaSemana[]>([]);
  const [horaInicio, setHoraInicio] = useState("00:00");
  const [horaFin, setHoraFin] = useState("23:59");
  const [potenciaKw, setPotenciaKw] = useState("");

  const toggleDia = (dia: DiaSemana) => {
    setDiasSeleccionados(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDiasSeleccionados([]);
    setHoraInicio("00:00");
    setHoraFin("23:59");
    setPotenciaKw("");
  };

  const handleAgregar = () => {
    const dispositivo: Partial<Dispositivo> = {
      nombre,
      dias: diasSeleccionados,
      horaInicio,
      horaFin,
      potenciaKw: parseFloat(potenciaKw),
    };

    const error = validarDispositivo(dispositivo);
    if (error) {
      toast.error(error);
      return;
    }

    const dispositivoCompleto: Dispositivo = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      dias: diasSeleccionados,
      horaInicio,
      horaFin,
      potenciaKw: parseFloat(potenciaKw),
    };

    onAgregar(dispositivoCompleto);
    limpiarFormulario();
    toast.success(`Dispositivo "${dispositivoCompleto.nombre}" agregado`);
  };

  return (
    <div className={`p-6 rounded-lg border ${
      darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
    }`}>
      <h4 className={`mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
        <span className="text-lg">🔌</span>
        Agregar Electrodoméstico
      </h4>

      <div className="space-y-4">
        {/* Nombre del dispositivo */}
        <div>
          <Label htmlFor="nombre" className={darkMode ? "text-slate-200" : ""}>
            Nombre del Dispositivo
          </Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Ej: Refrigerador, Lavadora, Aire Acondicionado"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
          />
        </div>

        {/* Días de uso */}
        <div>
          <Label className={darkMode ? "text-slate-200" : ""}>Días de uso</Label>
          <div className="flex gap-2 mt-2">
            {DIAS_SEMANA.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleDia(value)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  diasSeleccionados.includes(value)
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                    : darkMode
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Horario de uso */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="horaInicio" className={darkMode ? "text-slate-200" : ""}>
              Hora Inicio
            </Label>
            <Input
              id="horaInicio"
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="horaFin" className={darkMode ? "text-slate-200" : ""}>
              Hora Fin
            </Label>
            <Input
              id="horaFin"
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
            />
          </div>
        </div>

        {/* Potencia */}
        <div>
          <Label htmlFor="potencia" className={darkMode ? "text-slate-200" : ""}>
            Potencia (kW)
          </Label>
          <Input
            id="potencia"
            type="number"
            step="0.001"
            min="0"
            placeholder="0.150"
            value={potenciaKw}
            onChange={(e) => setPotenciaKw(e.target.value)}
            className={darkMode ? "bg-slate-700 border-slate-600 text-white" : ""}
          />
        </div>

        {/* Botón agregar */}
        <Button
          onClick={handleAgregar}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Dispositivo
        </Button>
      </div>
    </div>
  );
}
