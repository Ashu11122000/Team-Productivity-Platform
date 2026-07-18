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
    Application settings loaded from the .env file.
    """

    # ======================================================
    # Application
    # ======================================================

    APP_NAME: str = "Team Productivity Platform API"

    APP_VERSION: str = "1.0.0"

    ENVIRONMENT: Literal[
        "development",
        "testing",
        "staging",
        "production",
    ] = "development"

    DEBUG: bool = True

    # ======================================================
    # Server
    # ======================================================

    HOST: str = "0.0.0.0"

    PORT: int = 8000

    # ======================================================
    # Security
    # ======================================================

    SECRET_KEY: str = Field(
        ...,
        min_length=32,
        description="JWT Secret Key",
    )

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        gt=0,
    )

    # ======================================================
    # PostgreSQL
    # ======================================================

    POSTGRES_HOST: str

    POSTGRES_PORT: int = Field(gt=0)

    POSTGRES_USER: str

    POSTGRES_PASSWORD: str

    POSTGRES_DB: str

    DATABASE_URL: str

    # ======================================================
    # CORS
    # ======================================================

    BACKEND_CORS_ORIGINS: str = (
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    # ======================================================
    # Logging
    # ======================================================

    LOG_LEVEL: Literal[
        "DEBUG",
        "INFO",
        "WARNING",
        "ERROR",
        "CRITICAL",
    ] = "INFO"

    # ======================================================
    # External Services
    # ======================================================

    NESTJS_API_URL: AnyHttpUrl = (
        "http://localhost:3001/api/v1"
    )

    OPEN_LIBRARY_BASE_URL: AnyHttpUrl = (
        "https://openlibrary.org"
    )

    HOLIDAYS_API_BASE_URL: AnyHttpUrl = (
        "https://date.nager.at/api/v3"
    )

    # ======================================================
    # Pydantic Settings Configuration
    # ======================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ======================================================
    # Validators
    # ======================================================

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
                "DATABASE_URL must start with "
                "'postgresql+psycopg://' or 'postgresql://'."
            )

        return value

    # ======================================================
    # Computed Properties
    # ======================================================

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
        """
        True if running in development mode.
        """

        return self.ENVIRONMENT == "development"

    @property
    def is_testing(self) -> bool:
        """
        True if running in testing mode.
        """

        return self.ENVIRONMENT == "testing"

    @property
    def is_staging(self) -> bool:
        """
        True if running in staging mode.
        """

        return self.ENVIRONMENT == "staging"

    @property
    def is_production(self) -> bool:
        """
        True if running in production mode.
        """

        return self.ENVIRONMENT == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return a cached Settings instance.

    The configuration is loaded only once during the
    application's lifetime.
    """

    return Settings()


settings = get_settings()