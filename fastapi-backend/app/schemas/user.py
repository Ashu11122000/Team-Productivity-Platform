"""
==========================================================
User Schemas
==========================================================

Responsibilities
----------------
Provides reusable Pydantic schemas for user
authentication, registration, management and API
responses.

Features
--------
✓ User registration
✓ User update
✓ User response
✓ Public user information
✓ User summary
✓ Internal user representation
✓ Password validation
✓ SQLAlchemy ORM compatibility

Compatible With
---------------
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
"""

from __future__ import annotations

from pydantic import ConfigDict, EmailStr, Field, field_validator

from app.core.constants import (
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    UserRole,
)
from app.schemas.base import BaseSchema, EntitySchema
from app.utils.validators import validate_password

# ==========================================================
# Base User Schema
# ==========================================================


class UserBase(BaseSchema):
    """
    Base schema containing shared user fields.
    """

    email: EmailStr = Field(
        ...,
        description="User email address.",
    )


# ==========================================================
# User Registration
# ==========================================================


class UserCreate(UserBase):
    """
    Schema used for user registration.
    """

    password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="Plain-text password.",
    )

    @field_validator("password")
    @classmethod
    def validate_user_password(cls, value: str) -> str:
        """
        Validate password strength.

        Parameters
        ----------
        value : str
            User supplied password.

        Returns
        -------
        str
            Validated password.
        """

        return validate_password(value)


# ==========================================================
# User Update
# ==========================================================


class UserUpdate(BaseSchema):
    """
    Schema used for updating an existing user.

    All fields are optional.
    """

    email: EmailStr | None = Field(
        default=None,
        description="Updated email address.",
    )

    password: str | None = Field(
        default=None,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="Updated password.",
    )

    role: UserRole | None = Field(
        default=None,
        description="Updated user role.",
    )

    is_active: bool | None = Field(
        default=None,
        description="Whether the account is active.",
    )

    @field_validator("password")
    @classmethod
    def validate_user_password(
        cls,
        value: str | None,
    ) -> str | None:
        """
        Validate updated password.

        Returns
        -------
        str | None
            Validated password.
        """

        if value is None:
            return value

        return validate_password(value)


# ==========================================================
# User Response
# ==========================================================


class UserResponse(EntitySchema):
    """
    Complete user response.
    """

    email: EmailStr = Field(
        ...,
        description="User email address.",
    )

    role: UserRole = Field(
        ...,
        description="Assigned user role.",
    )

    is_active: bool = Field(
        ...,
        description="Whether the account is active.",
    )


# ==========================================================
# Public User
# ==========================================================


class UserPublic(BaseSchema):
    """
    Public user information.
    """

    id: int = Field(
        ...,
        description="User identifier.",
    )

    email: EmailStr = Field(
        ...,
        description="User email address.",
    )

    role: UserRole = Field(
        ...,
        description="Assigned user role.",
    )


# ==========================================================
# User Summary
# ==========================================================


class UserSummary(BaseSchema):
    """
    Lightweight user representation.
    """

    id: int = Field(
        ...,
        description="User identifier.",
    )

    email: EmailStr = Field(
        ...,
        description="User email address.",
    )


# ==========================================================
# Internal User
# ==========================================================


class UserInternal(UserResponse):
    """
    Internal schema including the password hash.

    This schema must never be returned to API clients.
    It is intended only for internal service and
    repository operations.
    """

    hashed_password: str = Field(
        ...,
        description="Stored password hash.",
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserPublic",
    "UserSummary",
    "UserInternal",
]