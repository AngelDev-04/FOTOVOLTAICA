"""
Caso de Uso: ProcessFileUseCase
Procesa un archivo de datos de consumo (CSV/Excel)
"""
from typing import List, BinaryIO
from pathlib import Path

from ...domain.interfaces import DataProcessor
from ...domain.entities import ConsumptionRecord


class ProcessFileError(Exception):
    """Excepción para errores al procesar archivo"""
    pass


class ProcessFileUseCase:
    """
    Caso de uso para procesar archivos de consumo.

    Responsabilidades:
    - Validar formato de archivo
    - Leer y parsear datos
    - Validar registros
    - Retornar datos procesados

    Este caso de uso orquesta el procesamiento pero delega
    la lógica específica al DataProcessor (Pandas).
    """

    def __init__(self, data_processor: DataProcessor):
        """
        Args:
            data_processor: Implementación de DataProcessor (ej: PandasDataProcessor)
        """
        self.data_processor = data_processor

    async def execute_from_path(self, file_path: Path) -> List[ConsumptionRecord]:
        """
        Procesa un archivo desde una ruta local.

        Args:
            file_path: Ruta al archivo CSV o Excel

        Returns:
            Lista de registros de consumo validados

        Raises:
            ProcessFileError: Si hay error al procesar el archivo
        """
        try:
            # Validar que el archivo existe
            if not file_path.exists():
                raise ProcessFileError(f"Archivo no encontrado: {file_path}")

            # Determinar tipo de archivo
            extension = file_path.suffix.lower()

            # Leer según formato
            if extension == '.csv':
                records = await self.data_processor.read_csv_file(file_path)
            elif extension in ['.xlsx', '.xls']:
                records = await self.data_processor.read_excel_file(file_path)
            else:
                raise ProcessFileError(
                    f"Formato de archivo no soportado: {extension}. "
                    f"Use CSV o Excel (.xlsx, .xls)"
                )

            # Validar registros
            valid_records, errors = await self.data_processor.validate_records(records)

            # Log de errores pero continuar si hay al menos algunos registros válidos
            if errors:
                print(f"WARNING: Se encontraron {len(errors)} errores durante la validacion:")
                for error in errors[:10]:  # Mostrar solo primeros 10
                    print(f"   - {error}")

            if not valid_records:
                raise ProcessFileError("No se pudieron procesar registros válidos del archivo")

            print(f"OK: Archivo procesado: {len(valid_records)} registros validos")

            return valid_records

        except ProcessFileError:
            raise
        except Exception as e:
            raise ProcessFileError(f"Error procesando archivo: {str(e)}")

    async def execute_from_upload(
        self,
        file_content: BinaryIO,
        filename: str
    ) -> List[ConsumptionRecord]:
        """
        Procesa un archivo subido (en memoria).

        Args:
            file_content: Contenido del archivo en memoria
            filename: Nombre del archivo (para determinar formato)

        Returns:
            Lista de registros de consumo validados

        Raises:
            ProcessFileError: Si hay error al procesar el archivo
        """
        try:
            # Validar extensión
            extension = Path(filename).suffix.lower()
            if extension not in ['.csv', '.xlsx', '.xls']:
                raise ProcessFileError(
                    f"Formato de archivo no soportado: {extension}. "
                    f"Use CSV o Excel (.xlsx, .xls)"
                )

            # Leer archivo
            records = await self.data_processor.read_uploaded_file(
                file_content,
                filename
            )

            # Validar registros
            valid_records, errors = await self.data_processor.validate_records(records)

            # Log de errores
            if errors:
                print(f"WARNING: Se encontraron {len(errors)} errores durante la validacion:")
                for error in errors[:10]:
                    print(f"   - {error}")

            if not valid_records:
                raise ProcessFileError("No se pudieron procesar registros válidos del archivo")

            print(f"OK: Archivo '{filename}' procesado: {len(valid_records)} registros validos")

            return valid_records

        except ProcessFileError:
            raise
        except Exception as e:
            raise ProcessFileError(f"Error procesando archivo '{filename}': {str(e)}")
