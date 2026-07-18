"""
==========================================================
Date & Time Utilities
==========================================================

Centralized UTC-aware date and time utilities for the
Team Productivity Platform.

Responsibilities
----------------
- Provide timezone-aware UTC datetimes
- Format datetimes consistently
- Parse ISO 8601 strings
- Convert timestamps
- Check expiration times
- Calculate time differences

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

from datetime import UTC, date, datetime, timedelta


def utc_now() -> datetime:
    """
    Return the current timezone-aware UTC datetime.
    """

    return datetime.now(UTC)


def utc_today() -> date:
    """
    Return the current UTC date.
    """

    return utc_now().date()


def utc_timestamp() -> int:
    """
    Return the current UTC Unix timestamp.
    """

    return int(utc_now().timestamp())


def to_iso(dt: datetime) -> str:
    """
    Convert a datetime into an ISO-8601 string.

    Naive datetimes are assumed to be UTC.
    """

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=UTC)

    return dt.astimezone(UTC).isoformat()


def from_iso(value: str) -> datetime:
    """
    Parse an ISO-8601 datetime string.

    Naive values are assumed to be UTC.
    """

    dt = datetime.fromisoformat(value)

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=UTC)

    return dt.astimezone(UTC)


def ensure_utc(dt: datetime) -> datetime:
    """
    Convert any datetime into a timezone-aware UTC datetime.
    """

    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)

    return dt.astimezone(UTC)


def add_minutes(
    dt: datetime,
    minutes: int,
) -> datetime:
    """
    Return a datetime with minutes added.
    """

    return ensure_utc(dt) + timedelta(minutes=minutes)


def add_hours(
    dt: datetime,
    hours: int,
) -> datetime:
    """
    Return a datetime with hours added.
    """

    return ensure_utc(dt) + timedelta(hours=hours)


def add_days(
    dt: datetime,
    days: int,
) -> datetime:
    """
    Return a datetime with days added.
    """

    return ensure_utc(dt) + timedelta(days=days)


def seconds_between(
    start: datetime,
    end: datetime,
) -> int:
    """
    Return the difference between two datetimes in seconds.
    """

    return int(
        (ensure_utc(end) - ensure_utc(start)).total_seconds()
    )


def is_expired(
    expires_at: datetime,
) -> bool:
    """
    Determine whether a datetime has passed.
    """

    return ensure_utc(expires_at) <= utc_now()


def is_future(
    dt: datetime,
) -> bool:
    """
    Return True if the datetime is in the future.
    """

    return ensure_utc(dt) > utc_now()


def is_past(
    dt: datetime,
) -> bool:
    """
    Return True if the datetime is in the past.
    """

    return ensure_utc(dt) < utc_now()


__all__ = [
    "utc_now",
    "utc_today",
    "utc_timestamp",
    "to_iso",
    "from_iso",
    "ensure_utc",
    "add_minutes",
    "add_hours",
    "add_days",
    "seconds_between",
    "is_expired",
    "is_future",
    "is_past",
]