"""
==========================================================
Application Configuration
==========================================================

Loads all application settings from .env using
Pydantic Settings (v2).

This file centralizes configuration for:

✓ FastAPI
✓ PostgreSQL
✓ JWT Authentication
✓ CORS
✓ Logging
✓ External APIs
✓ NestJS Integration

==========================================================
"""

from functools import lru_cache

from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """
    Application settings.
    """

    # ======================================================
    # Application
    # ======================================================

    APP_NAME: str = "Team Productivity Platform API"

    APP_VERSION: str = "1.0.0"

    ENVIRONMENT: str = "development"

    DEBUG: bool = True

    # ======================================================
    # Server
    # ======================================================

    HOST: str = "0.0.0.0"

    PORT: int = 8000

    # ======================================================
    # Security
    # ======================================================

    SECRET_KEY: str = Field(..., min_length=32)

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ======================================================
    # PostgreSQL
    # ======================================================

    POSTGRES_HOST: str

    POSTGRES_PORT: int

    POSTGRES_USER: str

    POSTGRES_PASSWORD: str

    POSTGRES_DB: str

    DATABASE_URL: str

    # ======================================================
    # CORS
    # ======================================================

    BACKEND_CORS_ORIGINS: str = (
        "http://localhost:3000"
    )

    # ======================================================
    # Logging
    # ======================================================

    LOG_LEVEL: str = "INFO"

    # ======================================================
    # NestJS
    # ======================================================

    NESTJS_API_URL: str = (
        "http://localhost:3001/api/v1"
    )

    # ======================================================
    # External APIs
    # ======================================================

    OPEN_LIBRARY_BASE_URL: str = (
        "https://openlibrary.org"
    )

    HOLIDAYS_API_BASE_URL: str = (
        "https://date.nager.at/api/v3"
    )

    # ======================================================
    # API
    # ======================================================

    API_V1_PREFIX: str = "/api/v1"

    # ======================================================
    # Settings
    # ======================================================

    # Use a plain dict for model_config to avoid importing pydantic_settings
    model_config: dict = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }

    # ======================================================
    # Computed Properties
    # ======================================================

    @property
    def cors_origins(self) -> list[str]:
        """
        Convert comma-separated CORS origins
        into a Python list.
        """
        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.

    Prevents reloading .env on every import.
    """
    return Settings()


settings = get_settings()