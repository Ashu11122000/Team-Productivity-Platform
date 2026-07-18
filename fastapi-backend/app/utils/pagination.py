"""
==========================================================
Pagination Utilities
==========================================================

Reusable pagination helpers for the Team Productivity
Platform.

Responsibilities
----------------
- Validate pagination parameters
- Calculate SQL query offsets
- Build pagination metadata
- Produce standardized paginated responses
- Remain framework independent

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

from dataclasses import dataclass
from math import ceil
from typing import Any, Generic, Sequence, TypeVar

T = TypeVar("T")

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


@dataclass(slots=True, frozen=True)
class PaginationParams:
    """
    Validated pagination parameters.

    Attributes
    ----------
    page:
        Current page number (1-based).

    page_size:
        Number of records per page.
    """

    page: int = DEFAULT_PAGE
    page_size: int = DEFAULT_PAGE_SIZE

    @property
    def offset(self) -> int:
        """
        SQL OFFSET value.
        """
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """
        SQL LIMIT value.
        """
        return self.page_size


@dataclass(slots=True, frozen=True)
class PaginationMeta:
    """
    Metadata describing a paginated result.
    """

    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool


@dataclass(slots=True, frozen=True)
class PaginatedResult(Generic[T]):
    """
    Generic paginated result.
    """

    items: Sequence[T]
    pagination: PaginationMeta


def validate_pagination(
    *,
    page: int = DEFAULT_PAGE,
    page_size: int = DEFAULT_PAGE_SIZE,
    max_page_size: int = MAX_PAGE_SIZE,
) -> PaginationParams:
    """
    Validate pagination parameters.

    Parameters
    ----------
    page:
        Requested page number.

    page_size:
        Requested page size.

    max_page_size:
        Maximum allowed page size.

    Returns
    -------
    PaginationParams
        Validated pagination parameters.

    Raises
    ------
    ValueError
        If page or page_size are invalid.
    """

    if page < 1:
        raise ValueError("Page must be greater than or equal to 1.")

    if page_size < 1:
        raise ValueError("Page size must be greater than or equal to 1.")

    if page_size > max_page_size:
        page_size = max_page_size

    return PaginationParams(
        page=page,
        page_size=page_size,
    )


def build_pagination_meta(
    *,
    total: int,
    page: int,
    page_size: int,
) -> PaginationMeta:
    """
    Build pagination metadata.

    Parameters
    ----------
    total:
        Total number of records.

    page:
        Current page.

    page_size:
        Number of records per page.
    """

    total_pages = max(1, ceil(total / page_size))

    return PaginationMeta(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_previous=page > 1,
    )


def paginate(
    *,
    items: Sequence[T],
    total: int,
    page: int = DEFAULT_PAGE,
    page_size: int = DEFAULT_PAGE_SIZE,
) -> PaginatedResult[T]:
    """
    Create a standardized paginated result.

    Parameters
    ----------
    items:
        Current page records.

    total:
        Total number of records.

    page:
        Current page.

    page_size:
        Number of records per page.

    Returns
    -------
    PaginatedResult[T]
    """

    params = validate_pagination(
        page=page,
        page_size=page_size,
    )

    metadata = build_pagination_meta(
        total=total,
        page=params.page,
        page_size=params.page_size,
    )

    return PaginatedResult(
        items=items,
        pagination=metadata,
    )


def pagination_dict(
    result: PaginatedResult[Any],
) -> dict[str, Any]:
    """
    Convert a paginated result into a JSON-serializable dictionary.

    Useful for APIs or custom response builders.
    """

    return {
        "items": list(result.items),
        "pagination": {
            "total": result.pagination.total,
            "page": result.pagination.page,
            "page_size": result.pagination.page_size,
            "total_pages": result.pagination.total_pages,
            "has_next": result.pagination.has_next,
            "has_previous": result.pagination.has_previous,
        },
    }


__all__ = [
    "DEFAULT_PAGE",
    "DEFAULT_PAGE_SIZE",
    "MAX_PAGE_SIZE",
    "PaginationParams",
    "PaginationMeta",
    "PaginatedResult",
    "validate_pagination",
    "build_pagination_meta",
    "paginate",
    "pagination_dict",
]