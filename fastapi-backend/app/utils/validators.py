"""
==========================================================
Validation Utilities
==========================================================

Reusable validation and normalization helpers for the
Team Productivity Platform.

Responsibilities
----------------
✓ Normalize user input
✓ Validate common formats
✓ Validate pagination parameters
✓ Validate password strength
✓ Validate UUIDs
✓ Normalize slugs
✓ Keep validation logic reusable
✓ Remain framework independent

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Pydantic v2
- Docker
- Alembic
- Python 3.12+
==========================================================
"""

from __future__ import annotations

import re
from typing import Final
from uuid import UUID

from app.core.config import settings
from app.core.constants import (
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
)

EMAIL_REGEX: Final[re.Pattern[str]] = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)

_WHITESPACE_REGEX: Final[re.Pattern[str]] = re.compile(r"\s+")

_SLUG_REGEX: Final[re.Pattern[str]] = re.compile(
    r"[^a-z0-9]+"
)


# ==========================================================
# String Helpers
# ==========================================================


def normalize_string(value: str) -> str:
    """
    Trim whitespace and collapse multiple spaces.
    """

    return _WHITESPACE_REGEX.sub(
        " ",
        value.strip(),
    )


def normalize_email(email: str) -> str:
    """
    Normalize an email address.
    """

    return normalize_string(email).lower()


def normalize_slug(value: str) -> str:
    """
    Convert a string into a URL-friendly slug.
    """

    value = normalize_string(value).lower()

    slug = _SLUG_REGEX.sub("-", value)

    return slug.strip("-")


# ==========================================================
# Email Validation
# ==========================================================


def is_valid_email(email: str) -> bool:
    """
    Return True if an email has a valid format.
    """

    return bool(
        EMAIL_REGEX.fullmatch(
            normalize_email(email)
        )
    )


def validate_email(email: str) -> str:
    """
    Validate and normalize an email address.
    """

    email = normalize_email(email)

    if not is_valid_email(email):
        raise ValueError(
            "Invalid email address."
        )

    return email


# ==========================================================
# Password Validation
# ==========================================================


def validate_password(password: str) -> str:
    """
    Validate password complexity.
    """

    if len(password) < PASSWORD_MIN_LENGTH:
        raise ValueError(
            f"Password must contain at least {PASSWORD_MIN_LENGTH} characters."
        )

    if len(password) > PASSWORD_MAX_LENGTH:
        raise ValueError(
            f"Password cannot exceed {PASSWORD_MAX_LENGTH} characters."
        )

    if not any(c.islower() for c in password):
        raise ValueError(
            "Password must contain a lowercase letter."
        )

    if not any(c.isupper() for c in password):
        raise ValueError(
            "Password must contain an uppercase letter."
        )

    if not any(c.isdigit() for c in password):
        raise ValueError(
            "Password must contain a numeric digit."
        )

    if not any(not c.isalnum() for c in password):
        raise ValueError(
            "Password must contain a special character."
        )

    return password


# ==========================================================
# Pagination
# ==========================================================


def validate_pagination_params(
    *,
    page: int = 1,
    page_size: int = settings.DEFAULT_PAGE_SIZE,
    max_page_size: int = settings.MAX_PAGE_SIZE,
) -> tuple[int, int]:
    """
    Validate pagination parameters.
    """

    if not isinstance(page, int):
        raise TypeError(
            "Page must be an integer."
        )

    if not isinstance(page_size, int):
        raise TypeError(
            "Page size must be an integer."
        )

    if page < 1:
        raise ValueError(
            "Page must be greater than or equal to 1."
        )

    if page_size < 1:
        raise ValueError(
            "Page size must be greater than or equal to 1."
        )

    page_size = min(
        page_size,
        max_page_size,
    )

    return page, page_size


# ==========================================================
# Generic Validation
# ==========================================================


def validate_uuid(value: str) -> UUID:
    """
    Validate a UUID string.
    """

    try:
        return UUID(value)
    except ValueError as exc:
        raise ValueError(
            "Invalid UUID."
        ) from exc


def ensure_positive_int(
    value: int,
    *,
    field_name: str = "value",
) -> int:
    """
    Ensure a positive integer.
    """

    if value <= 0:
        raise ValueError(
            f"{field_name} must be greater than zero."
        )

    return value


def ensure_non_empty(
    value: str,
    *,
    field_name: str = "value",
) -> str:
    """
    Ensure a non-empty normalized string.
    """

    value = normalize_string(value)

    if not value:
        raise ValueError(
            f"{field_name} cannot be empty."
        )

    return value


__all__ = [
    "normalize_string",
    "normalize_email",
    "normalize_slug",
    "is_valid_email",
    "validate_email",
    "validate_password",
    "validate_pagination_params",
    "validate_uuid",
    "ensure_positive_int",
    "ensure_non_empty",
]