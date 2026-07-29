"""
==========================================================
Common Pydantic Schemas
==========================================================

Responsibilities
----------------
Provides reusable response schemas shared across the Team
Productivity Platform.

Features
--------
✓ Standard API responses
✓ Success responses
✓ Error responses
✓ Message responses
✓ Pagination metadata
✓ Generic response models
✓ Health endpoint schemas

Compatible With
---------------
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
"""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import Field

from app.schemas.base import BaseSchema

T = TypeVar("T")

# ==========================================================
# Base Response
# ==========================================================


class BaseResponse(BaseSchema):
    """
    Base response schema shared by all API responses.
    """

    success: bool = Field(
        ...,
        description="Whether the request succeeded.",
    )

    message: str = Field(
        ...,
        description="Human-readable response message.",
    )

    timestamp: str = Field(
        ...,
        description="UTC timestamp in ISO 8601 format.",
    )

    request_id: str | None = Field(
        default=None,
        description="Unique request identifier.",
    )


# ==========================================================
# Message Response
# ==========================================================


class MessageResponse(BaseResponse):
    """
    Simple message response.
    """

    success: bool = True


# ==========================================================
# Success Response
# ==========================================================


class SuccessResponse(
    BaseResponse,
    Generic[T],
):
    """
    Standard successful API response.
    """

    success: bool = True

    data: T = Field(
        ...,
        description="Response payload.",
    )


# ==========================================================
# Error Response
# ==========================================================


class ErrorResponse(BaseResponse):
    """
    Standard error response.
    """

    success: bool = False

    error: str = Field(
        ...,
        description="Short error name.",
    )

    error_code: str = Field(
        ...,
        description="Application error code.",
    )

    details: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional error details.",
    )

    path: str = Field(
        ...,
        description="Request path.",
    )


# ==========================================================
# Pagination Metadata
# ==========================================================


class PaginationMeta(BaseSchema):
    """
    Pagination metadata.
    """

    offset: int = Field(
        ...,
        ge=0,
        description="Current pagination offset.",
    )

    limit: int = Field(
        ...,
        ge=1,
        description="Maximum records returned.",
    )

    total_items: int = Field(
        ...,
        ge=0,
        description="Total available records.",
    )

    total_pages: int = Field(
        ...,
        ge=0,
        description="Total available pages.",
    )

    current_page: int = Field(
        ...,
        ge=1,
        description="Current page number.",
    )

    next_page: int | None = Field(
        default=None,
        description="Next page number.",
    )

    previous_page: int | None = Field(
        default=None,
        description="Previous page number.",
    )

    has_next: bool = Field(
        ...,
        description="Whether another page exists.",
    )

    has_previous: bool = Field(
        ...,
        description="Whether a previous page exists.",
    )


# ==========================================================
# Paginated Response
# ==========================================================


class PaginatedResponse(
    BaseResponse,
    Generic[T],
):
    """
    Standard paginated response.
    """

    success: bool = True

    data: list[T]

    pagination: PaginationMeta


# ==========================================================
# Health Response
# ==========================================================


class HealthResponse(BaseSchema):
    """
    Health endpoint response.
    """

    status: str

    service: str

    version: str

    environment: str

    timestamp: str


# ==========================================================
# Root Response
# ==========================================================


class RootResponse(BaseSchema):
    """
    Root endpoint response.
    """

    name: str

    version: str

    environment: str

    status: str

    docs: str

    redoc: str

    health: str


# ==========================================================
# Empty Response
# ==========================================================


class EmptyResponse(
    SuccessResponse[dict[str, Any]],
):
    """
    Empty successful response.
    """

    data: dict[str, Any] = Field(
        default_factory=dict,
    )


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "BaseResponse",
    "MessageResponse",
    "SuccessResponse",
    "ErrorResponse",
    "PaginationMeta",
    "PaginatedResponse",
    "HealthResponse",
    "RootResponse",
    "EmptyResponse",
]