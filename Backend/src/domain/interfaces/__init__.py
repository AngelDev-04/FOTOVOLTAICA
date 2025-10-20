"""
Domain Interfaces - Interfaces de Dominio (Puertos)
Clean Architecture: Capa de Dominio
"""
from .data_repository import DataRepository
from .data_processor import DataProcessor

__all__ = [
    "DataRepository",
    "DataProcessor",
]
