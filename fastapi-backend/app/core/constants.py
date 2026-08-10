"""
==========================================================
Application Constants
==========================================================

Centralized compile-time constants used throughout the
Team Productivity Platform.

Only values that are NOT environment-specific belong here.

Environment-dependent values belong in app.core.config.

==========================================================
"""

from __future__ import annotations

from enum import Enum
from typing import Final

# ==========================================================
# API
# ==========================================================

API_VERSION: Final[str] = "v1"

# =============================================================================
# API Configuration
# =============================================================================

API_PREFIX: str = "/api"
API_VERSION: str = "v1"
API_V1_PREFIX: str = f"{API_PREFIX}/{API_VERSION}"
# ==========================================================
# Authentication
# ==========================================================

class TokenType(str, Enum):
    BEARER = "Bearer"


ACCESS_TOKEN_TYPE: Final[str] = "access"
REFRESH_TOKEN_TYPE: Final[str] = "refresh"

AUTHORIZATION_HEADER: Final[str] = "Authorization"

PASSWORD_MIN_LENGTH: Final[int] = 8
PASSWORD_MAX_LENGTH: Final[int] = 128

# ==========================================================
# Pagination
# ==========================================================

DEFAULT_PAGE: Final[int] = 1

# ==========================================================
# Notes
# ==========================================================

NOTE_TITLE_MAX_LENGTH: Final[int] = 200
NOTE_CONTENT_MAX_LENGTH: Final[int] = 10_000

# ==========================================================
# Users
# ==========================================================

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"

# ==========================================================
# JWT Claims
# ==========================================================

JWT_SUBJECT: Final[str] = "sub"
JWT_ISSUER_CLAIM: Final[str] = "iss"
JWT_AUDIENCE_CLAIM: Final[str] = "aud"
JWT_EXPIRES_CLAIM: Final[str] = "exp"

# ==========================================================
# HTTP Headers
# ==========================================================

CONTENT_TYPE_HEADER: Final[str] = "Content-Type"
ACCEPT_HEADER: Final[str] = "Accept"
LOCATION_HEADER: Final[str] = "Location"
CACHE_CONTROL_HEADER: Final[str] = "Cache-Control"

# ==========================================================
# Content Types
# ==========================================================

APPLICATION_JSON: Final[str] = "application/json"
TEXT_PLAIN: Final[str] = "text/plain"
APPLICATION_PDF: Final[str] = "application/pdf"
IMAGE_JPEG: Final[str] = "image/jpeg"
IMAGE_PNG: Final[str] = "image/png"
IMAGE_WEBP: Final[str] = "image/webp"

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
INVALID_CREDENTIALS_MESSAGE: Final[str] = "Invalid email or password"
TOKEN_EXPIRED_MESSAGE: Final[str] = "Access token has expired"
INVALID_TOKEN_MESSAGE: Final[str] = "Invalid access token"
VALIDATION_ERROR_MESSAGE: Final[str] = "Validation error"
SERVER_ERROR_MESSAGE: Final[str] = "Internal server error"

# ==========================================================
# Database
# ==========================================================

DEFAULT_SCHEMA: Final[str] = "public"
UTC_TIMEZONE: Final[str] = "UTC"

# ==========================================================
# Health
# ==========================================================

HEALTH_STATUS: Final[str] = "healthy"
SERVICE_STATUS: Final[str] = "running"

# ==========================================================
# Time
# ==========================================================

SECONDS_PER_MINUTE: Final[int] = 60
MINUTES_PER_HOUR: Final[int] = 60
HOURS_PER_DAY: Final[int] = 24
BYTES_PER_MB: Final[int] = 1024 * 1024

__all__ = [
    "API_VERSION",
    "TokenType",
    "AUTHORIZATION_HEADER",
    "PASSWORD_MIN_LENGTH",
    "PASSWORD_MAX_LENGTH",
    "DEFAULT_PAGE",
    "NOTE_TITLE_MAX_LENGTH",
    "NOTE_CONTENT_MAX_LENGTH",
    "UserRole",
    "UserStatus",
    "JWT_SUBJECT",
    "JWT_ISSUER_CLAIM",
    "JWT_AUDIENCE_CLAIM",
    "JWT_EXPIRES_CLAIM",
    "CONTENT_TYPE_HEADER",
    "ACCEPT_HEADER",
    "LOCATION_HEADER",
    "CACHE_CONTROL_HEADER",
    "APPLICATION_JSON",
    "TEXT_PLAIN",
    "APPLICATION_PDF",
    "IMAGE_JPEG",
    "IMAGE_PNG",
    "IMAGE_WEBP",
    "SUCCESS_MESSAGE",
    "CREATED_MESSAGE",
    "UPDATED_MESSAGE",
    "DELETED_MESSAGE",
    "NOT_FOUND_MESSAGE",
    "UNAUTHORIZED_MESSAGE",
    "FORBIDDEN_MESSAGE",
    "INVALID_CREDENTIALS_MESSAGE",
    "TOKEN_EXPIRED_MESSAGE",
    "INVALID_TOKEN_MESSAGE",
    "VALIDATION_ERROR_MESSAGE",
    "SERVER_ERROR_MESSAGE",
    "DEFAULT_SCHEMA",
    "UTC_TIMEZONE",
    "HEALTH_STATUS",
    "SERVICE_STATUS",
    "SECONDS_PER_MINUTE",
    "MINUTES_PER_HOUR",
    "HOURS_PER_DAY",
    "BYTES_PER_MB",
    "TokenType",
    "ACCESS_TOKEN_TYPE",
    "REFRESH_TOKEN_TYPE",
    "AUTHORIZATION_HEADER",
]