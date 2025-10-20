"""
Domain Entities - Entidades de Dominio
Clean Architecture: Capa de Dominio
"""
from .consumption_record import ConsumptionRecord
from .metrics import Metrics
from .ldc_data import LDCData
from .profile_data import ProfileData, Season

__all__ = [
    "ConsumptionRecord",
    "Metrics",
    "LDCData",
    "ProfileData",
    "Season",
]
