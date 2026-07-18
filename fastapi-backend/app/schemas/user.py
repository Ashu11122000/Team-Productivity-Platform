"""
==========================================================
User Schemas
==========================================================

Pydantic schemas for user management.

Responsibilities
----------------
✓ User creation
✓ User update
✓ User response
✓ Public user information
✓ User summary
✓ Internal user information

Compatible With
---------------
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x
==========================================================
"""

from __future__ import annotations

from datetime import datetime

from pydantic import ConfigDict, EmailStr, Field, field_validator

from app.core.constants import (
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    UserRole,
)
from app.schemas.base import BaseSchema, EntitySchema


# ==========================================================
# Base User Schema
# ==========================================================


class UserBase(BaseSchema):
    """
    Shared user fields.
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
    Schema for creating a new user.
    """

    password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        """
        Validate password strength.
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
# User Update
# ==========================================================


class UserUpdate(BaseSchema):
    """
    Schema for updating a user.
    """

    email: EmailStr | None = None

    password: str | None = Field(
        default=None,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
    )

    role: UserRole | None = None

    is_active: bool | None = None


# ==========================================================
# User Response
# ==========================================================


class UserResponse(EntitySchema):
    """
    Complete user response.
    """

    email: EmailStr

    role: UserRole

    is_active: bool


# ==========================================================
# Public User
# ==========================================================


class UserPublic(BaseSchema):
    """
    Public user information.
    """

    id: int

    email: EmailStr

    role: UserRole


# ==========================================================
# User Summary
# ==========================================================


class UserSummary(BaseSchema):
    """
    Lightweight user representation.
    """

    id: int

    email: EmailStr


# ==========================================================
# Internal User
# ==========================================================


class UserInternal(UserResponse):
    """
    Internal schema including password hash.

    Used only inside backend services.
    """

    hashed_password: str

    model_config = ConfigDict(
        from_attributes=True,
    )