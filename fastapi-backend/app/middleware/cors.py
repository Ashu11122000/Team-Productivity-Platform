"""
CORS Middleware Configuration
=============================

Centralized Cross-Origin Resource Sharing (CORS) configuration
for the Team Productivity Platform.

Responsibilities
----------------
- Configure allowed origins
- Configure allowed HTTP methods
- Configure allowed headers
- Configure credential support
- Keep CORS logic out of main.py

Compatible with:
- FastAPI
- Starlette
- Docker
- Production deployments
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def configure_cors(app: FastAPI) -> None:
    """
    Configure the application's CORS middleware.
    """

    if (
        "*" in settings.BACKEND_CORS_ORIGINS
        and settings.CORS_ALLOW_CREDENTIALS
    ):
        raise RuntimeError(
            "Wildcard CORS origins cannot be used when "
            "credentials are enabled."
        )

    logger.info(
        (
            "Configuring CORS | origins=%s | credentials=%s "
            "| methods=%s | headers=%s"
        ),
        len(settings.BACKEND_CORS_ORIGINS),
        settings.CORS_ALLOW_CREDENTIALS,
        ",".join(settings.CORS_ALLOW_METHODS),
        ",".join(settings.CORS_ALLOW_HEADERS),
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
        expose_headers=settings.CORS_EXPOSE_HEADERS,
        max_age=settings.CORS_MAX_AGE,
    )

    logger.info("CORS middleware configured successfully.")


__all__ = [
    "configure_cors",
]