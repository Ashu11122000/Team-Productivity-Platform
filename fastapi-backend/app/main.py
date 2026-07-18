"""
Main Application Entry Point
============================

Team Productivity Platform API

Responsibilities
----------------
- Create FastAPI application
- Configure middleware
- Register exception handlers
- Initialize database
- Register API routers
- Manage application lifespan
- Expose health endpoints

Architecture
------------
Frontend
    Next.js

Backend
    FastAPI
        - Authentication
        - Users
        - Notes

    NestJS
        - Tasks
        - Categories
        - Tags
        - Analytics

Database
    PostgreSQL

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- psycopg v3
- Docker
- Alembic
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes import auth, note
from app.core.config import settings
from app.core.constants import API_V1_PREFIX
from app.core.logging import get_logger
from app.db.init_db import initialize_database
from app.exceptions.handlers import register_exception_handlers
from app.middleware.cors import configure_cors

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application startup and shutdown events.
    """

    logger.info("=" * 80)
    logger.info("Starting %s", settings.APP_NAME)
    logger.info("Environment : %s", settings.ENVIRONMENT)
    logger.info("Version     : %s", settings.APP_VERSION)

    initialize_database()

    logger.info("Application started successfully.")
    logger.info("=" * 80)

    yield

    logger.info("=" * 80)
    logger.info("Shutting down %s", settings.APP_NAME)
    logger.info("Shutdown completed.")
    logger.info("=" * 80)


app = FastAPI(
    title=settings.APP_NAME,
    description="""
Enterprise Team Productivity Platform API.

FastAPI Service Responsibilities
--------------------------------
• Authentication
• User Management
• Notes Management
• Open Library Integration
• Notes → Task Conversion

The frontend communicates with both FastAPI and NestJS.

Authentication is shared using JWT.
""",
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# ---------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------

configure_cors(app)

# ---------------------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------------------

register_exception_handlers(app)

# ---------------------------------------------------------------------
# Health Endpoints
# ---------------------------------------------------------------------


@app.get("/", tags=["Root"])
async def root() -> dict[str, str]:
    """
    Root endpoint.
    """

    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
    }


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.
    """

    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# ---------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------

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

logger.info("API routes registered successfully.")