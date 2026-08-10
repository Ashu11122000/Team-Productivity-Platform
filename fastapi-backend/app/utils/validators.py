"""
===============================================================================
Validation Utilities
===============================================================================

Reusable validation and normalization helpers for the
Team Productivity Platform.

Responsibilities
----------------
• Normalize user input.
• Validate common formats.
• Validate pagination parameters.
• Validate password strength.
• Validate UUID values.
• Normalize URL-friendly slugs.
• Validate numeric values.
• Validate non-empty strings.
• Keep validation logic reusable.
• Remain independent of FastAPI and HTTP transport concerns.

Design
------
These helpers perform reusable application-level validation and normalization.

They intentionally do not raise FastAPI ``HTTPException`` or other HTTP-layer
exceptions. API/schema layers can translate validation failures into the
appropriate transport-level response.

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• PostgreSQL
• Pydantic v2
• Docker
• Alembic
• Python 3.12+
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


# =============================================================================
# Regular Expressions
# =============================================================================

EMAIL_REGEX: Final[re.Pattern[str]] = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)

_WHITESPACE_REGEX: Final[re.Pattern[str]] = re.compile(
    r"\s+"
)

_SLUG_REGEX: Final[re.Pattern[str]] = re.compile(
    r"[^a-z0-9]+"
)


# =============================================================================
# String Helpers
# =============================================================================


def normalize_string(
    value: str,
) -> str:
    """
    Trim leading/trailing whitespace and collapse consecutive whitespace.

    Parameters
    ----------
    value:
        String value to normalize.

    Returns
    -------
    str
        Normalized string.

    Examples
    --------
    ``"  Hello    World  "`` becomes:

    ``"Hello World"``
    """

    return _WHITESPACE_REGEX.sub(
        " ",
        value.strip(),
    )


def normalize_email(
    email: str,
) -> str:
    """
    Normalize an email address.

    Parameters
    ----------
    email:
        Email address to normalize.

    Returns
    -------
    str
        Trimmed, whitespace-normalized, lowercase email address.
    """

    return normalize_string(email).lower()


def normalize_slug(
    value: str,
) -> str:
    """
    Convert a string into a URL-friendly lowercase slug.

    Parameters
    ----------
    value:
        String to convert into a slug.

    Returns
    -------
    str
        Normalized URL-friendly slug.

    Examples
    --------
    ``"Hello World!"`` becomes:

    ``"hello-world"``
    """

    value = normalize_string(value).lower()

    slug = _SLUG_REGEX.sub(
        "-",
        value,
    )

    return slug.strip("-")


# =============================================================================
# Email Validation
# =============================================================================


def is_valid_email(
    email: str,
) -> bool:
    """
    Return whether an email has the expected basic format.

    Parameters
    ----------
    email:
        Email address to validate.

    Returns
    -------
    bool
        ``True`` when the email matches the application's basic email
        validation pattern.

    Notes
    -----
    This is intentionally a practical format check rather than a complete
    implementation of the entire RFC email grammar.
    """

    normalized_email = normalize_email(email)

    return bool(
        EMAIL_REGEX.fullmatch(
            normalized_email,
        )
    )


def validate_email(
    email: str,
) -> str:
    """
    Validate and normalize an email address.

    Parameters
    ----------
    email:
        Email address to validate.

    Returns
    -------
    str
        Normalized email address.

    Raises
    ------
    ValueError
        If the email does not match the application's expected format.
    """

    normalized_email = normalize_email(email)

    if not is_valid_email(normalized_email):
        raise ValueError(
            "Invalid email address."
        )

    return normalized_email


# =============================================================================
# Password Validation
# =============================================================================


def validate_password(
    password: str,
) -> str:
    """
    Validate password complexity.

    Parameters
    ----------
    password:
        Password to validate.

    Returns
    -------
    str
        The original password when validation succeeds.

    Raises
    ------
    ValueError
        If the password violates any configured password requirement.

    Requirements
    ------------
    • Minimum configured length.
    • Maximum configured length.
    • At least one lowercase letter.
    • At least one uppercase letter.
    • At least one numeric digit.
    • At least one special character.

    Notes
    -----
    The password is intentionally returned unchanged. Password normalization
    must not silently modify a user's password because that would alter the
    credential being authenticated.
    """

    if len(password) < PASSWORD_MIN_LENGTH:
        raise ValueError(
            f"Password must contain at least "
            f"{PASSWORD_MIN_LENGTH} characters."
        )

    if len(password) > PASSWORD_MAX_LENGTH:
        raise ValueError(
            f"Password cannot exceed "
            f"{PASSWORD_MAX_LENGTH} characters."
        )

    if not any(
        character.islower()
        for character in password
    ):
        raise ValueError(
            "Password must contain a lowercase letter."
        )

    if not any(
        character.isupper()
        for character in password
    ):
        raise ValueError(
            "Password must contain an uppercase letter."
        )

    if not any(
        character.isdigit()
        for character in password
    ):
        raise ValueError(
            "Password must contain a numeric digit."
        )

    if not any(
        not character.isalnum()
        for character in password
    ):
        raise ValueError(
            "Password must contain a special character."
        )

    return password


# =============================================================================
# Pagination Validation
# =============================================================================


def validate_pagination_params(
    *,
    page: int = 1,
    page_size: int = settings.DEFAULT_PAGE_SIZE,
    max_page_size: int = settings.MAX_PAGE_SIZE,
) -> tuple[int, int]:
    """
    Validate and normalize pagination parameters.

    Parameters
    ----------
    page:
        One-based page number.

    page_size:
        Requested number of records per page.

    max_page_size:
        Maximum permitted page size.

    Returns
    -------
    tuple[int, int]
        Validated page and normalized page size.

    Raises
    ------
    TypeError
        If any numeric pagination parameter is not an integer.

    ValueError
        If page is less than 1.

    ValueError
        If page size is less than 1.

    ValueError
        If maximum page size is less than 1.

    Notes
    -----
    A requested page size greater than ``max_page_size`` is capped at the
    configured maximum.

    This function intentionally mirrors the pagination behavior provided by
    ``app.utils.pagination.validate_pagination()``.
    """

    if isinstance(page, bool) or not isinstance(page, int):
        raise TypeError(
            "Page must be an integer."
        )

    if (
        isinstance(page_size, bool)
        or not isinstance(page_size, int)
    ):
        raise TypeError(
            "Page size must be an integer."
        )

    if (
        isinstance(max_page_size, bool)
        or not isinstance(max_page_size, int)
    ):
        raise TypeError(
            "Maximum page size must be an integer."
        )

    if page < 1:
        raise ValueError(
            "Page must be greater than or equal to 1."
        )

    if page_size < 1:
        raise ValueError(
            "Page size must be greater than or equal to 1."
        )

    if max_page_size < 1:
        raise ValueError(
            "Maximum page size must be greater than or equal to 1."
        )

    normalized_page_size = min(
        page_size,
        max_page_size,
    )

    return page, normalized_page_size


# =============================================================================
# Generic Validation
# =============================================================================


def validate_uuid(
    value: str,
) -> UUID:
    """
    Validate and convert a UUID string.

    Parameters
    ----------
    value:
        UUID string to validate.

    Returns
    -------
    UUID
        Parsed UUID object.

    Raises
    ------
    TypeError
        If ``value`` is not a string.

    ValueError
        If ``value`` is not a valid UUID representation.
    """

    if not isinstance(value, str):
        raise TypeError(
            "UUID value must be a string."
        )

    try:
        return UUID(value)
    except (ValueError, AttributeError) as exc:
        raise ValueError(
            "Invalid UUID."
        ) from exc


def ensure_positive_int(
    value: int,
    *,
    field_name: str = "value",
) -> int:
    """
    Ensure that a value is a positive integer.

    Parameters
    ----------
    value:
        Value to validate.

    field_name:
        Human-readable field name used in the validation error.

    Returns
    -------
    int
        The original value when validation succeeds.

    Raises
    ------
    TypeError
        If ``value`` is not an integer.

    ValueError
        If ``value`` is less than or equal to zero.
    """

    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(
            f"{field_name} must be an integer."
        )

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
    Ensure that a string is non-empty after normalization.

    Parameters
    ----------
    value:
        String to validate.

    field_name:
        Human-readable field name used in the validation error.

    Returns
    -------
    str
        Normalized non-empty string.

    Raises
    ------
    TypeError
        If ``value`` is not a string.

    ValueError
        If the normalized string is empty.
    """

    if not isinstance(value, str):
        raise TypeError(
            f"{field_name} must be a string."
        )

    normalized_value = normalize_string(value)

    if not normalized_value:
        raise ValueError(
            f"{field_name} cannot be empty."
        )

    return normalized_value


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
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
)