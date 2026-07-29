"""
==========================================================
Application Configuration
==========================================================

Centralized application configuration using Pydantic
Settings (v2).

Responsibilities
----------------
✓ Load configuration from .env
✓ Validate application settings
✓ Provide cached settings instance
✓ Configure PostgreSQL
✓ Configure JWT Authentication
✓ Configure SQLAlchemy
✓ Configure CORS
✓ Configure Logging
✓ Configure External APIs

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- psycopg v3
- Docker
- Alembic
==========================================================
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized application configuration.
    """

    # =====================================================
    # Application
    # =====================================================

    APP_NAME: str = "Team Productivity Platform API"

    APP_VERSION: str = "1.0.0"

    ENVIRONMENT: Literal[
        "development",
        "testing",
        "staging",
        "production",
    ] = "development"

    DEBUG: bool = True

    # =====================================================
    # API
    # =====================================================

    API_V1_PREFIX: str = "/api/v1"

    API_DOCS_URL: str = "/docs"

    API_REDOC_URL: str = "/redoc"

    API_OPENAPI_URL: str = "/openapi.json"

    HOST: str = "0.0.0.0"

    PORT: int = 8000

    # =====================================================
    # JWT
    # =====================================================

    SECRET_KEY: str = Field(
        ...,
        min_length=32,
    )

    ALGORITHM: Literal["HS256"] = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        gt=0,
    )

    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        gt=0,
    )

    JWT_ISSUER: str = "team-productivity-platform"

    JWT_AUDIENCE: str = "team-productivity-api"

    COOKIE_SECURE: bool = False

    COOKIE_HTTPONLY: bool = True

    COOKIE_SAMESITE: Literal[
        "lax",
        "strict",
        "none",
    ] = "lax"

    # =====================================================
    # PostgreSQL
    # =====================================================

    POSTGRES_HOST: str

    POSTGRES_PORT: int = Field(gt=0)

    POSTGRES_USER: str

    POSTGRES_PASSWORD: str

    POSTGRES_DB: str

    DATABASE_URL: str

    # =====================================================
    # SQLAlchemy Pool
    # =====================================================

    DATABASE_POOL_SIZE: int = Field(
        default=10,
        ge=1,
    )

    DATABASE_MAX_OVERFLOW: int = Field(
        default=20,
        ge=0,
    )

    DATABASE_POOL_TIMEOUT: int = Field(
        default=30,
        gt=0,
    )

    DATABASE_POOL_RECYCLE: int = Field(
        default=1800,
        gt=0,
    )

    DATABASE_POOL_PRE_PING: bool = True

    # =====================================================
    # CORS
    # =====================================================

    BACKEND_CORS_ORIGINS: str = (
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    # =====================================================
    # Logging
    # =====================================================

    LOG_LEVEL: Literal[
        "DEBUG",
        "INFO",
        "WARNING",
        "ERROR",
        "CRITICAL",
    ] = "INFO"

    # =====================================================
    # Pagination
    # =====================================================

    DEFAULT_PAGE_SIZE: int = Field(
        default=20,
        gt=0,
    )

    MAX_PAGE_SIZE: int = Field(
        default=100,
        gt=0,
    )

    # =====================================================
    # Rate Limiting
    # =====================================================

    RATE_LIMIT_ENABLED: bool = True

    DEFAULT_RATE_LIMIT: str = "100/minute"

    AUTH_RATE_LIMIT: str = "10/minute"

    # =====================================================
    # External APIs
    # =====================================================

    NESTJS_API_URL: AnyHttpUrl = (
        "http://localhost:3001/api/v1"
    )

    OPEN_LIBRARY_BASE_URL: AnyHttpUrl = (
        "https://openlibrary.org"
    )

    HOLIDAYS_API_BASE_URL: AnyHttpUrl = (
        "https://date.nager.at/api/v3"
    )

    # =====================================================
    # Pydantic Settings
    # =====================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # =====================================================
    # Validators
    # =====================================================

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, value: str) -> str:
        """
        Validate SQLAlchemy database URL.
        """

        supported_prefixes = (
            "postgresql+psycopg://",
            "postgresql://",
        )

        if not value.startswith(supported_prefixes):
            raise ValueError(
                "DATABASE_URL must begin with "
                "'postgresql+psycopg://' or "
                "'postgresql://'."
            )

        return value

    # =====================================================
    # Computed Properties
    # =====================================================

    @property
    def cors_origins(self) -> list[str]:
        """
        Return CORS origins as a list.
        """

        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    @property
    def is_testing(self) -> bool:
        return self.ENVIRONMENT == "testing"

    @property
    def is_staging(self) -> bool:
        return self.ENVIRONMENT == "staging"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def sqlalchemy_echo(self) -> bool:
        """
        Enable SQL logging only during DEBUG.
        """

        return self.DEBUG and self.LOG_LEVEL == "DEBUG"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return cached application settings.
    """

    return Settings()


settings = get_settings()

__all__ = [
    "Settings",
    "settings",
    "get_settings",
]