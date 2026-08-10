"""
Application constants.

Centralized application-level constants used throughout the
Team Productivity Platform.

Only values that are environment-independent belong here.

Environment-dependent values such as database URLs, JWT secrets,
CORS origins, service URLs, feature flags and infrastructure
configuration belong in ``app.core.config``.
"""

from __future__ import annotations

from enum import Enum
from typing import Final


# ============================================================================
# API
# ============================================================================

API_VERSION: Final[str] = "v1"


# ============================================================================
# Authentication
# ============================================================================


class TokenType(str, Enum):
    """
    Supported HTTP authentication scheme.
    """

    BEARER = "Bearer"


ACCESS_TOKEN_TYPE: Final[str] = "access"

REFRESH_TOKEN_TYPE: Final[str] = "refresh"

AUTHORIZATION_HEADER: Final[str] = "Authorization"

PASSWORD_MIN_LENGTH: Final[int] = 8

PASSWORD_MAX_LENGTH: Final[int] = 128


# ============================================================================
# Pagination
# ============================================================================

DEFAULT_PAGE: Final[int] = 1


# ============================================================================
# Notes
# ============================================================================

NOTE_TITLE_MAX_LENGTH: Final[int] = 200

NOTE_CONTENT_MAX_LENGTH: Final[int] = 10_000


# ============================================================================
# Users
# ============================================================================


class UserRole(str, Enum):
    """
    Supported application user roles.
    """

    ADMIN = "admin"
    USER = "user"


class UserStatus(str, Enum):
    """
    Supported application user statuses.
    """

    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"


# ============================================================================
# JWT Claims
# ============================================================================

JWT_SUBJECT: Final[str] = "sub"

JWT_ISSUER_CLAIM: Final[str] = "iss"

JWT_AUDIENCE_CLAIM: Final[str] = "aud"

JWT_EXPIRES_CLAIM: Final[str] = "exp"


# ============================================================================
# HTTP Headers
# ============================================================================

CONTENT_TYPE_HEADER: Final[str] = "Content-Type"

ACCEPT_HEADER: Final[str] = "Accept"

LOCATION_HEADER: Final[str] = "Location"

CACHE_CONTROL_HEADER: Final[str] = "Cache-Control"


# ============================================================================
# Content Types
# ============================================================================

APPLICATION_JSON: Final[str] = "application/json"

TEXT_PLAIN: Final[str] = "text/plain"

APPLICATION_PDF: Final[str] = "application/pdf"

IMAGE_JPEG: Final[str] = "image/jpeg"

IMAGE_PNG: Final[str] = "image/png"

IMAGE_WEBP: Final[str] = "image/webp"


# ============================================================================
# HTTP / Application Messages
# ============================================================================

SUCCESS_MESSAGE: Final[str] = "Success"

CREATED_MESSAGE: Final[str] = "Created successfully"

UPDATED_MESSAGE: Final[str] = "Updated successfully"

DELETED_MESSAGE: Final[str] = "Deleted successfully"

NOT_FOUND_MESSAGE: Final[str] = "Resource not found"

UNAUTHORIZED_MESSAGE: Final[str] = "Unauthorized"

FORBIDDEN_MESSAGE: Final[str] = "Forbidden"

INVALID_CREDENTIALS_MESSAGE: Final[str] = "Invalid email or password"

TOKEN_EXPIRED_MESSAGE: Final[str] = "Access token has expired"

INVALID_TOKEN_MESSAGE: Final[str] = "Invalid access token"

VALIDATION_ERROR_MESSAGE: Final[str] = "Validation error"

SERVER_ERROR_MESSAGE: Final[str] = "Internal server error"


# ============================================================================
# Database
# ============================================================================

DEFAULT_SCHEMA: Final[str] = "public"

UTC_TIMEZONE: Final[str] = "UTC"


# ============================================================================
# Health
# ============================================================================

HEALTH_STATUS: Final[str] = "healthy"

SERVICE_STATUS: Final[str] = "running"


# ============================================================================
# Time / Size
# ============================================================================

SECONDS_PER_MINUTE: Final[int] = 60

MINUTES_PER_HOUR: Final[int] = 60

HOURS_PER_DAY: Final[int] = 24

BYTES_PER_MB: Final[int] = 1024 * 1024


# ============================================================================
# Public Exports
# ============================================================================

__all__ = [
    "ACCEPT_HEADER",
    "ACCESS_TOKEN_TYPE",
    "APPLICATION_JSON",
    "APPLICATION_PDF",
    "AUTHORIZATION_HEADER",
    "BYTES_PER_MB",
    "CACHE_CONTROL_HEADER",
    "CONTENT_TYPE_HEADER",
    "CREATED_MESSAGE",
    "DEFAULT_PAGE",
    "DEFAULT_SCHEMA",
    "DELETED_MESSAGE",
    "FORBIDDEN_MESSAGE",
    "HEALTH_STATUS",
    "HOURS_PER_DAY",
    "IMAGE_JPEG",
    "IMAGE_PNG",
    "IMAGE_WEBP",
    "INVALID_CREDENTIALS_MESSAGE",
    "INVALID_TOKEN_MESSAGE",
    "JWT_AUDIENCE_CLAIM",
    "JWT_EXPIRES_CLAIM",
    "JWT_ISSUER_CLAIM",
    "JWT_SUBJECT",
    "LOCATION_HEADER",
    "MINUTES_PER_HOUR",
    "NOT_FOUND_MESSAGE",
    "NOTE_CONTENT_MAX_LENGTH",
    "NOTE_TITLE_MAX_LENGTH",
    "PASSWORD_MAX_LENGTH",
    "PASSWORD_MIN_LENGTH",
    "REFRESH_TOKEN_TYPE",
    "SECONDS_PER_MINUTE",
    "SERVER_ERROR_MESSAGE",
    "SERVICE_STATUS",
    "SUCCESS_MESSAGE",
    "TEXT_PLAIN",
    "TOKEN_EXPIRED_MESSAGE",
    "TokenType",
    "UNAUTHORIZED_MESSAGE",
    "UPDATED_MESSAGE",
    "UTC_TIMEZONE",
    "UserRole",
    "UserStatus",
    "VALIDATION_ERROR_MESSAGE",
    "API_VERSION",
]