"""
Implementación concreta: PandasDataProcessor
Procesamiento de datos usando Pandas y NumPy
"""
import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, BinaryIO
from datetime import datetime
import io

from ...domain.interfaces import DataProcessor
from ...domain.entities import (
    ConsumptionRecord,
    Metrics,
    LDCData,
    ProfileData,
    Season
)


class ProcessorError(Exception):
    """Excepción para errores de procesamiento"""
    pass


class PandasDataProcessor(DataProcessor):
    """
    Procesador de datos usando Pandas.

    Implementa todos los métodos de DataProcessor usando
    Pandas para operaciones eficientes sobre grandes datasets.
    """

    async def read_csv_file(self, file_path: Path) -> List[ConsumptionRecord]:
        """Lee archivo CSV y convierte a registros"""
        try:
            df = pd.read_csv(file_path)
            return await self._dataframe_to_records(df)
        except Exception as e:
            raise ProcessorError(f"Error leyendo CSV {file_path}: {str(e)}")

    async def read_excel_file(self, file_path: Path) -> List[ConsumptionRecord]:
        """Lee archivo Excel y convierte a registros"""
        try:
            df = pd.read_excel(file_path)
            return await self._dataframe_to_records(df)
        except Exception as e:
            raise ProcessorError(f"Error leyendo Excel {file_path}: {str(e)}")

    async def read_uploaded_file(
        self,
        file_content: BinaryIO,
        filename: str
    ) -> List[ConsumptionRecord]:
        """Lee archivo subido (en memoria) y convierte a registros"""
        try:
            # Determinar formato por extensión
            extension = Path(filename).suffix.lower()

            if extension == '.csv':
                df = pd.read_csv(file_content)
            elif extension in ['.xlsx', '.xls']:
                df = pd.read_excel(file_content)
            else:
                raise ProcessorError(f"Formato de archivo no soportado: {extension}")

            return await self._dataframe_to_records(df)

        except Exception as e:
            raise ProcessorError(f"Error leyendo archivo {filename}: {str(e)}")

    async def _dataframe_to_records(self, df: pd.DataFrame) -> List[ConsumptionRecord]:
        """
        Convierte DataFrame a lista de ConsumptionRecord.

        Formatos soportados:
        - StartDate, Value (kWh), day_of_week, notes
        - StartDate, Value (kWh)
        - timestamp, value_kwh
        """
        records = []

        # Normalizar nombres de columnas
        df.columns = df.columns.str.strip()

        # Detectar columnas de fecha y valor
        date_col = None
        value_col = None

        for col in df.columns:
            col_lower = col.lower()
            # Detectar columna de fecha (inglés y español)
            if any(keyword in col_lower for keyword in ['date', 'time', 'timestamp', 'fecha', 'hora']):
                date_col = col
            # Detectar columna de valor (inglés y español)
            elif any(keyword in col_lower for keyword in ['value', 'kwh', 'power', 'potencia', 'consumo', 'mw', 'kw']):
                value_col = col

        if not date_col or not value_col:
            raise ProcessorError(
                f"No se encontraron columnas de fecha y valor. "
                f"Columnas disponibles: {list(df.columns)}"
            )

        # Preprocesar y convertir fecha a datetime
        # Guardar columna original como string antes de intentar parsear
        date_strings_original = df[date_col].astype(str).copy()

        # Intentar detectar formato Año-Día-Mes y corregirlo a Año-Mes-Día
        try:
            # Primero intentar parsear normalmente (Año-Mes-Día)
            df[date_col] = pd.to_datetime(df[date_col], errors='coerce')

            # Si hay muchos valores NaT (Not a Time), probablemente el formato es Año-Día-Mes
            nat_count = df[date_col].isna().sum()
            if nat_count > len(df) * 0.1:  # Si más del 10% son NaT
                print(f"WARNING: Detectado posible formato Año-Día-Mes ({nat_count} fechas inválidas), intentando corregir...")

                # Intentar parsear con formato Año-Día-Mes
                df[date_col] = pd.to_datetime(date_strings_original, format='%Y-%d-%m %H:%M:%S', errors='coerce')

                # Si aún falla, intentar sin hora
                if df[date_col].isna().sum() > len(df) * 0.1:
                    df[date_col] = pd.to_datetime(date_strings_original, format='%Y-%d-%m', errors='coerce')

                corrected = len(df) - df[date_col].isna().sum()
                print(f"OK: Formato corregido exitosamente - {corrected} fechas parseadas")

        except Exception as e:
            print(f"WARNING: Error en preprocesamiento de fechas: {e}")
            # Intentar parseo estándar como fallback
            df[date_col] = pd.to_datetime(df[date_col], errors='coerce')

        # Procesar cada fila
        for idx, row in df.iterrows():
            try:
                timestamp = row[date_col]
                value_kwh = float(row[value_col])

                # day_of_week (0=Lunes, 6=Domingo)
                day_of_week = timestamp.weekday()

                # notes
                notes = "weekday"
                if 'notes' in df.columns:
                    notes = str(row['notes'])
                elif day_of_week in [5, 6]:
                    notes = "weekend"

                record = ConsumptionRecord(
                    timestamp=timestamp,
                    value_kwh=value_kwh,
                    day_of_week=day_of_week,
                    notes=notes,
                    record_id=f"rec_{idx}"
                )

                records.append(record)

            except Exception as e:
                # Log error pero continuar procesando
                print(f"Warning: Error en fila {idx}: {str(e)}")
                continue

        if not records:
            raise ProcessorError("No se pudieron procesar registros del archivo")

        return records

    async def calculate_metrics(
        self,
        records: List[ConsumptionRecord]
    ) -> Metrics:
        """Calcula métricas de consumo"""
        if not records:
            raise ProcessorError("No hay registros para calcular métricas")

        # Convertir a DataFrame para cálculos eficientes
        df = pd.DataFrame([
            {
                'timestamp': r.timestamp,
                'value_kwh': r.value_kwh,
                'day_of_week': r.day_of_week,
                'notes': r.notes
            }
            for r in records
        ])

        # Métricas básicas
        total_energy_kwh = df['value_kwh'].sum()
        average_power_kw = df['value_kwh'].mean()
        peak_power_kw = df['value_kwh'].max()
        min_power_kw = df['value_kwh'].min()

        # Fechas
        start_date = df['timestamp'].min()
        end_date = df['timestamp'].max()
        total_records = len(df)

        # Métricas adicionales
        period_days = (end_date - start_date).days + 1
        daily_average_kwh = total_energy_kwh / period_days if period_days > 0 else 0
        monthly_average_kwh = daily_average_kwh * 30  # Aproximado

        # Timestamp del pico
        peak_idx = df['value_kwh'].idxmax()
        peak_timestamp = df.loc[peak_idx, 'timestamp']

        # Weekday vs Weekend
        weekday_df = df[df['day_of_week'] < 5]
        weekend_df = df[df['day_of_week'] >= 5]

        weekday_average_kwh = weekday_df['value_kwh'].mean() if len(weekday_df) > 0 else 0
        weekend_average_kwh = weekend_df['value_kwh'].mean() if len(weekend_df) > 0 else 0

        # Crear entidad Metrics
        metrics = Metrics(
            total_energy_kwh=total_energy_kwh,
            average_power_kw=average_power_kw,
            peak_power_kw=peak_power_kw,
            min_power_kw=min_power_kw,
            total_records=total_records,
            start_date=start_date,
            end_date=end_date,
            daily_average_kwh=daily_average_kwh,
            monthly_average_kwh=monthly_average_kwh,
            peak_timestamp=peak_timestamp,
            weekday_average_kwh=weekday_average_kwh,
            weekend_average_kwh=weekend_average_kwh,
        )

        return metrics

    async def calculate_ldc(
        self,
        records: List[ConsumptionRecord]
    ) -> LDCData:
        """Calcula la Load Duration Curve"""
        if not records:
            raise ProcessorError("No hay registros para calcular LDC")

        # Extraer valores de potencia
        power_values = np.array([r.value_kwh for r in records])

        # Ordenar de MAYOR a MENOR
        power_sorted = np.sort(power_values)[::-1]

        # Calcular duración acumulada (porcentaje)
        total_hours = len(power_values)
        duration_percentage = np.linspace(0, 100, total_hours)

        # Base load y peak load
        peak_load = float(power_sorted[0])
        base_load = float(power_sorted[-1])

        ldc = LDCData(
            power_values=power_sorted.tolist(),
            duration_percentage=duration_percentage.tolist(),
            total_hours=total_hours,
            base_load=base_load,
            peak_load=peak_load
        )

        return ldc

    async def calculate_profile(
        self,
        records: List[ConsumptionRecord],
        diurnal_start: int = 6,
        diurnal_end: int = 18
    ) -> ProfileData:
        """Calcula perfil de consumo diurno/nocturno"""
        if not records:
            raise ProcessorError("No hay registros para calcular perfil")

        # Convertir a DataFrame
        df = pd.DataFrame([
            {
                'timestamp': r.timestamp,
                'value_kwh': r.value_kwh,
                'hour': r.get_hour(),
                'day_of_week': r.day_of_week,
                'notes': r.notes
            }
            for r in records
        ])

        # Clasificar diurno/nocturno
        is_diurnal = (df['hour'] >= diurnal_start) & (df['hour'] < diurnal_end)

        diurnal_kwh = df[is_diurnal]['value_kwh'].sum()
        nocturnal_kwh = df[~is_diurnal]['value_kwh'].sum()
        total_kwh = diurnal_kwh + nocturnal_kwh

        diurnal_percentage = (diurnal_kwh / total_kwh * 100) if total_kwh > 0 else 0
        nocturnal_percentage = (nocturnal_kwh / total_kwh * 100) if total_kwh > 0 else 0

        # Weekday vs Weekend
        weekday_kwh = df[df['day_of_week'] < 5]['value_kwh'].sum()
        weekend_kwh = df[df['day_of_week'] >= 5]['value_kwh'].sum()

        profile = ProfileData(
            diurnal_kwh=diurnal_kwh,
            nocturnal_kwh=nocturnal_kwh,
            diurnal_percentage=diurnal_percentage,
            nocturnal_percentage=nocturnal_percentage,
            diurnal_start_hour=diurnal_start,
            diurnal_end_hour=diurnal_end,
            weekday_kwh=weekday_kwh,
            weekend_kwh=weekend_kwh,
        )

        return profile

    async def generate_heatmap_data(
        self,
        records: List[ConsumptionRecord]
    ) -> dict:
        """Genera datos para heatmap 24h x días"""
        if not records:
            raise ProcessorError("No hay registros para generar heatmap")

        # Convertir a DataFrame
        df = pd.DataFrame([
            {
                'timestamp': r.timestamp,
                'value_kwh': r.value_kwh,
                'hour': r.get_hour(),
                'date': r.get_date(),
            }
            for r in records
        ])

        # Crear pivot table: filas=días, columnas=horas
        heatmap = df.pivot_table(
            values='value_kwh',
            index='date',
            columns='hour',
            aggfunc='mean',
            fill_value=0
        )

        # Convertir a formato JSON-serializable
        heatmap_data = {
            "hours": list(range(24)),
            "dates": heatmap.index.tolist(),
            "values": heatmap.values.tolist(),
            "max_value": float(heatmap.max().max()),
            "min_value": float(heatmap.min().min()),
        }

        return heatmap_data

    async def validate_records(
        self,
        records: List[ConsumptionRecord]
    ) -> tuple[List[ConsumptionRecord], List[str]]:
        """Valida registros y detecta anomalías"""
        valid_records = []
        errors = []

        for i, record in enumerate(records):
            try:
                # Las validaciones ya están en la entidad ConsumptionRecord
                # Aquí agregamos validaciones adicionales si es necesario

                # Validar que no sea un valor extremadamente alto (solo rechazar valores absurdos)
                if record.value_kwh > 100000:  # >100,000 kWh/hora es extremadamente alto
                    errors.append(
                        f"Registro {i}: Valor extremadamente alto ({record.value_kwh} kWh) "
                        f"en {record.timestamp} - RECHAZADO"
                    )
                    continue  # No agregar este registro

                # Advertencia para valores altos pero válidos (solo mostrar algunos)
                if record.value_kwh > 50000 and i % 1000 == 0:  # Mostrar cada 1000 registros
                    print(f"Info: Registro {i}: Consumo industrial alto: {record.value_kwh} kWh")

                valid_records.append(record)

            except Exception as e:
                errors.append(f"Registro {i}: {str(e)}")

        return valid_records, errors
