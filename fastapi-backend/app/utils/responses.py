"""
==========================================================
Response Utilities
==========================================================

Reusable API response builders for the Team Productivity
Platform.

Responsibilities
----------------
- Standardize API responses
- Build success responses
- Build error responses
- Build paginated responses
- Keep response formatting centralized

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Docker
- Alembic
- Pydantic v2
- Python 3.12+
==========================================================
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import status
from fastapi.responses import JSONResponse

from app.utils.pagination import PaginatedResult


def timestamp() -> str:
    """
    Return the current UTC timestamp in ISO-8601 format.
    """

    return datetime.now(UTC).isoformat()


# ==========================================================
# Success Responses
# ==========================================================


def success_response(
    *,
    data: Any = None,
    message: str = "Request completed successfully.",
    status_code: int = status.HTTP_200_OK,
) -> JSONResponse:
    """
    Build a standardized success response.
    """

    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
            "timestamp": timestamp(),
        },
    )


def created_response(
    *,
    data: Any = None,
    message: str = "Resource created successfully.",
) -> JSONResponse:
    """
    Build a standardized HTTP 201 response.
    """

    return success_response(
        data=data,
        message=message,
        status_code=status.HTTP_201_CREATED,
    )


def accepted_response(
    *,
    data: Any = None,
    message: str = "Request accepted.",
) -> JSONResponse:
    """
    Build a standardized HTTP 202 response.
    """

    return success_response(
        data=data,
        message=message,
        status_code=status.HTTP_202_ACCEPTED,
    )


def no_content_response() -> JSONResponse:
    """
    Build a standardized HTTP 204 response.
    """

    return JSONResponse(
        status_code=status.HTTP_204_NO_CONTENT,
        content=None,
    )


# ==========================================================
# Error Responses
# ==========================================================


def error_response(
    *,
    message: str,
    error: str,
    status_code: int,
    error_code: str | None = None,
    details: Any | None = None,
) -> JSONResponse:
    """
    Build a standardized error response.
    """

    content: dict[str, Any] = {
        "success": False,
        "error": error,
        "message": message,
        "timestamp": timestamp(),
    }

    if error_code is not None:
        content["error_code"] = error_code

    if details is not None:
        content["details"] = details

    return JSONResponse(
        status_code=status_code,
        content=content,
    )


# ==========================================================
# Pagination Responses
# ==========================================================


def paginated_response(
    result: PaginatedResult[Any],
    *,
    message: str = "Request completed successfully.",
    status_code: int = status.HTTP_200_OK,
) -> JSONResponse:
    """
    Build a standardized paginated response.
    """

    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": list(result.items),
            "pagination": {
                "total": result.pagination.total,
                "page": result.pagination.page,
                "page_size": result.pagination.page_size,
                "total_pages": result.pagination.total_pages,
                "has_next": result.pagination.has_next,
                "has_previous": result.pagination.has_previous,
            },
            "timestamp": timestamp(),
        },
    )


__all__ = [
    "timestamp",
    "success_response",
    "created_response",
    "accepted_response",
    "no_content_response",
    "error_response",
    "paginated_response",
]