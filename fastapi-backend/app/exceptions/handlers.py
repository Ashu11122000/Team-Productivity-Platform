"""
==========================================================
Global Exception Handlers
==========================================================

Centralized exception handling for the Team Productivity
Platform.

Responsibilities
----------------
- Handle custom application exceptions
- Handle FastAPI HTTP exceptions
- Handle request validation errors
- Handle SQLAlchemy database errors
- Handle unexpected exceptions
- Log server-side errors
- Return standardized API responses

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Pydantic v2
- Docker
- Alembic
- Python 3.12+
==========================================================
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.core.logging import get_logger
from app.exceptions.exceptions import ApplicationError

logger = get_logger(__name__)


def _timestamp() -> str:
    """
    Return the current UTC timestamp in ISO 8601 format.
    """
    return datetime.now(UTC).isoformat()


def _error_response(
    *,
    status_code: int,
    error: str,
    message: Any,
    path: str,
    error_code: str | None = None,
) -> JSONResponse:
    """
    Build a standardized API error response.
    """

    content: dict[str, Any] = {
        "success": False,
        "error": error,
        "message": message,
        "path": path,
        "timestamp": _timestamp(),
    }

    if error_code is not None:
        content["error_code"] = error_code

    return JSONResponse(
        status_code=status_code,
        content=content,
    )


# ==========================================================
# Application Exceptions
# ==========================================================


async def application_exception_handler(
    request: Request,
    exc: ApplicationError,
) -> JSONResponse:
    """
    Handle custom application exceptions.
    """

    logger.warning(
        "Application Error | %s | %s | %s | %s",
        exc.error_code,
        exc.status_code,
        request.method,
        request.url.path,
    )

    return _error_response(
        status_code=int(exc.status_code),
        error=exc.error_code,
        error_code=exc.error_code,
        message=exc.message,
        path=request.url.path,
    )


# ==========================================================
# FastAPI Exceptions
# ==========================================================


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """
    Handle FastAPI HTTP exceptions.
    """

    logger.warning(
        "HTTP %s | %s | %s",
        exc.status_code,
        request.method,
        request.url.path,
    )

    return _error_response(
        status_code=exc.status_code,
        error="HTTP_EXCEPTION",
        message=exc.detail,
        path=request.url.path,
    )


# ==========================================================
# Validation Errors
# ==========================================================


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """
    Handle request validation errors.
    """

    logger.warning(
        "Validation Error | %s | %s",
        request.method,
        request.url.path,
    )

    return _error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error="VALIDATION_ERROR",
        message=exc.errors(),
        path=request.url.path,
    )


# ==========================================================
# Database Errors
# ==========================================================


async def sqlalchemy_exception_handler(
    request: Request,
    exc: SQLAlchemyError,
) -> JSONResponse:
    """
    Handle SQLAlchemy database exceptions.
    """

    logger.exception(
        "Database Error | %s | %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )

    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error="DATABASE_ERROR",
        message="A database error occurred.",
        path=request.url.path,
    )


# ==========================================================
# Unhandled Exceptions
# ==========================================================


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """
    Handle unexpected exceptions.
    """

    logger.exception(
        "Unhandled Exception | %s | %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )

    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error="INTERNAL_SERVER_ERROR",
        message="An unexpected error occurred.",
        path=request.url.path,
    )


# ==========================================================
# Registration
# ==========================================================


def register_exception_handlers(app: FastAPI) -> None:
    """
    Register all global exception handlers.

    Parameters
    ----------
    app:
        FastAPI application instance.
    """

    app.add_exception_handler(
        ApplicationError,
        application_exception_handler,
    )

    app.add_exception_handler(
        HTTPException,
        http_exception_handler,
    )

    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler,
    )

    app.add_exception_handler(
        SQLAlchemyError,
        sqlalchemy_exception_handler,
    )

    app.add_exception_handler(
        Exception,
        unhandled_exception_handler,
    )

    logger.info("Global exception handlers registered successfully.")