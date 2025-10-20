"""
Entidad de Dominio: Metrics
Representa las métricas calculadas del consumo eléctrico
"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Metrics:
    """
    Métricas de consumo eléctrico calculadas a partir de los registros.

    Contiene todas las métricas principales que se muestran en el dashboard:
    energía total, promedios, picos, etc.

    Attributes:
        total_energy_kwh: Energía total consumida en el período (kWh)
        average_power_kw: Potencia promedio (kW)
        peak_power_kw: Potencia pico (máxima) (kW)
        min_power_kw: Potencia mínima (kW)
        total_records: Número total de registros analizados
        start_date: Fecha de inicio del período
        end_date: Fecha de fin del período
        daily_average_kwh: Energía promedio diaria (kWh/día)
        monthly_average_kwh: Energía promedio mensual (kWh/mes)
        peak_timestamp: Fecha y hora del pico de consumo
        diurnal_percentage: Porcentaje de energía consumida en horario diurno (%)
        nocturnal_percentage: Porcentaje de energía consumida en horario nocturno (%)
        weekday_average_kwh: Promedio de consumo en días laborables
        weekend_average_kwh: Promedio de consumo en fines de semana
    """

    total_energy_kwh: float
    average_power_kw: float
    peak_power_kw: float
    min_power_kw: float
    total_records: int
    start_date: datetime
    end_date: datetime

    # Métricas opcionales
    daily_average_kwh: Optional[float] = None
    monthly_average_kwh: Optional[float] = None
    peak_timestamp: Optional[datetime] = None
    diurnal_percentage: Optional[float] = None
    nocturnal_percentage: Optional[float] = None
    weekday_average_kwh: Optional[float] = None
    weekend_average_kwh: Optional[float] = None

    def __post_init__(self):
        """Validaciones de dominio"""
        self._validate_energy()
        self._validate_power()
        self._validate_records()
        self._validate_dates()

    def _validate_energy(self) -> None:
        """Valida que la energía total sea positiva"""
        if self.total_energy_kwh < 0:
            raise ValueError(f"Energía total no puede ser negativa: {self.total_energy_kwh}")

    def _validate_power(self) -> None:
        """Valida que las potencias sean razonables"""
        if self.average_power_kw < 0:
            raise ValueError(f"Potencia promedio no puede ser negativa: {self.average_power_kw}")

        if self.peak_power_kw < self.average_power_kw:
            raise ValueError(
                f"Potencia pico ({self.peak_power_kw}) no puede ser menor que "
                f"potencia promedio ({self.average_power_kw})"
            )

        if self.min_power_kw > self.average_power_kw:
            raise ValueError(
                f"Potencia mínima ({self.min_power_kw}) no puede ser mayor que "
                f"potencia promedio ({self.average_power_kw})"
            )

    def _validate_records(self) -> None:
        """Valida que haya al menos un registro"""
        if self.total_records <= 0:
            raise ValueError(f"Debe haber al menos 1 registro, recibido: {self.total_records}")

    def _validate_dates(self) -> None:
        """Valida que las fechas sean coherentes"""
        if self.end_date < self.start_date:
            raise ValueError(
                f"Fecha fin ({self.end_date}) no puede ser anterior a fecha inicio ({self.start_date})"
            )

    def get_period_days(self) -> int:
        """Retorna la cantidad de días en el período analizado"""
        return (self.end_date - self.start_date).days + 1

    def get_period_hours(self) -> int:
        """Retorna la cantidad de horas en el período analizado"""
        return int((self.end_date - self.start_date).total_seconds() / 3600)

    def calculate_load_factor(self) -> float:
        """
        Calcula el factor de carga (load factor)
        Factor de carga = Potencia promedio / Potencia pico

        Retorna un valor entre 0 y 1, donde:
        - Cercano a 1: consumo constante (ideal)
        - Cercano a 0: consumo muy variable con grandes picos
        """
        if self.peak_power_kw == 0:
            return 0.0
        return self.average_power_kw / self.peak_power_kw

    def to_dict(self) -> dict:
        """Convierte las métricas a diccionario para serialización"""
        return {
            "total_energy_kwh": round(self.total_energy_kwh, 3),
            "average_power_kw": round(self.average_power_kw, 3),
            "peak_power_kw": round(self.peak_power_kw, 3),
            "min_power_kw": round(self.min_power_kw, 3),
            "total_records": self.total_records,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "period_days": self.get_period_days(),
            "daily_average_kwh": round(self.daily_average_kwh, 3) if self.daily_average_kwh else None,
            "monthly_average_kwh": round(self.monthly_average_kwh, 3) if self.monthly_average_kwh else None,
            "peak_timestamp": self.peak_timestamp.isoformat() if self.peak_timestamp else None,
            "diurnal_percentage": round(self.diurnal_percentage, 2) if self.diurnal_percentage else None,
            "nocturnal_percentage": round(self.nocturnal_percentage, 2) if self.nocturnal_percentage else None,
            "weekday_average_kwh": round(self.weekday_average_kwh, 3) if self.weekday_average_kwh else None,
            "weekend_average_kwh": round(self.weekend_average_kwh, 3) if self.weekend_average_kwh else None,
            "load_factor": round(self.calculate_load_factor(), 3),
        }

    def __repr__(self) -> str:
        return (
            f"Metrics("
            f"total_energy={self.total_energy_kwh:.2f} kWh, "
            f"avg_power={self.average_power_kw:.2f} kW, "
            f"peak={self.peak_power_kw:.2f} kW, "
            f"records={self.total_records})"
        )
