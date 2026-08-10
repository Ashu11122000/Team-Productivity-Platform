"""
===============================================================================
FastAPI Application Entry Point
===============================================================================

Enterprise Team Productivity Platform API

Module:
    app.main

Architecture:
    Clean Architecture
    Composition Root Pattern
    Service Layer Pattern
    Repository Pattern
    Microservice Architecture

Python:
    3.12+

Framework:
    FastAPI

Database:
    PostgreSQL

ORM:
    SQLAlchemy 2.x

Validation:
    Pydantic v2

===============================================================================

Overview
--------
This module is the composition root of the FastAPI backend.

It creates and configures the complete FastAPI application by assembling:

• Application metadata
• Application lifecycle
• Database initialization
• Middleware
• Exception handlers
• API routers
• Root endpoint
• Health endpoint

This module contains no domain or business logic.

Architecture
------------

                    Next.js Frontend
                           │
                           ▼
                    HTTP / REST API
                           │
                           ▼
                 FastAPI Application
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         Middleware    Exceptions     Routers
                                        │
                                        ▼
                                    Services
                                        │
                                        ▼
                                  Repositories
                                        │
                                        ▼
                                   PostgreSQL


Microservice Responsibilities
-----------------------------

FastAPI owns:

• Authentication
• Authorization
• Users
• Notes
• Open Library Integration
• Notes → Task conversion preparation


NestJS owns:

• Tasks
• Categories
• Tags
• Notifications
• Analytics
• Dashboard
• Activity Logs


These ownership boundaries must remain explicit.

Responsibilities
----------------

This module is responsible only for:

✓ Creating the FastAPI application
✓ Configuring application metadata
✓ Managing application lifecycle
✓ Initializing infrastructure
✓ Registering middleware
✓ Registering exception handlers
✓ Registering API routers
✓ Exposing infrastructure health endpoints

Business logic MUST NOT exist here.

Design Principles
-----------------

• Composition Root Pattern
• Dependency Injection
• Clean Architecture
• Separation of Concerns
• Centralized Configuration
• Production Lifecycle Management
• Enterprise Middleware Pipeline
• Thin HTTP Layer
• Explicit Microservice Boundaries
• Structured Logging

Compatible With
---------------

• FastAPI
• SQLAlchemy 2.x
• PostgreSQL
• psycopg v3
• Pydantic v2
• Docker
• Alembic
• Python 3.12+

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Final

# =============================================================================
# Third-Party Imports
# =============================================================================

from fastapi import FastAPI, status

# =============================================================================
# API Route Imports
# =============================================================================

from app.api.routes import (
    auth,
    notes,
    users,
)

# =============================================================================
# Application Configuration
# =============================================================================

from app.core.config import settings

# =============================================================================
# Application Constants
# =============================================================================

from app.core.constants import (
    API_V1_PREFIX,
    HEALTH_STATUS,
    SERVICE_STATUS,
)

# =============================================================================
# Logging
# =============================================================================

from app.core.logging import get_logger

# =============================================================================
# Database Initialization
# =============================================================================

from app.db.init_db import initialize_database

# =============================================================================
# Exception Handling
# =============================================================================

from app.exceptions.handlers import register_exception_handlers

# =============================================================================
# Middleware
# =============================================================================

from app.middleware.cors import configure_cors
from app.middleware.logging import LoggingMiddleware

# =============================================================================
# Public Module API
# =============================================================================

__all__ = [
    "app",
    "create_application",
]

# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)

# =============================================================================
# Application Metadata Constants
# =============================================================================

APPLICATION_NAME: Final[str] = settings.APP_NAME

APPLICATION_VERSION: Final[str] = settings.APP_VERSION

APPLICATION_ENVIRONMENT: Final[str] = settings.ENVIRONMENT

# =============================================================================
# Application Paths
# =============================================================================

DEFAULT_ROOT_PATH: Final[str] = "/"

HEALTH_PATH: Final[str] = "/health"

DOCS_PATH: Final[str] = "/docs"

REDOC_PATH: Final[str] = "/redoc"

OPENAPI_PATH: Final[str] = "/openapi.json"

# =============================================================================
# HTTP Constants
# =============================================================================

HTTP_OK: Final[int] = status.HTTP_200_OK

# =============================================================================
# Logging Constants
# =============================================================================

LOG_STARTUP: Final[str] = "Application startup"

LOG_SHUTDOWN: Final[str] = "Application shutdown"

LOG_ROUTER: Final[str] = "Router registration"

LOG_MIDDLEWARE: Final[str] = "Middleware registration"

LOG_EXCEPTION: Final[str] = "Exception handler registration"

LOG_APPLICATION: Final[str] = "Application configuration"

# =============================================================================
# Application Description
# =============================================================================

APPLICATION_DESCRIPTION: Final[str] = """
Enterprise Team Productivity Platform API.

