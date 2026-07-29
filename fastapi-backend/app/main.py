"""
===============================================================================
FastAPI Application Entry Point
===============================================================================

Team Productivity Platform API

This module is the composition root of the FastAPI backend.

It creates and configures the complete application instance by assembling:

• Application metadata
• Database lifecycle
• Middleware stack
• Exception handlers
• API routers
• Health monitoring endpoints

Architecture
------------

Frontend
--------
Next.js Application


Backend
-------
FastAPI

Responsibilities:
    • Authentication
    • User Management
    • Notes Management
    • Open Library Integration


NestJS

Responsibilities:
    • Tasks
    • Categories
    • Tags
    • Notifications
    • Analytics
    • Dashboard


Database
--------
PostgreSQL


Application Flow
----------------

HTTP Request

      ↓

FastAPI Application

      ↓

Middleware Layer

      ↓

API Router

      ↓

Service Layer

      ↓

Repository Layer

      ↓

PostgreSQL


Design Principles
-----------------

• Composition Root Pattern
• Dependency Injection
• Clean Architecture
• Separation of Concerns
• Centralized Configuration
• Production Lifecycle Management
• Enterprise Middleware Pipeline


Responsibilities
----------------

This module is responsible ONLY for:

✓ Creating FastAPI application
✓ Configuring infrastructure
✓ Registering components
✓ Managing lifecycle


Business logic MUST NOT exist here.


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


from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import (
    FastAPI,
    status,
)


from app.api.routes import (
    auth,
    notes,
    users,
)

from app.core.config import settings

from app.core.constants import (
    API_V1_PREFIX,
    HEALTH_STATUS,
    SERVICE_STATUS,
)

from app.core.logging import get_logger

from app.db.init_db import (
    initialize_database,
)

from app.exceptions.handlers import (
    register_exception_handlers,
)

from app.middleware.cors import (
    configure_cors,
)

from app.middleware.logging import (
    LoggingMiddleware,
)


__all__ = [
    "app",
    "create_application",
]


# =============================================================================
# Module Logger
# =============================================================================


logger = get_logger(
    __name__,
)


# =============================================================================
# Application Constants
# =============================================================================


APPLICATION_NAME = settings.APP_NAME

APPLICATION_VERSION = settings.APP_VERSION

APPLICATION_ENVIRONMENT = settings.ENVIRONMENT


DEFAULT_ROOT_PATH = "/"

HEALTH_PATH = "/health"


DOCS_PATH = "/docs"

REDOC_PATH = "/redoc"


# =============================================================================
# HTTP Constants
# =============================================================================


HTTP_OK = status.HTTP_200_OK


# =============================================================================
# Logging Constants
# =============================================================================


LOG_STARTUP = "Application startup"

LOG_SHUTDOWN = "Application shutdown"

LOG_ROUTER = "Router registration"

LOG_MIDDLEWARE = "Middleware registration"

LOG_EXCEPTION = "Exception handler registration"


# =============================================================================
# End Module Foundation
# =============================================================================
# =============================================================================
# Application Metadata
# =============================================================================


APPLICATION_DESCRIPTION = """
Enterprise Team Productivity Platform API.

FastAPI Responsibilities
------------------------

• Authentication
• User Management
• Notes Management
• Open Library Integration
• Notes → Task Conversion


Architecture
------------

The platform follows a microservice architecture.

FastAPI
-------
Responsible for:

• Authentication
• Users
• Notes


NestJS
------
Responsible for:

• Tasks
• Categories
• Tags
• Notifications
• Analytics
• Dashboard


Frontend
--------

Next.js communicates with both backend services.

Authentication
--------------

