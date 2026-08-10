"""
Application configuration.

Centralized, strongly typed application configuration using
Pydantic Settings v2.

Responsibilities
----------------
- Load configuration from environment variables and `.env`.
- Validate application configuration.
- Provide a cached settings instance.
- Configure API behavior.
- Configure JWT authentication.
- Configure PostgreSQL and SQLAlchemy pooling.
- Configure CORS and trusted hosts.
- Configure logging.
- Configure optional Redis, Celery, MinIO and email infrastructure.
- Configure rate limiting, pagination and uploads.
- Enforce production safety requirements.

The configuration layer does not establish connections to external services.
It only validates and exposes configuration required by other application layers.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized application configuration.

    Configuration is loaded from environment variables and the local
    `.env` file. Environment variables take precedence over `.env` values.

    The class intentionally keeps optional infrastructure optional.
    Redis, Celery, MinIO and email services are controlled through
    explicit enable/disable flags and are not initialized here.
    """

    # ========================================================================
    # Application
    # ========================================================================

    APP_NAME: str = "Team Productivity Platform API"

    APP_VERSION: str = "1.0.0"

    ENVIRONMENT: Literal[
        "development",
        "testing",
        "staging",
        "production",
    ] = "development"

    DEBUG: bool = True

    # ========================================================================
    # API
    # ========================================================================

    API_V1_PREFIX: str = "/api/v1"

    API_DOCS_URL: str = "/docs"

    API_REDOC_URL: str = "/redoc"

    API_OPENAPI_URL: str = "/openapi.json"

    HOST: str = "0.0.0.0"

    PORT: int = Field(
        default=8000,
        ge=1,
        le=65535,
    )

    # ========================================================================
    # JWT Authentication
    # ========================================================================

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

    REFRESH_TOKEN_ROTATION: bool = True

    JWT_ISSUER: str = "team-productivity-platform"

    JWT_AUDIENCE: str = "team-productivity-api"

    # ========================================================================
    # Cookie Security
    # ========================================================================

    COOKIE_SECURE: bool = False

    COOKIE_HTTPONLY: bool = True

    COOKIE_SAMESITE: Literal[
        "lax",
        "strict",
        "none",
    ] = "lax"

    # ========================================================================
    # PostgreSQL
    # ========================================================================

    POSTGRES_HOST: str = "localhost"

    POSTGRES_PORT: int = Field(
        default=5432,
        ge=1,
        le=65535,
    )

    POSTGRES_USER: str = "postgres"

    POSTGRES_PASSWORD: str = "postgres"

    POSTGRES_DB: str = "team_productivity"

    DATABASE_URL: str

    # ========================================================================
    # SQLAlchemy Connection Pool
    # ========================================================================

    DATABASE_POOL_SIZE: int = Field(
        default=5,
        ge=1,
    )

    DATABASE_MAX_OVERFLOW: int = Field(
        default=5,
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

    # ========================================================================
    # CORS
    # ========================================================================

    BACKEND_CORS_ORIGINS: str = (
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    # ========================================================================
    # Trusted Hosts
    # ========================================================================

    TRUSTED_HOSTS: str = "localhost,127.0.0.1"

    # ========================================================================
    # Redis
    # ========================================================================

    REDIS_ENABLED: bool = False

    REDIS_HOST: str = "localhost"

    REDIS_PORT: int = Field(
        default=6379,
        ge=1,
        le=65535,
    )

    REDIS_DB: int = Field(
        default=0,
        ge=0,
    )

    REDIS_PASSWORD: str = ""

    REDIS_URL: str = "redis://localhost:6379/0"

    # ========================================================================
    # Celery
    # ========================================================================

    CELERY_ENABLED: bool = False

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"

    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    # ========================================================================
    # Object Storage / MinIO
    # ========================================================================

    STORAGE_ENABLED: bool = False

    MINIO_ENDPOINT: str = "localhost:9000"

    MINIO_ACCESS_KEY: str = "minioadmin"

    MINIO_SECRET_KEY: str = "minioadmin"

    MINIO_BUCKET: str = "team-productivity"

    MINIO_SECURE: bool = False

    # ========================================================================
    # Email
    # ========================================================================

    EMAIL_ENABLED: bool = False

    SMTP_HOST: str = ""

    SMTP_PORT: int = Field(
        default=587,
        ge=1,
        le=65535,
    )

    SMTP_USERNAME: str = ""

    SMTP_PASSWORD: str = ""

    SMTP_TLS: bool = True

    EMAIL_FROM: str = "noreply@example.com"

    # ========================================================================
    # Rate Limiting
    # ========================================================================

    RATE_LIMIT_ENABLED: bool = False

    DEFAULT_RATE_LIMIT: str = "100/minute"

    AUTH_RATE_LIMIT: str = "10/minute"

    # ========================================================================
    # Pagination
    # ========================================================================

    DEFAULT_PAGE_SIZE: int = Field(
        default=20,
        gt=0,
    )

    MAX_PAGE_SIZE: int = Field(
        default=100,
        gt=0,
    )

    # ========================================================================
    # File Uploads
    # ========================================================================

    MAX_UPLOAD_SIZE_MB: int = Field(
        default=10,
        gt=0,
    )

    ALLOWED_IMAGE_TYPES: str = (
        "image/jpeg,image/png,image/webp"
    )

    UPLOAD_DIRECTORY: str = "uploads"

    # ========================================================================
    # Logging
    # ========================================================================

    LOG_LEVEL: Literal[
        "DEBUG",
        "INFO",
        "WARNING",
        "ERROR",
        "CRITICAL",
    ] = "INFO"

    LOG_FORMAT: Literal[
        "json",
        "text",
    ] = "json"

    LOG_FILE: str = "logs/application.log"

    # ========================================================================
    # External APIs
    # ========================================================================

    NESTJS_API_URL: AnyHttpUrl = (
        "http://localhost:3001/api/v1"
    )

    OPEN_LIBRARY_BASE_URL: AnyHttpUrl = (
        "https://openlibrary.org"
    )

    HOLIDAYS_API_BASE_URL: AnyHttpUrl = (
        "https://date.nager.at/api/v3"
    )

    # ========================================================================
    # Pydantic Settings Configuration
    # ========================================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
        validate_default=True,
    )

    # ========================================================================
    # Field Validators
    # ========================================================================

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, value: str) -> str:
        """
        Validate that the configured database URL uses PostgreSQL.

        The project uses PostgreSQL with psycopg 3.
        """

        normalized_value = value.strip()

        if not normalized_value:
            raise ValueError(
                "DATABASE_URL must not be empty."
            )

        supported_prefixes = (
            "postgresql+psycopg://",
            "postgresql://",
        )

        if not normalized_value.startswith(supported_prefixes):
            raise ValueError(
                "DATABASE_URL must begin with "
                "'postgresql+psycopg://' or "
                "'postgresql://'."
            )

        return normalized_value

    @field_validator(
        "APP_NAME",
        "APP_VERSION",
        "API_V1_PREFIX",
        "JWT_ISSUER",
        "JWT_AUDIENCE",
        "POSTGRES_USER",
        "POSTGRES_DB",
        "MINIO_BUCKET",
    )
    @classmethod
    def validate_non_empty_strings(cls, value: str) -> str:
        """
        Reject empty configuration values for required textual settings.
        """

        normalized_value = value.strip()

        if not normalized_value:
            raise ValueError(
                "Configuration value must not be empty."
            )

        return normalized_value

    # ========================================================================
    # Cross-Setting Validation
    # ========================================================================

    @model_validator(mode="after")
    def validate_configuration(self) -> "Settings":
        """
        Validate relationships between multiple configuration values.
        """

        # --------------------------------------------------------------------
        # Pagination
        # --------------------------------------------------------------------

        if self.DEFAULT_PAGE_SIZE > self.MAX_PAGE_SIZE:
            raise ValueError(
                "DEFAULT_PAGE_SIZE must be less than or equal to "
                "MAX_PAGE_SIZE."
            )

        # --------------------------------------------------------------------
        # Cookie security
        # --------------------------------------------------------------------

        if (
            self.COOKIE_SAMESITE == "none"
            and not self.COOKIE_SECURE
        ):
            raise ValueError(
                "COOKIE_SECURE must be true when "
                "COOKIE_SAMESITE is 'none'."
            )

        # --------------------------------------------------------------------
        # Production safeguards
        # --------------------------------------------------------------------

        if self.is_production:
            if self.DEBUG:
                raise ValueError(
                    "DEBUG must be false in production."
                )

            if not self.COOKIE_SECURE:
                raise ValueError(
                    "COOKIE_SECURE must be true in production."
                )

            if self._is_insecure_secret_key:
                raise ValueError(
                    "SECRET_KEY must be replaced with a strong "
                    "production secret."
                )

            if not self.cors_origins:
                raise ValueError(
                    "BACKEND_CORS_ORIGINS must contain at least "
                    "one explicit origin in production."
                )

            if "*" in self.cors_origins:
                raise ValueError(
                    "Wildcard CORS origin '*' is not permitted "
                    "in production."
                )

        # --------------------------------------------------------------------
        # Optional infrastructure relationships
        # --------------------------------------------------------------------

        if self.CELERY_ENABLED and not self.REDIS_ENABLED:
            raise ValueError(
                "CELERY_ENABLED requires REDIS_ENABLED to be true "
                "when Redis is used as the configured broker."
            )

        return self

    # ========================================================================
    # Computed Properties
    # ========================================================================

    @property
    def cors_origins(self) -> list[str]:
        """
        Return configured CORS origins as a normalized list.
        """

        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    @property
    def trusted_hosts(self) -> list[str]:
        """
        Return configured trusted hosts as a normalized list.
        """

        return [
            host.strip()
            for host in self.TRUSTED_HOSTS.split(",")
            if host.strip()
        ]

    @property
    def allowed_image_types(self) -> list[str]:
        """
        Return allowed upload MIME types as a normalized list.
        """

        return [
            image_type.strip()
            for image_type in self.ALLOWED_IMAGE_TYPES.split(",")
            if image_type.strip()
        ]

    @property
    def is_development(self) -> bool:
        """Return whether the application runs in development."""

        return self.ENVIRONMENT == "development"

    @property
    def is_testing(self) -> bool:
        """Return whether the application runs in testing."""

        return self.ENVIRONMENT == "testing"

    @property
    def is_staging(self) -> bool:
        """Return whether the application runs in staging."""

        return self.ENVIRONMENT == "staging"

    @property
    def is_production(self) -> bool:
        """Return whether the application runs in production."""

        return self.ENVIRONMENT == "production"

    @property
    def sqlalchemy_echo(self) -> bool:
        """
        Determine whether SQLAlchemy SQL logging should be enabled.

        SQL echo is intentionally limited to DEBUG-level development/testing
        scenarios because SQL logging can be noisy and expensive.
        """

        return (
            self.DEBUG
            and self.LOG_LEVEL == "DEBUG"
            and not self.is_production
        )

    @property
    def upload_directory_path(self) -> Path:
        """
        Return the configured upload directory as a Path.

        The directory is not created here. Filesystem initialization belongs
        to the upload/storage layer.
        """

        return Path(self.UPLOAD_DIRECTORY)

    @property
    def _is_insecure_secret_key(self) -> bool:
        """
        Detect known development/example secret values.

        This property is used only for production validation.
        """

        normalized_secret = self.SECRET_KEY.strip().lower()

        insecure_values = {
            "change_this_to_a_long_random_development_secret",
            "change_this_to_a_long_random_secret",
            "secret",
            "secret-key",
            "your-secret-key",
            "your-secret-key-here",
            "changeme",
        }

        return normalized_secret in insecure_values


# ============================================================================
# Cached Settings Factory
# ============================================================================


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return the cached application settings instance.

    Caching ensures that the `.env` file and environment variables are not
    repeatedly parsed throughout the application lifecycle.
    """

    return Settings()


# ============================================================================
# Application-wide Settings Instance
# ============================================================================

settings = get_settings()


__all__ = [
    "Settings",
    "get_settings",
    "settings",
]