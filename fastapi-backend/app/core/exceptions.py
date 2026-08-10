"""
Application exceptions.

Centralized custom exception hierarchy for the
Team Productivity Platform.

Responsibilities
----------------
- Define reusable application exceptions.
- Decouple services from FastAPI-specific exceptions.
- Provide structured exception metadata.
- Standardize application error information.
- Provide safe serialization for API exception handlers.

The exception classes themselves do not perform HTTP response handling.
HTTP response conversion belongs to the centralized exception handler layer.
"""

from __future__ import annotations

from http import HTTPStatus
from typing import Any


# ============================================================================
# Base Application Exception
# ============================================================================


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
        HTTP status associated with this application error.

    details:
        Optional safe structured metadata.

    headers:
        Optional HTTP response headers required by the exception handler.
    """

    def __init__(
        self,
        message: str,
        *,
        error_code: str,
        status_code: HTTPStatus,
        details: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
    ) -> None:
        normalized_message = message.strip()
        normalized_error_code = error_code.strip()

        if not normalized_message:
            raise ValueError(
                "ApplicationError message must not be empty."
            )

        if not normalized_error_code:
            raise ValueError(
                "ApplicationError error_code must not be empty."
            )

        super().__init__(normalized_message)

        self.message = normalized_message
        self.error_code = normalized_error_code
        self.status_code = status_code
        self.details = details or {}
        self.headers = headers or {}

    def __str__(self) -> str:
        """
        Return the human-readable application error message.
        """

        return self.message

    def to_dict(self) -> dict[str, Any]:
        """
        Serialize the exception into the application's standard
        error response structure.

        HTTP status and headers are intentionally excluded because
        they are transport-level concerns handled separately by the
        exception handler.
        """

        return {
            "success": False,
            "error": {
                "code": self.error_code,
                "message": self.message,
                "details": self.details,
            },
        }


# ============================================================================
# Authentication & Authorization
# ============================================================================


class AuthenticationError(ApplicationError):
    """
    Raised when authentication fails.
    """

    def __init__(
        self,
        message: str = "Invalid authentication credentials.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            status_code=HTTPStatus.UNAUTHORIZED,
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


class AuthorizationError(ApplicationError):
    """
    Raised when an authenticated user lacks permission
    to perform an operation.
    """

    def __init__(
        self,
        message: str = (
            "You do not have permission to perform this action."
        ),
    ) -> None:
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            status_code=HTTPStatus.FORBIDDEN,
        )


class InactiveUserError(ApplicationError):
    """
    Raised when an inactive user attempts an authenticated action.
    """

    def __init__(
        self,
        message: str = "User account is inactive.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="INACTIVE_USER",
            status_code=HTTPStatus.FORBIDDEN,
        )


# ============================================================================
# User Exceptions
# ============================================================================


class UserNotFoundError(ApplicationError):
    """
    Raised when a requested user cannot be found.
    """

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
    """
    Raised when an email address is already registered.
    """

    def __init__(
        self,
        message: str = "Email address is already registered.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="EMAIL_ALREADY_EXISTS",
            status_code=HTTPStatus.CONFLICT,
        )


# ============================================================================
# Database Exceptions
# ============================================================================


class DatabaseError(ApplicationError):
    """
    Raised when a database operation fails.

    Internal database details must not be exposed through the public
    API response. Detailed database diagnostics belong in application
    logs handled by the exception layer.
    """

    def __init__(
        self,
        message: str = "Database operation failed.",
    ) -> None:
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )


# ============================================================================
# Note Exceptions
# ============================================================================


class NoteNotFoundError(ApplicationError):
    """
    Raised when a requested note cannot be found.
    """

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
    """
    Raised when a note has already been converted into a task.
    """

    def __init__(
        self,
        message: str = (
            "This note has already been converted into a task."
        ),
    ) -> None:
        super().__init__(
            message=message,
            error_code="NOTE_ALREADY_CONVERTED",
            status_code=HTTPStatus.CONFLICT,
        )


# ============================================================================
# Public Exports
# ============================================================================

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