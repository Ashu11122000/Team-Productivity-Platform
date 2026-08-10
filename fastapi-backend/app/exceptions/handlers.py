"""
===============================================================================
Global Exception Handlers
===============================================================================

Centralized exception handling for the Team Productivity Platform.

Responsibilities
----------------
• Handle custom application exceptions.
• Handle FastAPI HTTP exceptions.
• Handle request validation errors.
• Handle database integrity errors.
• Handle general SQLAlchemy database errors.
• Handle unexpected exceptions.
• Log server-side errors without exposing sensitive internals to clients.
• Return standardized API error responses.
• Preserve request correlation through request IDs when available.

Architecture
------------
Application / Security Layer
        │
        ▼
ApplicationError
        │
        ▼
Global Exception Handler
        │
        ▼
Standardized HTTP Response

Database Layer
        │
        ▼
SQLAlchemyError
        │
        ▼
Database Exception Handler
        │
        ▼
Safe API Error Response

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• PostgreSQL
• Pydantic v2
• Docker
• Alembic
• Python 3.12+
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.exceptions import ApplicationError
from app.core.logging import get_logger


# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# Public Constants
# =============================================================================

INTERNAL_SERVER_ERROR_CODE = "INTERNAL_SERVER_ERROR"
DATABASE_ERROR_CODE = "DATABASE_ERROR"
DATABASE_INTEGRITY_ERROR_CODE = "DATABASE_INTEGRITY_ERROR"
VALIDATION_ERROR_CODE = "VALIDATION_ERROR"
HTTP_EXCEPTION_CODE = "HTTP_EXCEPTION"

INTERNAL_SERVER_ERROR_MESSAGE = "An unexpected error occurred."
DATABASE_ERROR_MESSAGE = "A database error occurred."
DATABASE_INTEGRITY_ERROR_MESSAGE = (
    "The requested operation violates a database constraint."
)
VALIDATION_ERROR_MESSAGE = "Request validation failed."


# =============================================================================
# Request / Response Helpers
# =============================================================================


def _timestamp() -> str:
    """
    Return the current UTC timestamp.

    Returns
    -------
    str
        ISO-8601 formatted UTC timestamp.
    """

    return datetime.now(UTC).isoformat()


def _request_id(request: Request) -> str | None:
    """
    Return the request ID associated with the current request.

    The request ID is expected to be populated by request middleware through:

        request.state.request_id

    Parameters
    ----------
    request:
        Current FastAPI request.

    Returns
    -------
    str | None
        Request ID when available.
    """

    request_id = getattr(
        request.state,
        "request_id",
        None,
    )

    if request_id is None:
        return None

    if not isinstance(request_id, str):
        return str(request_id)

    request_id = request_id.strip()

    return request_id or None


def _error_response(
    *,
    status_code: int,
    error: str,
    message: Any,
    path: str,
    error_code: str | None = None,
    details: Any = None,
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """
    Build a standardized API error response.

    Parameters
    ----------
    status_code:
        HTTP status code.

    error:
        High-level error identifier.

    message:
        Safe human-readable error message.

    path:
        Request path.

    error_code:
        Optional application-specific error code.

    details:
        Optional structured error details.

    request_id:
        Optional request correlation identifier.

    headers:
        Optional HTTP response headers.

    Returns
    -------
    JSONResponse
        Standardized JSON error response.
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

    if details is not None:
        content["details"] = jsonable_encoder(details)

    if request_id is not None:
        content["request_id"] = request_id

    return JSONResponse(
        status_code=status_code,
        content=content,
        headers=headers,
    )


# =============================================================================
# Application Exceptions
# =============================================================================


async def application_exception_handler(
    request: Request,
    exc: ApplicationError,
) -> JSONResponse:
    """
    Handle custom application exceptions.

    Application exceptions are expected to provide their own:

    • status_code
    • error_code
    • message
    • details
    • headers

    The handler converts the application-level exception into the standard
    API error response format.
    """

    logger.warning(
        "Application error | error_code=%s | status_code=%s | method=%s | "
        "path=%s | request_id=%s",
        exc.error_code,
        exc.status_code,
        request.method,
        request.url.path,
        _request_id(request),
    )

    return _error_response(
        status_code=int(exc.status_code),
        error=exc.error_code,
        error_code=exc.error_code,
        message=exc.message,
        details=exc.details,
        path=request.url.path,
        request_id=_request_id(request),
        headers=exc.headers,
    )


