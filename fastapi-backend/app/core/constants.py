"""
==========================================================
Application Constants
==========================================================

Centralized constants used throughout the Team
Productivity Platform.

Purpose
-------
Avoid hardcoded values across the codebase.

Used By
-------
✓ FastAPI
✓ Authentication
✓ Users
✓ Notes
✓ Services
✓ Repositories
✓ Middleware
✓ Exception Handlers
✓ Logging
✓ Future Modules

==========================================================
"""

from __future__ import annotations

from enum import Enum
from typing import Final

# ==========================================================
# API
# ==========================================================

API_VERSION: Final[str] = "v1"

API_V1_PREFIX: Final[str] = "/api/v1"

API_NAME: Final[str] = "Team Productivity Platform API"

# ==========================================================
# Authentication
# ==========================================================

ACCESS_TOKEN_TYPE: Final[str] = "Bearer"

AUTHORIZATION_HEADER: Final[str] = "Authorization"

PASSWORD_MIN_LENGTH: Final[int] = 8

PASSWORD_MAX_LENGTH: Final[int] = 128

# ==========================================================
# Pagination
# ==========================================================

DEFAULT_PAGE: Final[int] = 1

DEFAULT_PAGE_SIZE: Final[int] = 10

MAX_PAGE_SIZE: Final[int] = 100

# ==========================================================
# Notes
# ==========================================================

NOTE_TITLE_MAX_LENGTH: Final[int] = 200

NOTE_CONTENT_MAX_LENGTH: Final[int] = 10_000

# ==========================================================
# Users
# ==========================================================


class UserRole(str, Enum):
    """
    Available user roles.
    """

    ADMIN = "admin"
    USER = "user"


class UserStatus(str, Enum):
    """
    Available user statuses.
    """

    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"


# ==========================================================
# HTTP Messages
# ==========================================================

SUCCESS_MESSAGE: Final[str] = "Success"

CREATED_MESSAGE: Final[str] = "Created successfully"

UPDATED_MESSAGE: Final[str] = "Updated successfully"

DELETED_MESSAGE: Final[str] = "Deleted successfully"

NOT_FOUND_MESSAGE: Final[str] = "Resource not found"

UNAUTHORIZED_MESSAGE: Final[str] = "Unauthorized"

FORBIDDEN_MESSAGE: Final[str] = "Forbidden"

INVALID_CREDENTIALS_MESSAGE: Final[str] = (
    "Invalid email or password"
)

TOKEN_EXPIRED_MESSAGE: Final[str] = (
    "Access token has expired"
)

INVALID_TOKEN_MESSAGE: Final[str] = (
    "Invalid access token"
)

VALIDATION_ERROR_MESSAGE: Final[str] = (
    "Validation error"
)

SERVER_ERROR_MESSAGE: Final[str] = (
    "Internal server error"
)

# ==========================================================
# Logging
# ==========================================================

LOG_FORMAT: Final[str] = (
    "%(asctime)s | "
    "%(levelname)s | "
    "%(name)s | "
    "%(message)s"
)

LOG_DATE_FORMAT: Final[str] = "%Y-%m-%d %H:%M:%S"

# ==========================================================
# Database
# ==========================================================

DEFAULT_SCHEMA: Final[str] = "public"

# ==========================================================
# Health Check
# ==========================================================

HEALTH_STATUS: Final[str] = "healthy"

SERVICE_STATUS: Final[str] = "running"

# ==========================================================
# Content Types
# ==========================================================

APPLICATION_JSON: Final[str] = "application/json"

# ==========================================================
# Time
# ==========================================================

SECONDS_PER_MINUTE: Final[int] = 60

MINUTES_PER_HOUR: Final[int] = 60

HOURS_PER_DAY: Final[int] = 24