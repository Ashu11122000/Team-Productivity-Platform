"""
===============================================================================
Utilities Package
===============================================================================

Centralized public API for reusable utility functions used throughout the
Team Productivity Platform.

Responsibilities
----------------
• Provide a clean public API for utility modules.
• Re-export commonly used utility functions.
• Hide internal utility module structure where appropriate.
• Keep commonly used imports consistent across the application.
• Avoid placing implementation logic inside the package initializer.

Public Utility Groups
---------------------
Pagination
    paginate

Date & Time
    utc_now

Validation
    normalize_email
    normalize_string
    validate_pagination_params

API Responses
    success_response
    error_response

Example
-------
    from app.utils import (
        paginate,
        utc_now,
        normalize_email,
        success_response,
    )

Architecture
------------
Application Code
        │
        ▼
    app.utils
        │
        ├── datetime.py
        ├── pagination.py
        ├── responses.py
        └── validators.py

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• Pydantic v2
• PostgreSQL
• Docker
• Alembic
• Python 3.12+
"""

from __future__ import annotations

# =============================================================================
# Pagination
# =============================================================================

from app.utils.pagination import paginate


# =============================================================================
# Date & Time
# =============================================================================

from app.utils.datetime import utc_now


# =============================================================================
# Validators
# =============================================================================

from app.utils.validators import (
    normalize_email,
    normalize_string,
    validate_pagination_params,
)


# =============================================================================
# API Responses
# =============================================================================

from app.utils.responses import (
    error_response,
    success_response,
)


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
    # Pagination
    "paginate",

    # Date & Time
    "utc_now",

    # Validators
    "normalize_email",
    "normalize_string",
    "validate_pagination_params",

    # API Responses
    "success_response",
    "error_response",
)