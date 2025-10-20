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

## Estructura del Proyecto (Clean Architecture)

```
Backend/
├── src/
│   ├── domain/                    # Capa de Dominio (núcleo)
│   │   ├── entities/              # Entidades de negocio
│   │   │   ├── consumption_record.py  ✅ Registro de consumo
│   │   │   ├── metrics.py             ✅ Métricas calculadas
│   │   │   ├── ldc_data.py            ✅ Load Duration Curve
│   │   │   └── profile_data.py        ✅ Perfil de consumo
│   │   └── interfaces/            # Interfaces (puertos)
│   │       ├── data_repository.py     ✅ Repositorio abstracto
│   │       └── data_processor.py      ✅ Procesador abstracto
│   │
│   ├── application/               # Capa de Aplicación
│   │   ├── use_cases/             # Casos de uso
│   │   │   ├── process_file.py        🔄 Pendiente
│   │   │   ├── calculate_ldc.py       🔄 Pendiente
│   │   │   └── calculate_metrics.py   🔄 Pendiente
│   │   └── dto/                   # Data Transfer Objects
│   │
│   ├── infrastructure/            # Capa de Infraestructura
│   │   ├── services/
│   │   │   └── pandas_processor.py    ✅ Procesador con Pandas
│   │   ├── persistence/
│   │   │   └── file_repository.py     🔄 Pendiente
│   │   └── external/
│   │       └── export_service.py      🔄 Pendiente
│   │
│   └── presentation/              # Capa de Presentación
│       ├── api/v1/
│       │   ├── routes/
│       │   │   ├── upload.py          🔄 Pendiente
│       │   │   ├── metrics.py         🔄 Pendiente
│       │   │   └── export.py          🔄 Pendiente
│       │   └── schemas/
│       └── dependencies/
│
├── tests/
│   ├── unit/                      # Tests unitarios
│   └── integration/               # Tests de integración
│
├── main.py                        # Entry point FastAPI
├── config.py                      # Configuración
└── requirements.txt               ✅ Dependencias instaladas
```

## Estado del Proyecto

### ✅ Completado

1. **Estructura de carpetas** - Clean Architecture
2. **Entidades de Dominio** (4):
   - `ConsumptionRecord`: Registro individual de consumo
   - `Metrics`: Métricas agregadas (total, promedio, pico, etc.)
   - `LDCData`: Load Duration Curve para dimensionamiento
   - `ProfileData`: Perfil diurno/nocturno, estacional
3. **Interfaces de Dominio** (2):
   - `DataRepository`: Contrato para persistencia
   - `DataProcessor`: Contrato para procesamiento
4. **Servicio de Infraestructura**:
   - `PandasDataProcessor`: Implementación con Pandas/NumPy

### 🔄 En Progreso / Pendiente

- Casos de Uso (Application Layer)
- Endpoints FastAPI (Presentation Layer)
- Archivo main.py y config.py
- Tests

## Instalación

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

## Ejecución

```bash
# Modo desarrollo
uvicorn main:app --reload --port 8000

# Modo producción
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Arquitectura: Principios SOLID

### 1. Single Responsibility Principle (SRP)
- Cada entidad tiene una única responsabilidad
- `ConsumptionRecord`: Solo gestiona registros individuales
- `Metrics`: Solo calcula y almacena métricas
- `PandasDataProcessor`: Solo procesa datos con Pandas

### 2. Open/Closed Principle (OCP)
- Extensible mediante nuevas implementaciones de interfaces
- Cerrado para modificación de entidades y contratos

### 3. Liskov Substitution Principle (LSP)
- Cualquier implementación de `DataProcessor` es intercambiable
- Se puede cambiar Pandas por otra librería sin afectar casos de uso

### 4. Interface Segregation Principle (ISP)
- Interfaces específicas y pequeñas
- `DataRepository` solo para persistencia
- `DataProcessor` solo para procesamiento

### 5. Dependency Inversion Principle (DIP)
- Casos de uso dependen de **interfaces**, no de implementaciones
- `PandasDataProcessor` implementa `DataProcessor` (dependencia invertida)

## Flujo de Datos

```
CSV/XLSX File
    ↓
PandasDataProcessor.read_uploaded_file()
    ↓
List[ConsumptionRecord] (Entidades de Dominio)
    ↓
Use Case: CalculateMetricsUseCase
    ↓
PandasDataProcessor.calculate_metrics()
    ↓
Metrics (Entidad de Dominio)
    ↓
API Response (JSON)
```

## Dataset de Ejemplo

El sistema procesa archivos CSV/Excel con la estructura:

```csv
StartDate,Value (kWh),day_of_week,notes
2016-01-06 00:00:00,1.057,2,weekday
2016-01-06 01:00:00,1.171,2,weekday
...
```

**Características**:
- ~35,000 registros horarios
- Período: 2016-2020 (4.5 años)
- Granularidad: Horaria
- Categorías: weekday, weekend, COVID_lockdown

## Próximos Pasos

1. **Crear Casos de Uso** (Application Layer)
2. **Implementar Endpoints FastAPI** (Presentation Layer)
3. **Crear main.py y config.py**
4. **Pruebas con dataset real**
5. **Tests unitarios e integración**
6. **Dockerización para Cloud Run**

## Licencia

