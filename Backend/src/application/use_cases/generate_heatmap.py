"""
Caso de Uso: GenerateHeatmapUseCase
Genera datos para heatmap de consumo (24h x días)
"""
from typing import List

from ...domain.interfaces import DataProcessor
from ...domain.entities import ConsumptionRecord


class GenerateHeatmapError(Exception):
    """Excepción para errores al generar heatmap"""
    pass


class GenerateHeatmapUseCase:
    """
    Caso de uso para generar datos de heatmap.

    El heatmap muestra:
    - Consumo por hora del día (eje X: 0-23)
    - A lo largo de múltiples días (eje Y: fechas)
    - Intensidad de color según magnitud del consumo

    Es útil para:
    - Identificar patrones visuales rápidamente
    - Detectar anomalías
    - Ver evolución temporal del consumo
    """

    def __init__(self, data_processor: DataProcessor):
        """
        Args:
            data_processor: Implementación de DataProcessor
        """
        self.data_processor = data_processor

    async def execute(self, records: List[ConsumptionRecord]) -> dict:
        """
        Genera datos para heatmap.

        Args:
            records: Lista de registros de consumo

        Returns:
            Diccionario con estructura del heatmap:
            {
                "hours": [0, 1, 2, ..., 23],
                "dates": ["2016-01-06", "2016-01-07", ...],
                "values": [[...], [...], ...],  # Matriz
                "max_value": float,
                "min_value": float
            }

        Raises:
            GenerateHeatmapError: Si hay error al generar heatmap
        """
        try:
            # Validar que hay datos
            if not records:
                raise GenerateHeatmapError("No hay registros para generar heatmap")

            if len(records) < 24:
                raise GenerateHeatmapError(
                    f"Se requieren al menos 24 registros (1 día), recibidos: {len(records)}"
                )

            # Generar datos del heatmap usando el procesador
            heatmap_data = await self.data_processor.generate_heatmap_data(records)

            print(f"OK: Heatmap generado:")
            print(f"   - Días: {len(heatmap_data['dates'])}")
            print(f"   - Horas por día: {len(heatmap_data['hours'])}")
            print(f"   - Valor máximo: {heatmap_data['max_value']:.2f} kWh")
            print(f"   - Valor mínimo: {heatmap_data['min_value']:.2f} kWh")

            return heatmap_data

        except GenerateHeatmapError:
            raise
        except Exception as e:
            raise GenerateHeatmapError(f"Error generando heatmap: {str(e)}")
