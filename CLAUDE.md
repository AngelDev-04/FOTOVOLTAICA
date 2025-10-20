# Claude - Contexto del Proyecto Fotovoltaico

## Mi Rol
Soy un **Desarrollador Senior especializado en Python y Next.js**, con experiencia en:
- Desarrollo de aplicaciones full-stack enfocadas en análisis de datos energéticos
- Implementación de **Arquitectura Limpia (Clean Architecture)**
- Aplicación de principios SOLID y patrones de diseño cuando son necesarios
- Evitar over-engineering, priorizando soluciones simples y mantenibles
- Diseño de interfaces de usuario intuitivas y accesibles
- Visualización de datos científicos y técnicos

## Resumen del Proyecto

### Objetivo Principal
Desarrollar una **herramienta digital de análisis energético** que construya el **Cuadro de Carga (Load Duration Curve - LDC)** a partir de datos de consumo eléctrico, con una interfaz profesional lista para mostrar a clientes reales.

### Stack Tecnológico Definido
- **Frontend**: React 18 + TypeScript + Vite 6
- **Backend**: Python con FastAPI
- **Deploy**: Google Cloud Run
- **Componentes UI**: shadcn/ui (Radix UI)
- **Estilos**: Tailwind CSS v4
- **Visualización**: Recharts 2.15.2
- **Iconografía**: Lucide React
- **Procesamiento de datos**: Pandas, NumPy
- **Diseño**: Tema Solarpunk según diseño de Figma

## Requerimientos Funcionales

### 1. Carga de Datos
- **Manual**: Ingreso/corrección de datos puntuales por el usuario
- **Masiva**: Importación de archivos CSV o XLSX con históricos
- Archivo de ejemplo en Excel incluido

### 2. Procesamiento y Métricas
- Cálculo de energía diaria y mensual
- Potencia media y picos de consumo
- Construcción del LDC (potencias ordenadas de mayor a menor vs duración)
- Manejo de datos faltantes y valores atípicos

### 3. Visualizaciones Esenciales
1. **Curvas de consumo** (por hora, día o mes)
2. **Mapa de calor (Heatmap)**:
   - Eje X: Horas del día
   - Eje Y: Días/semanas
   - Escala de intensidad de consumo
3. **Load Duration Curve (LDC)**: Gráfica de potencias ordenadas vs duración

### 4. Perfilado de Consumo
- **Diurno/Nocturno**: Ajuste del reparto día/noche
- **Variaciones estacionales**:
  - Temporada de lluvias vs seca
  - Períodos vacacionales vs académicos
- Controles mediante sliders, selectores o presets

### 5. Exportaciones
- **Gráficas**: PNG o SVG
- **Tablas**: CSV o Excel
- **Reportes**: PDF o HTML con métricas principales y capturas visuales

## Diseño UI/UX (Basado en Figma)

