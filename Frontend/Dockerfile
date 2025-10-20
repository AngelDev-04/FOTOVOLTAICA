# ============================================
# STAGE 1: Build de la aplicación React
# ============================================
FROM node:20-alpine AS builder

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias (usa cache si package.json no cambia)
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY . .

# Build argument para URL del backend
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# ============================================
# STAGE 2: Servidor Nginx para servir archivos
# ============================================
FROM nginx:alpine

# Copiar archivos build desde stage anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 8080 (Cloud Run requirement)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
