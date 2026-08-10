"""
===============================================================================
Response Utilities
===============================================================================

Reusable API response builders for the Team Productivity
Platform.

Responsibilities
----------------
• Standardize successful API responses.
• Standardize error API responses.
• Build HTTP 201 Created responses.
• Build HTTP 202 Accepted responses.
• Build HTTP 204 No Content responses.
• Build standardized paginated responses.
• Serialize Pydantic and Python objects safely.
• Keep response formatting centralized.

Response Contract
-----------------
Successful response:

    {
        "success": true,
        "message": "...",
        "data": ...,
        "timestamp": "..."
    }

Error response:

    {
        "success": false,
        "error": "...",
        "message": "...",
        "error_code": "...",
        "details": ...,
        "timestamp": "..."
    }

Pagination response:

    {
        "success": true,
        "message": "...",
        "data": [...],
        "pagination": {...},
        "timestamp": "..."
    }

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• PostgreSQL
• Docker
• Alembic
• Pydantic v2
• Python 3.12+
"""

from __future__ import annotations

from typing import Any

from fastapi import Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.utils.datetime import to_iso, utc_now
from app.utils.pagination import (
    PaginatedResult,
    pagination_dict,
)


# =============================================================================
# Timestamp
# =============================================================================


def timestamp() -> str:
    """
    Return the current UTC timestamp in ISO-8601 format.

    Returns
    -------
    str
        Current UTC timestamp using the ``Z`` suffix.

    Example
    -------
    ``2026-07-29T14:30:00Z``
    """

    return to_iso(utc_now())


# =============================================================================
# Success Responses
# =============================================================================


def success_response(
    *,
    data: Any = None,
    message: str = "Request completed successfully.",
    status_code: int = status.HTTP_200_OK,
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """
    Build a standardized successful API response.

    Parameters
    ----------
    data:
        Response payload.

    message:
        Human-readable success message.

    status_code:
        HTTP status code.

    request_id:
        Optional request correlation ID.

    headers:
        Optional HTTP response headers.

    Returns
    -------
    JSONResponse
        Standardized JSON success response.
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
        content=jsonable_encoder(content),
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
    Build a standardized HTTP 201 Created response.

    Parameters
    ----------
    data:
        Created resource or response payload.

    message:
        Human-readable success message.

    request_id:
        Optional request correlation ID.

    headers:
        Optional HTTP response headers.

    Returns
    -------
    JSONResponse
        HTTP 201 JSON response.
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
    Build a standardized HTTP 202 Accepted response.

    Parameters
    ----------
    data:
        Optional response payload.

    message:
        Human-readable acceptance message.

    request_id:
        Optional request correlation ID.

    headers:
        Optional HTTP response headers.

    Returns
    -------
    JSONResponse
        HTTP 202 JSON response.
    """

    return success_response(
        data=data,
        message=message,
        status_code=status.HTTP_202_ACCEPTED,
        request_id=request_id,
        headers=headers,
    )


def no_content_response(
    *,
    headers: dict[str, str] | None = None,
) -> Response:
    """
    Build a standards-compliant HTTP 204 No Content response.

    Parameters
    ----------
    headers:
        Optional HTTP response headers.

    Returns
    -------
    Response
        Empty HTTP 204 response.

    Notes
    -----
    A 204 response intentionally contains no JSON body.
    """

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
        headers=headers,
    )


# =============================================================================
# Error Responses
# =============================================================================


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
    Build a standardized API error response.

    Parameters
    ----------
    message:
        Safe human-readable error message.

    error:
        High-level error identifier.

    status_code:
        HTTP status code.

    error_code:
        Optional application-specific error code.

    details:
        Optional structured error details.

    request_id:
        Optional request correlation ID.

    headers:
        Optional HTTP response headers.

    Returns
    -------
    JSONResponse
        Standardized JSON error response.

    Security
    --------
    Callers should never pass raw database exceptions, stack traces,
    credentials, tokens, or other sensitive implementation details as
    ``message`` or ``details``.
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
        content=jsonable_encoder(content),
        headers=headers,
    )


# =============================================================================
# Pagination Responses
# =============================================================================


def paginated_response(
    result: PaginatedResult[Any],
    *,
    message: str = "Request completed successfully.",
    status_code: int = status.HTTP_200_OK,
    request_id: str | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """
    Build a standardized paginated API response.

    Parameters
    ----------
    result:
        Paginated result produced by ``app.utils.pagination``.

    message:
        Human-readable success message.

    status_code:
        HTTP status code.

    request_id:
        Optional request correlation ID.

    headers:
        Optional HTTP response headers.

    Returns
    -------
    JSONResponse
        Standardized paginated JSON response.
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
        content=jsonable_encoder(content),
        headers=headers,
    )


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
    "timestamp",
    "success_response",
    "created_response",
    "accepted_response",
    "no_content_response",
    "error_response",
    "paginated_response",
)