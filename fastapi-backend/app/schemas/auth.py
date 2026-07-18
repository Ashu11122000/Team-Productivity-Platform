"""
==========================================================
Authentication Schemas
==========================================================

Pydantic schemas for authentication.

Responsibilities
----------------
✓ User registration
✓ User login
✓ Authentication response
✓ Password change
✓ Password reset
✓ Email verification (future)

Compatible With
---------------
- FastAPI
- Pydantic v2
- JWT Authentication
==========================================================
"""

from __future__ import annotations

from pydantic import EmailStr, Field, field_validator

from app.core.constants import (
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
)
from app.schemas.base import BaseSchema
from app.schemas.token import TokenResponse
from app.schemas.user import UserCreate, UserResponse


# ==========================================================
# Login Request
# ==========================================================


class LoginRequest(BaseSchema):
    """
    User login request.
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


# ==========================================================
# Registration Request
# ==========================================================


class RegisterRequest(UserCreate):
    """
    User registration request.

    Reuses the UserCreate schema.
    """

    pass


# ==========================================================
# Authentication Response
# ==========================================================


class AuthResponse(TokenResponse):
    """
    Authentication response returned after
    successful login or registration.
    """

    user: UserResponse


# ==========================================================
# Change Password
# ==========================================================


class ChangePasswordRequest(BaseSchema):
    """
    Change password request.
    """

    current_password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
    )

    new_password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
    )

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(
        cls,
        value: str,
    ) -> str:
        """
        Validate password complexity.
        """

        if not any(char.isupper() for char in value):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not any(char.islower() for char in value):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not any(char.isdigit() for char in value):
            raise ValueError(
                "Password must contain at least one digit."
            )

        return value


# ==========================================================
# Forgot Password
# ==========================================================


class ForgotPasswordRequest(BaseSchema):
    """
    Forgot password request.
    """

    email: EmailStr


# ==========================================================
# Reset Password
# ==========================================================


class ResetPasswordRequest(BaseSchema):
    """
    Reset password request.
    """

    token: str = Field(
        ...,
        description="Password reset token.",
    )

    new_password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
    )

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(
        cls,
        value: str,
    ) -> str:
        """
        Validate password complexity.
        """

        if not any(char.isupper() for char in value):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not any(char.islower() for char in value):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not any(char.isdigit() for char in value):
            raise ValueError(
                "Password must contain at least one digit."
            )

        return value


# ==========================================================
# Refresh Token
# ==========================================================


class RefreshTokenRequest(BaseSchema):
    """
    Refresh access token request.

    Reserved for future refresh token support.
    """

    refresh_token: str


# ==========================================================
# Verify Email
# ==========================================================


class VerifyEmailRequest(BaseSchema):
    """
    Email verification request.

    Reserved for future email verification.
    """

    token: str


# ==========================================================
# Logout Response
# ==========================================================


class LogoutResponse(BaseSchema):
    """
    Logout response.
    """

    message: str = "Logged out successfully."