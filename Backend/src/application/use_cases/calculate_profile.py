"""
Caso de Uso: CalculateProfileUseCase
Calcula perfil de consumo (diurno/nocturno, estacional)
"""
from typing import List

from ...domain.interfaces import DataProcessor
from ...domain.entities import ConsumptionRecord, ProfileData


class CalculateProfileError(Exception):
    """Excepción para errores al calcular perfil"""
    pass


class CalculateProfileUseCase:
    """
    Caso de uso para calcular perfil de consumo.

    El perfil permite entender:
    - Distribución diurna vs nocturna (configurable)
    - Consumo en días laborables vs fines de semana
    - Variaciones estacionales

    Esto es clave para:
    - Optimizar tarifas eléctricas
    - Dimensionar almacenamiento de energía
    - Ajustar patrones de consumo
    """

    def __init__(self, data_processor: DataProcessor):
        """
        Args:
            data_processor: Implementación de DataProcessor
        """
        self.data_processor = data_processor

    async def execute(
        self,
        records: List[ConsumptionRecord],
        diurnal_start_hour: int = 6,
        diurnal_end_hour: int = 18
    ) -> ProfileData:
        """
        Calcula el perfil de consumo.

        Args:
            records: Lista de registros de consumo
            diurnal_start_hour: Hora de inicio del período diurno (0-23)
            diurnal_end_hour: Hora de fin del período diurno (0-23)

        Returns:
            Objeto ProfileData con el perfil calculado

        Raises:
            CalculateProfileError: Si hay error al calcular perfil
        """
        try:
            # Validar que hay datos
            if not records:
                raise CalculateProfileError("No hay registros para calcular perfil")

            if len(records) < 24:
                raise CalculateProfileError(
                    f"Se requieren al menos 24 registros (1 día), recibidos: {len(records)}"
                )

            # Validar horas
            if not 0 <= diurnal_start_hour <= 23:
                raise CalculateProfileError(
                    f"Hora de inicio diurno inválida: {diurnal_start_hour} (debe ser 0-23)"
                )

            if not 0 <= diurnal_end_hour <= 23:
                raise CalculateProfileError(
                    f"Hora de fin diurno inválida: {diurnal_end_hour} (debe ser 0-23)"
                )

            # Calcular perfil usando el procesador
            profile_data = await self.data_processor.calculate_profile(
                records,
                diurnal_start=diurnal_start_hour,
                diurnal_end=diurnal_end_hour
            )

            print(f"OK: Perfil calculado:")
            print(f"   - Horario diurno: {diurnal_start_hour:02d}:00 - {diurnal_end_hour:02d}:00")
            print(f"   - Consumo diurno: {profile_data.diurnal_percentage:.1f}%")
            print(f"   - Consumo nocturno: {profile_data.nocturnal_percentage:.1f}%")
            print(f"   - Patrón: {profile_data._get_pattern_description()}")

            return profile_data

        except CalculateProfileError:
            raise
        except Exception as e:
            raise CalculateProfileError(f"Error calculando perfil: {str(e)}")