FastAPI Responsibilities
------------------------

• Authentication
• Authorization
• User Management
• Notes Management
• Open Library Integration
• Notes → Task Conversion Preparation


Architecture
------------

The platform follows a microservice architecture.


FastAPI
-------

Responsible for:

• Authentication
• Authorization
• JWT identity
• Users
• Notes
• Open Library Integration


NestJS
------

Responsible for:

• Tasks
• Categories
• Tags
• Notifications
• Analytics
• Dashboard
• Activity Logs


Frontend
--------

The Next.js frontend communicates with both backend services.


Authentication
--------------

FastAPI is the source of truth for authentication and JWT generation.

NestJS validates JWTs issued by FastAPI when authenticated communication
with NestJS-owned resources is required.
"""

# =============================================================================
# OpenAPI Metadata
# =============================================================================

OPENAPI_CONTACT: Final[dict[str, str]] = {
    "name": "Ashish Sharma",
    "url": "https://github.com/Ashu11122000",
}

OPENAPI_LICENSE: Final[dict[str, str]] = {
    "name": "MIT",
}

# =============================================================================
# Root Endpoint Metadata
# =============================================================================

ROOT_RESPONSE_METADATA: Final[dict[str, str]] = {
    "name": APPLICATION_NAME,
    "version": APPLICATION_VERSION,
    "environment": APPLICATION_ENVIRONMENT,
    "status": SERVICE_STATUS,
    "docs": DOCS_PATH,
    "redoc": REDOC_PATH,
    "health": HEALTH_PATH,
}

# =============================================================================
# Health Endpoint Metadata
# =============================================================================

HEALTH_RESPONSE_METADATA: Final[dict[str, str]] = {
    "status": HEALTH_STATUS,
    "service": APPLICATION_NAME,
    "version": APPLICATION_VERSION,
    "environment": APPLICATION_ENVIRONMENT,
}

# =============================================================================
# Application Lifespan
# =============================================================================


@asynccontextmanager
async def lifespan(
    application: FastAPI,
) -> AsyncIterator[None]:
    """
    Manage the FastAPI application lifecycle.

    Responsibilities
    ----------------
    Startup:

    • Log application metadata.
    • Initialize database infrastructure.
    • Verify required startup resources.

    Runtime:

    • Yield control to the FastAPI runtime.

    Shutdown:

    • Execute future resource cleanup hooks.
    • Log graceful application shutdown.

    Parameters
    ----------
    application:
        FastAPI application instance.

    Yields
    ------
    None
        Control is yielded to FastAPI while the application is running.

    Raises
    ------
    Exception
        Startup exceptions are propagated to prevent the application from
        running in an unhealthy state.

        Shutdown exceptions are also propagated after being logged.
    """
    logger.info("=" * 80)
    logger.info("%s started.", LOG_STARTUP)
    logger.info("Application : %s", APPLICATION_NAME)
    logger.info("Version     : %s", APPLICATION_VERSION)
    logger.info("Environment : %s", APPLICATION_ENVIRONMENT)
    logger.info("=" * 80)

    # =========================================================================
    # Startup
    # =========================================================================

    try:
        logger.info("Initializing database.")

        initialize_database()

        logger.info("Database initialized successfully.")
        logger.info("%s completed successfully.", LOG_STARTUP)

    except Exception:
        logger.exception(
            "%s failed.",
            LOG_STARTUP,
        )
        raise

    # =========================================================================
    # Runtime
    # =========================================================================

    try:
        yield

    # =========================================================================
    # Shutdown
    # =========================================================================

    finally:
        logger.info("=" * 80)
        logger.info("%s started.", LOG_SHUTDOWN)

        try:
            # -----------------------------------------------------------------
            # Future resource cleanup hooks
            # -----------------------------------------------------------------
            #
            # Examples:
            #
            # await redis_client.aclose()
            # await http_client.aclose()
            # await message_queue.shutdown()
            #
            # -----------------------------------------------------------------

            logger.info(
                "Application resources released successfully."
            )

        except Exception:
            logger.exception(
                "%s encountered an error.",
                LOG_SHUTDOWN,
            )
            raise

        finally:
            logger.info(
                "%s completed.",
                LOG_SHUTDOWN,
            )
            logger.info("=" * 80)


# =============================================================================
# Middleware Configuration
# =============================================================================


def configure_middlewares(
    application: FastAPI,
) -> None:
    """
    Configure application middleware.

    Registered Middleware
    ---------------------

    LoggingMiddleware

        Responsible for:

        • Request logging
        • Response logging
        • Request lifecycle tracking


    CORS Middleware

        Responsible for:

        • Browser cross-origin access
        • Next.js frontend communication
        • Origin policy enforcement


    Parameters
    ----------
    application:
        FastAPI application instance.
    """
    logger.info(
        "%s started.",
        LOG_MIDDLEWARE,
    )

    # =========================================================================
    # Request Logging Middleware
    # =========================================================================

    application.add_middleware(
        LoggingMiddleware,
    )

    logger.debug(
        "Logging middleware registered."
    )

    # =========================================================================
    # CORS Middleware
    # =========================================================================

    configure_cors(
        application,
    )

    logger.debug(
        "CORS middleware configured."
    )

    logger.info(
        "%s completed successfully.",
        LOG_MIDDLEWARE,
    )


# =============================================================================
# Exception Handler Configuration
# =============================================================================


def configure_exception_handlers(
    application: FastAPI,
) -> None:
    """
    Register global exception handlers.

    Responsibilities
    ----------------

    • Centralize exception handling.
    • Convert application exceptions into HTTP responses.
    • Maintain consistent API error responses.
    • Handle validation failures.
    • Handle unexpected runtime failures.

    Parameters
    ----------
    application:
        FastAPI application instance.
    """
    logger.info(
        "%s started.",
        LOG_EXCEPTION,
    )

    register_exception_handlers(
        application,
    )

    logger.info(
        "%s completed successfully.",
        LOG_EXCEPTION,
    )


# =============================================================================
# API Router Registration
# =============================================================================


def register_api_routes(
    application: FastAPI,
) -> None:
    """
    Register all FastAPI routers.

    Registered Routes
    -----------------

    Authentication:

        /api/v1/auth


    Users:

        /api/v1/users


    Notes:

        /api/v1/notes


    Parameters
    ----------
    application:
        FastAPI application instance.

    Notes
    -----
    Only FastAPI-owned domains are registered here.

    Tasks, categories, tags, notifications, analytics, dashboard, and
    activity logs remain owned by the NestJS microservice.
    """
    logger.info(
        "%s started.",
        LOG_ROUTER,
    )

    # =========================================================================
    # Authentication Router
    # =========================================================================

    application.include_router(
        auth.router,
        prefix=API_V1_PREFIX,
    )

    logger.debug(
        "Authentication routes registered."
    )

    # =========================================================================
    # Users Router
    # =========================================================================

    application.include_router(
        users.router,
        prefix=API_V1_PREFIX,
    )

    logger.debug(
        "User routes registered."
    )

    # =========================================================================
    # Notes Router
    # =========================================================================

    application.include_router(
        notes.router,
        prefix=API_V1_PREFIX,
    )

    logger.debug(
        "Notes routes registered."
    )

    logger.info(
        "%s completed successfully.",
        LOG_ROUTER,
    )


# =============================================================================
# Infrastructure Route Registration
# =============================================================================


def register_infrastructure_routes(
    application: FastAPI,
) -> None:
    """
    Register application-level infrastructure endpoints.

    These endpoints are intentionally kept outside versioned business API
    routes because they describe the running application itself rather than
    a particular API domain.

    Registered Endpoints
    --------------------

    GET /

        Returns basic application metadata.


    GET /health

        Returns lightweight application health information.


    Parameters
    ----------
    application:
        FastAPI application instance.
    """

    # =========================================================================
    # Root Endpoint
    # =========================================================================

    @application.get(
        DEFAULT_ROOT_PATH,
        tags=["Infrastructure"],
        status_code=HTTP_OK,
        summary="API Information",
        response_description="Application metadata.",
    )
    async def root() -> dict[str, str]:
        """
        Return basic application information.

        This endpoint intentionally performs no database queries,
        authentication, or external service calls.
        """
        logger.debug(
            "Root endpoint requested."
        )

        return ROOT_RESPONSE_METADATA.copy()

    # =========================================================================
    # Health Endpoint
    # =========================================================================

    @application.get(
        HEALTH_PATH,
        tags=["Infrastructure"],
        status_code=HTTP_OK,
        summary="Health Check",
        response_description="Application health information.",
    )
    async def health() -> dict[str, str]:
        """
        Return lightweight application health information.

        Notes
        -----
        This endpoint verifies that the FastAPI process is available.

        It intentionally does not perform database or downstream-service
        health checks. Deeper readiness checks can be introduced separately
        in the future.
        """
        logger.debug(
            "Health endpoint requested."
        )

        return HEALTH_RESPONSE_METADATA.copy()


# =============================================================================
# FastAPI Application Factory
# =============================================================================


def create_application() -> FastAPI:
    """
    Create and fully configure the FastAPI application.

    This function is the application's composition root.

    Responsibilities
    ----------------

    • Create the FastAPI instance.
    • Configure OpenAPI metadata.
    • Attach application lifecycle management.
    • Register middleware.
    • Register global exception handlers.
    • Register infrastructure endpoints.
    • Register versioned API routers.

    Returns
    -------
    FastAPI
        Fully configured FastAPI application.

    Notes
    -----
    No business logic belongs in this function.

    Business logic belongs in:

    • Service layer
    • Domain layer

    Persistence logic belongs in:

    • Repository layer
    """
    logger.info(
        "%s started.",
        LOG_APPLICATION,
    )

    # =========================================================================
    # Create FastAPI Application
    # =========================================================================

    application = FastAPI(
        title=APPLICATION_NAME,
        version=APPLICATION_VERSION,
        description=APPLICATION_DESCRIPTION,
        debug=settings.DEBUG,
        docs_url=DOCS_PATH,
        redoc_url=REDOC_PATH,
        openapi_url=OPENAPI_PATH,
        contact=OPENAPI_CONTACT,
        license_info=OPENAPI_LICENSE,
        lifespan=lifespan,
    )

    logger.debug(
        "FastAPI application instance created."
    )

    # =========================================================================
    # Configure Middleware
    # =========================================================================

    configure_middlewares(
        application,
    )

    # =========================================================================
    # Configure Exception Handlers
    # =========================================================================

    configure_exception_handlers(
        application,
    )

    # =========================================================================
    # Register Infrastructure Routes
    # =========================================================================

    register_infrastructure_routes(
        application,
    )

    # =========================================================================
    # Register API Routes
    # =========================================================================

    register_api_routes(
        application,
    )

    logger.info(
        "%s completed successfully.",
        LOG_APPLICATION,
    )

    return application


# =============================================================================
# Application Instance
# =============================================================================

app = create_application()

# =============================================================================
# End FastAPI Application Entry Point
# =============================================================================