# =============================================================================
# FastAPI HTTP Exceptions
# =============================================================================


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """
    Handle FastAPI HTTP exceptions.

    HTTP-specific details are preserved while converting the response into
    the application's standardized error envelope.
    """

    logger.warning(
        "HTTP exception | status_code=%s | method=%s | path=%s | request_id=%s",
        exc.status_code,
        request.method,
        request.url.path,
        _request_id(request),
    )

    return _error_response(
        status_code=exc.status_code,
        error=HTTP_EXCEPTION_CODE,
        message=exc.detail,
        path=request.url.path,
        error_code=HTTP_EXCEPTION_CODE,
        request_id=_request_id(request),
        headers=exc.headers,
    )


# =============================================================================
# Request Validation Errors
# =============================================================================


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """
    Handle FastAPI/Pydantic request validation errors.

    Validation details are returned in a structured form while preserving the
    application's standardized error response envelope.
    """

    logger.warning(
        "Request validation error | method=%s | path=%s | request_id=%s",
        request.method,
        request.url.path,
        _request_id(request),
    )

    validation_details = exc.errors()

    return _error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error=VALIDATION_ERROR_CODE,
        error_code=VALIDATION_ERROR_CODE,
        message=VALIDATION_ERROR_MESSAGE,
        details=validation_details,
        path=request.url.path,
        request_id=_request_id(request),
    )


# =============================================================================
# Database Integrity Errors
# =============================================================================


async def integrity_exception_handler(
    request: Request,
    exc: IntegrityError,
) -> JSONResponse:
    """
    Handle database integrity constraint violations.

    Examples include:

    • Unique constraint violations.
    • Foreign key violations.
    • NOT NULL violations.
    • Check constraint violations.

    Raw database exception details are intentionally not returned to the
    client because they may reveal database implementation details.
    """

    logger.exception(
        "Database integrity error | method=%s | path=%s | request_id=%s",
        request.method,
        request.url.path,
        _request_id(request),
    )

    return _error_response(
        status_code=status.HTTP_409_CONFLICT,
        error=DATABASE_INTEGRITY_ERROR_CODE,
        error_code=DATABASE_INTEGRITY_ERROR_CODE,
        message=DATABASE_INTEGRITY_ERROR_MESSAGE,
        path=request.url.path,
        request_id=_request_id(request),
    )


# =============================================================================
# General Database Errors
# =============================================================================


async def sqlalchemy_exception_handler(
    request: Request,
    exc: SQLAlchemyError,
) -> JSONResponse:
    """
    Handle general SQLAlchemy database errors.

    Internal SQLAlchemy/PostgreSQL exception details are logged server-side
    but are never returned directly to API consumers.
    """

    logger.exception(
        "Database error | method=%s | path=%s | request_id=%s",
        request.method,
        request.url.path,
        _request_id(request),
    )

    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error=DATABASE_ERROR_CODE,
        error_code=DATABASE_ERROR_CODE,
        message=DATABASE_ERROR_MESSAGE,
        path=request.url.path,
        request_id=_request_id(request),
    )


# =============================================================================
# Unhandled Exceptions
# =============================================================================


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """
    Handle unexpected application exceptions.

    Detailed exception information is intentionally restricted to server-side
    logs. Clients receive only a safe generic error message.
    """

    logger.exception(
        "Unhandled exception | method=%s | path=%s | request_id=%s",
        request.method,
        request.url.path,
        _request_id(request),
    )

    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error=INTERNAL_SERVER_ERROR_CODE,
        error_code=INTERNAL_SERVER_ERROR_CODE,
        message=INTERNAL_SERVER_ERROR_MESSAGE,
        path=request.url.path,
        request_id=_request_id(request),
    )


# =============================================================================
# Registration
# =============================================================================


def register_exception_handlers(
    app: FastAPI,
) -> None:
    """
    Register all global exception handlers on the FastAPI application.

    Parameters
    ----------
    app:
        FastAPI application instance.

    Notes
    -----
    Registration order does not replace FastAPI's exception type resolution.
    More specific exception types are registered explicitly so database
    integrity errors are handled before the broader SQLAlchemyError handler.
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
        IntegrityError,
        integrity_exception_handler,
    )

    app.add_exception_handler(
        SQLAlchemyError,
        sqlalchemy_exception_handler,
    )

    app.add_exception_handler(
        Exception,
        unhandled_exception_handler,
    )

    logger.info(
        "Global exception handlers registered successfully.",
    )


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
    "application_exception_handler",
    "http_exception_handler",
    "validation_exception_handler",
    "integrity_exception_handler",
    "sqlalchemy_exception_handler",
    "unhandled_exception_handler",
    "register_exception_handlers",
)