"""
===============================================================================
Exception Package
===============================================================================

Public exception API for the Team Productivity Platform.

Responsibilities
----------------
• Expose application exceptions through a stable import path.
• Hide internal exception implementation details.
• Provide a clean public API for the exception layer.
• Keep exception imports consistent across the application.

Architecture
------------
Application Code
        │
        ▼
app.exceptions
        │
        ▼
app.core.exceptions
        │
        ├── ApplicationError
        ├── AuthenticationError
        ├── AuthorizationError
        ├── DatabaseError
        ├── EmailAlreadyExistsError
        ├── InactiveUserError
        ├── NoteAlreadyConvertedError
        ├── NoteNotFoundError
        └── UserNotFoundError

Example
-------
    from app.exceptions import AuthenticationError
    from app.exceptions import UserNotFoundError

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

from app.core.exceptions import (
    ApplicationError,
    AuthenticationError,
    AuthorizationError,
    DatabaseError,
    EmailAlreadyExistsError,
    InactiveUserError,
    NoteAlreadyConvertedError,
    NoteNotFoundError,
    UserNotFoundError,
)


# =============================================================================
# Public Exports
# =============================================================================

__all__ = (
    "ApplicationError",
    "AuthenticationError",
    "AuthorizationError",
    "DatabaseError",
    "EmailAlreadyExistsError",
    "InactiveUserError",
    "NoteAlreadyConvertedError",
    "NoteNotFoundError",
    "UserNotFoundError",
)