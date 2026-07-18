"""
==========================================================
Application Exceptions
==========================================================

Centralized custom exception hierarchy for the
Team Productivity Platform.

Responsibilities
----------------
- Define reusable domain exceptions
- Decouple business logic from FastAPI
- Provide structured exception metadata
- Standardize error handling across services

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Docker
- Alembic
- Pydantic v2
- Python 3.12+
==========================================================
"""

from __future__ import annotations

from http import HTTPStatus


class ApplicationError(Exception):
    """
    Base class for all application-specific exceptions.

    Parameters
    ----------
    message:
        Human-readable error message.

    error_code:
        Machine-readable application error code.

    status_code:
        HTTP status associated with this exception.
    """

    def __init__(
        self,
        message: str,
        *,
        error_code: str,
        status_code: HTTPStatus,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code

    def __str__(self) -> str:
        return self.message


# ==========================================================
# Authentication & Authorization Exceptions
# ==========================================================


class AuthenticationError(ApplicationError):
    """Raised when authentication fails."""

    def __init__(
        self,
        message: str = "Invalid authentication credentials.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            status_code=HTTPStatus.UNAUTHORIZED,
        )


class AuthorizationError(ApplicationError):
    """Raised when the authenticated user lacks permissions."""

    def __init__(
        self,
        message: str = "You do not have permission to perform this action.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            status_code=HTTPStatus.FORBIDDEN,
        )


class InactiveUserError(ApplicationError):
    """Raised when an inactive user attempts an authenticated action."""

    def __init__(
        self,
        message: str = "User account is inactive.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="INACTIVE_USER",
            status_code=HTTPStatus.FORBIDDEN,
        )


# ==========================================================
# User Exceptions
# ==========================================================


class UserNotFoundError(ApplicationError):
    """Raised when a user cannot be found."""

    def __init__(
        self,
        message: str = "User not found.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="USER_NOT_FOUND",
            status_code=HTTPStatus.NOT_FOUND,
        )


class EmailAlreadyExistsError(ApplicationError):
    """Raised when attempting to register an email that already exists."""

    def __init__(
        self,
        message: str = "Email address is already registered.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="EMAIL_ALREADY_EXISTS",
            status_code=HTTPStatus.CONFLICT,
        )


# ==========================================================
# Note Exceptions
# ==========================================================


class NoteNotFoundError(ApplicationError):
    """Raised when a note cannot be found."""

    def __init__(
        self,
        message: str = "Note not found.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="NOTE_NOT_FOUND",
            status_code=HTTPStatus.NOT_FOUND,
        )


class NoteAlreadyConvertedError(ApplicationError):
    """Raised when attempting to convert an already converted note."""

    def __init__(
        self,
        message: str = "This note has already been converted into a task.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="NOTE_ALREADY_CONVERTED",
            status_code=HTTPStatus.CONFLICT,
        )


__all__ = [
    "ApplicationError",
    "AuthenticationError",
    "AuthorizationError",
    "InactiveUserError",
    "UserNotFoundError",
    "EmailAlreadyExistsError",
    "NoteNotFoundError",
    "NoteAlreadyConvertedError",
]