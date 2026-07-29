"""
==========================================================
Token Schemas
==========================================================

Responsibilities
----------------
Provides reusable Pydantic schemas for JWT authentication
and authorization across the Team Productivity Platform.

Features
--------
✓ Access token response
✓ Refresh token response
✓ JWT payload validation
✓ Authenticated user information
✓ Token verification response
✓ Future token revocation support

Compatible With
---------------
- FastAPI
- Pydantic v2
- python-jose
- SQLAlchemy 2.x

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
"""

from __future__ import annotations

from datetime import datetime

from pydantic import ConfigDict, EmailStr, Field

from app.core.constants import ACCESS_TOKEN_TYPE
from app.schemas.base import BaseSchema

# ==========================================================
# Access Token
# ==========================================================


class Token(BaseSchema):
    """
    JWT access token.
    """

    access_token: str = Field(
        ...,
        description="Signed JWT access token.",
    )

    token_type: str = Field(
        default=ACCESS_TOKEN_TYPE.lower(),
        description="Authentication scheme.",
    )


# ==========================================================
# Token Response
# ==========================================================


class TokenResponse(Token):
    """
    Authentication response returned after a
    successful login.
    """

    expires_in: int = Field(
        ...,
        ge=1,
        description="Access token lifetime in seconds.",
    )


# ==========================================================
# JWT Payload
# ==========================================================


class TokenPayload(BaseSchema):
    """
    Decoded JWT payload.
    """

    sub: EmailStr = Field(
        ...,
        description="Authenticated user's email.",
    )

    user_id: int = Field(
        ...,
        ge=1,
        description="Authenticated user's ID.",
    )

    role: str = Field(
        ...,
        description="Authenticated user's role.",
    )

    type: str = Field(
        ...,
        description="JWT token type.",
    )

    iss: str = Field(
        ...,
        description="JWT issuer.",
    )

    aud: str = Field(
        ...,
        description="JWT audience.",
    )

    iat: int = Field(
        ...,
        description="Issued-at timestamp.",
    )

    exp: int = Field(
        ...,
        description="Expiration timestamp.",
    )

    jti: str | None = Field(
        default=None,
        description="JWT identifier.",
    )

    nbf: int | None = Field(
        default=None,
        description="Not-before timestamp.",
    )


# ==========================================================
# JWT Claims
# ==========================================================


class JWTClaims(BaseSchema):
    """
    Authenticated user information extracted
    from a validated JWT.
    """

    user_id: int

    email: EmailStr

    role: str


# ==========================================================
# Current User
# ==========================================================


class CurrentUser(BaseSchema):
    """
    Current authenticated user.
    """

    id: int

    email: EmailStr

    role: str

    is_active: bool


# ==========================================================
# Token Verification Response
# ==========================================================


class TokenVerificationResponse(BaseSchema):
    """
    Response returned after validating a JWT.
    """

    valid: bool = Field(
        default=True,
        description="Whether the supplied token is valid.",
    )

    user: CurrentUser


# ==========================================================
# Refresh Token
# ==========================================================


class RefreshToken(BaseSchema):
    """
    Refresh token schema.

    Reserved for future refresh-token rotation.
    """

    refresh_token: str = Field(
        ...,
        description="JWT refresh token.",
    )


# ==========================================================
# Refresh Token Response
# ==========================================================


class RefreshTokenResponse(TokenResponse):
    """
    Authentication response containing both
    access and refresh tokens.
    """

    refresh_token: str = Field(
        ...,
        description="JWT refresh token.",
    )


# ==========================================================
# Token Blacklist Entry
# ==========================================================


class TokenBlacklistEntry(BaseSchema):
    """
    Represents a revoked JWT.

    Reserved for future token revocation support.
    """

    jti: str = Field(
        ...,
        description="JWT unique identifier.",
    )

    expires_at: datetime = Field(
        ...,
        description="UTC expiration timestamp.",
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "Token",
    "TokenResponse",
    "TokenPayload",
    "JWTClaims",
    "CurrentUser",
    "TokenVerificationResponse",
    "RefreshToken",
    "RefreshTokenResponse",
    "TokenBlacklistEntry",
]