"""
Schemas de Response - Pydantic Models para respuestas API
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class MetricsResponse(BaseModel):
    """Response con métricas de consumo"""

    total_energy_kwh: float = Field(..., description="Energía total consumida (kWh)")
    average_power_kw: float = Field(..., description="Potencia promedio (kW)")
    peak_power_kw: float = Field(..., description="Potencia pico (kW)")
    min_power_kw: float = Field(..., description="Potencia mínima (kW)")
    total_records: int = Field(..., description="Número total de registros")
    start_date: str = Field(..., description="Fecha de inicio (ISO)")
    end_date: str = Field(..., description="Fecha de fin (ISO)")
    period_days: int = Field(..., description="Días en el período")
    daily_average_kwh: Optional[float] = Field(None, description="Promedio diario (kWh/día)")
    monthly_average_kwh: Optional[float] = Field(None, description="Promedio mensual (kWh/mes)")
    peak_timestamp: Optional[str] = Field(None, description="Timestamp del pico (ISO)")
    diurnal_percentage: Optional[float] = Field(None, description="% energía diurna")
    nocturnal_percentage: Optional[float] = Field(None, description="% energía nocturna")
    weekday_average_kwh: Optional[float] = Field(None, description="Promedio días laborables")
    weekend_average_kwh: Optional[float] = Field(None, description="Promedio fines de semana")
    load_factor: float = Field(..., description="Factor de carga (0-1)")

    class Config:
        json_schema_extra = {
            "example": {
                "total_energy_kwh": 42563.125,
                "average_power_kw": 1.184,
                "peak_power_kw": 3.647,
                "min_power_kw": 0.263,
                "total_records": 35952,
                "start_date": "2016-01-06T00:00:00",
                "end_date": "2020-07-07T23:00:00",
                "period_days": 1644,
                "daily_average_kwh": 25.89,
                "monthly_average_kwh": 776.7,
                "peak_timestamp": "2016-01-06T17:00:00",
                "load_factor": 0.325
            }
        }


class LDCResponse(BaseModel):
    """Response con datos de Load Duration Curve"""

    power_values: List[float] = Field(..., description="Potencias ordenadas (kW)")
    duration_percentage: List[float] = Field(..., description="Porcentajes de duración (0-100)")
    total_hours: int = Field(..., description="Total de horas analizadas")
    base_load: float = Field(..., description="Carga base (kW)")
    peak_load: float = Field(..., description="Carga pico (kW)")
    average_load: float = Field(..., description="Carga promedio (kW)")
    curve_points_100: List[List[float]] = Field(..., description="100 puntos de la curva para graficar")

    class Config:
        json_schema_extra = {
            "example": {
                "power_values": [3.647, 3.326, 3.212, "..."],
                "duration_percentage": [0.0, 0.002, 0.005, "..."],
                "total_hours": 35952,
                "base_load": 0.263,
                "peak_load": 3.647,
                "average_load": 1.184,
                "curve_points_100": [[0.0, 3.647], [1.0, 3.5], "..."]
            }
        }


class ProfileResponse(BaseModel):
    """Response con perfil de consumo"""

    diurnal_kwh: float = Field(..., description="Energía diurna (kWh)")
    nocturnal_kwh: float = Field(..., description="Energía nocturna (kWh)")
    total_kwh: float = Field(..., description="Energía total (kWh)")
    diurnal_percentage: float = Field(..., description="% energía diurna")
    nocturnal_percentage: float = Field(..., description="% energía nocturna")
    diurnal_hours: Dict[str, Any] = Field(..., description="Horario diurno configurado")
    pattern: str = Field(..., description="Descripción del patrón de consumo")
    weekday_kwh: Optional[float] = Field(None, description="Energía días laborables")
    weekend_kwh: Optional[float] = Field(None, description="Energía fines de semana")
    weekday_percentage: Optional[float] = Field(None, description="% días laborables")
    weekend_percentage: Optional[float] = Field(None, description="% fines de semana")

    class Config:
        json_schema_extra = {
            "example": {
                "diurnal_kwh": 25000.0,
                "nocturnal_kwh": 17563.125,
                "total_kwh": 42563.125,
                "diurnal_percentage": 58.7,
                "nocturnal_percentage": 41.3,
                "diurnal_hours": {
                    "start": 6,
                    "end": 18,
                    "range": "06:00 - 18:00"
                },
                "pattern": "Consumo predominantemente diurno",
                "weekday_kwh": 30000.0,
                "weekend_kwh": 12563.125
            }
        }


class HeatmapResponse(BaseModel):
    """Response con datos para heatmap"""

    hours: List[int] = Field(..., description="Horas del día (0-23)")
    dates: List[str] = Field(..., description="Fechas (YYYY-MM-DD)")
    values: List[List[float]] = Field(..., description="Matriz de valores [día][hora]")
    max_value: float = Field(..., description="Valor máximo en el heatmap")
    min_value: float = Field(..., description="Valor mínimo en el heatmap")

    class Config:
        json_schema_extra = {
            "example": {
                "hours": [0, 1, 2, "...", 23],
                "dates": ["2016-01-06", "2016-01-07", "..."],
                "values": [[1.057, 1.171, 0.56, "..."], ["..."]],
                "max_value": 3.647,
                "min_value": 0.263
            }
        }


class UploadResponse(BaseModel):
    """Response después de subir y procesar archivo"""

    success: bool = Field(..., description="Si el procesamiento fue exitoso")
    message: str = Field(..., description="Mensaje descriptivo")
    records_processed: int = Field(..., description="Número de registros procesados")
    records_valid: int = Field(..., description="Número de registros válidos")
    errors: List[str] = Field(default_factory=list, description="Lista de errores encontrados")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Archivo procesado exitosamente",
                "records_processed": 35952,
                "records_valid": 35952,
                "errors": []
            }
        }


class HourlyDataResponse(BaseModel):
    """Response con datos horarios de un día específico"""

    date: str = Field(..., description="Fecha del día (YYYY-MM-DD)")
    hours: List[int] = Field(..., description="Horas del día (0-23)")
    consumption: List[float] = Field(..., description="Consumo por hora (kWh)")
    total_kwh: float = Field(..., description="Total consumido en el día (kWh)")
    peak_hour: int = Field(..., description="Hora de pico de consumo")
    peak_value: float = Field(..., description="Valor de pico (kWh)")

    class Config:
        json_schema_extra = {
            "example": {
                "date": "2016-06-01",
                "hours": [0, 1, 2, "...", 23],
                "consumption": [1.057, 1.171, 0.56, "..."],
                "total_kwh": 28.5,
                "peak_hour": 17,
                "peak_value": 3.2
            }
        }


class WeeklyDataResponse(BaseModel):
    """Response con datos por día de una semana específica"""

    week: int = Field(..., description="Número de semana del año (1-52)")
    year: int = Field(..., description="Año")
    start_date: str = Field(..., description="Fecha de inicio de la semana (YYYY-MM-DD)")
    end_date: str = Field(..., description="Fecha de fin de la semana (YYYY-MM-DD)")
    days: List[str] = Field(..., description="Nombres de los días (Lun-Dom)")
    dates: List[str] = Field(..., description="Fechas de cada día (YYYY-MM-DD)")
    consumption: List[float] = Field(..., description="Consumo por día (kWh)")
    total_kwh: float = Field(..., description="Total consumido en la semana (kWh)")
    peak_day: str = Field(..., description="Día con mayor consumo")
    peak_value: float = Field(..., description="Valor de pico (kWh)")

    class Config:
        json_schema_extra = {
            "example": {
                "week": 23,
                "year": 2016,
                "start_date": "2016-06-06",
                "end_date": "2016-06-12",
                "days": ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
                "dates": ["2016-06-06", "2016-06-07", "..."],
                "consumption": [145.2, 152.8, 148.3, 158.1, 162.5, 135.7, 128.4],
                "total_kwh": 1031.0,
                "peak_day": "Vie",
                "peak_value": 162.5
            }
        }


class ErrorResponse(BaseModel):
    """Response para errores"""

    success: bool = Field(default=False, description="Siempre false en errores")
    error: str = Field(..., description="Tipo de error")
    message: str = Field(..., description="Mensaje de error detallado")
    details: Optional[Dict] = Field(None, description="Detalles adicionales del error")

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "ProcessFileError",
                "message": "Error procesando archivo: formato no soportado",
                "details": {"filename": "data.txt", "extension": ".txt"}
            }
        }
