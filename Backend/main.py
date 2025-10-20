"""
Main Entry Point - FastAPI Application
Sistema de Análisis Energético - Proyecto Fotovoltaico
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from src.presentation.api.v1.routes.analysis import router as analysis_router

# Metadata de la aplicación
app = FastAPI(
    title="Sistema de Análisis Energético",
    description="""
    API para análisis de datos de consumo eléctrico y dimensionamiento fotovoltaico.

    ## Características Principales

    * **Upload**: Carga de archivos CSV/Excel con datos de consumo
    * **Métricas**: Cálculo de energía total, promedios, picos, factor de carga
    * **LDC**: Load Duration Curve para dimensionamiento de sistemas
    * **Perfil**: Análisis diurno/nocturno y estacional
    * **Heatmap**: Visualización de patrones de consumo

    ## Flujo de Uso

    1. **POST /api/v1/upload** - Subir archivo de datos
    2. **GET /api/v1/metrics** - Obtener métricas calculadas
    3. **GET /api/v1/ldc** - Obtener Load Duration Curve
    4. **POST /api/v1/profile** - Calcular perfil de consumo
    5. **GET /api/v1/heatmap** - Obtener datos para heatmap

    ## Formatos Soportados

    - **CSV** (.csv)
    - **Excel** (.xlsx, .xls)

    ## Ejemplo de Estructura de Datos

    ```csv
    StartDate,Value (kWh),day_of_week,notes
    2016-01-06 00:00:00,1.057,2,weekday
    2016-01-06 01:00:00,1.171,2,weekday
    ```

    ## Arquitectura

    Este proyecto implementa **Clean Architecture** con:
    - **Domain Layer**: Entidades y reglas de negocio
    - **Application Layer**: Casos de uso
    - **Infrastructure Layer**: Implementaciones concretas (Pandas)
    - **Presentation Layer**: API REST (FastAPI)
    """,
    version="1.0.0",
    contact={
        "name": "Proyecto Fotovoltaico",
        "email": "contacto@ejemplo.com",
    },
    license_info={
        "name": "MIT",
    },
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Desarrollo local
        "http://localhost:3000",  # Frontend React (Vite)
        "http://localhost:5173",  # Vite alternativo
        "http://localhost:8000",  # Mismo servidor
        # Producción Cloud Run
        "https://fotovoltaica-frontend-892407171632.us-central1.run.app",  # Frontend producción
        "https://fotovoltaica-892407171632.us-central1.run.app",  # Backend producción
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(analysis_router)


@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to docs"""
    return RedirectResponse(url="/docs")


@app.get("/health", tags=["system"])
async def health_check():
    """
    Health check endpoint para verificar que la API está funcionando.

    Útil para:
    - Monitoreo de servicios
    - Load balancers
    - Container orchestration (K8s, Cloud Run)
    """
    return {
        "status": "healthy",
        "service": "Sistema de Análisis Energético",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload en desarrollo
        log_level="info"
    )
