"""
===============================================================================
Request Logging Middleware
===============================================================================

Request/response logging middleware for the Team Productivity Platform.

Responsibilities
----------------
• Generate or propagate request IDs.
• Store request IDs on ``request.state``.
• Log incoming HTTP requests.
• Log completed HTTP responses.
• Measure request processing time.
• Attach diagnostic response headers.
• Log unexpected request-processing exceptions.
• Preserve exception propagation for global exception handlers.

Request Lifecycle
-----------------
Incoming Request
        │
        ▼
LoggingMiddleware
        │
        ├── Request ID
        ├── Start Timer
        ├── Request Metadata
        │
        ▼
Application
        │
        ├── Success
        │      ↓
        │   Response
        │
        └── Exception
               ↓
        Global Exception Handler
               ↓
            Response

        ▼
LoggingMiddleware
        │
        ├── X-Request-ID
        └── X-Process-Time
        │
        ▼
Client

Security
--------
This middleware intentionally does NOT log:

• Authorization headers
• JWT access tokens
• Refresh tokens
• Passwords
• Cookies
• Request bodies
• Sensitive personal information

Performance
-----------
The middleware uses lightweight timing and UUID generation only.

It does not perform database queries, external network calls, or other
expensive operations.

Compatible With
---------------
• FastAPI
• Starlette
• Uvicorn
• Docker
• Python 3.12+
"""

from __future__ import annotations

import time
from uuid import uuid4

from fastapi import Request, Response
from starlette.middleware.base import (
    BaseHTTPMiddleware,
    RequestResponseEndpoint,
)

from app.core.logging import get_logger


# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# Constants
# =============================================================================

REQUEST_ID_HEADER = "X-Request-ID"
PROCESS_TIME_HEADER = "X-Process-Time"

REQUEST_ID_MAX_LENGTH = 128

UNKNOWN_CLIENT = "unknown"


# =============================================================================
# Request ID Helpers
# =============================================================================


def _generate_request_id() -> str:
    """
    Generate a new request correlation ID.

    Returns
    -------
    str
        UUID4-based request ID.
    """

    return str(uuid4())


def _get_request_id(request: Request) -> str:
    """
    Get or generate a request ID for the current request.

    An incoming ``X-Request-ID`` header is reused when it is present and
    reasonably sized. Otherwise a new UUID4 request ID is generated.

    Parameters
    ----------
    request:
        Incoming HTTP request.

    Returns
    -------
    str
        Safe request correlation ID.
    """

    incoming_request_id = request.headers.get(
        REQUEST_ID_HEADER,
    )

    if incoming_request_id is None:
        return _generate_request_id()

    request_id = incoming_request_id.strip()

    if not request_id:
        return _generate_request_id()

    if len(request_id) > REQUEST_ID_MAX_LENGTH:
        logger.warning(
            "Incoming request ID exceeded the maximum allowed length; "
            "generating a new request ID."
        )

        return _generate_request_id()

    return request_id


# =============================================================================
# Client Metadata Helpers
# =============================================================================


def _get_client_ip(request: Request) -> str:
    """
    Return the direct client IP address when available.

    Parameters
    ----------
    request:
        Incoming HTTP request.

    Returns
    -------
    str
        Client IP address or ``unknown``.
    """

    if request.client is None:
        return UNKNOWN_CLIENT

    return request.client.host


# =============================================================================
# Logging Middleware
# =============================================================================


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware responsible for logging the HTTP request lifecycle.

    Responsibilities
    ----------------
    • Generate or propagate request IDs.
    • Attach request IDs to ``request.state``.
    • Measure request processing time.
    • Log request start.
    • Log request completion.
    • Log unexpected request-processing exceptions.
    • Add diagnostic response headers.

    Notes
    -----
    This middleware deliberately does not handle application exceptions itself.

    Exceptions are re-raised so that FastAPI's centralized exception handling
    layer can produce the appropriate API response.
    """

    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        """
        Process an incoming HTTP request.

        Parameters
        ----------
        request:
            Incoming FastAPI request.

        call_next:
            Next middleware or application handler.

        Returns
        -------
        Response
            HTTP response generated by the application.
        """

        # ---------------------------------------------------------------------
        # Request ID
        # ---------------------------------------------------------------------

        request_id = _get_request_id(request)

        request.state.request_id = request_id

        # ---------------------------------------------------------------------
        # Request Timer
        # ---------------------------------------------------------------------

        start_time = time.perf_counter()

        # ---------------------------------------------------------------------
        # Request Metadata
        # ---------------------------------------------------------------------

        method = request.method
        path = request.url.path
        client_ip = _get_client_ip(request)

        # ---------------------------------------------------------------------
        # Request Start Logging
        # ---------------------------------------------------------------------

        logger.info(
            "Request started.",
            extra={
                "request_id": request_id,
                "method": method,
                "path": path,
                "client_ip": client_ip,
            },
        )

        try:
            # ---------------------------------------------------------------
            # Process Request
            # ---------------------------------------------------------------

            response = await call_next(request)

        except Exception:
            # ---------------------------------------------------------------
            # Failed Request
            # ---------------------------------------------------------------

            elapsed_ms = (
                time.perf_counter() - start_time
            ) * 1000

            logger.exception(
                "Request failed.",
                extra={
                    "request_id": request_id,
                    "method": method,
                    "path": path,
                    "client_ip": client_ip,
                    "duration_ms": round(elapsed_ms, 2),
                },
            )

            # ---------------------------------------------------------------
            # IMPORTANT
            # ---------------------------------------------------------------
            #
            # Do not convert the exception into an HTTP response here.
            #
            # The centralized exception handlers in:
            #
            #     app/exceptions/handlers.py
            #
            # remain responsible for converting application exceptions into
            # standardized API responses.
            #
            # ---------------------------------------------------------------

            raise

        # ---------------------------------------------------------------------
        # Request Duration
        # ---------------------------------------------------------------------

        elapsed_ms = (
            time.perf_counter() - start_time
        ) * 1000

        # ---------------------------------------------------------------------
        # Diagnostic Response Headers
        # ---------------------------------------------------------------------

        response.headers[REQUEST_ID_HEADER] = request_id
        response.headers[PROCESS_TIME_HEADER] = f"{elapsed_ms:.2f}"

        # ---------------------------------------------------------------------
        # Request Completion Logging
        # ---------------------------------------------------------------------

        logger.info(
            "Request completed.",
            extra={
                "request_id": request_id,
                "method": method,
                "path": path,
                "status_code": response.status_code,
                "client_ip": client_ip,
                "duration_ms": round(elapsed_ms, 2),
            },
        )

        return response


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
    "LoggingMiddleware",
)