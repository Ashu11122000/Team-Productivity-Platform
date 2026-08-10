"""
==========================================================
Exception Package
==========================================================

Centralized exports for all custom application exceptions.

Responsibilities
----------------
- Expose custom exception classes through a single import path
- Hide internal package implementation details
- Maintain a clean public API for the exception layer

Example
-------
from app.exceptions import UserNotFoundError
from app.exceptions import AuthenticationError

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

__all__ = [
    "ApplicationError",
    "AuthenticationError",
    "AuthorizationError",
    "DatabaseError",
    "EmailAlreadyExistsError",
    "InactiveUserError",
    "NoteAlreadyConvertedError",
    "NoteNotFoundError",
    "UserNotFoundError",
]