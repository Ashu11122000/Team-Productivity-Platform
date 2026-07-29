"""
==========================================================
Authentication Schemas
==========================================================

Responsibilities
----------------
Provides reusable authentication-related schemas for the
Team Productivity Platform.

Features
--------
✓ User login
✓ User registration
✓ Authentication response
✓ Password change
✓ Password reset
✓ Refresh token support
✓ Email verification
✓ Logout response

Compatible With
---------------
- FastAPI
- Pydantic v2
- JWT Authentication

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
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


# ==========================================================
# Login Request
# ==========================================================


class LoginRequest(BaseSchema):
    """
    User login request.
    """

    email: EmailStr = Field(
        ...,
        description="Registered user email address.",
    )

    password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="User password.",
    )


# ==========================================================
# Registration Request
# ==========================================================


class RegisterRequest(UserCreate):
    """
    User registration request.

    Reuses UserCreate.
    """

    pass


# ==========================================================
# Authentication Response
# ==========================================================


class AuthResponse(TokenResponse):
    """
    Response returned after successful authentication.
    """

    user: UserResponse = Field(
        ...,
        description="Authenticated user.",
    )


# ==========================================================
# Change Password
# ==========================================================


class ChangePasswordRequest(BaseSchema):
    """
    Request to change the current password.
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
    def validate_new_password(cls, value: str) -> str:
        """
        Validate password strength.
        """

        return validate_password(value)


# ==========================================================
# Forgot Password
# ==========================================================


class ForgotPasswordRequest(BaseSchema):
    """
    Forgot password request.
    """

    email: EmailStr = Field(
        ...,
        description="Registered email address.",
    )


# ==========================================================
# Reset Password
# ==========================================================


class ResetPasswordRequest(BaseSchema):
    """
    Password reset request.
    """

    token: str = Field(
        ...,
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
    def validate_new_password(cls, value: str) -> str:
        """
        Validate password strength.
        """

        return validate_password(value)


# ==========================================================
# Refresh Token
# ==========================================================


class RefreshTokenRequest(BaseSchema):
    """
    Refresh access token request.

    Reserved for future refresh-token support.
    """

    refresh_token: str = Field(
        ...,
        description="Refresh token.",
    )


# ==========================================================
# Verify Email
# ==========================================================


class VerifyEmailRequest(BaseSchema):
    """
    Email verification request.

    Reserved for future email verification.
    """

    token: str = Field(
        ...,
        description="Email verification token.",
    )


# ==========================================================
# Logout Response
# ==========================================================


class LogoutResponse(MessageResponse):
    """
    Logout response.
    """

    message: str = Field(
        default="Logged out successfully.",
        description="Logout status message.",
    )


# ==========================================================
# Public Exports
# ==========================================================

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