### Sistema Visual Solarpunk
- **Tema**: Dark mode optimizado (#1e1e1e de fondo)
- **Tipografía**:
  - Figma Sans (300-900) para interfaz
  - Figma Mono para datos y código
- **Paleta**: Colores contrastantes, legibles, con estética sostenible/optimista
- **Layout**: Desktop-first (1408×1244), responsive
- **Accesibilidad**: Contraste adecuado, etiquetas claras

### Principios de Diseño
- Claridad visual por encima de complejidad
- Visualizaciones que se leen "de un vistazo"
- Experiencia de usuario intuitiva para usuarios no técnicos
- Coherencia en componentes y espaciado

## Arquitectura del Sistema

### Arquitectura Limpia (Clean Architecture)

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTACIÓN                       │
│            (Next.js Frontend / FastAPI)             │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              CONTROLADORES / ADAPTADORES             │
│        (API Routes, Controllers, Presenters)        │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                 CASOS DE USO (Use Cases)            │
│   (Lógica de negocio: Calcular LDC, Métricas, etc) │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              ENTIDADES (Domain Models)              │
│      (ConsumptionData, Metrics, LoadProfile)        │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│        INFRAESTRUCTURA (External Dependencies)      │
│    (File Storage, DB, External APIs, Pandas)        │
└─────────────────────────────────────────────────────┘
```

### Backend (FastAPI - Clean Architecture)

```
/backend
  /src
    /domain                    # Capa de Dominio (núcleo)
      /entities
        - consumption_data.py  # Entidad de datos de consumo
        - metrics.py          # Entidad de métricas
        - load_profile.py     # Entidad de perfil de carga
      /value_objects
        - time_range.py       # Value objects
        - power_unit.py
      /interfaces            # Interfaces (puertos)
        - data_repository.py
        - calculator_service.py

    /application              # Capa de Aplicación
      /use_cases
        - calculate_ldc.py    # Caso de uso: Calcular LDC
        - calculate_metrics.py
        - process_file.py
        - generate_heatmap.py
        - export_report.py
      /dto                    # Data Transfer Objects
        - consumption_input.py
        - metrics_output.py

    /infrastructure           # Capa de Infraestructura
      /persistence
        - file_repository.py  # Implementación de repositorio
      /services
        - pandas_calculator.py # Implementación con Pandas
        - file_processor.py
      /external
        - export_service.py   # PDF, CSV exports

    /presentation             # Capa de Presentación
      /api
        /v1
          /routes
            - consumption.py  # Endpoints de consumo
            - metrics.py
            - export.py
          /schemas          # Pydantic schemas para API
            - requests.py
            - responses.py
      /dependencies          # Dependency injection
        - containers.py

  /tests
    /unit
    /integration

  main.py                    # Entry point FastAPI
  config.py                  # Configuración
  requirements.txt
  Dockerfile                # Para Cloud Run
```

### Frontend (React + Vite)

```
/Frontend
  /src
    /components               # Todos los componentes
      /ui                     # Componentes base (shadcn/ui - Radix wrapped)
        - accordion.tsx
        - alert-dialog.tsx
        - alert.tsx
        - avatar.tsx
        - badge.tsx
        - button.tsx
        - calendar.tsx
        - card.tsx
        - checkbox.tsx
        - dialog.tsx
        - dropdown-menu.tsx
        - form.tsx
        - input.tsx
        - label.tsx
        - select.tsx
        - slider.tsx
        - switch.tsx
        - table.tsx
        - tabs.tsx
        - tooltip.tsx
        - [40+ componentes más...]

      /solar-es               # Componentes principales españolizados
        - BarraLateral.tsx    # Sidebar con navegación
        - Encabezado.tsx      # Header con usuario y notificaciones
        - TarjetaMetrica.tsx  # Cards de KPIs (energía, potencia)
        - GraficoCurvaCarga.tsx  # Gráficos Recharts (LDC, horario, diario)
        - MapaCalor.tsx       # Heatmap 24x7 de consumo
        - PanelCargaDatos.tsx # Carga manual/masiva (CSV/XLSX)
        - ControlesPerfil.tsx # Sliders diurno/nocturno, estaciones
        - PanelExportacion.tsx # Exportar CSV, Excel, PNG, SVG, PDF

      /solar                  # Componentes en inglés (alternativa)
        - Header.tsx
        - Sidebar.tsx
        - SummaryCard.tsx
        - InverterPanel.tsx
        - LoadChart.tsx

      /figma
        - ImageWithFallback.tsx

      - CloudBackground.tsx
      - DashboardHeader.tsx
      - EnergyCard.tsx
      - EnvironmentalChart.tsx
      - GardenMonitor.tsx
      - ResourceUsage.tsx
      - WeatherWidget.tsx

    /styles
      - globals.css           # Estilos globales y tema Tailwind

    - App.tsx                 # Componente principal con routing por tabs
    - main.tsx                # Entry point React
    - index.css               # Tailwind compilado (2700+ líneas)

  - index.html                # HTML entry point
  - vite.config.ts            # Configuración Vite
  - package.json
  - README.md
```

### Principios SOLID en Arquitectura Limpia

#### 1. Single Responsibility Principle (SRP)
- Cada caso de uso tiene una única responsabilidad
- Entidades solo contienen lógica de dominio
- Servicios de infraestructura solo implementan acceso externo

#### 2. Open/Closed Principle (OCP)
- Extensible mediante nuevos casos de uso sin modificar existentes
- Nuevos calculadores mediante interfaces

#### 3. Liskov Substitution Principle (LSP)
- Todas las implementaciones de repositorios son intercambiables
- Calculadores diferentes pueden sustituirse entre sí

#### 4. Interface Segregation Principle (ISP)
- Interfaces pequeñas y específicas por funcionalidad
- Clientes solo dependen de métodos que usan

#### 5. Dependency Inversion Principle (DIP)
- Casos de uso dependen de interfaces, no de implementaciones
- Infraestructura implementa interfaces del dominio

### Patrones de Diseño Aplicados

#### 1. Repository Pattern
```python
# domain/interfaces/data_repository.py
class DataRepository(ABC):
    @abstractmethod
    def save(self, data: ConsumptionData) -> None: pass

    @abstractmethod
    def find_by_date_range(self, start: date, end: date) -> List[ConsumptionData]: pass
```

#### 2. Strategy Pattern (Cálculo Estacional)
```python
# application/use_cases/calculate_metrics.py
class SeasonalStrategy(ABC):
    @abstractmethod
    def adjust_consumption(self, data: ConsumptionData) -> ConsumptionData: pass

class RainySeasonStrategy(SeasonalStrategy): ...
class DrySeasonStrategy(SeasonalStrategy): ...
```

#### 3. Factory Pattern (Visualizaciones)
```typescript
// frontend/features/visualization/utils/chart-factory.ts
class ChartFactory {
  createChart(type: ChartType, data: ChartData): ChartComponent
}
```

#### 4. Dependency Injection
```python
# FastAPI dependency injection
def get_ldc_calculator() -> LDCCalculator:
    return PandasLDCCalculator()

@router.post("/calculate")
async def calculate(
    calculator: LDCCalculator = Depends(get_ldc_calculator)
):
    ...
```

## Despliegue en Google Cloud Run

### Configuración Backend (FastAPI)

```dockerfile
# Dockerfile para Cloud Run
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src ./src
COPY ./main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Configuración Frontend (React + Vite)
- Build con Vite → carpeta /build
- Deploy en Cloud Run o Vercel
- Variables de entorno para API backend
- Servidor de desarrollo en puerto 3000

### CI/CD
- GitHub Actions para despliegue automático
- Tests antes de deploy
- Variables de entorno seguras

## Plan de Desarrollo (3 Sprints)

### Sprint 1: Fundamentos y Diseño (Semana 1)
- ✅ Setup del proyecto (React + Vite exportado desde Figma)
- ✅ Componentes UI base (shadcn/ui - 60+ componentes)
- ✅ Componentes principales en español (solar-es)
- ✅ Sistema de diseño Solarpunk con Tailwind CSS v4
- 🔄 Backend FastAPI (pendiente)
- 🔄 Definición de entidades de dominio (pendiente)
- 🔄 Interfaces y contratos (pendiente)

### Sprint 2: MVP Funcional (Semana 2)
- 🔄 Backend: Casos de uso básicos implementados
- 🔄 Lectura de archivos CSV/XLSX (backend)
- 🔄 Cálculo de LDC (backend con Pandas)
- ✅ Frontend: Gráfica de consumo (Recharts - 3 vistas)
- ✅ Frontend: Heatmap interactivo
- 🔄 API FastAPI funcional
- 🔄 Integración Frontend-Backend (conectar datos reales)

### Sprint 3: Experiencia y Despliegue (Semana 3)
- ✅ Frontend: Perfilado diurno/nocturno con sliders
- ✅ Frontend: Ajustes estacionales (select dropdown)
- ✅ Frontend: Sistema de exportaciones (CSV, Excel, PNG, SVG, PDF)
- 🔄 Backend: Lógica de exportaciones
- 🔄 Tests unitarios e integración
- 🔄 Despliegue a producción (Cloud Run)
- 🔄 Documentación completa
- 🔄 Manual de usuario / video

## Criterios de Evaluación

### Críticos (Alta Prioridad)
- ✅ LDC correctamente implementado
- ✅ Visualizaciones claras y útiles
- ✅ Carga de datos (manual y masiva) funcional
- ✅ Perfilado diurno/nocturno con impacto real en métricas
- ✅ Arquitectura limpia bien implementada

### Importantes
- ✅ Usabilidad para usuarios no técnicos
- ✅ Estabilidad del despliegue en Cloud Run
- ✅ Documentación completa (README + manual/video)
- ✅ Calidad de exportaciones
- ✅ Buenas prácticas (estructura, comentarios, tests, versionado)
- ✅ Separación clara de responsabilidades

### Diferenciadores
- ✅ **Rasgo distintivo del equipo** (a definir)
  - Opciones: modo confidencial, comparador de escenarios, tema visual Solarpunk único, accesibilidad avanzada

## Buenas Prácticas Específicas

### Arquitectura
- **Independencia del framework**: Lógica de negocio no depende de FastAPI/Next.js
- **Testeable**: Casos de uso pueden probarse sin infraestructura
- **Independencia de UI**: Cambiar frontend sin afectar lógica
- **Independencia de DB**: Cambiar persistencia sin afectar negocio

### Datos
- Probar con datasets pequeños y grandes (mínimo 30 días, granularidad horaria)
- Documentar manejo de valores faltantes y atípicos
- Anonimización de información sensible
- Recolección mínima de datos necesarios

### Desarrollo
- Versionado semántico (Git)
- Comentarios claros en lógica compleja
- Tests unitarios para casos de uso críticos
- Tests de integración para API
- Registro de cambios (CHANGELOG)
- Type hints en Python
- TypeScript estricto en Frontend

### Ética y Seguridad
- Privacidad de datos del usuario
- Transparencia en cálculos y algoritmos
- Validación de inputs (evitar inyecciones)
- CORS configurado correctamente
- HTTPS en producción
- Accesibilidad (WCAG 2.1 AA mínimo)

## Entregables Finales

1. **Aplicación desplegada en Cloud Run**
2. **README completo** con:
   - Instalación y configuración local
   - Guía de uso
   - Arquitectura del proyecto
   - Diagramas de arquitectura limpia
3. **Datos de prueba** incluidos
4. **Manual de usuario** (documento Markdown o video corto)
5. **Código fuente** con:
   - Tests unitarios y de integración
   - Documentación inline
   - Type hints/TypeScript completo
6. **Documentación API** (OpenAPI/Swagger automático de FastAPI)

## Filosofía de Desarrollo

> "Arquitectura limpia no significa complejidad. Significa separación clara de responsabilidades, testabilidad y mantenibilidad. Solo añade capas cuando resuelvan un problema real."

### Decisiones de Diseño
- **¿Nueva capa?** → Solo si mejora la separación de responsabilidades
- **¿Patrón de diseño?** → Solo si simplifica el código, no por tendencia
- **¿Nueva librería?** → Solo si no hay alternativa razonable en el stack actual
- **¿Feature adicional?** → Solo si aporta valor claro al usuario final
- **¿Abstracción?** → Solo después de ver duplicación real (regla de tres)

### Reglas de Dependencia
```
Dominio ← Aplicación ← Infraestructura/Presentación
(El flujo de control va hacia afuera, las dependencias hacia adentro)
```

---

## Estado del Proyecto
- **Fase actual**: Sprint 1 - Frontend completado
- **Stack confirmado**: React + Vite + FastAPI + Cloud Run
- **Arquitectura**: Clean Architecture (backend pendiente)
- **Diseño UI**: ✅ Implementado desde Figma (tema Solarpunk)
- **Frontend**: ✅ Completado (React 18, Vite 6, shadcn/ui, Tailwind v4, Recharts)
- **Backend**: 🔄 Pendiente (FastAPI con Clean Architecture)
- **Próximos pasos**:
  1. ✅ Frontend: Setup completado
  2. 🔄 Backend: Setup inicial con FastAPI
  3. 🔄 Definición de entidades de dominio
  4. 🔄 Implementación de casos de uso core
  5. 🔄 Integración Frontend-Backend
