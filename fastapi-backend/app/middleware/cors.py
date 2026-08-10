"""
===============================================================================
Cross-Origin Resource Sharing (CORS) Configuration
===============================================================================

Centralized Cross-Origin Resource Sharing (CORS) configuration for the
Team Productivity Platform.

Responsibilities
----------------
• Configure allowed origins.
• Configure allowed HTTP methods.
• Configure allowed request headers.
• Configure credential support.
• Configure exposed response headers.
• Configure browser preflight cache duration.
• Prevent invalid wildcard/credential combinations.
• Keep CORS configuration outside main.py.

Architecture
------------
Application Configuration
        │
        ▼
app.core.config.settings
        │
        ▼
configure_cors()
        │
        ▼
FastAPI CORSMiddleware
        │
        ▼
HTTP Requests

Security
--------
CORS configuration is controlled centrally through application settings.

Credentials must never be enabled together with a wildcard origin.

Compatible With
---------------
• FastAPI
• Starlette
• Docker
• PostgreSQL-backed API deployments
• Production deployments
• Python 3.12+
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import get_logger


# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# Configuration
# =============================================================================


def _validate_cors_configuration() -> None:
    """
    Validate the application's CORS configuration.

    Raises
    ------
    RuntimeError
        If wildcard origins are combined with credential support.

    Notes
    -----
    A wildcard origin means:

        allow_origins=["*"]

    Credentialed cross-origin requests require explicit origins rather than
    an unrestricted wildcard origin.
    """

    if (
        "*" in settings.BACKEND_CORS_ORIGINS
        and settings.CORS_ALLOW_CREDENTIALS
    ):
        raise RuntimeError(
            "Invalid CORS configuration: wildcard origins cannot be used "
            "when credential support is enabled. Configure explicit "
            "frontend origins instead."
        )


def _log_cors_configuration() -> None:
    """
    Log the effective CORS configuration without exposing unnecessary
    sensitive application information.

    Origins are represented by their count rather than logging the complete
    origin list.
    """

    logger.info(
        "Configuring CORS | origins=%s | credentials=%s | methods=%s | "
        "headers=%s | exposed_headers=%s | max_age=%s",
        len(settings.BACKEND_CORS_ORIGINS),
        settings.CORS_ALLOW_CREDENTIALS,
        ",".join(settings.CORS_ALLOW_METHODS),
        ",".join(settings.CORS_ALLOW_HEADERS),
        ",".join(settings.CORS_EXPOSE_HEADERS),
        settings.CORS_MAX_AGE,
    )


# =============================================================================
# Public Configuration Function
# =============================================================================


def configure_cors(
    app: FastAPI,
) -> None:
    """
    Configure CORS middleware for the FastAPI application.

    Parameters
    ----------
    app:
        FastAPI application instance.

    Raises
    ------
    RuntimeError
        If the configured CORS settings contain an invalid
        wildcard-origin/credential combination.

    Notes
    -----
    All CORS values are read from ``app.core.config.settings``.

    CORS configuration therefore remains centralized and does not need to
    be duplicated inside ``main.py``.
    """

    _validate_cors_configuration()

    _log_cors_configuration()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
        expose_headers=settings.CORS_EXPOSE_HEADERS,
        max_age=settings.CORS_MAX_AGE,
    )

    logger.info(
        "CORS middleware configured successfully.",
    )


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
    "configure_cors",
)