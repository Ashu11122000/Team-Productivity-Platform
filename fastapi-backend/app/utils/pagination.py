"""
==========================================================
Pagination Utilities
==========================================================

Reusable pagination helpers for the Team Productivity
Platform.

Responsibilities
----------------
✓ Validate pagination parameters
✓ Calculate SQL query offsets
✓ Build pagination metadata
✓ Produce standardized paginated responses
✓ Remain framework independent

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

from dataclasses import asdict, dataclass
from math import ceil
from typing import Any, Generic, Sequence, TypeVar

from app.core.config import settings

T = TypeVar("T")


@dataclass(slots=True, frozen=True)
class PaginationParams:
    """
    Validated pagination parameters.
    """

    page: int = 1
    page_size: int = settings.DEFAULT_PAGE_SIZE

    @property
    def offset(self) -> int:
        """
        SQL OFFSET.
        """

        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """
        SQL LIMIT.
        """

        return self.page_size


@dataclass(slots=True, frozen=True)
class PaginationMeta:
    """
    Pagination metadata returned with every paginated response.
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
        return self.total > 0

    @property
    def is_first_page(self) -> bool:
        return self.page == 1

    @property
    def is_last_page(self) -> bool:
        return self.page >= self.total_pages


@dataclass(slots=True, frozen=True)
class PaginatedResult(Generic[T]):
    """
    Generic paginated result.
    """

    items: Sequence[T]
    pagination: PaginationMeta


def validate_pagination(
    *,
    page: int = 1,
    page_size: int = settings.DEFAULT_PAGE_SIZE,
    max_page_size: int = settings.MAX_PAGE_SIZE,
) -> PaginationParams:
    """
    Validate pagination parameters.
    """

    if page < 1:
        raise ValueError(
            "Page must be greater than or equal to 1."
        )

    if page_size < 1:
        raise ValueError(
            "Page size must be greater than or equal to 1."
        )

    page_size = min(page_size, max_page_size)

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
    """

    if total < 0:
        raise ValueError(
            "Total number of records cannot be negative."
        )

    total_pages = max(1, ceil(total / page_size))

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


def paginate(
    *,
    items: Sequence[T],
    total: int,
    page: int = 1,
    page_size: int = settings.DEFAULT_PAGE_SIZE,
) -> PaginatedResult[T]:
    """
    Build a standardized paginated result.
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
    Convert a paginated result into a JSON-serializable
    dictionary.
    """

    return asdict(result)


__all__ = [
    "PaginationParams",
    "PaginationMeta",
    "PaginatedResult",
    "validate_pagination",
    "build_pagination_meta",
    "paginate",
    "pagination_dict",
]