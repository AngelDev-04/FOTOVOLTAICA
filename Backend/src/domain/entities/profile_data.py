"""
Entidad de Dominio: ProfileData
Representa el perfil de consumo con distribución diurna/nocturna y estacional
"""
from dataclasses import dataclass
from typing import Dict, Optional
from enum import Enum


class Season(str, Enum):
    """Estaciones o períodos del año"""
    DRY = "seca"
    RAINY = "lluviosa"
    TRANSITION = "transicion"
    ALL = "todo_el_ano"


@dataclass
class ProfileData:
    """
    Perfil de consumo eléctrico con distribución temporal.

    Permite analizar y ajustar el consumo según diferentes criterios:
    - Horario diurno vs nocturno
    - Estacionalidad (seca, lluviosa, transición)
    - Día laborable vs fin de semana

    Attributes:
        diurnal_kwh: Energía consumida en horario diurno (kWh)
        nocturnal_kwh: Energía consumida en horario nocturno (kWh)
        diurnal_percentage: Porcentaje de energía diurna (0-100)
        nocturnal_percentage: Porcentaje de energía nocturna (0-100)
        diurnal_start_hour: Hora de inicio del período diurno (0-23)
        diurnal_end_hour: Hora de fin del período diurno (0-23)
        weekday_kwh: Energía en días laborables
        weekend_kwh: Energía en fines de semana
        seasonal_distribution: Distribución por estación
        season_filter: Estación aplicada en el análisis
    """

    diurnal_kwh: float
    nocturnal_kwh: float
    diurnal_percentage: float
    nocturnal_percentage: float
    diurnal_start_hour: int = 6  # 06:00
    diurnal_end_hour: int = 18   # 18:00
    weekday_kwh: Optional[float] = None
    weekend_kwh: Optional[float] = None
    seasonal_distribution: Optional[Dict[Season, float]] = None
    season_filter: Season = Season.ALL

    def __post_init__(self):
        """Validaciones de dominio"""
        self._validate_energy()
        self._validate_percentages()
        self._validate_hours()

    def _validate_energy(self) -> None:
        """Valida que las energías sean no negativas"""
        if self.diurnal_kwh < 0:
            raise ValueError(f"Energía diurna no puede ser negativa: {self.diurnal_kwh}")

        if self.nocturnal_kwh < 0:
            raise ValueError(f"Energía nocturna no puede ser negativa: {self.nocturnal_kwh}")

    def _validate_percentages(self) -> None:
        """Valida que los porcentajes sumen aproximadamente 100%"""
        total = self.diurnal_percentage + self.nocturnal_percentage

        if not 99.9 <= total <= 100.1:  # Tolerancia para errores de redondeo
            raise ValueError(
                f"Los porcentajes deben sumar 100%, suma actual: {total:.2f}%"
            )

        if not 0 <= self.diurnal_percentage <= 100:
            raise ValueError(f"Porcentaje diurno fuera de rango: {self.diurnal_percentage}%")

        if not 0 <= self.nocturnal_percentage <= 100:
            raise ValueError(f"Porcentaje nocturno fuera de rango: {self.nocturnal_percentage}%")

    def _validate_hours(self) -> None:
        """Valida que las horas sean válidas"""
        if not 0 <= self.diurnal_start_hour <= 23:
            raise ValueError(f"Hora de inicio diurno inválida: {self.diurnal_start_hour}")

        if not 0 <= self.diurnal_end_hour <= 23:
            raise ValueError(f"Hora de fin diurno inválida: {self.diurnal_end_hour}")

    def get_total_energy(self) -> float:
        """Retorna la energía total (diurna + nocturna)"""
        return self.diurnal_kwh + self.nocturnal_kwh

    def is_predominantly_diurnal(self) -> bool:
        """Retorna True si el consumo es predominantemente diurno (>60%)"""
        return self.diurnal_percentage > 60.0

    def is_predominantly_nocturnal(self) -> bool:
        """Retorna True si el consumo es predominantemente nocturno (>60%)"""
        return self.nocturnal_percentage > 60.0

    def is_balanced(self) -> bool:
        """Retorna True si el consumo está balanceado (40-60% cada uno)"""
        return 40.0 <= self.diurnal_percentage <= 60.0

    def get_diurnal_hours_range(self) -> tuple[int, int]:
        """Retorna el rango de horas diurnas (inicio, fin)"""
        return (self.diurnal_start_hour, self.diurnal_end_hour)

    def get_weekday_percentage(self) -> Optional[float]:
        """Retorna el porcentaje de consumo en días laborables"""
        if self.weekday_kwh is None or self.weekend_kwh is None:
            return None

        total = self.weekday_kwh + self.weekend_kwh
        if total == 0:
            return 0.0

        return (self.weekday_kwh / total) * 100

    def get_weekend_percentage(self) -> Optional[float]:
        """Retorna el porcentaje de consumo en fines de semana"""
        if self.weekday_kwh is None or self.weekend_kwh is None:
            return None

        total = self.weekday_kwh + self.weekend_kwh
        if total == 0:
            return 0.0

        return (self.weekend_kwh / total) * 100

    def to_dict(self) -> dict:
        """Convierte el perfil a diccionario para serialización"""
        return {
            "diurnal_kwh": round(self.diurnal_kwh, 3),
            "nocturnal_kwh": round(self.nocturnal_kwh, 3),
            "total_kwh": round(self.get_total_energy(), 3),
            "diurnal_percentage": round(self.diurnal_percentage, 2),
            "nocturnal_percentage": round(self.nocturnal_percentage, 2),
            "diurnal_hours": {
                "start": self.diurnal_start_hour,
                "end": self.diurnal_end_hour,
                "range": f"{self.diurnal_start_hour:02d}:00 - {self.diurnal_end_hour:02d}:00"
            },
            "pattern": self._get_pattern_description(),
            "weekday_kwh": round(self.weekday_kwh, 3) if self.weekday_kwh else None,
            "weekend_kwh": round(self.weekend_kwh, 3) if self.weekend_kwh else None,
            "weekday_percentage": round(self.get_weekday_percentage(), 2) if self.get_weekday_percentage() else None,
            "weekend_percentage": round(self.get_weekend_percentage(), 2) if self.get_weekend_percentage() else None,
            "seasonal_distribution": self.seasonal_distribution,
            "season_filter": self.season_filter.value,
        }

    def _get_pattern_description(self) -> str:
        """Retorna una descripción del patrón de consumo"""
        if self.is_predominantly_diurnal():
            return "Consumo predominantemente diurno"
        elif self.is_predominantly_nocturnal():
            return "Consumo predominantemente nocturno"
        elif self.is_balanced():
            return "Consumo balanceado día/noche"
        else:
            return "Patrón de consumo variable"

    def __repr__(self) -> str:
        return (
            f"ProfileData("
            f"diurnal={self.diurnal_percentage:.1f}%, "
            f"nocturnal={self.nocturnal_percentage:.1f}%, "
            f"total={self.get_total_energy():.2f} kWh)"
        )
