"""
Caso de Uso: CalculateMetricsUseCase
Calcula métricas de consumo a partir de registros
"""
from typing import List

from ...domain.interfaces import DataProcessor
from ...domain.entities import ConsumptionRecord, Metrics


class CalculateMetricsError(Exception):
    """Excepción para errores al calcular métricas"""
    pass


class CalculateMetricsUseCase:
    """
    Caso de uso para calcular métricas de consumo.

    Responsabilidades:
    - Validar que hay datos suficientes
    - Calcular todas las métricas
    - Retornar métricas calculadas

    Delega el cálculo real al DataProcessor.
    """

    def __init__(self, data_processor: DataProcessor):
        """
        Args:
            data_processor: Implementación de DataProcessor
        """
        self.data_processor = data_processor

    async def execute(self, records: List[ConsumptionRecord]) -> Metrics:
        """
        Calcula métricas de consumo.

        Args:
            records: Lista de registros de consumo

        Returns:
            Objeto Metrics con todas las métricas calculadas

        Raises:
            CalculateMetricsError: Si hay error al calcular métricas
        """
        try:
            # Validar que hay datos
            if not records:
                raise CalculateMetricsError("No hay registros para calcular métricas")

            if len(records) < 24:
                raise CalculateMetricsError(
                    f"Se requieren al menos 24 registros (1 día), recibidos: {len(records)}"
                )

            # Calcular métricas usando el procesador
            metrics = await self.data_processor.calculate_metrics(records)

            print(f"OK: Métricas calculadas para {metrics.total_records} registros")
            print(f"   - Total: {metrics.total_energy_kwh:.2f} kWh")
            print(f"   - Promedio: {metrics.average_power_kw:.2f} kW")
            print(f"   - Pico: {metrics.peak_power_kw:.2f} kW")
            print(f"   - Factor de carga: {metrics.calculate_load_factor():.2%}")

            return metrics

        except CalculateMetricsError:
            raise
        except Exception as e:
            raise CalculateMetricsError(f"Error calculando métricas: {str(e)}")
