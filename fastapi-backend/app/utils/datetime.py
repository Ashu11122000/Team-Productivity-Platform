"""
===============================================================================
Date & Time Utilities
===============================================================================

Centralized UTC-aware date and time utilities for the
Team Productivity Platform.

Responsibilities
----------------
• Provide timezone-aware UTC datetimes.
• Provide the current UTC date.
• Provide Unix timestamps.
• Normalize datetimes to UTC.
• Format datetimes consistently as ISO-8601 strings.
• Parse ISO-8601 datetime strings.
• Convert Unix timestamps to UTC datetimes.
• Add seconds, minutes, hours, and days to datetimes.
• Calculate differences between datetimes.
• Calculate UTC day boundaries.
• Check expiration, future, and past datetime states.

Timezone Policy
---------------
The application uses UTC as its canonical timezone.

Naive datetimes passed to ``ensure_utc()`` are assumed to already represent
UTC. They are therefore assigned the UTC timezone rather than converted from
the machine's local timezone.

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

from datetime import UTC, date, datetime, time, timedelta


# =============================================================================
# Current UTC Date / Time
# =============================================================================


def utc_now() -> datetime:
    """
    Return the current timezone-aware UTC datetime.

    Returns
    -------
    datetime
        Current UTC datetime with ``tzinfo=UTC``.
    """

    return datetime.now(UTC)


def utc_today() -> date:
    """
    Return the current UTC calendar date.

    Returns
    -------
    date
        Current date according to UTC.
    """

    return utc_now().date()


def utc_timestamp() -> int:
    """
    Return the current UTC Unix timestamp.

    Returns
    -------
    int
        Number of seconds elapsed since the Unix epoch.

    Notes
    -----
    The returned value is an integer number of seconds, matching the
    established timestamp contract used by this utility module.
    """

    return int(utc_now().timestamp())


# =============================================================================
# UTC Normalization
# =============================================================================


def ensure_utc(
    dt: datetime,
) -> datetime:
    """
    Return a timezone-aware UTC datetime.

    Parameters
    ----------
    dt:
        Datetime to normalize.

    Returns
    -------
    datetime
        Timezone-aware UTC datetime.

    Notes
    -----
    Naive datetimes are assumed to already represent UTC.

    They are assigned:

        tzinfo=UTC

    rather than being interpreted as local machine time.

    Timezone-aware datetimes are converted to UTC.
    """

    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)

    return dt.astimezone(UTC)


# =============================================================================
# ISO-8601 Conversion
# =============================================================================


def to_iso(
    dt: datetime,
) -> str:
    """
    Convert a datetime to an ISO-8601 UTC string.

    Parameters
    ----------
    dt:
        Datetime to convert.

    Returns
    -------
    str
        ISO-8601 UTC representation using the ``Z`` suffix.

    Examples
    --------
    ``2026-07-29T14:30:00Z``
    """

    return (
        ensure_utc(dt)
        .isoformat(timespec="seconds")
        .replace("+00:00", "Z")
    )


def from_iso(
    value: str,
) -> datetime:
    """
    Parse an ISO-8601 datetime string into a UTC-aware datetime.

    Parameters
    ----------
    value:
        ISO-8601 datetime string.

    Returns
    -------
    datetime
        Timezone-aware UTC datetime.

    Raises
    ------
    ValueError
        If ``value`` is not a valid ISO-8601 datetime string.

    Examples
    --------
    Supported UTC forms include:

        2026-07-29T10:00:00Z
        2026-07-29T10:00:00+00:00

    Notes
    -----
    A trailing ``Z`` is normalized to ``+00:00`` before parsing so that
    the resulting datetime is explicitly timezone-aware.
    """

    normalized_value = value.strip()

    if normalized_value.endswith(("Z", "z")):
        normalized_value = (
            normalized_value[:-1] + "+00:00"
        )

    dt = datetime.fromisoformat(normalized_value)

    return ensure_utc(dt)


# =============================================================================
# Unix Timestamp Conversion
# =============================================================================


def from_timestamp(
    timestamp: int | float,
) -> datetime:
    """
    Convert a Unix timestamp to a timezone-aware UTC datetime.

    Parameters
    ----------
    timestamp:
        Unix timestamp expressed in seconds.

    Returns
    -------
    datetime
        Corresponding timezone-aware UTC datetime.
    """

    return datetime.fromtimestamp(
        timestamp,
        tz=UTC,
    )


# =============================================================================
# Datetime Arithmetic
# =============================================================================


def add_seconds(
    dt: datetime,
    seconds: int,
) -> datetime:
    """
    Return a UTC datetime with the specified number of seconds added.

    Parameters
    ----------
    dt:
        Starting datetime.

    seconds:
        Number of seconds to add. Negative values subtract seconds.

    Returns
    -------
    datetime
        Resulting timezone-aware UTC datetime.
    """

    return ensure_utc(dt) + timedelta(
        seconds=seconds,
    )


def add_minutes(
    dt: datetime,
    minutes: int,
) -> datetime:
    """
    Return a UTC datetime with the specified number of minutes added.

    Parameters
    ----------
    dt:
        Starting datetime.

    minutes:
        Number of minutes to add. Negative values subtract minutes.

    Returns
    -------
    datetime
        Resulting timezone-aware UTC datetime.
    """

    return ensure_utc(dt) + timedelta(
        minutes=minutes,
    )


def add_hours(
    dt: datetime,
    hours: int,
) -> datetime:
    """
    Return a UTC datetime with the specified number of hours added.

    Parameters
    ----------
    dt:
        Starting datetime.

    hours:
        Number of hours to add. Negative values subtract hours.

    Returns
    -------
    datetime
        Resulting timezone-aware UTC datetime.
    """

    return ensure_utc(dt) + timedelta(
        hours=hours,
    )


def add_days(
    dt: datetime,
    days: int,
) -> datetime:
    """
    Return a UTC datetime with the specified number of days added.

    Parameters
    ----------
    dt:
        Starting datetime.

    days:
        Number of days to add. Negative values subtract days.

    Returns
    -------
    datetime
        Resulting timezone-aware UTC datetime.
    """

    return ensure_utc(dt) + timedelta(
        days=days,
    )


# =============================================================================
# Datetime Differences
# =============================================================================


def seconds_between(
    start: datetime,
    end: datetime,
) -> int:
    """
    Return the number of whole seconds between two datetimes.

    Parameters
    ----------
    start:
        Starting datetime.

    end:
        Ending datetime.

    Returns
    -------
    int
        Difference between ``end`` and ``start`` in whole seconds.

    Notes
    -----
    The result may be negative when ``end`` occurs before ``start``.
    """

    start_utc = ensure_utc(start)
    end_utc = ensure_utc(end)

    return int(
        (end_utc - start_utc).total_seconds(),
    )


def minutes_between(
    start: datetime,
    end: datetime,
) -> int:
    """
    Return the number of whole minutes between two datetimes.

    Parameters
    ----------
    start:
        Starting datetime.

    end:
        Ending datetime.

    Returns
    -------
    int
        Difference between ``end`` and ``start`` in whole minutes.

    Notes
    -----
    The calculation is based on ``seconds_between()`` and therefore preserves
    the established whole-minute behavior of this utility module.
    """

    return seconds_between(
        start,
        end,
    ) // 60


# =============================================================================
# UTC Day Boundaries
# =============================================================================


def start_of_day(
    dt: datetime,
) -> datetime:
    """
    Return the start of the UTC calendar day containing ``dt``.

    Parameters
    ----------
    dt:
        Datetime whose UTC calendar day should be used.

    Returns
    -------
    datetime
        ``00:00:00`` UTC for the corresponding day.
    """

    normalized_dt = ensure_utc(dt)

    return datetime.combine(
        normalized_dt.date(),
        time.min,
        tzinfo=UTC,
    )


def end_of_day(
    dt: datetime,
) -> datetime:
    """
    Return the end of the UTC calendar day containing ``dt``.

    Parameters
    ----------
    dt:
        Datetime whose UTC calendar day should be used.

    Returns
    -------
    datetime
        ``23:59:59.999999`` UTC for the corresponding day.
    """

    normalized_dt = ensure_utc(dt)

    return datetime.combine(
        normalized_dt.date(),
        time.max,
        tzinfo=UTC,
    )


# =============================================================================
# Datetime State Checks
# =============================================================================


def is_expired(
    expires_at: datetime,
) -> bool:
    """
    Return whether a datetime has expired.

    Parameters
    ----------
    expires_at:
        Expiration datetime.

    Returns
    -------
    bool
        ``True`` when the expiration datetime is less than or equal to the
        current UTC datetime.
    """

    return ensure_utc(expires_at) <= utc_now()


def is_future(
    dt: datetime,
) -> bool:
    """
    Return whether a datetime occurs in the future.

    Parameters
    ----------
    dt:
        Datetime to evaluate.

    Returns
    -------
    bool
        ``True`` when the datetime is later than the current UTC datetime.
    """

    return ensure_utc(dt) > utc_now()


def is_past(
    dt: datetime,
) -> bool:
    """
    Return whether a datetime occurs in the past.

    Parameters
    ----------
    dt:
        Datetime to evaluate.

    Returns
    -------
    bool
        ``True`` when the datetime is earlier than the current UTC datetime.
    """

    return ensure_utc(dt) < utc_now()


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
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
)