"""
==========================================================
Response Utilities
==========================================================

Reusable API response builders for the Team Productivity
Platform.

Responsibilities
----------------
✓ Standardize API responses
✓ Build success responses
✓ Build error responses
✓ Build paginated responses
✓ Keep response formatting centralized

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

from typing import Any

from fastapi import Response, status
from fastapi.responses import JSONResponse

from app.utils.datetime import to_iso, utc_now
from app.utils.pagination import (
    PaginatedResult,
    pagination_dict,
)


def timestamp() -> str:
    """
    Return the current UTC timestamp in ISO-8601 format.
    """

    return to_iso(utc_now())


# ==========================================================
# Success Responses
# ==========================================================


def success_response(
    *,
    data: Any = None,
    message: str = "Request completed successfully.",
    status_code: int = status.HTTP_200_OK,
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """
    Build a standardized success response.
    """

    content: dict[str, Any] = {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": timestamp(),
    }

    if request_id is not None:
        content["request_id"] = request_id

    return JSONResponse(
        status_code=status_code,
        content=content,
        headers=headers,
    )


def created_response(
    *,
    data: Any = None,
    message: str = "Resource created successfully.",
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """
    Build a standardized HTTP 201 response.
    """

    return success_response(
        data=data,
        message=message,
        status_code=status.HTTP_201_CREATED,
        request_id=request_id,
        headers=headers,
    )


def accepted_response(
    *,
    data: Any = None,
    message: str = "Request accepted.",
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """
    Build a standardized HTTP 202 response.
    """

    return success_response(
        data=data,
        message=message,
        status_code=status.HTTP_202_ACCEPTED,
        request_id=request_id,
        headers=headers,
    )


def no_content_response() -> Response:
    """
    Build a standards-compliant HTTP 204 response.
    """

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
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
    details: Any = None,
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
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

    if request_id is not None:
        content["request_id"] = request_id

    return JSONResponse(
        status_code=status_code,
        content=content,
        headers=headers,
    )


# ==========================================================
# Pagination Responses
# ==========================================================


def paginated_response(
    result: PaginatedResult[Any],
    *,
    message: str = "Request completed successfully.",
    status_code: int = status.HTTP_200_OK,
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """
    Build a standardized paginated response.
    """

    page = pagination_dict(result)

    content: dict[str, Any] = {
        "success": True,
        "message": message,
        "data": page["items"],
        "pagination": page["pagination"],
        "timestamp": timestamp(),
    }

    if request_id is not None:
        content["request_id"] = request_id

    return JSONResponse(
        status_code=status_code,
        content=content,
        headers=headers,
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