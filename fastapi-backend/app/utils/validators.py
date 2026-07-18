"""
==========================================================
Validation Utilities
==========================================================

Reusable validation and normalization helpers for the
Team Productivity Platform.

Responsibilities
----------------
- Normalize user input
- Validate common formats
- Validate pagination parameters
- Validate password strength
- Keep validation logic reusable
- Remain framework independent

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

# ==========================================================
# Constants
# ==========================================================

EMAIL_REGEX: Final[re.Pattern[str]] = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

MIN_PASSWORD_LENGTH = 8

_WHITESPACE_REGEX: Final[re.Pattern[str]] = re.compile(r"\s+")


# ==========================================================
# String Helpers
# ==========================================================


def normalize_string(value: str) -> str:
    """
    Normalize a string by trimming leading/trailing whitespace
    and collapsing consecutive whitespace into a single space.

    Examples
    --------
    "  Hello   World  " -> "Hello World"
    """

    return _WHITESPACE_REGEX.sub(" ", value.strip())


def normalize_email(email: str) -> str:
    """
    Normalize an email address.

    The email is stripped of surrounding whitespace and
    converted to lowercase.
    """

    return normalize_string(email).lower()


# ==========================================================
# Email Validation
# ==========================================================


def is_valid_email(email: str) -> bool:
    """
    Return True if the email address has a valid format.
    """

    normalized = normalize_email(email)
    return bool(EMAIL_REGEX.fullmatch(normalized))


def validate_email(email: str) -> str:
    """
    Validate and normalize an email address.

    Returns
    -------
    str
        Normalized email.

    Raises
    ------
    ValueError
        If the email is invalid.
    """

    normalized = normalize_email(email)

    if not is_valid_email(normalized):
        raise ValueError("Invalid email address.")

    return normalized


# ==========================================================
# Password Validation
# ==========================================================


def validate_password(password: str) -> str:
    """
    Validate password strength.

    Requirements
    ------------
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    """

    if len(password) < MIN_PASSWORD_LENGTH:
        raise ValueError(
            f"Password must contain at least {MIN_PASSWORD_LENGTH} characters."
        )

    if not any(char.islower() for char in password):
        raise ValueError(
            "Password must contain at least one lowercase letter."
        )

    if not any(char.isupper() for char in password):
        raise ValueError(
            "Password must contain at least one uppercase letter."
        )

    if not any(char.isdigit() for char in password):
        raise ValueError(
            "Password must contain at least one numeric digit."
        )

    return password


# ==========================================================
# Pagination Validation
# ==========================================================


def validate_pagination_params(
    *,
    page: int = DEFAULT_PAGE,
    page_size: int = DEFAULT_PAGE_SIZE,
    max_page_size: int = MAX_PAGE_SIZE,
) -> tuple[int, int]:
    """
    Validate pagination parameters.

    Returns
    -------
    tuple[int, int]
        (page, page_size)
    """

    if page < 1:
        raise ValueError(
            "Page number must be greater than or equal to 1."
        )

    if page_size < 1:
        raise ValueError(
            "Page size must be greater than or equal to 1."
        )

    if page_size > max_page_size:
        page_size = max_page_size

    return page, page_size


# ==========================================================
# Generic Helpers
# ==========================================================


def ensure_positive_int(
    value: int,
    *,
    field_name: str = "value",
) -> int:
    """
    Ensure an integer is positive.

    Raises
    ------
    ValueError
        If the value is less than or equal to zero.
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
    Ensure a string is not empty after normalization.
    """

    normalized = normalize_string(value)

    if not normalized:
        raise ValueError(
            f"{field_name} cannot be empty."
        )

    return normalized


__all__ = [
    "DEFAULT_PAGE",
    "DEFAULT_PAGE_SIZE",
    "MAX_PAGE_SIZE",
    "MIN_PASSWORD_LENGTH",
    "normalize_string",
    "normalize_email",
    "is_valid_email",
    "validate_email",
    "validate_password",
    "validate_pagination_params",
    "ensure_positive_int",
    "ensure_non_empty",
]