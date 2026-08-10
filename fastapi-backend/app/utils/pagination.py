"""
===============================================================================
Pagination Utilities
===============================================================================

Reusable pagination helpers for the Team Productivity
Platform.

Responsibilities
----------------
• Validate pagination parameters.
• Calculate SQL query offsets.
• Calculate SQL query limits.
• Build pagination metadata.
• Produce standardized paginated results.
• Convert paginated results into dictionary structures.
• Remain independent of FastAPI request/response objects.

Design
------
The pagination utility deliberately uses lightweight Python dataclasses rather
than Pydantic or FastAPI-specific models.

This allows pagination to be reused by:

    Repository
        ↓
    Service
        ↓
    API Route

without coupling database or business logic to the HTTP framework.

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

from dataclasses import asdict, dataclass
from math import ceil
from typing import Any, Generic, Sequence, TypeVar

from app.core.config import settings


# =============================================================================
# Generic Type
# =============================================================================

T = TypeVar("T")


# =============================================================================
# Pagination Parameters
# =============================================================================


@dataclass(slots=True, frozen=True)
class PaginationParams:
    """
    Validated pagination parameters.

    Attributes
    ----------
    page:
        One-based page number.

    page_size:
        Number of records requested per page.
    """

    page: int = 1
    page_size: int = settings.DEFAULT_PAGE_SIZE

    @property
    def offset(self) -> int:
        """
        Return the SQL OFFSET value.

        Returns
        -------
        int
            Number of records to skip.
        """

        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """
        Return the SQL LIMIT value.

        Returns
        -------
        int
            Maximum number of records to retrieve.
        """

        return self.page_size


# =============================================================================
# Pagination Metadata
# =============================================================================


@dataclass(slots=True, frozen=True)
class PaginationMeta:
    """
    Pagination metadata returned with a paginated result.

    Attributes
    ----------
    total:
        Total number of records matching the query.

    page:
        Current one-based page number.

    page_size:
        Number of records requested per page.

    total_pages:
        Total number of available pages.

    has_next:
        Whether another page exists after the current page.

    has_previous:
        Whether a previous page exists.

    next_page:
        Next page number when available.

    previous_page:
        Previous page number when available.
    """

    total: int
    page: int
    page_size: int
    total_pages: int

    has_next: bool
    has_previous: bool

    next_page: int | None
    previous_page: int | None

    @property
    def has_items(self) -> bool:
        """
        Return whether the result set contains at least one item.

        Returns
        -------
        bool
            ``True`` when ``total`` is greater than zero.
        """

        return self.total > 0

    @property
    def is_first_page(self) -> bool:
        """
        Return whether the current page is the first page.

        Returns
        -------
        bool
            ``True`` when the current page is page 1.
        """

        return self.page == 1

    @property
    def is_last_page(self) -> bool:
        """
        Return whether the current page is the final available page.

        Returns
        -------
        bool
            ``True`` when the current page is greater than or equal to the
            calculated total number of pages.
        """

        return self.page >= self.total_pages


# =============================================================================
# Paginated Result
# =============================================================================


@dataclass(slots=True, frozen=True)
class PaginatedResult(Generic[T]):
    """
    Generic paginated result.

    Attributes
    ----------
    items:
        Records belonging to the current page.

    pagination:
        Pagination metadata describing the complete result set.
    """

    items: Sequence[T]
    pagination: PaginationMeta


# =============================================================================
# Pagination Validation
# =============================================================================


def validate_pagination(
    *,
    page: int = 1,
    page_size: int = settings.DEFAULT_PAGE_SIZE,
    max_page_size: int = settings.MAX_PAGE_SIZE,
) -> PaginationParams:
    """
    Validate and normalize pagination parameters.

    Parameters
    ----------
    page:
        One-based page number. Must be greater than or equal to 1.

    page_size:
        Requested number of records per page. Must be greater than or equal
        to 1.

    max_page_size:
        Maximum permitted number of records per page.

    Returns
    -------
    PaginationParams
        Validated pagination parameters.

    Raises
    ------
    ValueError
        If ``page`` is less than 1.

    ValueError
        If ``page_size`` is less than 1.

    ValueError
        If ``max_page_size`` is less than 1.

    ValueError
        If ``page_size`` or ``max_page_size`` is not an integer.

    Notes
    -----
    A requested page size larger than ``max_page_size`` is capped at the
    configured maximum rather than rejected.

    This preserves the behavior of the existing pagination contract while
    preventing excessively large database queries.
    """

    if not isinstance(page, int):
        raise ValueError(
            "Page must be an integer.",
        )

    if not isinstance(page_size, int):
        raise ValueError(
            "Page size must be an integer.",
        )

    if not isinstance(max_page_size, int):
        raise ValueError(
            "Maximum page size must be an integer.",
        )

    if page < 1:
        raise ValueError(
            "Page must be greater than or equal to 1.",
        )

    if page_size < 1:
        raise ValueError(
            "Page size must be greater than or equal to 1.",
        )

    if max_page_size < 1:
        raise ValueError(
            "Maximum page size must be greater than or equal to 1.",
        )

    normalized_page_size = min(
        page_size,
        max_page_size,
    )

    return PaginationParams(
        page=page,
        page_size=normalized_page_size,
    )


# =============================================================================
# Pagination Metadata Construction
# =============================================================================


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
        Total number of records matching the query.

    page:
        Current one-based page number.

    page_size:
        Number of records requested per page.

    Returns
    -------
    PaginationMeta
        Calculated pagination metadata.

    Raises
    ------
    ValueError
        If ``total`` is negative.

    ValueError
        If ``page`` is less than 1.

    ValueError
        If ``page_size`` is less than 1.

    ValueError
        If any pagination numeric parameter is not an integer.

    Notes
    -----
    An empty result set reports one logical page:

        total = 0
        total_pages = 1

    This keeps the metadata predictable for clients displaying an empty
    paginated collection.
    """

    if not isinstance(total, int):
        raise ValueError(
            "Total number of records must be an integer.",
        )

    if not isinstance(page, int):
        raise ValueError(
            "Page must be an integer.",
        )

    if not isinstance(page_size, int):
        raise ValueError(
            "Page size must be an integer.",
        )

    if total < 0:
        raise ValueError(
            "Total number of records cannot be negative.",
        )

    if page < 1:
        raise ValueError(
            "Page must be greater than or equal to 1.",
        )

    if page_size < 1:
        raise ValueError(
            "Page size must be greater than or equal to 1.",
        )

    total_pages = max(
        1,
        ceil(total / page_size),
    )

    has_next = page < total_pages
    has_previous = page > 1

    return PaginationMeta(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=has_next,
        has_previous=has_previous,
        next_page=page + 1 if has_next else None,
        previous_page=page - 1 if has_previous else None,
    )