JWT authentication is shared between services.
"""


# =============================================================================
# OpenAPI Metadata
# =============================================================================


OPENAPI_CONTACT = {
    "name": "Ashish Sharma",
    "url": "https://github.com/Ashu11122000",
}


OPENAPI_LICENSE = {
    "name": "MIT",
}


# =============================================================================
# Documentation Metadata
# =============================================================================


DOCUMENTATION_METADATA = {
    "title": APPLICATION_NAME,
    "version": APPLICATION_VERSION,
    "description": APPLICATION_DESCRIPTION,
    "contact": OPENAPI_CONTACT,
    "license_info": OPENAPI_LICENSE,
}


# =============================================================================
# Root Endpoint Metadata
# =============================================================================


ROOT_RESPONSE_METADATA = {
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


HEALTH_RESPONSE_METADATA = {
    "status": HEALTH_STATUS,
    "service": APPLICATION_NAME,
    "version": APPLICATION_VERSION,
    "environment": APPLICATION_ENVIRONMENT,
}


# =============================================================================
# End Application Metadata
# =============================================================================
# =============================================================================
# Application Lifespan Management
# =============================================================================


@asynccontextmanager
async def lifespan(
    app: FastAPI,
) -> AsyncIterator[None]:
    """
    Manage application startup and shutdown lifecycle.

    Responsibilities
    ----------------
    Startup:
        • Log application startup information.
        • Initialize database resources.
        • Prepare application infrastructure.

    Runtime:
        • Keep application running.

    Shutdown:
        • Release resources.
        • Log graceful shutdown.

    Parameters
    ----------
    app:
        FastAPI application instance.

    Yields
    ------
    None
        Control returns to FastAPI runtime.

    Raises
    ------
    Exception
        Propagates startup failures so the application
        does not run in an unhealthy state.
    """

    # =========================================================================
    # Startup
    # =========================================================================

    logger.info(
        "=" * 80,
    )

    logger.info(
        "%s started.",
        LOG_STARTUP,
    )

    logger.info(
        "Application : %s",
        APPLICATION_NAME,
    )

    logger.info(
        "Version     : %s",
        APPLICATION_VERSION,
    )

    logger.info(
        "Environment : %s",
        APPLICATION_ENVIRONMENT,
    )

    logger.info(
        "=" * 80,
    )


    try:
        # ---------------------------------------------------------------------
        # Database Initialization
        # ---------------------------------------------------------------------

        logger.info(
            "Initializing database.",
        )

        initialize_database()

        logger.info(
            "Database initialized successfully.",
        )


        logger.info(
            "%s completed successfully.",
            LOG_STARTUP,
        )


    except Exception as exc:

        logger.exception(
            "Application startup failed.",
            exc_info=exc,
        )

        raise


    # =========================================================================
    # Application Runtime
    # =========================================================================

    yield


    # =========================================================================
    # Shutdown
    # =========================================================================

    logger.info(
        "=" * 80,
    )

    logger.info(
        "%s started.",
        LOG_SHUTDOWN,
    )


    try:

        # ---------------------------------------------------------------------
        # Future Cleanup Hooks
        # ---------------------------------------------------------------------
        #
        # Examples:
        #
        # await redis_client.close()
        # await http_client.aclose()
        # await message_queue.shutdown()
        #
        # ---------------------------------------------------------------------

        logger.info(
            "Application resources released successfully.",
        )


    except Exception as exc:

        logger.exception(
            "Application shutdown encountered an error.",
            exc_info=exc,
        )

        raise


    finally:

        logger.info(
            "%s completed successfully.",
            LOG_SHUTDOWN,
        )

        logger.info(
            "=" * 80,
        )


# =============================================================================
# End Application Lifespan
# =============================================================================
# =============================================================================
# FastAPI Application Factory
# =============================================================================


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.

    This function is the application composition root.

    Responsibilities
    ----------------
    • Create FastAPI instance.
    • Apply application metadata.
    • Attach lifecycle management.
    • Configure middleware.
    • Register exception handlers.
    • Register API routers.

    Returns
    -------
    FastAPI
        Fully configured FastAPI application.

    Notes
    -----
    This function contains only application assembly.

    Business logic belongs to:

    • Services
    • Repositories
    • Domain layers

    """

    logger.info(
        "Creating FastAPI application instance.",
    )


    application = FastAPI(
        title=APPLICATION_NAME,
        version=APPLICATION_VERSION,
        debug=settings.DEBUG,
        lifespan=lifespan,
        description=APPLICATION_DESCRIPTION,
        contact=OPENAPI_CONTACT,
        license_info=OPENAPI_LICENSE,
    )


    logger.info(
        "FastAPI application instance created.",
    )


    return application


# =============================================================================
# Application Instance
# =============================================================================


app = create_application()


# =============================================================================
# End Application Factory
# =============================================================================
# =============================================================================
# Middleware Configuration
# =============================================================================


