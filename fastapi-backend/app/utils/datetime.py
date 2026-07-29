"""
==========================================================
Date & Time Utilities
==========================================================

Centralized UTC-aware date and time utilities for the
Team Productivity Platform.

Responsibilities
----------------
✓ Provide timezone-aware UTC datetimes
✓ Format datetimes consistently
✓ Parse ISO 8601 strings
✓ Convert Unix timestamps
✓ Check expiration times
✓ Calculate time differences
✓ Normalize datetimes to UTC

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

from datetime import UTC, date, datetime, time, timedelta


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


def ensure_utc(dt: datetime) -> datetime:
    """
    Return a timezone-aware UTC datetime.

    Naive datetimes are assumed to already represent UTC.
    """

    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)

    return dt.astimezone(UTC)


def to_iso(dt: datetime) -> str:
    """
    Convert a datetime to an ISO-8601 UTC string.

    Example
    -------
    2026-07-29T14:30:00Z
    """

    return (
        ensure_utc(dt)
        .isoformat(timespec="seconds")
        .replace("+00:00", "Z")
    )


def from_iso(value: str) -> datetime:
    """
    Parse an ISO-8601 datetime string into UTC.

    Supports both:
    - 2026-07-29T10:00:00Z
    - 2026-07-29T10:00:00+00:00
    """

    value = value.replace("Z", "+00:00")

    dt = datetime.fromisoformat(value)

    return ensure_utc(dt)


def from_timestamp(timestamp: int | float) -> datetime:
    """
    Convert a Unix timestamp to a UTC datetime.
    """

    return datetime.fromtimestamp(timestamp, tz=UTC)


def add_seconds(
    dt: datetime,
    seconds: int,
) -> datetime:
    """
    Return a datetime with seconds added.
    """

    return ensure_utc(dt) + timedelta(seconds=seconds)


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
    Return the number of seconds between two datetimes.
    """

    return int(
        (ensure_utc(end) - ensure_utc(start)).total_seconds()
    )


def minutes_between(
    start: datetime,
    end: datetime,
) -> int:
    """
    Return the number of whole minutes between two datetimes.
    """

    return seconds_between(start, end) // 60


def start_of_day(dt: datetime) -> datetime:
    """
    Return 00:00:00 UTC for the given datetime.
    """

    dt = ensure_utc(dt)

    return datetime.combine(
        dt.date(),
        time.min,
        tzinfo=UTC,
    )


def end_of_day(dt: datetime) -> datetime:
    """
    Return 23:59:59.999999 UTC for the given datetime.
    """

    dt = ensure_utc(dt)

    return datetime.combine(
        dt.date(),
        time.max,
        tzinfo=UTC,
    )


def is_expired(
    expires_at: datetime,
) -> bool:
    """
    Return True if the supplied datetime has expired.
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
    "ensure_utc",
    "to_iso",
    "from_iso",
    "from_timestamp",
    "add_seconds",
    "add_minutes",
    "add_hours",
    "add_days",
    "seconds_between",
    "minutes_between",
    "start_of_day",
    "end_of_day",
    "is_expired",
    "is_future",
    "is_past",
]