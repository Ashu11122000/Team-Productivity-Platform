"""
===============================================================================
Authentication Schemas
===============================================================================

Pydantic schemas for authentication-related API operations.

Responsibilities
----------------
• Validate login requests.
• Validate registration requests.
• Represent successful authentication responses.
• Validate password-change requests.
• Validate forgot-password requests.
• Validate password-reset requests.
• Validate refresh-token requests.
• Validate email-verification requests.
• Represent logout responses.

Security
--------
Plain-text passwords are accepted only by input schemas where they are
required for authentication or credential creation.

Password strength validation is applied when a new password is created or
changed.

Existing passwords used for login or password verification are intentionally
not subjected to password-strength validation.

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
    Request schema used to authenticate an existing user.

    Password-strength validation is intentionally not performed here.

    A login request contains an already-established credential. The
    authentication service is responsible for verifying that credential
    against the stored password hash.
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


# =============================================================================
# Registration Request
# =============================================================================


class RegisterRequest(UserCreate):
    """
    Request schema used when registering a new user.

    Registration reuses ``UserCreate`` so that the same email and password
    validation rules are applied consistently.
    """

    pass


# =============================================================================
# Authentication Response
# =============================================================================


class AuthResponse(TokenResponse):
    """
    Response returned after successful authentication.

    Contains the issued authentication tokens together with the safe
    representation of the authenticated user.

    The user representation intentionally excludes the password hash.
    """

    user: UserResponse = Field(
        ...,
        description="Authenticated user.",
    )


# =============================================================================
# Change Password Request
# =============================================================================


class ChangePasswordRequest(BaseSchema):
    """
    Request schema used to change the authenticated user's password.

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
        Validate the strength of the new password.

        The value is validated but not normalized because modifying a
        password before hashing would change the user's actual credential.

        Parameters
        ----------
        value:
            New plain-text password.

        Returns
        -------
        str
            Validated password.
        """

        return validate_password(value)


# =============================================================================
# Forgot Password Request
# =============================================================================


class ForgotPasswordRequest(BaseSchema):
    """
    Request schema used to initiate a password-reset flow.

    The authentication service is responsible for determining whether the
    supplied email corresponds to an account and for handling reset-token
    generation and delivery.
    """

    email: EmailStr = Field(
        ...,
        description="Registered email address.",
    )


# =============================================================================
# Reset Password Request
# =============================================================================


class ResetPasswordRequest(BaseSchema):
    """
    Request schema used to reset a user's password.

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
        Validate the strength of the new password.

        Parameters
        ----------
        value:
            New plain-text password.

        Returns
        -------
        str
            Validated password.
        """

        return validate_password(value)


# =============================================================================
# Refresh Token Request
# =============================================================================


class RefreshTokenRequest(BaseSchema):
    """
    Request schema used to obtain a new access token from a refresh token.

    Reserved for the platform's refresh-token authentication flow.
    """

    refresh_token: str = Field(
        ...,
        min_length=1,
        description="Refresh token.",
    )


# =============================================================================
# Verify Email Request
# =============================================================================


class VerifyEmailRequest(BaseSchema):
    """
    Request schema used to verify a user's email address.

    Reserved for the platform's email-verification flow.
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
    Response returned after a successful logout operation.

    The default message provides a consistent response when the endpoint
    does not need to customize the message.
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