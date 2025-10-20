"""
Entidad de Dominio: ConsumptionRecord
Representa un registro individual de consumo eléctrico
"""
from datetime import datetime
from typing import Optional
from dataclasses import dataclass


@dataclass
class ConsumptionRecord:
    """
    Registro de consumo eléctrico en un momento específico.

    Representa la unidad básica de datos del sistema: un valor de consumo
    en kWh medido en una fecha y hora específica.

    Attributes:
        timestamp: Fecha y hora del registro
        value_kwh: Consumo en kilovatios-hora (kWh)
        day_of_week: Día de la semana (0=Lunes, 6=Domingo)
        notes: Clasificación o notas (ej: "weekday", "weekend", "COVID_lockdown")
        record_id: Identificador único del registro (opcional)
    """

    timestamp: datetime
    value_kwh: float
    day_of_week: int
    notes: str = "weekday"
    record_id: Optional[str] = None

    def __post_init__(self):
        """Validaciones de dominio"""
        self._validate_value()
        self._validate_day_of_week()
        self._validate_timestamp()

    def _validate_value(self) -> None:
        """Valida que el consumo sea un valor positivo razonable"""
        if self.value_kwh < 0:
            raise ValueError(f"El consumo no puede ser negativo: {self.value_kwh}")

        # Límite ajustado para soportar consumo industrial/comercial grande
        # Valores mayores a 100,000 kWh/hora son probablemente errores
        if self.value_kwh > 100000:
            raise ValueError(f"Consumo extremadamente alto (probablemente error): {self.value_kwh} kWh")

    def _validate_day_of_week(self) -> None:
        """Valida que el día de la semana esté en rango válido"""
        if not 0 <= self.day_of_week <= 6:
            raise ValueError(f"Día de la semana inválido: {self.day_of_week} (debe ser 0-6)")

    def _validate_timestamp(self) -> None:
        """Valida que el timestamp sea una fecha válida"""
        if not isinstance(self.timestamp, datetime):
            raise TypeError(f"timestamp debe ser datetime, recibido: {type(self.timestamp)}")

    def is_weekend(self) -> bool:
        """Retorna True si el registro corresponde a fin de semana"""
        return self.day_of_week in [5, 6]  # Sábado=5, Domingo=6

    def is_peak_hour(self) -> bool:
        """
        Retorna True si el registro corresponde a hora pico (17:00-22:00)
        Basado en el análisis del dataset real
        """
        hour = self.timestamp.hour
        return 17 <= hour <= 22

    def is_off_peak_hour(self) -> bool:
        """Retorna True si el registro corresponde a hora valle (00:00-06:00)"""
        hour = self.timestamp.hour
        return 0 <= hour <= 6

    def get_hour(self) -> int:
        """Retorna la hora del día (0-23)"""
        return self.timestamp.hour

    def get_date(self) -> str:
        """Retorna la fecha en formato ISO (YYYY-MM-DD)"""
        return self.timestamp.date().isoformat()

    def __repr__(self) -> str:
        return (
            f"ConsumptionRecord("
            f"timestamp={self.timestamp.isoformat()}, "
            f"value_kwh={self.value_kwh:.3f}, "
            f"notes={self.notes})"
        )
