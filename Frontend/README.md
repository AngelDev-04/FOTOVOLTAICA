
# 🌞 Frontend - Dashboard de Análisis Energético Solarpunk

> Interfaz de usuario moderna y responsiva para análisis de consumo eléctrico y dimensionamiento de sistemas fotovoltaicos, construida con **React 18**, **TypeScript**, **Vite** y **Tailwind CSS**.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Componentes Principales](#-componentes-principales)
- [Hooks Personalizados](#-hooks-personalizados)
- [Integración con Backend](#-integración-con-backend)
- [Generación de PDFs](#-generación-de-pdfs)
- [Temas y Estilos](#-temas-y-estilos)
- [Build y Despliegue](#-build-y-despliegue)
- [Contribución](#-contribución)

---

## 📖 Descripción

**Solarpunk Dashboard** es una aplicación web moderna que permite a usuarios y profesionales del sector energético analizar patrones de consumo eléctrico para diseñar sistemas fotovoltaicos eficientes.

> **Diseño Original:** Basado en [Solarpunk Dashboard (Community)](https://www.figma.com/design/keUO89iWFzkfa9VhlUcXE5/Solarpunk-Dashboard--Community-) de Figma.

### 🎯 Objetivos

- **Visualizar** datos históricos de consumo eléctrico de forma intuitiva
- **Analizar** patrones de consumo (diurno/nocturno, diario/semanal)
- **Calcular** métricas energéticas clave (potencia pico, factor de carga, etc.)
- **Generar** reportes PDF profesionales con gráficas y análisis
- **Optimizar** el dimensionamiento de sistemas solares fotovoltaicos

### 🌟 Características Destacadas

- 🎨 **Diseño Solarpunk** - Estética futurista sostenible con tema claro/oscuro
- 📊 **Gráficas Interactivas** - Visualización con Recharts (LDC, heatmaps, perfiles)
- 📄 **Exportación PDF** - Reportes profesionales con captura de gráficas
- 🚀 **Rendimiento Optimizado** - Vite + SWC para builds ultrarrápidos
- 📱 **Responsive Design** - Adaptable a móviles, tablets y escritorio
- ♿ **Accesibilidad** - Componentes basados en Radix UI con ARIA labels
- 🌐 **Internacionalización** - Interfaz completamente en español

---

## ✨ Características

### 📁 Gestión de Datos
- ✅ **Carga de archivos** CSV/Excel mediante drag & drop
- ✅ **Validación en tiempo real** de formato y datos
- ✅ **Preview de datos** antes de procesar
- ✅ **Gestión de errores** con notificaciones amigables

### 📊 Visualizaciones
- ✅ **Load Duration Curve (LDC)** - Curva de carga ordenada para dimensionamiento
- ✅ **Heatmap Horario/Semanal** - Matriz 7x24 con promedios de consumo
- ✅ **Gráfica Por Hora** - Consumo horario de un día específico
- ✅ **Gráfica Por Día** - Consumo diario de una semana específica
- ✅ **Tarjetas de Métricas** - Energía total, potencia pico, factor de carga

### 🔧 Análisis Avanzado
- ✅ **Perfiles de Consumo** - Análisis diurno/nocturno configurable
- ✅ **Filtrado por Período** - Año, mes, semana, día
- ✅ **Comparación Estacional** - Patrones verano/invierno
- ✅ **Detección de Picos** - Identificación de consumos máximos

### 📄 Reportes
- ✅ **Generación de PDF** - Reportes profesionales con logo y branding
- ✅ **Captura de Gráficas** - SVG→PNG sin dependencias pesadas
- ✅ **Exportación de Datos** - CSV/Excel para análisis externo
- ✅ **Impresión Optimizada** - Estilos específicos para impresión

---

## 🛠️ Stack Tecnológico

### Core Framework
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **[React](https://reactjs.org/)** | 18.3.1 | Framework UI con Hooks y Context |
| **[TypeScript](https://www.typescriptlang.org/)** | 5.x | Tipado estático y autocompletado |
| **[Vite](https://vitejs.dev/)** | 6.3.5 | Build tool ultrarrápido con HMR |

### UI & Styling
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **[Tailwind CSS](https://tailwindcss.com/)** | v4 | Framework CSS utility-first |
| **[Radix UI](https://www.radix-ui.com/)** | ^1.x | Componentes accesibles sin estilo |
| **[shadcn/ui](https://ui.shadcn.com/)** | - | Componentes reutilizables con Tailwind |
| **[Lucide React](https://lucide.dev/)** | 0.487.0 | Biblioteca de iconos SVG |
| **[Next Themes](https://github.com/pacocoursey/next-themes)** | 0.4.6 | Sistema de temas claro/oscuro |

### Visualización de Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **[Recharts](https://recharts.org/)** | 2.15.2 | Gráficas interactivas con D3.js |
| **[@react-pdf/renderer](https://react-pdf.org/)** | 4.3.1 | Generación de PDFs en React |
| **[html2canvas](https://html2canvas.hertzen.com/)** | 1.4.1 | Captura de screenshots DOM→Canvas |
| **[jsPDF](https://github.com/parallax/jsPDF)** | 3.0.3 | Biblioteca PDF (fallback) |

### Utilidades
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **[React Hook Form](https://react-hook-form.com/)** | 7.55.0 | Manejo eficiente de formularios |
| **[Sonner](https://sonner.emilkowal.ski/)** | 2.0.3 | Toast notifications elegantes |
| **[file-saver](https://github.com/eligrey/FileSaver.js)** | 2.0.5 | Descargas de archivos del cliente |
| **[class-variance-authority](https://cva.style/)** | 0.7.1 | Gestión de variantes de componentes |
| **[clsx](https://github.com/lukeed/clsx)** | - | Construcción de clases CSS condicionales |
| **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** | - | Merge inteligente de clases Tailwind |

---

## 🏗️ Arquitectura

### Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                       APP.TSX (Root)                        │
│              Estado Global + Routing + Themes               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYOUT COMPONENTS                        │
│        Encabezado │ BarraLateral │ Main Content            │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│   FEATURES      │ │   CHARTS    │ │   EXPORT        │
│ • PanelCarga    │ │ • LDC       │ │ • ReportePDF    │
│ • Métricas      │ │ • Heatmap   │ │ • Exportación   │
│ • Controles     │ │ • Horario   │ │                 │
│                 │ │ • Semanal   │ │                 │
└─────────────────┘ └─────────────┘ └─────────────────┘
            │               │               │
            └───────────────┼───────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOKS LAYER                       │
│    useApi • useMetrics • useLDC • useHeatmap • useChart    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API CLIENT SERVICE                        │
│           HTTP Fetch → Backend FastAPI (REST)              │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos (One-Way Data Flow)

```
Usuario                    React State                Backend API
   │                            │                          │
   ├─ Sube archivo ────────────>│                          │
   │                            ├─ uploadFile() ──────────>│
   │                            │<─ response ──────────────┤
   │                            │                          │
   │                            ├─ fetchMetrics() ────────>│
   │                            │<─ MetricsResponse ───────┤
   │                            │                          │
   │                            ├─ fetchLDC() ────────────>│
   │                            │<─ LDCResponse ───────────┤
   │                            │                          │
   │<─ Re-render (métricas) ────┤                          │
   │<─ Re-render (gráficas) ────┤                          │
   │                            │                          │
   ├─ Genera PDF ──────────────>│                          │
   │                            ├─ captureCharts()         │
   │                            ├─ renderPDF()             │
   │<─ Descarga PDF ────────────┤                          │
```

---

## 📁 Estructura del Proyecto

```
Frontend/
│
├── 📄 index.html                      # HTML entry point
├── 📄 package.json                    # Dependencias y scripts
├── 📄 vite.config.ts                  # Configuración de Vite
├── 📄 README.md                       # Este archivo
│
├── 📂 src/                            # Código fuente
│   ├── 📄 main.tsx                    # Entry point de React
│   ├── 📄 App.tsx                     # Componente raíz con estado global
│   ├── 📄 index.css                   # Estilos globales + Tailwind directives
│   ├── 📄 vite-env.d.ts               # Type definitions de Vite
│   │
│   ├── 📂 components/                 # Componentes React
│   │   │
│   │   ├── 📂 solar-es/               # 🌞 Componentes principales (español)
│   │   │   ├── Encabezado.tsx         # Header con logo y navegación
│   │   │   ├── BarraLateral.tsx       # Sidebar con navegación
│   │   │   ├── PanelCargaDatos.tsx    # Upload de archivos CSV/Excel
│   │   │   ├── TarjetaMetrica.tsx     # Card de métrica individual
│   │   │   ├── GraficoCurvaCarga.tsx  # Gráficas LDC/Horario/Semanal
│   │   │   ├── MapaCalor.tsx          # Heatmap 7x24 horas
│   │   │   ├── ControlesPerfil.tsx    # Controles de perfil de consumo
│   │   │   ├── PanelExportacion.tsx   # Exportación PDF/CSV/Excel
│   │   │   └── ReportePDF.tsx         # Template de reporte PDF
│   │   │
│   │   ├── 📂 ui/                     # 🧩 Componentes shadcn/ui
│   │   │   ├── button.tsx             # Botones con variantes
│   │   │   ├── card.tsx               # Cards contenedores
│   │   │   ├── dialog.tsx             # Modales
│   │   │   ├── select.tsx             # Dropdowns
│   │   │   ├── tabs.tsx               # Tabs de navegación
│   │   │   ├── tooltip.tsx            # Tooltips informativos
│   │   │   ├── progress.tsx           # Barras de progreso
│   │   │   ├── separator.tsx          # Divisores
│   │   │   ├── label.tsx              # Labels de formularios
│   │   │   └── ...                    # 20+ componentes Radix UI
│   │   │
│   │   ├── 📂 figma/                  # Componentes de diseño Figma
│   │   │   └── ImageWithFallback.tsx  # Imágenes con fallback
│   │   │
│   │   ├── ErrorBoundary.tsx          # Error boundary de React
│   │   ├── CloudBackground.tsx        # Fondo animado de nubes
│   │   ├── DashboardHeader.tsx        # Header genérico
│   │   └── ...                        # Otros componentes legacy
│   │
│   ├── 📂 hooks/                      # 🎣 Custom Hooks
│   │   ├── useApi.ts                  # Hooks de API (useMetrics, useLDC, etc.)
│   │   └── useChartCapture.ts         # Hook para captura de gráficas
│   │
│   ├── 📂 services/                   # 🔧 Servicios
│   │   └── api-client.ts              # Cliente HTTP para Backend API
│   │
│   ├── 📂 utils/                      # 🛠️ Utilidades
│   │   ├── dom-patch.ts               # Patches del DOM para exports
│   │   ├── html2canvas-patch.ts       # Patches de html2canvas
│   │   └── svg-to-png.ts              # Conversión SVG→PNG nativa
│   │
│   └── 📂 styles/                     # 🎨 Estilos
│       ├── globals.css                # Estilos globales y variables CSS
│       └── print.css                  # Estilos para impresión
│
└── 📂 build/                          # 📦 Build de producción (generado)
    ├── index.html
    └── assets/
        ├── index-[hash].css
        └── index-[hash].js
```

---

## 🚀 Instalación

### Requisitos Previos

- **Node.js 20+** (recomendado: usar [nvm](https://github.com/nvm-sh/nvm))
- **npm** o **yarn** o **pnpm** (gestor de paquetes)
- **Backend en ejecución** en `http://localhost:8000` (ver [Backend README](../Backend/README_COMPLETO.md))

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/AngelDev-04/FOTOVOLTAICA.git
cd FOTOVOLTAICA/Frontend
```

### Paso 2: Instalar Dependencias

```bash
# Con npm
npm install

# O con yarn
yarn install

# O con pnpm
pnpm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del Frontend:

```env
# .env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="Solarpunk Dashboard"
VITE_APP_VERSION="1.0.0"
```

**Variables disponibles:**

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del Backend API | `http://localhost:8000` |
| `VITE_APP_NAME` | Nombre de la aplicación | `Solarpunk Dashboard` |
| `VITE_APP_VERSION` | Versión de la app | `1.0.0` |

---

## 💻 Uso

### Modo Desarrollo

```bash
# Ejecutar servidor de desarrollo
npm run dev

# O con yarn
yarn dev

# O con pnpm
pnpm dev
```

La aplicación estará disponible en:
- **URL:** http://localhost:3000
- **Hot Module Replacement (HMR)** activado
- **TypeScript checking** en tiempo real

### Construir para Producción

```bash
# Build optimizado
npm run build

# Previsualizar build local
npm run preview
```

### Scripts Disponibles

```json
{
  "dev": "vite",                    // Servidor de desarrollo
  "build": "vite build"             // Build de producción
}
```

---

## 🧩 Componentes Principales

### 1. `App.tsx` - Componente Raíz

**Responsabilidad:** Gestión de estado global, routing de tabs, integración de componentes.

```typescript
export default function App() {
  // Estados principales
  const [activeTab, setActiveTab] = useState("inicio");
  const [darkMode, setDarkMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Hooks de API
  const { data: metricsData, loading, fetchMetrics } = useMetrics();
  
  // Referencias para captura de gráficas
  const graficoCurvaCargaRef = useRef<GraficoCurvaCargaHandle>(null);
  
  // Handler de exportación PDF
  const handleExportPDF = async () => {
    // 1. Capturar gráficas → SVG a PNG
    // 2. Generar PDF con @react-pdf/renderer
    // 3. Descargar archivo con file-saver
  };
  
  return (
    <div className={darkMode ? "dark" : ""}>
      <Encabezado />
      <BarraLateral activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContent>
        {/* Contenido dinámico según activeTab */}
      </MainContent>
    </div>
  );
}
```

**Props y Estado:**
- `activeTab`: Tab activa del dashboard ("inicio", "curva", "heatmap", etc.)
- `darkMode`: Modo oscuro/claro
- `dataLoaded`: Indica si se han cargado datos desde el backend

---

### 2. `PanelCargaDatos.tsx` - Carga de Archivos

**Responsabilidad:** Upload de archivos CSV/Excel, validación, preview de datos.

**Características:**
- ✅ Drag & drop de archivos
- ✅ Validación de formato (.csv, .xlsx, .xls)
- ✅ Validación de tamaño (máx. 50MB)
- ✅ Barra de progreso durante upload
- ✅ Mensajes de error descriptivos

---

### 3. `GraficoCurvaCarga.tsx` - Gráficas Principales

**Responsabilidad:** Visualización de LDC, consumo horario y consumo semanal.

**Características:**
- ✅ **3 gráficas en tabs:** LDC, Por Hora, Por Día
- ✅ **Recharts interactivo:** Tooltips, zoom, pan
- ✅ **Refs para export:** Gráficas ocultas renderizadas para PDF
- ✅ **Hooks separados:** Evita conflictos de estado entre gráficas visibles/ocultas
- ✅ **useImperativeHandle:** Expone método `getChartElements()` al padre

---

### 4. `MapaCalor.tsx` - Heatmap de Consumo

**Responsabilidad:** Visualización de matriz 7x24 (días × horas) con promedios de consumo.

**Características:**
- ✅ **Matriz 7×24:** Días de la semana × Horas del día
- ✅ **Gradiente de colores:** Azul (bajo) → Naranja (alto)
- ✅ **Tooltips informativos:** Día, hora, valor exacto
- ✅ **Leyenda de colores:** Min-Max visual
- ✅ **Responsive:** Grid adapta al tamaño de pantalla

---

### 5. `ReportePDF.tsx` - Generación de PDFs

**Responsabilidad:** Template de reporte PDF con @react-pdf/renderer.

**Proceso de generación:**
1. **Capturar gráficas** → SVG a PNG con Canvas API
2. **Renderizar template** → Componente React con @react-pdf/renderer
3. **Generar blob** → `pdf(<ReportePDF />).toBlob()`
4. **Descargar archivo** → `saveAs(blob, 'reporte.pdf')`

---

## 🎣 Hooks Personalizados

### `useApi.ts` - Hooks de API

Hooks reutilizables para interactuar con el Backend.

```typescript
// Hook para métricas
export function useMetrics() {
  const [state, setState] = useState<UseApiState<MetricsResponse>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const fetchMetrics = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await apiClient.getMetrics();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);
  
  return { ...state, fetchMetrics };
}

// Hooks adicionales:
// - useUploadFile()
// - useLDC()
// - useHeatmap()
// - useProfile()
// - useHourlyData()
// - useWeeklyData()
// - useStatus()
```

**Ventajas:**
- ✅ **Separación de concerns:** Lógica de API fuera de componentes
- ✅ **Reutilizable:** Múltiples componentes usan el mismo hook
- ✅ **Type-safe:** TypeScript infiere tipos automáticamente
- ✅ **Gestión de estado:** Loading, error, data en un solo hook

---

### `useChartCapture.ts` - Captura de Gráficas

Hook para convertir elementos DOM (SVG) a imágenes PNG.

**Por qué no usar html2canvas:**
- ❌ html2canvas tiene problemas con `oklch()` de Tailwind v4
- ❌ Librería pesada (~500KB)
- ✅ Canvas API nativo es más rápido y ligero
- ✅ XMLSerializer + Canvas maneja SVG perfectamente

---

## 🔌 Integración con Backend

### `api-client.ts` - Cliente HTTP

Cliente centralizado para todas las llamadas al Backend.

### Endpoints Utilizados

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/upload` | POST | Subir archivo CSV/Excel |
| `/api/v1/metrics` | GET | Obtener métricas energéticas |
| `/api/v1/ldc` | GET | Obtener Load Duration Curve |
| `/api/v1/profile` | POST | Calcular perfil de consumo |
| `/api/v1/heatmap` | GET | Obtener datos de heatmap |
| `/api/v1/hourly` | GET | Consumo horario de un día |
| `/api/v1/weekly` | GET | Consumo semanal |
| `/api/v1/status` | GET | Estado del sistema |
| `/api/v1/clear` | DELETE | Limpiar datos |
| `/health` | GET | Health check |

---

## 📄 Generación de PDFs

### Proceso Completo

```typescript
// 1. Obtener referencias de gráficas
const chartElements = graficoCurvaCargaRef.current?.getChartElements();

// 2. Capturar cada gráfica como PNG
const ldcImg = await captureChart(chartElements.ldcChart, 2);
const horarioImg = await captureChart(chartElements.horarioChart, 2);
const diarioImg = await captureChart(chartElements.diarioChart, 2);

// 3. Preparar datos del reporte
const reportData = {
  metricas: {
    energiaTotal: metricsData.total_energy_kwh,
    potenciaPico: metricsData.peak_power_kw,
    // ...
  },
  graficas: {
    ldc: ldcImg.dataUrl,
    horario: horarioImg.dataUrl,
    diario: diarioImg.dataUrl,
  },
};

// 4. Generar PDF con @react-pdf/renderer
const blob = await pdf(<ReportePDF {...reportData} />).toBlob();

// 5. Descargar archivo
saveAs(blob, `reporte-energia-${Date.now()}.pdf`);
```

### Estrategia de Captura de Gráficas

**Problema inicial:**
- Las gráficas en tabs no se renderizan si no están activas
- Solo se podía capturar la gráfica visible

**Solución implementada:**
1. Renderizar **gráficas ocultas** fuera de la pantalla (`position: absolute; left: -9999px`)
2. Usar **hooks separados** para datos visibles y ocultos (evita conflictos de estado)
3. **Cargar datos automáticamente** en las gráficas ocultas al montar el componente
4. Exponer **refs** de las gráficas ocultas mediante `useImperativeHandle`

---

## 🎨 Temas y Estilos

### Sistema de Temas

El proyecto usa **next-themes** para gestionar el modo claro/oscuro.

### Tailwind CSS v4

**Variables CSS personalizadas** definidas en `globals.css` con soporte para modo oscuro.

---

## 🚢 Build y Despliegue

### Build de Producción

```bash
# Build optimizado
npm run build

# Archivos generados en /build:
# - index.html (con hashes)
# - assets/index-[hash].js (JS minificado)
# - assets/index-[hash].css (CSS optimizado)
```

### Optimizaciones Aplicadas

| Optimización | Descripción |
|--------------|-------------|
| **Code Splitting** | Vite divide automáticamente en chunks |
| **Tree Shaking** | Elimina código no usado |
| **Minificación** | Terser para JS, cssnano para CSS |
| **Compresión** | Gzip/Brotli en servidor |
| **Lazy Loading** | Componentes cargados bajo demanda |
| **Image Optimization** | SVG inline, PNG comprimidas |

---

### Despliegue en Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy a producción
vercel --prod
```

---

### Despliegue en Netlify

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy

# 4. Deploy a producción
netlify deploy --prod
```

---

## 🤝 Contribución

### Guía de Contribución

1. **Fork** el repositorio
2. Crea una **rama** para tu feature:
   ```bash
   git checkout -b feature/nueva-visualizacion
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m 'feat: Agrega gráfica de comparación mensual'
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/nueva-visualizacion
   ```
5. Abre un **Pull Request** con descripción clara

### Estándares de Código

#### Convenciones de Nombres

```typescript
// Componentes: PascalCase
export function BarraLateral() { }

// Hooks: camelCase con prefijo "use"
export function useMetrics() { }

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000';

// Variables/funciones: camelCase
const fetchData = async () => { };
```

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](../LICENSE) para más detalles.

---

## 👥 Autores

- **Equipo Proyecto Fotovoltaico** - Universidad Nacional
  - Desarrolladores Frontend
  - Diseñadores UX/UI
  - Analistas de Datos

---

## 📞 Soporte

### Canales de Comunicación

- **Issues:** [GitHub Issues](https://github.com/AngelDev-04/FOTOVOLTAICA/issues)
- **Email:** contacto@ejemplo.com
- **Documentación Backend:** [Backend README](../Backend/README_COMPLETO.md)

### FAQs

**P: ¿Por qué no se cargan las gráficas?**
R: Asegúrate de que el Backend esté ejecutándose en `http://localhost:8000` y que hayas subido un archivo de datos.

**P: ¿Cómo cambio la URL del Backend?**
R: Edita el archivo `.env` y cambia `VITE_API_URL` a la URL de tu Backend.

**P: ¿Por qué el PDF no incluye todas las gráficas?**
R: Verifica que los datos estén cargados y que todas las gráficas se hayan renderizado correctamente. Revisa la consola para errores.

**P: ¿Cómo activo el modo oscuro?**
R: Haz clic en el botón de tema (☀️/🌙) en el header del dashboard.

---

## 🙏 Agradecimientos

- [Recharts](https://recharts.org/) - Gráficas interactivas hermosas
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles de alta calidad
- [shadcn/ui](https://ui.shadcn.com/) - Sistema de diseño elegante
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS increíble
- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
- Comunidad de React - Por las librerías y recursos
- Universidad Nacional - Por el apoyo académico

---

## 📚 Referencias

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Recharts Documentation](https://recharts.org/en-US/api)
- [@react-pdf/renderer](https://react-pdf.org/)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/docs)

---

## 🔄 Changelog

### [1.0.0] - 2025-10-19

#### Added
- ✨ Dashboard completo con Solarpunk design
- ✨ Carga de archivos CSV/Excel con drag & drop
- ✨ Visualizaciones interactivas (LDC, heatmap, horario, semanal)
- ✨ Generación de PDFs con captura de gráficas
- ✨ Sistema de temas claro/oscuro
- ✨ Responsive design para móviles/tablets
- ✨ Integración completa con Backend FastAPI
- ✨ Componentes reutilizables con shadcn/ui
- ✨ Hooks personalizados para API
- ✨ Manejo de errores con toast notifications

#### Changed
- 🔄 Migración de html2canvas a Canvas API nativo
- 🔄 Implementación de gráficas ocultas para PDF export

#### Fixed
- 🐛 Captura de todas las gráficas en PDF (LDC, Horario, Semanal)
- 🐛 Conflictos de estado entre gráficas visibles/ocultas
- 🐛 Problemas con `oklch()` en Tailwind v4

---

**⚡ ¡Happy Coding!**

*Made with ❤️ and ☀️ by Proyecto Fotovoltaico Team*

---

## 🔗 Enlaces Útiles

- **Repositorio:** https://github.com/AngelDev-04/FOTOVOLTAICA
- **Backend README:** [../Backend/README_COMPLETO.md](../Backend/README_COMPLETO.md)
- **Diseño Original:** [Figma - Solarpunk Dashboard](https://www.figma.com/design/keUO89iWFzkfa9VhlUcXE5/Solarpunk-Dashboard--Community-)
- **Documentación API Backend:** http://localhost:8000/docs
  