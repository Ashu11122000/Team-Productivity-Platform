"""
===============================================================================
Authentication Schemas
===============================================================================

Pydantic schemas for authentication-related API operations.

Responsibilities
----------------
• User registration.
• User login.
• Authentication response.
• Password change.
• Password reset.
• Email verification.
• Refresh token support.
• Logout response.

Security
--------
Password-strength validation is centralized in ``app.utils.validators``.
Authentication schemas validate request structure and input constraints;
authentication logic remains in the security/service layers.

Compatible With
---------------
• FastAPI
• Pydantic v2
• JWT Authentication
• Python 3.12+
"""

from __future__ import annotations

from pydantic import EmailStr, Field, field_validator

from app.core.constants import (
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
)
from app.schemas.base import BaseSchema
from app.schemas.common import MessageResponse
from app.schemas.token import TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.utils.validators import validate_password


# =============================================================================
# Login Request
# =============================================================================


class LoginRequest(BaseSchema):
    """
    User login request.

    Password-strength validation is intentionally not performed here because
    login verifies an existing credential rather than creating a new one.
    """

    email: EmailStr = Field(
        ...,
        description="Registered email address.",
    )

    password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="User password.",
    )


# =============================================================================
# Registration Request
# =============================================================================


class RegisterRequest(UserCreate):
    """
    User registration request.

    Reuses ``UserCreate`` so registration follows the same validation rules
    as the user-management layer.
    """

    pass


# =============================================================================
# Authentication Response
# =============================================================================


class AuthResponse(TokenResponse):
    """
    Authentication response returned after successful login or registration.
    """

    user: UserResponse = Field(
        ...,
        description="Authenticated user.",
    )


# =============================================================================
# Change Password
# =============================================================================


class ChangePasswordRequest(BaseSchema):
    """
    Change-password request.

    The current password is verified by the authentication/service layer.

    Only the new password is subjected to password-strength validation.
    """

    current_password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="Current password.",
    )

    new_password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="New password.",
    )

    @field_validator("new_password")
    @classmethod
    def validate_new_password(
        cls,
        value: str,
    ) -> str:
        """
        Validate the new password using the centralized password policy.
        """

        return validate_password(value)


# =============================================================================
# Forgot Password
# =============================================================================


class ForgotPasswordRequest(BaseSchema):
    """
    Forgot-password request.

    The authentication/service layer handles reset-token generation and
    delivery.
    """

    email: EmailStr = Field(
        ...,
        description="Registered email address.",
    )


# =============================================================================
# Reset Password
# =============================================================================


class ResetPasswordRequest(BaseSchema):
    """
    Reset-password request.

    The reset token is validated by the authentication/service layer.
    """

    token: str = Field(
        ...,
        min_length=1,
        description="Password reset token.",
    )

    new_password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="New password.",
    )

    @field_validator("new_password")
    @classmethod
    def validate_new_password(
        cls,
        value: str,
    ) -> str:
        """
        Validate the new password using the centralized password policy.
        """

        return validate_password(value)


# =============================================================================
# Refresh Token
# =============================================================================


class RefreshTokenRequest(BaseSchema):
    """
    Refresh access-token request.

    Reserved for the platform's refresh-token authentication flow.
    """

    refresh_token: str = Field(
        ...,
        min_length=1,
        description="Refresh token.",
    )


# =============================================================================
# Verify Email
# =============================================================================


class VerifyEmailRequest(BaseSchema):
    """
    Email-verification request.

    Reserved for the platform's future email-verification flow.
    """

    token: str = Field(
        ...,
        min_length=1,
        description="Email verification token.",
    )


# =============================================================================
# Logout Response
# =============================================================================


class LogoutResponse(MessageResponse):
    """
    Logout response using the standard API message-response contract.
    """

    message: str = Field(
        default="Logged out successfully.",
        description="Logout status message.",
    )


# =============================================================================
# Public Exports
# =============================================================================

__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "AuthResponse",
    "ChangePasswordRequest",
    "ForgotPasswordRequest",
    "ResetPasswordRequest",
    "RefreshTokenRequest",
    "VerifyEmailRequest",
    "LogoutResponse",
]