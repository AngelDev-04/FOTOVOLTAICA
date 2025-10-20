"""
Configuration - Configuración de la aplicación
Variables de entorno y configuración global
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Configuración de la aplicación usando Pydantic Settings.

    Las variables se pueden configurar mediante:
    1. Archivo .env
    2. Variables de entorno del sistema
    3. Valores por defecto
    """

    # Información de la aplicación
    APP_NAME: str = "Sistema de Análisis Energético"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API para análisis de consumo eléctrico"

    # Configuración del servidor
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    RELOAD: bool = True  # Auto-reload en desarrollo

    # CORS - Orígenes permitidos
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]

    # Configuración de archivos
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50 MB
    ALLOWED_EXTENSIONS: List[str] = [".csv", ".xlsx", ".xls"]

    # Configuración de procesamiento
    MIN_RECORDS: int = 24  # Mínimo de registros (1 día)
    MAX_RECORDS: int = 1_000_000  # Máximo de registros

    # Configuración de perfil por defecto
    DEFAULT_DIURNAL_START: int = 6  # 06:00
    DEFAULT_DIURNAL_END: int = 18   # 18:00

    # Logging
    LOG_LEVEL: str = "INFO"

    # Base de datos (futuro)
    # DATABASE_URL: str = "sqlite:///./energy_data.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Instancia global de configuración
settings = Settings()