# =============================================================================
# Paginated Result Construction
# =============================================================================


def paginate(
    *,
    items: Sequence[T],
    total: int,
    page: int = 1,
    page_size: int = settings.DEFAULT_PAGE_SIZE,
) -> PaginatedResult[T]:
    """
    Build a standardized paginated result.

    Parameters
    ----------
    items:
        Records belonging to the current page.

    total:
        Total number of records matching the query.

    page:
        Current one-based page number.

    page_size:
        Requested number of records per page.

    Returns
    -------
    PaginatedResult[T]
        Generic paginated result containing the current page's items and
        pagination metadata.
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


# =============================================================================
# Dictionary Conversion
# =============================================================================


def pagination_dict(
    result: PaginatedResult[Any],
) -> dict[str, Any]:
    """
    Convert a paginated result into a nested dictionary.

    Parameters
    ----------
    result:
        Paginated result to convert.

    Returns
    -------
    dict[str, Any]
        Dictionary representation of the paginated result.

    Notes
    -----
    ``dataclasses.asdict()`` recursively converts the dataclass structure into
    ordinary Python dictionaries and collections.

    This function prepares the result for API serialization but does not
    itself guarantee that arbitrary item objects are JSON serializable.
    """

    return asdict(result)


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
    "PaginationParams",
    "PaginationMeta",
    "PaginatedResult",
    "validate_pagination",
    "build_pagination_meta",
    "paginate",
    "pagination_dict",
)