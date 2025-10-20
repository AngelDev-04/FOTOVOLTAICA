"""
Interface: DataRepository
Define el contrato para almacenar y recuperar datos de consumo
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime
from ..entities import ConsumptionRecord


class DataRepository(ABC):
    """
    Repositorio abstracto para gestión de datos de consumo.

    Define las operaciones básicas de persistencia sin especificar
    la implementación concreta (puede ser archivo, base de datos, memoria, etc.)
    """

    @abstractmethod
    async def save(self, record: ConsumptionRecord) -> None:
        """
        Guarda un registro de consumo.

        Args:
            record: Registro de consumo a guardar

        Raises:
            RepositoryError: Si hay error al guardar
        """
        pass

    @abstractmethod
    async def save_batch(self, records: List[ConsumptionRecord]) -> int:
        """
        Guarda múltiples registros de consumo en lote.

        Args:
            records: Lista de registros a guardar

        Returns:
            Número de registros guardados exitosamente

        Raises:
            RepositoryError: Si hay error al guardar
        """
        pass

    @abstractmethod
    async def find_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> List[ConsumptionRecord]:
        """
        Busca registros en un rango de fechas.

        Args:
            start_date: Fecha de inicio
            end_date: Fecha de fin

        Returns:
            Lista de registros en el rango especificado

        Raises:
            RepositoryError: Si hay error en la búsqueda
        """
        pass

    @abstractmethod
    async def find_all(self) -> List[ConsumptionRecord]:
        """
        Recupera todos los registros almacenados.

        Returns:
            Lista de todos los registros

        Raises:
            RepositoryError: Si hay error en la recuperación
        """
        pass

    @abstractmethod
    async def delete_all(self) -> int:
        """
        Elimina todos los registros.

        Returns:
            Número de registros eliminados

        Raises:
            RepositoryError: Si hay error al eliminar
        """
        pass

    @abstractmethod
    async def count(self) -> int:
        """
        Cuenta el total de registros almacenados.

        Returns:
            Número total de registros

        Raises:
            RepositoryError: Si hay error al contar
        """
        pass
