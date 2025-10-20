"""
Caso de Uso: CalculateLDCUseCase
Calcula la Load Duration Curve (Curva de Duración de Carga)
"""
from typing import List

from ...domain.interfaces import DataProcessor
from ...domain.entities import ConsumptionRecord, LDCData


class CalculateLDCError(Exception):
    """Excepción para errores al calcular LDC"""
    pass


class CalculateLDCUseCase:
    """
    Caso de uso para calcular Load Duration Curve.

    La LDC es fundamental para:
    - Dimensionamiento de sistemas fotovoltaicos
    - Análisis de carga base vs carga pico
    - Optimización de generación vs consumo

    Responsabilidades:
    - Validar datos suficientes
    - Calcular LDC
    - Retornar datos de la curva
    """

    def __init__(self, data_processor: DataProcessor):
        """
        Args:
            data_processor: Implementación de DataProcessor
        """
        self.data_processor = data_processor

    async def execute(self, records: List[ConsumptionRecord]) -> LDCData:
        """
        Calcula la Load Duration Curve.

        Args:
            records: Lista de registros de consumo

        Returns:
            Objeto LDCData con la curva calculada

        Raises:
            CalculateLDCError: Si hay error al calcular LDC
        """
        try:
            # Validar que hay datos
            if not records:
                raise CalculateLDCError("No hay registros para calcular LDC")

            if len(records) < 24:
                raise CalculateLDCError(
                    f"Se requieren al menos 24 registros (1 día), recibidos: {len(records)}"
                )

            # Calcular LDC usando el procesador
            ldc_data = await self.data_processor.calculate_ldc(records)

            print(f"OK: LDC calculada:")
            print(f"   - Carga base: {ldc_data.base_load:.2f} kW")
            print(f"   - Carga pico: {ldc_data.peak_load:.2f} kW")
            print(f"   - Total horas: {ldc_data.total_hours}")
            print(f"   - Puntos en curva: {len(ldc_data.power_values)}")

            return ldc_data

        except CalculateLDCError:
            raise
        except Exception as e:
            raise CalculateLDCError(f"Error calculando LDC: {str(e)}")
