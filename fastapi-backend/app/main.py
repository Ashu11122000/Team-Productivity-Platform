"""
==========================================================
Main Application Entry Point
==========================================================

Team Productivity Platform API

Responsibilities
----------------
✓ Create FastAPI application
✓ Configure middleware
✓ Register global exception handlers
✓ Initialize PostgreSQL database
✓ Register API routers
✓ Manage application lifecycle
✓ Expose health endpoints

Architecture
------------
Frontend
    Next.js

Backend
    FastAPI
        • Authentication
        • Users
        • Notes

    NestJS
        • Tasks
        • Categories
        • Tags
        • Analytics

Database
--------
PostgreSQL

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- psycopg v3
- Docker
- Alembic
==========================================================
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, status

from app.api.routes import auth, note
from app.core.config import settings
from app.core.constants import (
    API_V1_PREFIX,
    HEALTH_STATUS,
    SERVICE_STATUS,
)
from app.core.logging import get_logger
from app.db.init_db import initialize_database
from app.exceptions.handlers import register_exception_handlers
from app.middleware.cors import configure_cors
from app.middleware.logging import LoggingMiddleware

logger = get_logger(__name__)


# ==========================================================
# Application Lifespan
# ==========================================================


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """
    Manage application startup and shutdown.
    """

    logger.info("=" * 80)
    logger.info("Starting %s", settings.APP_NAME)
    logger.info("Environment : %s", settings.ENVIRONMENT)
    logger.info("Version     : %s", settings.APP_VERSION)
    logger.info("=" * 80)

    initialize_database()

    logger.info("%s started successfully.", settings.APP_NAME)

    yield

    logger.info("=" * 80)
    logger.info("Shutting down %s...", settings.APP_NAME)
    logger.info("%s stopped successfully.", settings.APP_NAME)
    logger.info("=" * 80)


# ==========================================================
# FastAPI Application
# ==========================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
    description="""
Enterprise Team Productivity Platform API.

FastAPI Responsibilities
------------------------
• Authentication
• User Management
• Notes Management
• Open Library Integration
• Notes → Task Conversion

The frontend communicates with both FastAPI and NestJS.

Authentication is shared using JWT.
""",
    contact={
        "name": "Ashish Sharma",
        "url": "https://github.com/Ashu11122000",
    },
    license_info={
        "name": "MIT",
    },
)

# ==========================================================
# Middleware
# ==========================================================

app.add_middleware(LoggingMiddleware)

configure_cors(app)

# ==========================================================
# Exception Handlers
# ==========================================================

register_exception_handlers(app)

# ==========================================================
# Root Endpoint
# ==========================================================


@app.get(
    "/",
    tags=["Root"],
    status_code=status.HTTP_200_OK,
)
async def root() -> dict[str, str]:
    """
    Root endpoint.
    """

    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status": SERVICE_STATUS,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
    }


# ==========================================================
# Health Endpoint
# ==========================================================


@app.get(
    "/health",
    tags=["Health"],
    status_code=status.HTTP_200_OK,
)
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.
    """

    return {
        "status": HEALTH_STATUS,
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# ==========================================================
# API Routes
# ==========================================================

app.include_router(
    auth.router,
    prefix=API_V1_PREFIX,
    tags=["Authentication"],
)

app.include_router(
    note.router,
    prefix=API_V1_PREFIX,
    tags=["Notes"],
)

logger.info("API routers registered successfully.")