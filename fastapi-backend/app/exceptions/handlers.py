"""
Global Exception Handlers
=========================

Centralized exception handling for the Team Productivity Platform.

Responsibilities
----------------
- Handle FastAPI HTTP exceptions
- Handle request validation errors
- Handle SQLAlchemy database errors
- Handle unexpected exceptions
- Log all server-side errors
- Return consistent API responses

Compatible with:
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.core.logging import get_logger

logger = get_logger(__name__)


def _timestamp() -> str:
    """Return current UTC timestamp in ISO 8601 format."""
    return datetime.now(UTC).isoformat()


def _error_response(
    *,
    status_code: int,
    error: str,
    message: Any,
    path: str,
) -> JSONResponse:
    """
    Build a standardized error response.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": error,
            "message": message,
            "path": path,
            "timestamp": _timestamp(),
        },
    )


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
        error="HTTPException",
        message=exc.detail,
        path=request.url.path,
    )


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
        error="ValidationError",
        message=exc.errors(),
        path=request.url.path,
    )


async def sqlalchemy_exception_handler(
    request: Request,
    exc: SQLAlchemyError,
) -> JSONResponse:
    """
    Handle SQLAlchemy exceptions.
    """

    logger.exception(
        "Database Error | %s | %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )

    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error="DatabaseError",
        message="A database error occurred.",
        path=request.url.path,
    )


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
        error="InternalServerError",
        message="An unexpected error occurred.",
        path=request.url.path,
    )


def register_exception_handlers(app: FastAPI) -> None:
    """
    Register all global exception handlers.

    Parameters
    ----------
    app : FastAPI
        FastAPI application instance.
    """

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

    logger.info("Global exception handlers registered.")