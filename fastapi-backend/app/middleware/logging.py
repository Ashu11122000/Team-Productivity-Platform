"""
==========================================================
Request Logging Middleware
==========================================================

Logs every incoming HTTP request and outgoing response.

Responsibilities
----------------
✓ Log incoming requests
✓ Log outgoing responses
✓ Measure request processing time
✓ Log unexpected exceptions
✓ Production-ready request logging

Compatible With
---------------
- FastAPI
- Starlette
- Uvicorn
- Docker
==========================================================
"""

from __future__ import annotations

import time
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import get_logger

logger = get_logger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that logs all HTTP requests and responses.
    """

    async def dispatch(
        self,
        request: Request,
        call_next: Callable,
    ) -> Response:
        """
        Process an HTTP request.
        """

        start_time = time.perf_counter()

        client_ip = (
            request.client.host
            if request.client
            else "unknown"
        )

        logger.info(
            "Request Started | %s %s | Client=%s",
            request.method,
            request.url.path,
            client_ip,
        )

        try:
            response = await call_next(request)

        except Exception:
            elapsed = (
                time.perf_counter() - start_time
            ) * 1000

            logger.exception(
                "Request Failed | %s %s | %.2f ms",
                request.method,
                request.url.path,
                elapsed,
            )

            raise

        elapsed = (
            time.perf_counter() - start_time
        ) * 1000

        logger.info(
            "Request Completed | %s %s | Status=%s | %.2f ms",
            request.method,
            request.url.path,
            response.status_code,
            elapsed,
        )

        response.headers["X-Process-Time"] = (
            f"{elapsed:.2f} ms"
        )

        return response
    