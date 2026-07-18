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

Notes
-----
Uses values from app.core.config.settings.

Compatible with:
- FastAPI
- Starlette
- Docker
- Production deployments
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def configure_cors(app: FastAPI) -> None:
    """
    Configure CORS middleware.

    Parameters
    ----------
    app : FastAPI
        FastAPI application instance.

    Returns
    -------
    None
    """

    logger.info(
        "Configuring CORS middleware | Allowed Origins: %s",
        settings.BACKEND_CORS_ORIGINS,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=86400,  # Cache preflight requests for 24 hours
    )

    logger.info("CORS middleware configured successfully.")