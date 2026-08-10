"""
===============================================================================
User Schemas
===============================================================================

Pydantic schemas for user authentication, registration, management,
authorization-related data, and API responses.

Responsibilities
----------------
• Validate user registration data.
• Validate user update data.
• Represent authenticated users safely.
• Represent public user information.
• Represent lightweight user summaries.
• Represent internal user data when explicitly required.
• Validate password strength through centralized utilities.
• Support SQLAlchemy ORM objects through Pydantic v2 attribute-based parsing.

Security
--------
Plain-text passwords may appear only in input schemas such as ``UserCreate``
and ``UserUpdate``.

Password hashes are restricted to ``UserInternal`` and must never be returned
through public API responses.

Compatible With
---------------
• FastAPI
• Pydantic v2
• SQLAlchemy 2.x
• PostgreSQL
• Python 3.12+
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


# =============================================================================
# Base User Schema
# =============================================================================


class UserBase(BaseSchema):
    """
    Base schema containing fields shared by user-related input schemas.

    This schema intentionally contains only fields that are safe and
    appropriate for user-facing input operations.
    """

    email: EmailStr = Field(
        ...,
        description="User email address.",
    )


# =============================================================================
# User Registration
# =============================================================================


class UserCreate(UserBase):
    """
    Schema used when registering a new user.

    The password is validated against the application's centralized
    password policy before it reaches the service layer.
    """

    password: str = Field(
        ...,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="Plain-text password.",
    )

    @field_validator("password")
    @classmethod
    def validate_user_password(
        cls,
        value: str,
    ) -> str:
        """
        Validate the supplied password.

        The password is validated but intentionally not normalized.
        Changing password contents before hashing would change the user's
        actual credential.

        Parameters
        ----------
        value:
            User-supplied plain-text password.

        Returns
        -------
        str
            The validated password.

        Raises
        ------
        ValueError
            If the password violates the application's password policy.
        """

        return validate_password(value)


# =============================================================================
# User Update
# =============================================================================


class UserUpdate(BaseSchema):
    """
    Schema used when updating an existing user.

    All fields are optional.

    Authorization decisions such as whether a user is allowed to modify
    ``role`` or ``is_active`` belong to the service/dependency layer rather
    than this validation schema.
    """

    email: EmailStr | None = Field(
        default=None,
        description="Updated email address.",
    )

    password: str | None = Field(
        default=None,
        min_length=PASSWORD_MIN_LENGTH,
        max_length=PASSWORD_MAX_LENGTH,
        description="Updated plain-text password.",
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
        Validate an updated password when one is supplied.

        ``None`` means that the password was not included in the update
        request and therefore requires no validation.

        Parameters
        ----------
        value:
            Optional user-supplied password.

        Returns
        -------
        str | None
            The validated password or ``None``.
        """

        if value is None:
            return None

        return validate_password(value)


# =============================================================================
# User Response
# =============================================================================


class UserResponse(EntitySchema):
    """
    Standard authenticated-user API response.

    This schema intentionally excludes the password hash.

    It is suitable for returning user account information to trusted API
    consumers where the user's role and account state are required.
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

    model_config = ConfigDict(
        from_attributes=True,
    )


# =============================================================================
# Public User
# =============================================================================


class UserPublic(BaseSchema):
    """
    Public representation of a user.

    This schema exposes only information appropriate for public-facing
    user references.
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

    model_config = ConfigDict(
        from_attributes=True,
    )


# =============================================================================
# User Summary
# =============================================================================


class UserSummary(BaseSchema):
    """
    Lightweight user representation.

    Intended for nested references, lists, dashboards, and other places
    where the complete user representation is unnecessary.
    """

    id: int = Field(
        ...,
        description="User identifier.",
    )

    email: EmailStr = Field(
        ...,
        description="User email address.",
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# =============================================================================
# Internal User
# =============================================================================


class UserInternal(UserResponse):
    """
    Internal user representation containing the stored password hash.

    Security
    --------
    This schema is strictly for server-side application logic.

    It MUST NOT be returned directly from an API endpoint.

    The password hash must never be included in public response schemas,
    logs, serialized API responses, or frontend payloads.
    """

    hashed_password: str = Field(
        ...,
        description="Stored password hash.",
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# =============================================================================
# Public Exports
# =============================================================================

__all__ = [
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserPublic",
    "UserSummary",
    "UserInternal",
]