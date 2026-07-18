"""
==========================================================
Utilities Package
==========================================================

Centralized exports for reusable utility functions used
throughout the Team Productivity Platform.

Responsibilities
----------------
- Provide a clean public API for utility modules
- Re-export commonly used helper functions
- Hide the internal package structure
- Keep imports consistent across the application

Example
-------
from app.utils import (
    paginate,
    utc_now,
    normalize_email,
    success_response,
)

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- PostgreSQL
- Docker
- Alembic
- Python 3.12+
==========================================================
"""

# Pagination
from app.utils.pagination import paginate

# Date & Time
from app.utils.datetime import utc_now

# Validators
from app.utils.validators import (
    normalize_email,
    normalize_string,
    validate_pagination_params,
)

# API Responses
from app.utils.responses import (
    error_response,
    success_response,
)

__all__ = [
    # Pagination
    "paginate",
    # Date & Time
    "utc_now",
    # Validators
    "normalize_email",
    "normalize_string",
    "validate_pagination_params",
    # Responses
    "success_response",
    "error_response",
]