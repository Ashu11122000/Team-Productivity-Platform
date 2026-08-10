"""
===============================================================================
Common Pydantic Schemas
===============================================================================

Reusable response schemas shared across the Team Productivity Platform.

Responsibilities
----------------
• Define the standard API response contract.
• Represent successful responses.
• Represent error responses.
• Represent message-only responses.
• Represent pagination metadata.
• Represent generic paginated responses.
• Represent health endpoint responses.
• Represent the root endpoint response.
• Represent successful responses without a meaningful payload.

Compatible With
---------------
• FastAPI
• Pydantic v2
• SQLAlchemy 2.x
• Python 3.12+
"""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import Field

from app.schemas.base import BaseSchema


# =============================================================================
# Generic Type
# =============================================================================

T = TypeVar("T")


# =============================================================================
# Base Response
# =============================================================================


class BaseResponse(BaseSchema):
    """
    Base response schema shared by API response models.

    Attributes
    ----------
    success:
        Indicates whether the operation succeeded.

    message:
        Human-readable description of the operation result.

    timestamp:
        UTC timestamp represented as an ISO-8601 string.

    request_id:
        Optional request correlation identifier.
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


# =============================================================================
# Message Response
# =============================================================================


class MessageResponse(BaseResponse):
    """
    Response containing a standard message without a data payload.

    The response represents a successful operation by default.
    """

    success: bool = True


# =============================================================================
# Success Response
# =============================================================================


class SuccessResponse(
    BaseResponse,
    Generic[T],
):
    """
    Standard successful API response.

    Parameters
    ----------
    T:
        Type of the response payload stored in ``data``.
    """

    success: bool = True

    data: T = Field(
        ...,
        description="Response payload.",
    )


# =============================================================================
# Error Response
# =============================================================================


class ErrorResponse(BaseResponse):
    """
    Standard API error response.

    Attributes
    ----------
    error:
        Short, human-readable error category.

    error_code:
        Stable application-level error code.

    details:
        Additional structured error information.

    path:
        HTTP request path associated with the error.

    Security
    --------
    ``details`` must contain only safe client-facing information.

    Internal database errors, stack traces, credentials, SQL statements,
    tokens, and other implementation details must not be exposed through
    this response.
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
        description="Additional safe error details.",
    )

    path: str = Field(
        ...,
        description="Request path.",
    )


# =============================================================================
# Pagination Metadata
# =============================================================================


class PaginationMeta(BaseSchema):
    """
    Metadata describing a paginated collection.

    Attributes
    ----------
    offset:
        Zero-based offset used to retrieve the current page.

    limit:
        Maximum number of records requested for the page.

    total_items:
        Total number of records available.

    total_pages:
        Total number of available pages.

    current_page:
        One-based current page number.

    next_page:
        One-based next page number, or ``None`` when there is no next page.

    previous_page:
        One-based previous page number, or ``None`` when there is no previous
        page.

    has_next:
        Whether another page exists.

    has_previous:
        Whether a previous page exists.
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
        ge=1,
        description="Next page number.",
    )

    previous_page: int | None = Field(
        default=None,
        ge=1,
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


# =============================================================================
# Paginated Response
# =============================================================================


class PaginatedResponse(
    BaseResponse,
    Generic[T],
):
    """
    Standard paginated API response.

    Parameters
    ----------
    T:
        Type of each item contained in the ``data`` collection.
    """

    success: bool = True

    data: list[T] = Field(
        ...,
        description="Paginated response items.",
    )

    pagination: PaginationMeta = Field(
        ...,
        description="Pagination metadata.",
    )


# =============================================================================
# Health Response
# =============================================================================


class HealthResponse(BaseSchema):
    """
    Response returned by the application health endpoint.

    Attributes
    ----------
    status:
        Current application health status.

    service:
        Service name.

    version:
        Application/service version.

    environment:
        Current runtime environment.

    timestamp:
        UTC timestamp represented as an ISO-8601 string.
    """

    status: str = Field(
        ...,
        description="Current service health status.",
    )

    service: str = Field(
        ...,
        description="Service name.",
    )

    version: str = Field(
        ...,
        description="Application version.",
    )

    environment: str = Field(
        ...,
        description="Runtime environment.",
    )

    timestamp: str = Field(
        ...,
        description="UTC timestamp in ISO 8601 format.",
    )


# =============================================================================
# Root Response
# =============================================================================


class RootResponse(BaseSchema):
    """
    Response returned by the application root endpoint.

    Provides basic service metadata and navigation links.
    """

    name: str = Field(
        ...,
        description="Application or service name.",
    )

    version: str = Field(
        ...,
        description="Application version.",
    )

    environment: str = Field(
        ...,
        description="Runtime environment.",
    )

    status: str = Field(
        ...,
        description="Current service status.",
    )

    docs: str = Field(
        ...,
        description="URL path for the OpenAPI documentation.",
    )

    redoc: str = Field(
        ...,
        description="URL path for the ReDoc documentation.",
    )

    health: str = Field(
        ...,
        description="URL path for the health endpoint.",
    )


# =============================================================================
# Empty Response
# =============================================================================


class EmptyResponse(
    SuccessResponse[dict[str, Any]],
):
    """
    Successful response with an empty dictionary payload.

    Useful for operations that succeed but do not have meaningful
    response data.
    """

    data: dict[str, Any] = Field(
        default_factory=dict,
        description="Empty response payload.",
    )


# =============================================================================
# Public Exports
# =============================================================================

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