"""
==========================================================
Application Constants
==========================================================

Central location for reusable constants across the
Team Productivity Platform.

Avoid hardcoding strings throughout the project.

Used by:

✓ FastAPI
✓ Authentication
✓ Users
✓ Notes
✓ Middleware
✓ Services
✓ Responses

==========================================================
"""

from enum import Enum

# ==========================================================
# API
# ==========================================================

API_VERSION = "v1"

API_PREFIX = "/api/v1"

# ==========================================================
# Authentication
# ==========================================================

ACCESS_TOKEN_TYPE = "Bearer"

ACCESS_TOKEN_NAME = "Authorization"

PASSWORD_MIN_LENGTH = 8

PASSWORD_MAX_LENGTH = 128

# ==========================================================
# Pagination
# ==========================================================

DEFAULT_PAGE = 1

DEFAULT_PAGE_SIZE = 10

MAX_PAGE_SIZE = 100

# ==========================================================
# User Roles
# ==========================================================


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


# ==========================================================
# User Status
# ==========================================================


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"


# ==========================================================
# Notes
# ==========================================================

NOTE_TITLE_MAX_LENGTH = 200

NOTE_CONTENT_MAX_LENGTH = 10000

# ==========================================================
# HTTP Messages
# ==========================================================

SUCCESS = "Success"

CREATED = "Created successfully"

UPDATED = "Updated successfully"

DELETED = "Deleted successfully"

NOT_FOUND = "Resource not found"

UNAUTHORIZED = "Unauthorized"

FORBIDDEN = "Forbidden"

INVALID_CREDENTIALS = "Invalid email or password"

TOKEN_EXPIRED = "Access token has expired"

INVALID_TOKEN = "Invalid access token"

VALIDATION_ERROR = "Validation error"

SERVER_ERROR = "Internal server error"

# ==========================================================
# Logging
# ==========================================================

LOG_FORMAT = (
    "%(asctime)s | "
    "%(levelname)s | "
    "%(name)s | "
    "%(message)s"
)

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"