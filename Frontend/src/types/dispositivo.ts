export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

export interface Dispositivo {
  id: string;
  nombre: string;
  dias: DiaSemana[];
  horaInicio: string; // Formato "HH:mm"
  horaFin: string; // Formato "HH:mm"
  potenciaKw: number;
}

export interface DatoSintetico {
  timestamp: string; // Formato "YYYY-MM-DD HH:mm:ss"
  power_kw: number;
}

export interface ConfiguracionMes {
  mes: number; // 1-12
  anio: number;
  diasDelMes: number; // 28, 29, 30, 31
}