def configure_middlewares(
    application: FastAPI,
) -> None:
    """
    Configure and register application middleware.

    Responsibilities
    ----------------
    • Register request logging middleware.
    • Configure Cross-Origin Resource Sharing.
    • Provide a centralized location for future middleware.

    Registered Middleware
    ---------------------
    1. LoggingMiddleware

        Responsibilities:
        • Request logging
        • Response logging
        • Request lifecycle tracking


    2. CORS Middleware

        Responsibilities:
        • Allow frontend communication.
        • Control browser cross-origin access.


    Parameters
    ----------
    application:
        FastAPI application instance.

    Returns
    -------
    None

    Notes
    -----
    Middleware execution order matters.

    FastAPI executes middleware in reverse registration order.
    Therefore new middleware should be added carefully.
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
        "Logging middleware registered.",
    )


    # =========================================================================
    # CORS Middleware
    # =========================================================================

    configure_cors(
        application,
    )


    logger.debug(
        "CORS middleware configured.",
    )


    logger.info(
        "%s completed successfully.",
        LOG_MIDDLEWARE,
    )


# =============================================================================
# End Middleware Configuration
# =============================================================================

# =============================================================================
# Exception Handler Configuration
# =============================================================================


def configure_exception_handlers(
    application: FastAPI,
) -> None:
    """
    Register global application exception handlers.

    Responsibilities
    ----------------
    • Configure centralized exception handling.
    • Convert application exceptions into API responses.
    • Keep error responses consistent.
    • Provide a single registration point.

    Registered Handlers
    -------------------

    Application Exception Handler

        Handles:
        • AuthenticationError
        • AuthorizationError
        • ValidationError
        • DatabaseError
        • ResourceNotFoundError


    Validation Handler

        Handles:
        • Pydantic validation failures


    Unexpected Exception Handler

        Handles:
        • Unknown runtime exceptions


    Parameters
    ----------
    application:
        FastAPI application instance.

    Returns
    -------
    None

    Notes
    -----
    Exception handlers are registered once during
    application creation.
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
# End Exception Handler Configuration
# =============================================================================
# =============================================================================
# Root Endpoint
# =============================================================================


@app.get(
    DEFAULT_ROOT_PATH,
    tags=["Root"],
    status_code=HTTP_OK,
)
async def root() -> dict[str, str]:
    """
    Return basic application information.

    Responsibilities
    ----------------
    • Confirm API availability.
    • Expose application metadata.
    • Provide documentation links.

    Returns
    -------
    dict[str, str]
        Basic application information.

    Notes
    -----
    This endpoint does not perform:

    • Database queries
    • Authentication
    • External service calls

    It should remain lightweight.
    """

    logger.debug(
        "Root endpoint requested.",
    )

    return ROOT_RESPONSE_METADATA

# =============================================================================
# API Router Registration
# =============================================================================


def register_api_routes(
    application: FastAPI,
) -> None:
    """
    Register all API routers.

    Responsibilities
    ----------------
    • Attach API routers to the FastAPI application.
    • Apply API version prefix.
    • Organize endpoint groups.
    • Provide centralized router management.

    Registered Routers
    ------------------

    Authentication
        /api/v1/auth

    Users
        /api/v1/users

    Notes
        /api/v1/notes


    Parameters
    ----------
    application:
        FastAPI application instance.

    Returns
    -------
    None

    Notes
    -----
    Future routers should be registered here.

    Examples:

    - Tasks router
    - Notifications router
    - Analytics router
    - Dashboard router
    """

    logger.info(
        "%s started.",
        LOG_ROUTER,
    )


    # =========================================================================
    # Authentication Routes
    # =========================================================================

    application.include_router(
        auth.router,
        prefix=API_V1_PREFIX,
        tags=[
            "Authentication",
        ],
    )


    logger.debug(
        "Authentication routes registered.",
    )


    # =========================================================================
    # User Routes
    # =========================================================================

    application.include_router(
        users.router,
        prefix=API_V1_PREFIX,
        tags=[
            "Users",
        ],
    )


    logger.debug(
        "User routes registered.",
    )


    # =========================================================================
    # Notes Routes
    # =========================================================================

    application.include_router(
        notes.router,
        prefix=API_V1_PREFIX,
        tags=[
            "Notes",
        ],
    )


    logger.debug(
        "Notes routes registered.",
    )


    logger.info(
        "%s completed successfully.",
        LOG_ROUTER,
    )


# =============================================================================
# End Router Registration
# =============================================================================
