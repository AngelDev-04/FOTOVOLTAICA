"""
Schemas de Request - Pydantic Models para peticiones API
"""
from pydantic import BaseModel, Field
from typing import Optional


class ProcessFileRequest(BaseModel):
    """Request para procesar archivo subido"""
    # El archivo viene en multipart/form-data, no en JSON
    # Este schema es para documentación
    pass


class CalculateProfileRequest(BaseModel):
    """Request para calcular perfil de consumo con parámetros personalizados"""

    diurnal_start_hour: int = Field(
        default=7,
        ge=0,
        le=23,
        description="Hora de inicio del período diurno (0-23). Por defecto 7 = 6:01am-6:59am",
        example=7
    )

    diurnal_end_hour: int = Field(
        default=20,
        ge=0,
        le=23,
        description="Hora de fin del período diurno (0-23). Por defecto 20 = 8:00pm-8:59pm",
        example=20
    )

    year: Optional[int] = Field(
        default=None,
        description="Año para filtrar datos. Si no se especifica, usa todos los datos",
        example=2016
    )

    month: Optional[int] = Field(
        default=None,
        ge=1,
        le=12,
        description="Mes para filtrar datos (1-12). Si no se especifica, usa todos los datos",
        example=1
    )

    class Config:
        json_schema_extra = {
            "example": {
                "diurnal_start_hour": 7,
                "diurnal_end_hour": 20,
                "year": 2016,
                "month": 1
            }
        }
