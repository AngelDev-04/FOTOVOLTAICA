"""
Interface: DataProcessor
Define el contrato para procesamiento de datos de consumo
"""
from abc import ABC, abstractmethod
from typing import List, BinaryIO
from pathlib import Path
from ..entities import ConsumptionRecord, Metrics, LDCData, ProfileData


class DataProcessor(ABC):
    """
    Procesador abstracto para análisis de datos de consumo.

    Define las operaciones de procesamiento y cálculo sin especificar
    la implementación concreta (Pandas, NumPy, etc.)
    """

    @abstractmethod
    async def read_csv_file(self, file_path: Path) -> List[ConsumptionRecord]:
        """
        Lee un archivo CSV y convierte a registros de consumo.

        Args:
            file_path: Ruta al archivo CSV

        Returns:
            Lista de registros de consumo

        Raises:
            ProcessorError: Si hay error al leer o parsear el archivo
        """
        pass

    @abstractmethod
    async def read_excel_file(self, file_path: Path) -> List[ConsumptionRecord]:
        """
        Lee un archivo Excel y convierte a registros de consumo.

        Args:
            file_path: Ruta al archivo Excel (.xlsx o .xls)

        Returns:
            Lista de registros de consumo

        Raises:
            ProcessorError: Si hay error al leer o parsear el archivo
        """
        pass

    @abstractmethod
    async def read_uploaded_file(
        self,
        file_content: BinaryIO,
        filename: str
    ) -> List[ConsumptionRecord]:
        """
        Lee un archivo subido (en memoria) y convierte a registros.

        Args:
            file_content: Contenido del archivo en memoria
            filename: Nombre del archivo (para determinar formato)

        Returns:
            Lista de registros de consumo

        Raises:
            ProcessorError: Si hay error al leer o parsear el archivo
        """
        pass

    @abstractmethod
    async def calculate_metrics(
        self,
        records: List[ConsumptionRecord]
    ) -> Metrics:
        """
        Calcula métricas de consumo a partir de registros.

        Args:
            records: Lista de registros de consumo

        Returns:
            Objeto con todas las métricas calculadas

        Raises:
            ProcessorError: Si hay error en los cálculos
        """
        pass

    @abstractmethod
    async def calculate_ldc(
        self,
        records: List[ConsumptionRecord]
    ) -> LDCData:
        """
        Calcula la Load Duration Curve (LDC) a partir de registros.

        Args:
            records: Lista de registros de consumo

        Returns:
            Datos de la curva LDC

        Raises:
            ProcessorError: Si hay error en los cálculos
        """
        pass

    @abstractmethod
    async def calculate_profile(
        self,
        records: List[ConsumptionRecord],
        diurnal_start: int = 6,
        diurnal_end: int = 18
    ) -> ProfileData:
        """
        Calcula el perfil de consumo (diurno/nocturno, estacional).

        Args:
            records: Lista de registros de consumo
            diurnal_start: Hora de inicio del período diurno (0-23)
            diurnal_end: Hora de fin del período diurno (0-23)

        Returns:
            Datos del perfil de consumo

        Raises:
            ProcessorError: Si hay error en los cálculos
        """
        pass

    @abstractmethod
    async def generate_heatmap_data(
        self,
        records: List[ConsumptionRecord]
    ) -> dict:
        """
        Genera datos para el heatmap de consumo (24h x días).

        Args:
            records: Lista de registros de consumo

        Returns:
            Diccionario con estructura del heatmap

        Raises:
            ProcessorError: Si hay error al generar los datos
        """
        pass

    @abstractmethod
    async def validate_records(
        self,
        records: List[ConsumptionRecord]
    ) -> tuple[List[ConsumptionRecord], List[str]]:
        """
        Valida registros y detecta anomalías.

        Args:
            records: Lista de registros a validar

        Returns:
            Tupla (registros_válidos, lista_de_errores)

        Raises:
            ProcessorError: Si hay error crítico en validación
        """
        pass
