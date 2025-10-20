"""
Routes: Analysis Endpoints
Endpoints para análisis de datos de consumo eléctrico
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
from datetime import datetime, timedelta

from .....application.use_cases import (
    ProcessFileUseCase,
    CalculateMetricsUseCase,
    CalculateLDCUseCase,
    CalculateProfileUseCase,
    GenerateHeatmapUseCase,
    ProcessFileError,
    CalculateMetricsError,
    CalculateLDCError,
    CalculateProfileError,
    GenerateHeatmapError,
)
from .....domain.entities import ConsumptionRecord
from .....infrastructure.services import PandasDataProcessor
from ..schemas import (
    UploadResponse,
    MetricsResponse,
    LDCResponse,
    ProfileResponse,
    HeatmapResponse,
    HourlyDataResponse,
    WeeklyDataResponse,
    CalculateProfileRequest,
    ErrorResponse,
)

router = APIRouter(prefix="/api/v1", tags=["analysis"])

# Estado global para almacenar registros procesados (temporal)
# TODO: Reemplazar con repositorio persistente
_current_records: List[ConsumptionRecord] = []


def get_data_processor() -> PandasDataProcessor:
    """Dependency injection para DataProcessor"""
    return PandasDataProcessor()


@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Subir y procesar archivo de consumo",
    description="Sube un archivo CSV o Excel con datos de consumo eléctrico y lo procesa"
)
async def upload_file(
    file: UploadFile = File(..., description="Archivo CSV o Excel con datos de consumo"),
    processor: PandasDataProcessor = Depends(get_data_processor)
):
    """
    Endpoint para subir y procesar archivo de consumo.

    **Formatos aceptados:**
    - CSV (.csv)
    - Excel (.xlsx, .xls)

    **Estructura esperada:**
    - Columna de fecha/hora (StartDate, timestamp, etc.)
    - Columna de consumo (Value (kWh), value_kwh, power, etc.)
    - Opcional: day_of_week, notes

    **Ejemplo de CSV:**
    ```csv
    StartDate,Value (kWh),day_of_week,notes
    2016-01-06 00:00:00,1.057,2,weekday
    2016-01-06 01:00:00,1.171,2,weekday
    ...
    ```
    """
    global _current_records

    try:
        # Validar tipo de archivo
        if not file.filename:
            raise HTTPException(status_code=400, detail="Nombre de archivo no proporcionado")

        # Leer contenido del archivo
        file_content = await file.read()

        # Crear caso de uso
        process_use_case = ProcessFileUseCase(processor)

        # Procesar archivo
        import io
        records = await process_use_case.execute_from_upload(
            file_content=io.BytesIO(file_content),
            filename=file.filename
        )

        # Guardar registros en memoria (temporal)
        _current_records = records

        return UploadResponse(
            success=True,
            message=f"Archivo '{file.filename}' procesado exitosamente",
            records_processed=len(records),
            records_valid=len(records),
            errors=[]
        )

    except ProcessFileError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.get(
    "/metrics",
    response_model=MetricsResponse,
    summary="Obtener métricas de consumo",
    description="Calcula y retorna todas las métricas del dataset cargado"
)
async def get_metrics(
    processor: PandasDataProcessor = Depends(get_data_processor)
):
    """
    Endpoint para obtener métricas de consumo.

    **Métricas calculadas:**
    - Energía total (kWh)
    - Potencia promedio, pico y mínima (kW)
    - Promedios diarios y mensuales
    - Factor de carga
    - Distribución weekday/weekend

    **Requiere:** Haber subido previamente un archivo con POST /upload
    """
    global _current_records

    try:
        if not _current_records:
            raise HTTPException(
                status_code=400,
                detail="No hay datos cargados. Suba un archivo primero con POST /upload"
            )

        # Crear caso de uso
        metrics_use_case = CalculateMetricsUseCase(processor)

        # Calcular métricas
        metrics = await metrics_use_case.execute(_current_records)

        # Convertir a dict para response
        return MetricsResponse(**metrics.to_dict())

    except CalculateMetricsError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.get(
    "/ldc",
    response_model=LDCResponse,
    summary="Obtener Load Duration Curve",
    description="Calcula y retorna la curva de duración de carga (LDC) para un mes específico"
)
async def get_ldc(
    year: int = None,
    month: int = None,
    processor: PandasDataProcessor = Depends(get_data_processor)
):
    """
    Endpoint para obtener Load Duration Curve (LDC).

    **Uso:**
    La LDC es fundamental para dimensionamiento de sistemas fotovoltaicos.
    Muestra las potencias ordenadas de mayor a menor vs su duración.

    **Parámetros opcionales:**
    - year: Año específico (ej: 2016)
    - month: Mes específico (1-12)

    Si no se especifica año/mes, usa el primer mes disponible en los datos.

    **Requiere:** Haber subido previamente un archivo con POST /upload
    """
    global _current_records

    try:
        if not _current_records:
            raise HTTPException(
                status_code=400,
                detail="No hay datos cargados. Suba un archivo primero con POST /upload"
            )

        # Filtrar registros por mes si se especifica
        filtered_records = _current_records
        if year is not None and month is not None:
            filtered_records = [
                r for r in _current_records
                if r.timestamp.year == year and r.timestamp.month == month
            ]
            if not filtered_records:
                raise HTTPException(
                    status_code=404,
                    detail=f"No hay datos para el mes {month}/{year}"
                )
        elif year is None and month is None:
            # Si no se especifica mes, usar el primer mes disponible
            if _current_records:
                first_record = min(_current_records, key=lambda r: r.timestamp)
                year = first_record.timestamp.year
                month = first_record.timestamp.month
                filtered_records = [
                    r for r in _current_records
                    if r.timestamp.year == year and r.timestamp.month == month
                ]

        # Crear caso de uso
        ldc_use_case = CalculateLDCUseCase(processor)

        # Calcular LDC con registros filtrados
        ldc_data = await ldc_use_case.execute(filtered_records)

        # Convertir a dict para response
        return LDCResponse(**ldc_data.to_dict())

    except CalculateLDCError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.post(
    "/profile",
    response_model=ProfileResponse,
    summary="Calcular perfil de consumo",
    description="Calcula perfil diurno/nocturno y estacional con parámetros configurables"
)
async def calculate_profile(
    request: CalculateProfileRequest = CalculateProfileRequest(),
    processor: PandasDataProcessor = Depends(get_data_processor)
):
    """
    Endpoint para calcular perfil de consumo.

    **Parámetros configurables:**
    - `diurnal_start_hour`: Hora de inicio del período diurno (0-23)
    - `diurnal_end_hour`: Hora de fin del período diurno (0-23)
    - `year`: Año para filtrar datos (opcional)
    - `month`: Mes para filtrar datos 1-12 (opcional)

    **Perfil calculado:**
    - Distribución diurna vs nocturna
    - Consumo weekday vs weekend
    - Patrón de consumo identificado

    **Requiere:** Haber subido previamente un archivo con POST /upload
    """
    global _current_records

    try:
        if not _current_records:
            raise HTTPException(
                status_code=400,
                detail="No hay datos cargados. Suba un archivo primero con POST /upload"
            )

        # Filtrar registros por año/mes si se especificaron
        filtered_records = _current_records
        if request.year is not None or request.month is not None:
            filtered_records = [
                record for record in _current_records
                if (request.year is None or record.timestamp.year == request.year) and
                   (request.month is None or record.timestamp.month == request.month)
            ]

            if not filtered_records:
                raise HTTPException(
                    status_code=404,
                    detail=f"No hay datos para el período especificado (año: {request.year}, mes: {request.month})"
                )

        # Crear caso de uso
        profile_use_case = CalculateProfileUseCase(processor)

        # Calcular perfil
        profile_data = await profile_use_case.execute(
            records=filtered_records,
            diurnal_start_hour=request.diurnal_start_hour,
            diurnal_end_hour=request.diurnal_end_hour
        )

        # Convertir a dict para response
        return ProfileResponse(**profile_data.to_dict())

    except CalculateProfileError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.get(
    "/heatmap",
    response_model=HeatmapResponse,
    summary="Obtener datos para heatmap",
    description="Genera matriz de datos para heatmap de consumo (24h x días)"
)
async def get_heatmap(
    processor: PandasDataProcessor = Depends(get_data_processor)
):
    """
    Endpoint para obtener datos de heatmap.

    **Formato de datos:**
    - Eje X: Horas del día (0-23)
    - Eje Y: Fechas (días)
    - Valores: Consumo en kWh por hora

    **Uso:**
    Útil para visualizar patrones de consumo a lo largo del tiempo
    e identificar anomalías visualmente.

    **Requiere:** Haber subido previamente un archivo con POST /upload
    """
    global _current_records

    try:
        if not _current_records:
            raise HTTPException(
                status_code=400,
                detail="No hay datos cargados. Suba un archivo primero con POST /upload"
            )

        # Crear caso de uso
        heatmap_use_case = GenerateHeatmapUseCase(processor)

        # Generar heatmap
        heatmap_data = await heatmap_use_case.execute(_current_records)

        # Ya viene en formato dict correcto
        return HeatmapResponse(**heatmap_data)

    except GenerateHeatmapError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.get(
    "/hourly",
    response_model=HourlyDataResponse,
    summary="Obtener datos horarios de un día específico",
    description="Retorna el consumo por hora de un día específico"
)
async def get_hourly_data(
    date: str,
    processor: PandasDataProcessor = Depends(get_data_processor)
):
    """
    Endpoint para obtener datos horarios de un día específico.

    **Parámetros:**
    - `date`: Fecha en formato YYYY-MM-DD (ej: 2016-06-01)

    **Retorna:**
    - Consumo por cada hora del día (0-23)
    - Total del día
    - Hora pico y su valor

    **Requiere:** Haber subido previamente un archivo con POST /upload
    """
    global _current_records

    try:
        if not _current_records:
            raise HTTPException(
                status_code=400,
                detail="No hay datos cargados. Suba un archivo primero con POST /upload"
            )

        # Parse date
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Formato de fecha inválido. Use YYYY-MM-DD (ej: 2016-06-01)"
            )

        # Filter records for that day
        day_records = [
            r for r in _current_records
            if r.timestamp.date() == target_date
        ]

        if not day_records:
            raise HTTPException(
                status_code=404,
                detail=f"No hay datos para la fecha {date}"
            )

        # Group by hour
        hourly_data = {}
        for record in day_records:
            hour = record.timestamp.hour
            if hour not in hourly_data:
                hourly_data[hour] = []
            hourly_data[hour].append(record.value_kwh)

        # Calculate hourly averages
        hours = list(range(24))
        consumption = []
        for hour in hours:
            if hour in hourly_data:
                avg = sum(hourly_data[hour]) / len(hourly_data[hour])
                consumption.append(round(avg, 3))
            else:
                consumption.append(0.0)

        # Calculate metrics
        total_kwh = sum(consumption)
        peak_value = max(consumption)
        peak_hour = consumption.index(peak_value)

        return HourlyDataResponse(
            date=date,
            hours=hours,
            consumption=consumption,
            total_kwh=round(total_kwh, 2),
            peak_hour=peak_hour,
            peak_value=round(peak_value, 3)
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.get(
    "/weekly",
    response_model=WeeklyDataResponse,
    summary="Obtener datos por día de una semana específica",
    description="Retorna el consumo diario de una semana específica"
)
async def get_weekly_data(
    week: int,
    year: int = 2016,
    processor: PandasDataProcessor = Depends(get_data_processor)
):
    """
    Endpoint para obtener datos semanales.

    **Parámetros:**
    - `week`: Número de semana del año (1-52)
    - `year`: Año (default: 2016)

    **Retorna:**
    - Consumo por cada día de la semana (Lun-Dom)
    - Total de la semana
    - Día pico y su valor

    **Requiere:** Haber subido previamente un archivo con POST /upload
    """
    global _current_records

    try:
        if not _current_records:
            raise HTTPException(
                status_code=400,
                detail="No hay datos cargados. Suba un archivo primero con POST /upload"
            )

        # Validate week number
        if week < 1 or week > 53:
            raise HTTPException(
                status_code=400,
                detail="Número de semana debe estar entre 1 y 53"
            )

        # Calculate start date of the week (Monday)
        # ISO week date: week 1 is the first week with Thursday in the new year
        jan_4 = datetime(year, 1, 4)
        week_start = jan_4 - timedelta(days=jan_4.weekday()) + timedelta(weeks=week - 1)
        week_end = week_start + timedelta(days=6)

        # Filter records for that week
        week_records = [
            r for r in _current_records
            if week_start.date() <= r.timestamp.date() <= week_end.date()
        ]

        if not week_records:
            raise HTTPException(
                status_code=404,
                detail=f"No hay datos para la semana {week} de {year}"
            )

        # Group by day
        daily_data = {}
        for record in week_records:
            day_key = record.timestamp.date()
            if day_key not in daily_data:
                daily_data[day_key] = []
            daily_data[day_key].append(record.value_kwh)

        # Build 7-day week
        day_names = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        dates = []
        consumption = []

        for i in range(7):
            current_date = (week_start + timedelta(days=i)).date()
            dates.append(current_date.isoformat())

            if current_date in daily_data:
                daily_total = sum(daily_data[current_date])
                consumption.append(round(daily_total, 2))
            else:
                consumption.append(0.0)

        # Calculate metrics
        total_kwh = sum(consumption)
        peak_value = max(consumption)
        peak_index = consumption.index(peak_value)
        peak_day = day_names[peak_index]

        return WeeklyDataResponse(
            week=week,
            year=year,
            start_date=week_start.date().isoformat(),
            end_date=week_end.date().isoformat(),
            days=day_names,
            dates=dates,
            consumption=consumption,
            total_kwh=round(total_kwh, 2),
            peak_day=peak_day,
            peak_value=round(peak_value, 2)
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.get(
    "/status",
    summary="Estado del sistema",
    description="Verifica si hay datos cargados y retorna información básica"
)
async def get_status():
    """
    Endpoint para verificar estado del sistema.

    Retorna:
    - Si hay datos cargados
    - Número de registros
    - Rango de fechas
    """
    global _current_records

    if not _current_records:
        return {
            "data_loaded": False,
            "records_count": 0,
            "message": "No hay datos cargados. Suba un archivo con POST /upload"
        }

    first_record = _current_records[0]
    last_record = _current_records[-1]

    # Calcular semana del primer registro
    first_date = first_record.timestamp
    first_week = first_date.isocalendar()[1]  # Número de semana ISO

    return {
        "data_loaded": True,
        "records_count": len(_current_records),
        "date_range": {
            "start": first_record.timestamp.isoformat(),
            "end": last_record.timestamp.isoformat(),
            "start_date": first_record.timestamp.date().isoformat(),
            "end_date": last_record.timestamp.date().isoformat(),
            "start_year": first_date.year,
            "start_month": first_date.month,
            "start_week": first_week,
        },
        "message": "Datos cargados correctamente"
    }


@router.delete(
    "/clear",
    summary="Limpiar datos cargados",
    description="Elimina todos los datos cargados en memoria"
)
async def clear_data():
    """
    Endpoint para limpiar datos cargados.

    Útil para resetear el estado y cargar un nuevo archivo.
    """
    global _current_records
    count = len(_current_records)
    _current_records = []

    return {
        "success": True,
        "message": f"Se eliminaron {count} registros de memoria",
        "records_deleted": count
    }
