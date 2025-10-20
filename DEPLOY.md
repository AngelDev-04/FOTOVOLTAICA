# 🚀 Guía de Despliegue en Google Cloud Run

Esta guía te ayudará a desplegar el proyecto Fotovoltaica en Google Cloud Run.

## 📋 Prerrequisitos

1. **Cuenta de Google Cloud Platform (GCP)**
   - Crea una cuenta en https://cloud.google.com
   - Crea un proyecto nuevo o usa uno existente

2. **Google Cloud SDK instalado**
   ```bash
   # Verificar instalación
   gcloud --version
   
   # Si no está instalado, descárgalo de:
   # https://cloud.google.com/sdk/docs/install
   ```

3. **Autenticación**
   ```bash
   # Iniciar sesión
   gcloud auth login
   
   # Configurar proyecto
   gcloud config set project TU_PROJECT_ID
   ```

---

## 🔧 Paso 1: Desplegar Backend

### 1.1 Navegar a la carpeta Backend
```bash
cd Backend
```

### 1.2 Build y Push de la imagen
```bash
gcloud builds submit --tag gcr.io/TU_PROJECT_ID/fotovoltaica-backend
```

### 1.3 Deploy a Cloud Run
```bash
gcloud run deploy fotovoltaica-backend \
  --image gcr.io/TU_PROJECT_ID/fotovoltaica-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0
```

### 1.4 Obtener URL del Backend
```bash
gcloud run services describe fotovoltaica-backend \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

**Guarda esta URL**, la necesitarás para el frontend.

Ejemplo de salida:
```
https://fotovoltaica-backend-xxxxxxxxx-uc.a.run.app
```

---

## 🎨 Paso 2: Desplegar Frontend

### 2.1 Navegar a la carpeta Frontend
```bash
cd ../Frontend
```

### 2.2 Build con URL del Backend
**⚠️ IMPORTANTE:** Reemplaza `YOUR_BACKEND_URL` con la URL que obtuviste en el paso 1.4

```bash
gcloud builds submit \
  --tag gcr.io/TU_PROJECT_ID/fotovoltaica-frontend \
  --build-arg VITE_API_URL=https://fotovoltaica-backend-xxxxxxxxx-uc.a.run.app
```

### 2.3 Deploy a Cloud Run
```bash
gcloud run deploy fotovoltaica-frontend \
  --image gcr.io/TU_PROJECT_ID/fotovoltaica-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 10 \
  --min-instances 0
```

### 2.4 Obtener URL del Frontend
```bash
gcloud run services describe fotovoltaica-frontend \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

Ejemplo de salida:
```
https://fotovoltaica-frontend-xxxxxxxxx-uc.a.run.app
```

---

## 🔒 Paso 3: Actualizar CORS en Backend

### 3.1 Editar main.py
Abre `Backend/main.py` y actualiza la configuración de CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Desarrollo local
        "https://fotovoltaica-frontend-xxxxxxxxx-uc.a.run.app",  # ← Tu URL de Cloud Run
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3.2 Redesplegar Backend
```bash
cd Backend

# Build
gcloud builds submit --tag gcr.io/TU_PROJECT_ID/fotovoltaica-backend

# Deploy (más rápido, solo actualiza)
gcloud run deploy fotovoltaica-backend \
  --image gcr.io/TU_PROJECT_ID/fotovoltaica-backend \
  --platform managed \
  --region us-central1
```

---

## ✅ Paso 4: Verificación

### 4.1 Verificar Backend
```bash
curl https://fotovoltaica-backend-xxxxxxxxx-uc.a.run.app/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "service": "Sistema de Análisis Energético",
  "version": "1.0.0"
}
```

### 4.2 Verificar Frontend
Abre en tu navegador:
```
https://fotovoltaica-frontend-xxxxxxxxx-uc.a.run.app
```

Deberías ver el dashboard de Solarpunk.

### 4.3 Verificar Comunicación Frontend ↔ Backend
1. En el dashboard, sube un archivo CSV de prueba
2. Si ves las métricas calculadas, ¡todo funciona! 🎉

---

## 🔄 Actualizaciones Futuras

### Actualizar Backend
```bash
cd Backend
gcloud builds submit --tag gcr.io/TU_PROJECT_ID/fotovoltaica-backend
gcloud run deploy fotovoltaica-backend \
  --image gcr.io/TU_PROJECT_ID/fotovoltaica-backend \
  --platform managed \
  --region us-central1
```

### Actualizar Frontend
```bash
cd Frontend
gcloud builds submit \
  --tag gcr.io/TU_PROJECT_ID/fotovoltaica-frontend \
  --build-arg VITE_API_URL=https://fotovoltaica-backend-xxxxxxxxx-uc.a.run.app

gcloud run deploy fotovoltaica-frontend \
  --image gcr.io/TU_PROJECT_ID/fotovoltaica-frontend \
  --platform managed \
  --region us-central1
```

---

## 📊 Recursos Configurados

| Servicio | CPU | RAM | Timeout | Max Instances | Costo Estimado/mes |
|----------|-----|-----|---------|---------------|-------------------|
| **Backend** | 2 vCPU | 2 GB | 300s | 10 | $10-20 |
| **Frontend** | 1 vCPU | 512 MB | 60s | 10 | $1-5 |

---

## 🐛 Troubleshooting

### Error: "Permission denied"
```bash
# Habilitar APIs necesarias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Error: "CORS policy"
- Verifica que agregaste la URL del frontend en `Backend/main.py`
- Redespliega el backend después de cambiar CORS

### Error: "Module not found" en Backend
- Verifica que `requirements.txt` esté completo
- Rebuilldea la imagen

### Frontend muestra página en blanco
- Verifica que la URL del backend sea correcta en el build
- Abre DevTools (F12) → Console para ver errores
- Verifica que el backend esté respondiendo en `/health`

### Error: "Build argument VITE_API_URL not found"
Para pasar el build arg correctamente, usa:
```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions _VITE_API_URL=https://tu-backend-url
```

O crea un `cloudbuild.yaml`:
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/fotovoltaica-frontend'
      - '--build-arg'
      - 'VITE_API_URL=${_VITE_API_URL}'
      - '.'
images:
  - 'gcr.io/$PROJECT_ID/fotovoltaica-frontend'
substitutions:
  _VITE_API_URL: 'https://fotovoltaica-backend-xxx.a.run.app'
```

---

## 🔐 Seguridad en Producción

### Habilitar autenticación (opcional)
```bash
# Remover --allow-unauthenticated
gcloud run deploy fotovoltaica-backend \
  --image gcr.io/TU_PROJECT_ID/fotovoltaica-backend \
  --platform managed \
  --region us-central1 \
  --no-allow-unauthenticated
```

### Configurar dominio personalizado
```bash
# Mapear dominio
gcloud run domain-mappings create \
  --service fotovoltaica-frontend \
  --domain tu-dominio.com \
  --region us-central1
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: https://console.cloud.google.com/logs
2. Verifica el estado de Cloud Run: https://console.cloud.google.com/run
3. Consulta la documentación: https://cloud.google.com/run/docs

---

## 🎉 ¡Listo!

Tu aplicación Fotovoltaica está desplegada en Google Cloud Run y lista para producción.

**URLs de tu aplicación:**
- Frontend: `https://fotovoltaica-frontend-xxxxxxxxx-uc.a.run.app`
- Backend: `https://fotovoltaica-backend-xxxxxxxxx-uc.a.run.app`
- Docs API: `https://fotovoltaica-backend-xxxxxxxxx-uc.a.run.app/docs`

---

**Made with ❤️ and ☀️ by Proyecto Fotovoltaico Team**
