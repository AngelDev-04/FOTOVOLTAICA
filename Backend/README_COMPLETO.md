# 🔌 Backend - Sistema de Análisis Energético

> API REST para análisis de datos de consumo eléctrico y dimensionamiento de sistemas fotovoltaicos, construida con **Clean Architecture** y **FastAPI**.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.5-009688.svg)](https://fastapi.tiangolo.com/)
[![Pandas](https://img.shields.io/badge/Pandas-2.2.3-150458.svg)](https://pandas.pydata.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Procesamiento de Datos](#-procesamiento-de-datos)
- [Entidades de Dominio](#-entidades-de-dominio)
- [Casos de Uso](#-casos-de-uso)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

---

## 📖 Descripción

Sistema backend para el análisis de datos de consumo eléctrico que permite:

- **Cargar y procesar** archivos CSV/Excel con datos históricos de consumo
- **Calcular métricas** energéticas (energía total, potencia media/pico, factor de carga)
- **Generar Load Duration Curve (LDC)** para dimensionamiento de sistemas fotovoltaicos
- **Analizar perfiles** de consumo (diurno/nocturno, estacional)
- **Visualizar patrones** mediante heatmaps horarios y semanales

### 🎯 Objetivo

Proporcionar una API robusta, escalable y mantenible que procese datos de consumo eléctrico para ayudar en el diseño e implementación de sistemas de energía solar fotovoltaica.

---

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** (Arquitectura Hexagonal), separando las responsabilidades en capas concéntricas:

```
┌─────────────────────────────────────────────────────────┐
│               PRESENTACIÓN (API REST)                    │
│         FastAPI, Endpoints, Schemas Pydantic            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│             APLICACIÓN (Casos de Uso)                   │
│    ProcessFile, CalculateMetrics, CalculateLDC, etc.   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               DOMINIO (Entidades Core)                  │
│   ConsumptionRecord, Metrics, LDCData, ProfileData     │
│          Interfaces (DataProcessor, Repository)         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│         INFRAESTRUCTURA (Implementaciones)              │
│    PandasDataProcessor, FileRepository, Exports        │
└─────────────────────────────────────────────────────────┘
```

### ✅ Principios SOLID Aplicados

| Principio | Implementación |
|-----------|----------------|
| **S**RP | Cada clase tiene una única responsabilidad |
| **O**CP | Extensible mediante interfaces, cerrado a modificaciones |
| **L**SP | Implementaciones de interfaces son intercambiables |
| **I**SP | Interfaces pequeñas y específicas (`DataProcessor`, `DataRepository`) |
| **D**IP | Dependencias apuntan a abstracciones, no a concreciones |

---

## 🛠️ Stack Tecnológico

### Core Framework
- **[FastAPI](https://fastapi.tiangolo.com/) 0.115.5** - Framework web moderno y rápido
- **[Uvicorn](https://www.uvicorn.org/) 0.32.1** - Servidor ASGI de alto rendimiento
- **[Pydantic](https://pydantic-docs.helpmanual.io/) 2.10.3** - Validación de datos y serialización

### Procesamiento de Datos
- **[Pandas](https://pandas.pydata.org/) 2.2.3** - Análisis y manipulación de datos tabulares
- **[NumPy](https://numpy.org/) 2.2.1** - Operaciones numéricas y arrays optimizados
- **[OpenPyXL](https://openpyxl.readthedocs.io/) 3.1.5** - Lectura/escritura de Excel (.xlsx)

### Utilidades
- **[Python-Multipart](https://andrew-d.github.io/python-multipart/) 0.0.17** - Manejo de uploads
- **[AIOFiles](https://github.com/Tinche/aiofiles) 24.1.0** - I/O asíncrona de archivos
- **[Python-Dotenv](https://github.com/theskumar/python-dotenv) 1.0.1** - Variables de entorno

### Testing
- **[Pytest](https://pytest.org/) 8.3.4** - Framework de testing
- **[HTTPX](https://www.python-httpx.org/) 0.28.1** - Cliente HTTP asíncrono para tests
- **[Pytest-Cov](https://pytest-cov.readthedocs.io/) 6.0.0** - Cobertura de código

### Desarrollo
- **[Black](https://black.readthedocs.io/) 24.10.0** - Formateador de código
- **[Flake8](https://flake8.pycqa.org/) 7.1.1** - Linter
- **[MyPy](http://mypy-lang.org/) 1.13.0** - Type checker

---

## 📁 Estructura del Proyecto

```
Backend/
│
├── 📄 main.py                          # Entry point de la aplicación FastAPI
├── 📄 config.py                        # Configuración centralizada
├── 📄 requirements.txt                 # Dependencias del proyecto
├── 📄 README.md                        # Este archivo
│
├── 📂 src/                             # Código fuente principal
│   ├── 📂 domain/                      # 🎯 CAPA DE DOMINIO (núcleo)
│   │   ├── 📂 entities/                # Entidades de negocio
│   │   │   ├── consumption_record.py   # Registro individual de consumo
│   │   │   ├── metrics.py              # Métricas agregadas del sistema
│   │   │   ├── ldc_data.py             # Load Duration Curve
│   │   │   └── profile_data.py         # Perfil de consumo (diurno/nocturno)
│   │   │
│   │   ├── 📂 interfaces/              # Interfaces (puertos)
│   │   │   ├── data_processor.py       # Contrato para procesamiento
│   │   │   └── data_repository.py      # Contrato para persistencia
│   │   │
│   │   └── 📂 value_objects/           # Objetos de valor inmutables
│   │
│   ├── 📂 application/                 # 🔄 CAPA DE APLICACIÓN
│   │   ├── 📂 use_cases/               # Casos de uso del sistema
│   │   │   ├── process_file.py         # Procesar archivo cargado
│   │   │   ├── calculate_metrics.py    # Calcular métricas energéticas
│   │   │   ├── calculate_ldc.py        # Generar Load Duration Curve
│   │   │   ├── calculate_profile.py    # Calcular perfil de consumo
│   │   │   └── generate_heatmap.py     # Generar datos para heatmap
│   │   │
│   │   └── 📂 dto/                     # Data Transfer Objects
│   │       └── __init__.py
│   │
│   ├── 📂 infrastructure/              # 🔧 CAPA DE INFRAESTRUCTURA
│   │   ├── 📂 services/
│   │   │   └── pandas_processor.py     # Procesador con Pandas/NumPy
│   │   │
│   │   ├── 📂 persistence/
│   │   │   └── file_repository.py      # Repositorio de archivos
│   │   │
│   │   └── 📂 external/
│   │       └── export_service.py       # Exportación (CSV, Excel, PDF)
│   │
│   └── 📂 presentation/                # 🌐 CAPA DE PRESENTACIÓN
│       ├── 📂 api/
│       │   └── 📂 v1/
│       │       ├── 📂 routes/          # Endpoints de la API
│       │       │   └── analysis.py     # Rutas de análisis
│       │       │
│       │       └── 📂 schemas/         # Pydantic schemas (request/response)
│       │           ├── upload.py
│       │           ├── metrics.py
│       │           ├── ldc.py
│       │           ├── profile.py
│       │           └── heatmap.py
│       │
│       └── 📂 dependencies/            # Dependency injection
│           └── __init__.py
│
└── 📂 tests/                           # Tests del proyecto
    ├── 📂 unit/                        # Tests unitarios
    │   ├── test_entities.py
    │   ├── test_use_cases.py
    │   └── test_processors.py
    │
    └── 📂 integration/                 # Tests de integración
        ├── test_api_endpoints.py
        └── test_file_processing.py
```

---

## 🚀 Instalación

### Requisitos Previos

- **Python 3.11+** instalado
- **pip** (gestor de paquetes de Python)
- **virtualenv** (recomendado)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/proyecto-fotovoltaico.git
cd proyecto-fotovoltaico/Backend
```

### Paso 2: Crear Entorno Virtual

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows (PowerShell):
venv\Scripts\Activate.ps1

# Windows (CMD):
venv\Scripts\activate.bat

# Linux/Mac:
source venv/bin/activate
```

### Paso 3: Instalar Dependencias

```bash
# Instalar todas las dependencias
pip install -r requirements.txt

# O solo las de producción (sin dev tools):
pip install fastapi uvicorn pandas numpy openpyxl python-multipart aiofiles
```

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del Backend:

```env
# .env
ENVIRONMENT=development
DEBUG=True
API_VERSION=v1
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_UPLOAD_SIZE_MB=50
```

---

## 💻 Uso

### Modo Desarrollo

```bash
# Ejecutar servidor con auto-reload
uvicorn main:app --reload --port 8000

# O usando el script principal:
python main.py
```

La API estará disponible en:
- **Swagger UI (Docs interactivos)**: http://localhost:8000/docs
- **ReDoc (Documentación alternativa)**: http://localhost:8000/redoc
- **OpenAPI Schema (JSON)**: http://localhost:8000/openapi.json

### Modo Producción

```bash
# Con Uvicorn (single worker)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# O con Gunicorn (múltiples workers)
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 📡 Endpoints de la API

### Base URL: `/api/v1`

| Método | Endpoint | Descripción | Request | Response |
|--------|----------|-------------|---------|----------|
| `POST` | `/upload` | Subir archivo CSV/Excel | `multipart/form-data` | `UploadResponse` |
| `GET` | `/status` | Estado del dataset cargado | - | `StatusResponse` |
| `GET` | `/metrics` | Métricas energéticas | - | `Metrics` |
| `GET` | `/ldc` | Load Duration Curve | `?year=2016&month=1` | `LDCData` |
| `GET` | `/hourly` | Consumo por hora del día | `?date=2016-01-06` | `HourlyData` |
| `GET` | `/weekly` | Consumo por día de la semana | `?week=1&year=2016` | `WeeklyData` |
| `GET` | `/heatmap` | Datos para heatmap | `?year=2016&month=1` | `HeatmapData` |
| `POST` | `/profile` | Calcular perfil de consumo | `ProfileRequest` | `ProfileData` |

### Ejemplos de Uso

#### 1. Subir Archivo de Datos

```bash
curl -X POST "http://localhost:8000/api/v1/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@power_usage_2016_2020.csv"
```

**Response:**
```json
{
  "message": "Archivo procesado exitosamente",
  "records_count": 35064,
  "date_range": {
    "start": "2016-01-06",
    "end": "2020-12-31"
  }
}
```

#### 2. Obtener Métricas

```bash
curl -X GET "http://localhost:8000/api/v1/metrics"
```

**Response:**
```json
{
  "total_energy_kwh": 1234567.89,
  "average_power_kw": 14.23,
  "peak_power_kw": 28.45,
  "load_factor": 0.65,
  "peak_date": "2019-07-15T14:00:00",
  "records_analyzed": 35064
}
```

#### 3. Obtener Load Duration Curve (LDC)

```bash
curl -X GET "http://localhost:8000/api/v1/ldc?year=2016&month=1"
```

**Response:**
```json
{
  "year": 2016,
  "month": 1,
  "power_values": [28.45, 27.89, 26.23, ...],
  "duration_percentage": [0.0, 0.13, 0.27, ...],
  "total_hours": 744,
  "base_load": 10.5,
  "peak_load": 28.45,
  "average_load": 14.23
}
```

#### 4. Obtener Consumo Horario

```bash
curl -X GET "http://localhost:8000/api/v1/hourly?date=2016-01-06"
```

**Response:**
```json
{
  "date": "2016-01-06",
  "hours": [0, 1, 2, ..., 23],
  "consumption": [12.3, 11.8, 11.2, ..., 13.5],
  "total_kwh": 328.5,
  "peak_hour": 18,
  "peak_value": 19.8
}
```

---

## 🔄 Procesamiento de Datos

### Flujo de Datos Completo

```
1️⃣ ENTRADA
   ↓
   Usuario sube archivo CSV/XLSX
   ↓
2️⃣ VALIDACIÓN
   ↓
   FastAPI valida formato y tamaño
   ↓
3️⃣ PROCESAMIENTO
   ↓
   PandasDataProcessor lee y parsea el archivo
   ↓
4️⃣ TRANSFORMACIÓN
   ↓
   Convierte filas a List[ConsumptionRecord]
   ↓
5️⃣ CASOS DE USO
   ↓
   CalculateMetricsUseCase analiza los datos
   CalculateLDCUseCase genera curva de carga
   GenerateHeatmapUseCase crea matriz de calor
   ↓
6️⃣ SALIDA
   ↓
   API retorna JSON con resultados
```

### Formato de Datos de Entrada

El sistema acepta archivos CSV/Excel con la siguiente estructura:

```csv
StartDate,Value (kWh),day_of_week,notes
2016-01-06 00:00:00,1.057,2,weekday
2016-01-06 01:00:00,1.171,2,weekday
2016-01-06 02:00:00,1.284,2,weekday
...
```

**Columnas requeridas:**
- `StartDate`: Fecha y hora del registro (formato: `YYYY-MM-DD HH:MM:SS`)
- `Value (kWh)`: Consumo en kWh (float)

**Columnas opcionales:**
- `day_of_week`: Día de la semana (0-6 o nombre)
- `notes`: Notas adicionales (weekday, weekend, etc.)

### Algoritmos de Procesamiento

#### 1. **Load Duration Curve (LDC)**

El LDC ordena las potencias de mayor a menor y asigna un porcentaje de duración a cada valor.

```python
# Pseudocódigo simplificado
def calculate_ldc(records):
    # 1. Extraer potencias
    powers = [record.power for record in records]
    
    # 2. Ordenar de mayor a menor
    powers_sorted = sorted(powers, reverse=True)
    
    # 3. Calcular porcentajes de duración
    total_hours = len(powers_sorted)
    duration_pct = [(i / total_hours) * 100 for i in range(total_hours)]
    
    # 4. Retornar curva
    return LDCData(
        power_values=powers_sorted,
        duration_percentage=duration_pct,
        base_load=min(powers_sorted),
        peak_load=max(powers_sorted)
    )
```

**Ejemplo visual:**

```
Potencia (kW) │
              │ ●
           28 │ ●●
           26 │ ●●●
           24 │ ●●●●
           22 │ ●●●●●
           20 │ ●●●●●●●
              └─────────────────> Duración (%)
                0%        50%     100%
```

#### 2. **Métricas Energéticas**

Calcula indicadores clave del sistema energético.

```python
# Pseudocódigo simplificado
def calculate_metrics(records):
    # Energía total (suma de consumos)
    total_energy = sum(record.consumption for record in records)
    
    # Potencia promedio
    avg_power = total_energy / len(records)
    
    # Potencia pico
    peak_power = max(record.power for record in records)
    
    # Factor de carga (promedio / pico)
    load_factor = avg_power / peak_power
    
    return Metrics(
        total_energy_kwh=total_energy,
        average_power_kw=avg_power,
        peak_power_kw=peak_power,
        load_factor=load_factor
    )
```

**Fórmulas utilizadas:**

- **Energía Total**: $E_{total} = \sum_{i=1}^{n} P_i \cdot \Delta t$
- **Potencia Promedio**: $P_{avg} = \frac{E_{total}}{n}$
- **Factor de Carga**: $FC = \frac{P_{avg}}{P_{peak}}$

#### 3. **Heatmap Horario/Semanal**

Crea una matriz 7x24 (días × horas) con promedios de consumo.

```python
# Pseudocódigo simplificado
def generate_heatmap(records):
    # Crear matriz 7 días x 24 horas
    matrix = [[0 for _ in range(24)] for _ in range(7)]
    counts = [[0 for _ in range(24)] for _ in range(7)]
    
    for record in records:
        day_of_week = record.timestamp.weekday()  # 0-6
        hour = record.timestamp.hour              # 0-23
        
        # Acumular consumo
        matrix[day_of_week][hour] += record.consumption
        counts[day_of_week][hour] += 1
    
    # Calcular promedios
    for day in range(7):
        for hour in range(24):
            if counts[day][hour] > 0:
                matrix[day][hour] /= counts[day][hour]
    
    return matrix
```

**Visualización conceptual:**

```
        00  01  02  ... 22  23
Lun  [  🟦  🟦  🟦  ... 🟨  🟧  ]
Mar  [  🟦  🟦  🟦  ... 🟨  🟧  ]
Mié  [  🟦  🟦  🟦  ... 🟨  🟧  ]
Jue  [  🟦  🟦  🟦  ... 🟨  🟧  ]
Vie  [  🟦  🟦  🟦  ... 🟨  🟨  ]
Sáb  [  🟩  🟩  🟩  ... 🟦  🟦  ]
Dom  [  🟩  🟩  🟩  ... 🟦  🟦  ]

🟦 = Bajo consumo
🟨 = Consumo medio
🟧 = Alto consumo
```

---

## 🎯 Entidades de Dominio

### 1. `ConsumptionRecord`

Representa un registro individual de consumo eléctrico.

```python
@dataclass
class ConsumptionRecord:
    """Registro individual de consumo eléctrico."""
    timestamp: datetime          # Fecha y hora del registro
    consumption_kwh: float       # Consumo en kWh
    power_kw: float             # Potencia instantánea (kW)
    day_of_week: int            # 0=Lunes, 6=Domingo
    is_weekend: bool            # True si es fin de semana
    notes: Optional[str]        # Notas adicionales
```

**Ejemplo:**
```python
record = ConsumptionRecord(
    timestamp=datetime(2016, 1, 6, 12, 0),
    consumption_kwh=15.4,
    power_kw=15.4,
    day_of_week=2,  # Miércoles
    is_weekend=False,
    notes="weekday"
)
```

### 2. `Metrics`

Contiene las métricas calculadas del sistema.

```python
@dataclass
class Metrics:
    """Métricas energéticas del sistema."""
    total_energy_kwh: float      # Energía total consumida
    average_power_kw: float      # Potencia promedio
    peak_power_kw: float         # Potencia pico
    load_factor: float           # Factor de carga (0-1)
    peak_date: datetime          # Fecha/hora del pico
    records_analyzed: int        # Cantidad de registros
```

**Ejemplo:**
```python
metrics = Metrics(
    total_energy_kwh=123456.78,
    average_power_kw=14.23,
    peak_power_kw=28.45,
    load_factor=0.50,  # 50%
    peak_date=datetime(2019, 7, 15, 14, 0),
    records_analyzed=35064
)
```

### 3. `LDCData`

Datos de la Load Duration Curve para dimensionamiento.

```python
@dataclass
class LDCData:
    """Load Duration Curve (Curva de Carga Ordenada)."""
    year: int                          # Año de los datos
    month: int                         # Mes de los datos
    power_values: List[float]          # Potencias ordenadas (mayor a menor)
    duration_percentage: List[float]   # Porcentaje de duración
    total_hours: int                   # Total de horas analizadas
    base_load: float                   # Carga base (mínima)
    peak_load: float                   # Carga pico (máxima)
    average_load: float                # Carga promedio
```

**Ejemplo:**
```python
ldc = LDCData(
    year=2016,
    month=1,
    power_values=[28.45, 27.89, 27.23, ..., 10.5],
    duration_percentage=[0.0, 0.13, 0.27, ..., 99.87],
    total_hours=744,
    base_load=10.5,
    peak_load=28.45,
    average_load=14.23
)
```

### 4. `ProfileData`

Perfil de consumo (diurno/nocturno, estacional).

```python
@dataclass
class ProfileData:
    """Perfil de consumo diurno/nocturno y estacional."""
    diurnal_percentage: float    # % consumo diurno (6am-6pm)
    nocturnal_percentage: float  # % consumo nocturno (6pm-6am)
    summer_avg_kwh: float        # Promedio verano
    winter_avg_kwh: float        # Promedio invierno
    weekday_avg_kwh: float       # Promedio días laborables
    weekend_avg_kwh: float       # Promedio fines de semana
```

**Ejemplo:**
```python
profile = ProfileData(
    diurnal_percentage=60.0,     # 60% día
    nocturnal_percentage=40.0,   # 40% noche
    summer_avg_kwh=16.5,
    winter_avg_kwh=12.8,
    weekday_avg_kwh=15.2,
    weekend_avg_kwh=12.1
)
```

---

## 🔧 Casos de Uso

### 1. `ProcessFileUseCase`

**Responsabilidad:** Procesar archivo CSV/Excel y convertirlo a entidades de dominio.

```python
class ProcessFileUseCase:
    """Caso de uso para procesar archivos de consumo."""
    
    def __init__(self, processor: DataProcessor):
        self.processor = processor
    
    async def execute_from_upload(
        self, 
        file: UploadFile
    ) -> List[ConsumptionRecord]:
        """
        Procesa archivo subido y retorna lista de registros.
        
        Args:
            file: Archivo CSV/Excel subido
            
        Returns:
            Lista de registros de consumo
            
        Raises:
            ValueError: Si el archivo no es válido
        """
        # 1. Validar formato y tamaño
        # 2. Leer contenido del archivo
        # 3. Parsear y convertir a ConsumptionRecord
        # 4. Retornar lista de registros
```

### 2. `CalculateMetricsUseCase`

**Responsabilidad:** Calcular métricas energéticas a partir de los registros.

```python
class CalculateMetricsUseCase:
    """Caso de uso para calcular métricas energéticas."""
    
    def __init__(self, processor: DataProcessor):
        self.processor = processor
    
    async def execute(
        self, 
        records: List[ConsumptionRecord]
    ) -> Metrics:
        """
        Calcula métricas energéticas del sistema.
        
        Args:
            records: Lista de registros de consumo
            
        Returns:
            Objeto Metrics con todas las métricas calculadas
        """
        # 1. Calcular energía total
        # 2. Calcular potencia promedio y pico
        # 3. Calcular factor de carga
        # 4. Identificar fecha del pico
        # 5. Retornar objeto Metrics
```

### 3. `CalculateLDCUseCase`

**Responsabilidad:** Generar Load Duration Curve para dimensionamiento.

```python
class CalculateLDCUseCase:
    """Caso de uso para generar Load Duration Curve."""
    
    def __init__(self, processor: DataProcessor):
        self.processor = processor
    
    async def execute(
        self, 
        records: List[ConsumptionRecord]
    ) -> LDCData:
        """
        Genera Load Duration Curve ordenada.
        
        Args:
            records: Lista de registros de consumo
            
        Returns:
            Objeto LDCData con la curva calculada
        """
        # 1. Extraer potencias
        # 2. Ordenar de mayor a menor
        # 3. Calcular porcentajes de duración
        # 4. Calcular base_load, peak_load, average_load
        # 5. Retornar LDCData
```

### 4. `GenerateHeatmapUseCase`

**Responsabilidad:** Generar datos para visualización de heatmap.

```python
class GenerateHeatmapUseCase:
    """Caso de uso para generar heatmap de consumo."""
    
    def __init__(self, processor: DataProcessor):
        self.processor = processor
    
    async def execute(
        self, 
        records: List[ConsumptionRecord]
    ) -> dict:
        """
        Genera matriz de heatmap (7 días x 24 horas).
        
        Args:
            records: Lista de registros de consumo
            
        Returns:
            Diccionario con matriz de heatmap y metadatos
        """
        # 1. Crear matriz 7x24
        # 2. Agrupar por día de semana y hora
        # 3. Calcular promedios
        # 4. Retornar diccionario con matriz y estadísticas
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
pytest

# Tests con cobertura
pytest --cov=src --cov-report=html

# Tests específicos
pytest tests/unit/test_entities.py
pytest tests/integration/test_api_endpoints.py

# Tests con verbosidad
pytest -v

# Tests con output detallado
pytest -s

# Ver reporte de cobertura en HTML
# Abre: htmlcov/index.html en tu navegador
```

### Estructura de Tests

```
tests/
├── unit/                           # Tests unitarios (rápidos, aislados)
│   ├── test_entities.py            # Tests de entidades de dominio
│   ├── test_use_cases.py           # Tests de casos de uso
│   └── test_processors.py          # Tests del procesador Pandas
│
└── integration/                    # Tests de integración
    ├── test_api_endpoints.py       # Tests de endpoints completos
    └── test_file_processing.py     # Tests de carga de archivos
```

### Ejemplo de Test Unitario

```python
# tests/unit/test_use_cases.py
import pytest
from datetime import datetime
from src.application.use_cases.calculate_metrics import CalculateMetricsUseCase
from src.domain.entities.consumption_record import ConsumptionRecord
from src.infrastructure.services.pandas_processor import PandasDataProcessor

@pytest.fixture
def sample_records():
    """Fixture con registros de ejemplo."""
    return [
        ConsumptionRecord(
            timestamp=datetime(2016, 1, 6, 0, 0),
            consumption_kwh=10.0,
            power_kw=10.0,
            day_of_week=2,
            is_weekend=False,
            notes="weekday"
        ),
        ConsumptionRecord(
            timestamp=datetime(2016, 1, 6, 1, 0),
            consumption_kwh=20.0,
            power_kw=20.0,
            day_of_week=2,
            is_weekend=False,
            notes="weekday"
        ),
        ConsumptionRecord(
            timestamp=datetime(2016, 1, 6, 2, 0),
            consumption_kwh=15.0,
            power_kw=15.0,
            day_of_week=2,
            is_weekend=False,
            notes="weekday"
        ),
    ]

@pytest.mark.asyncio
async def test_calculate_metrics_returns_correct_values(sample_records):
    """Test que verifica el cálculo correcto de métricas."""
    # Arrange
    processor = PandasDataProcessor()
    use_case = CalculateMetricsUseCase(processor)
    
    # Act
    metrics = await use_case.execute(sample_records)
    
    # Assert
    assert metrics.peak_power_kw == 20.0
    assert metrics.average_power_kw == 15.0
    assert metrics.total_energy_kwh == 45.0
    assert 0.0 <= metrics.load_factor <= 1.0
    assert metrics.records_analyzed == 3

@pytest.mark.asyncio
async def test_calculate_ldc_orders_correctly(sample_records):
    """Test que verifica el ordenamiento del LDC."""
    # Arrange
    processor = PandasDataProcessor()
    use_case = CalculateLDCUseCase(processor)
    
    # Act
    ldc_data = await use_case.execute(sample_records)
    
    # Assert
    assert ldc_data.power_values[0] >= ldc_data.power_values[-1]  # Ordenado desc
    assert ldc_data.peak_load == 20.0
    assert ldc_data.base_load == 10.0
    assert len(ldc_data.power_values) == 3
```

### Ejemplo de Test de Integración

```python
# tests/integration/test_api_endpoints.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_upload_file_endpoint():
    """Test de upload de archivo."""
    # Preparar archivo de prueba
    files = {"file": ("test.csv", open("test_data.csv", "rb"), "text/csv")}
    
    # Hacer request
    response = client.post("/api/v1/upload", files=files)
    
    # Verificar respuesta
    assert response.status_code == 200
    assert "records_count" in response.json()
    assert response.json()["records_count"] > 0

def test_get_metrics_endpoint():
    """Test de obtención de métricas."""
    response = client.get("/api/v1/metrics")
    
    assert response.status_code == 200
    data = response.json()
    assert "total_energy_kwh" in data
    assert "average_power_kw" in data
    assert "peak_power_kw" in data
    assert "load_factor" in data
```

---

## 🚢 Despliegue

### Docker

#### Dockerfile

```dockerfile
# Dockerfile
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Comando de inicio
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Docker Compose (opcional)

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DEBUG=False
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped
```

#### Comandos Docker

```bash
# Construir imagen
docker build -t backend-energia .

# Ejecutar contenedor
docker run -p 8000:8000 backend-energia

# Con Docker Compose
docker-compose up -d
```

---

### Google Cloud Run

#### Paso 1: Preparar `cloudbuild.yaml`

```yaml
# cloudbuild.yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/backend-energia', '.']
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/backend-energia']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'backend-energia'
      - '--image'
      - 'gcr.io/$PROJECT_ID/backend-energia'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/backend-energia'
```

#### Paso 2: Desplegar

```bash
# 1. Autenticar con Google Cloud
gcloud auth login

# 2. Configurar proyecto
gcloud config set project tu-proyecto-id

# 3. Build y deploy automático
gcloud builds submit --config cloudbuild.yaml

# O deploy manual
gcloud run deploy backend-energia \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 60s \
  --max-instances 10
```

---

### Variables de Entorno en Producción

```env
# .env.production
ENVIRONMENT=production
DEBUG=False
API_VERSION=v1
ALLOWED_ORIGINS=https://tu-frontend.com,https://www.tu-frontend.com
MAX_UPLOAD_SIZE_MB=100
LOG_LEVEL=info

# Opcional: Base de datos
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Opcional: Almacenamiento
STORAGE_BUCKET=gs://tu-bucket-nombre
```

---

## 🤝 Contribución

### Guía de Contribución

1. **Fork** el repositorio
2. Crea una **rama** para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m 'feat: Agrega nueva funcionalidad de exportación'
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un **Pull Request** con:
   - Descripción clara del cambio
   - Tests que cubran la nueva funcionalidad
   - Documentación actualizada

### Estándares de Código

#### Formateo
```bash
# Formatear con Black
black src/ tests/

# Ordenar imports con isort
isort src/ tests/
```

#### Linting
```bash
# Verificar estilo con Flake8
flake8 src/ tests/ --max-line-length=100

# Type checking con MyPy
mypy src/
```

#### Convenciones
- **Nombres de archivos**: snake_case (`calculate_metrics.py`)
- **Nombres de clases**: PascalCase (`CalculateMetricsUseCase`)
- **Nombres de funciones**: snake_case (`async def execute()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE_MB`)
- **Type hints**: Obligatorios en funciones públicas
- **Docstrings**: Google style

#### Ejemplo de Docstring

```python
async def calculate_metrics(
    records: List[ConsumptionRecord],
    start_date: Optional[datetime] = None
) -> Metrics:
    """
    Calcula métricas energéticas a partir de registros de consumo.
    
    Args:
        records: Lista de registros de consumo a analizar.
        start_date: Fecha de inicio opcional para filtrar registros.
            Si es None, se procesan todos los registros.
    
    Returns:
        Objeto Metrics con todas las métricas calculadas.
    
    Raises:
        ValueError: Si la lista de registros está vacía.
        TypeError: Si los registros no son del tipo correcto.
    
    Examples:
        >>> records = [ConsumptionRecord(...), ...]
        >>> metrics = await calculate_metrics(records)
        >>> print(metrics.peak_power_kw)
        28.45
    """
```

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Proyecto Fotovoltaico - Universidad Nacional

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Autores

- **Equipo Proyecto Fotovoltaico** - Universidad Nacional
  - Desarrolladores Backend
  - Analistas de Datos
  - Ingenieros de Energía

---

## 📞 Soporte

### Canales de Comunicación

- **Issues:** [GitHub Issues](https://github.com/tu-usuario/proyecto-fotovoltaico/issues)
- **Email:** contacto@ejemplo.com
- **Documentación:** http://localhost:8000/docs (después de ejecutar el servidor)

### FAQs

**P: ¿Qué formato de archivo debo usar?**
R: Acepta CSV y Excel (.xlsx, .xls). Ver sección [Formato de Datos](#formato-de-datos-de-entrada).

**P: ¿Cuál es el tamaño máximo de archivo?**
R: Por defecto 50MB. Configurable vía `MAX_UPLOAD_SIZE_MB` en `.env`.

**P: ¿Cómo maneja datos faltantes?**
R: Los registros con valores nulos se omiten automáticamente con logging.

**P: ¿Es seguro para producción?**
R: Sí, implementa validación de inputs, CORS configurado, y rate limiting (opcional).

---

## 🙏 Agradecimientos

- [FastAPI](https://fastapi.tiangolo.com/) - Por el excelente framework web
- [Pandas](https://pandas.pydata.org/) - Por las herramientas de análisis de datos
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Por la validación de datos robusta
- Comunidad de Python - Por las librerías y recursos educativos
- Universidad Nacional - Por el apoyo académico

---

## 📚 Referencias

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Load Duration Curve - Wikipedia](https://en.wikipedia.org/wiki/Load_duration_curve)

---

## 🔄 Changelog

### [1.0.0] - 2025-01-20

#### Added
- ✨ Sistema completo de análisis energético con Clean Architecture
- ✨ Endpoints API REST para upload, métricas, LDC, heatmap
- ✨ Procesamiento de archivos CSV/Excel con Pandas
- ✨ Cálculo de Load Duration Curve (LDC)
- ✨ Generación de heatmaps horarios/semanales
- ✨ Análisis de perfiles de consumo
- ✨ Documentación completa con Swagger/ReDoc
- ✨ Tests unitarios e integración con Pytest
- ✨ Soporte para Docker y Google Cloud Run

#### Changed
- 🔄 Migración de arquitectura monolítica a Clean Architecture
- 🔄 Implementación de principios SOLID

#### Fixed
- 🐛 Manejo robusto de datos faltantes
- 🐛 Validación de formatos de archivo

---

**⚡ ¡Happy Coding!**

*Made with ❤️ by Proyecto Fotovoltaico Team*
