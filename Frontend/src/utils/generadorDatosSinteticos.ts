import { Dispositivo, DatoSintetico, DiaSemana, ConfiguracionMes } from "../types/dispositivo";

/**
 * Obtiene el nombre del día de la semana en español
 */
function obtenerDiaSemana(fecha: Date): DiaSemana {
  const dias: DiaSemana[] = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  return dias[fecha.getDay()];
}

/**
 * Convierte una hora en formato "HH:mm" a número de hora (0-23)
 */
function extraerHora(horaStr: string): number {
  return parseInt(horaStr.split(':')[0]);
}

/**
 * Formatea un número para tener 2 dígitos (ej: 5 -> "05")
 */
function pad(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Genera datos sintéticos mensuales basados en dispositivos y su configuración
 *
 * @param dispositivos - Lista de dispositivos con sus horarios y consumo
 * @param config - Configuración del mes (mes, año, días del mes)
 * @returns Array de datos sintéticos con timestamp y potencia
 */
export function generarDatosMensuales(
  dispositivos: Dispositivo[],
  config: ConfiguracionMes
): DatoSintetico[] {
  const datos: DatoSintetico[] = [];
  const { mes, anio, diasDelMes } = config;

  // Para cada día del mes
  for (let dia = 1; dia <= diasDelMes; dia++) {
    const fecha = new Date(anio, mes - 1, dia);
    const diaSemana = obtenerDiaSemana(fecha);

    // Para cada hora del día (0-23)
    for (let hora = 0; hora < 24; hora++) {
      let potenciaTotal = 0;

      // Para cada dispositivo, verificar si está activo en este día y hora
      dispositivos.forEach(dispositivo => {
        // ¿Este dispositivo se usa este día de la semana?
        if (dispositivo.dias.includes(diaSemana)) {
          const horaInicio = extraerHora(dispositivo.horaInicio);
          const horaFin = extraerHora(dispositivo.horaFin);

          // ¿Esta hora está dentro del rango de uso?
          if (hora >= horaInicio && hora <= horaFin) {
            potenciaTotal += dispositivo.potenciaKw;
          }
        }
      });

      // Solo agregar registro si hay consumo (potencia > 0)
      if (potenciaTotal > 0) {
        const timestamp = `${anio}-${pad(mes)}-${pad(dia)} ${pad(hora)}:00:00`;
        datos.push({
          timestamp,
          power_kw: parseFloat(potenciaTotal.toFixed(3)) // Redondear a 3 decimales
        });
      }
    }
  }

  return datos;
}

/**
 * Valida que un dispositivo tenga todos los campos requeridos
 */
export function validarDispositivo(dispositivo: Partial<Dispositivo>): string | null {
  if (!dispositivo.nombre || dispositivo.nombre.trim() === '') {
    return 'El nombre del dispositivo es requerido';
  }

  if (!dispositivo.dias || dispositivo.dias.length === 0) {
    return 'Debe seleccionar al menos un día de la semana';
  }

  if (!dispositivo.horaInicio || !dispositivo.horaFin) {
    return 'Debe especificar el rango horario';
  }

  if (!dispositivo.potenciaKw || dispositivo.potenciaKw <= 0) {
    return 'La potencia debe ser mayor a 0 kW';
  }

  const horaInicio = extraerHora(dispositivo.horaInicio);
  const horaFin = extraerHora(dispositivo.horaFin);

  if (horaFin < horaInicio) {
    return 'La hora de fin debe ser posterior a la hora de inicio';
  }

  return null; // Sin errores
}

/**
 * Calcula el número de días de un mes específico
 */
export function obtenerDiasDelMes(mes: number, anio: number): number {
  return new Date(anio, mes, 0).getDate();
}
