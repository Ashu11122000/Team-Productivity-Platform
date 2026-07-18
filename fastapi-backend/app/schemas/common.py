"""
==========================================================
Common Pydantic Schemas
==========================================================

Reusable schemas shared across the Team Productivity
Platform.

Responsibilities
----------------
✓ Standard API responses
✓ Success responses
✓ Error responses
✓ Message responses
✓ Pagination metadata

Compatible With
---------------
- FastAPI
- Pydantic v2
==========================================================
"""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import Field
from pydantic.generics import GenericModel

from app.schemas.base import BaseSchema

T = TypeVar("T")


# ==========================================================
# Message Response
# ==========================================================


class MessageResponse(BaseSchema):
    """
    Standard message response.
    """

    message: str = Field(
        ...,
        description="Human-readable response message.",
    )


# ==========================================================
# Success Response
# ==========================================================


class SuccessResponse(BaseSchema, GenericModel, Generic[T]):
    """
    Standard successful API response.
    """

    success: bool = Field(
        default=True,
        description="Whether the request succeeded.",
    )

    data: T


# ==========================================================
# Error Response
# ==========================================================


class ErrorResponse(BaseSchema):
    """
    Standard error response.
    """

    success: bool = Field(
        default=False,
    )

    error: str

    message: str

    path: str

    timestamp: str


# ==========================================================
# Pagination Metadata
# ==========================================================


class PaginationMeta(BaseSchema):
    """
    Pagination metadata.
    """

    page: int = Field(
        ...,
        ge=1,
    )

    page_size: int = Field(
        ...,
        ge=1,
    )

    total_items: int = Field(
        ...,
        ge=0,
    )

    total_pages: int = Field(
        ...,
        ge=0,
    )

    has_next: bool

    has_previous: bool


# ==========================================================
# Paginated Response
# ==========================================================


class PaginatedResponse(
    BaseSchema,
    GenericModel,
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


class EmptyResponse(BaseSchema):
    """
    Empty successful response.
    """

    success: bool = True

    data: dict[str, Any] = Field(
        default_factory=dict,
    )