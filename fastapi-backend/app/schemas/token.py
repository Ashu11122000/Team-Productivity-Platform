"""
==========================================================
Token Schemas
==========================================================

Pydantic schemas related to JWT authentication.

Responsibilities
----------------
✓ Access token response
✓ Token payload
✓ JWT claims
✓ Authentication response

Compatible With
---------------
- FastAPI
- Pydantic v2
- python-jose
==========================================================
"""

from __future__ import annotations

from datetime import datetime

from pydantic import ConfigDict, EmailStr, Field

from app.core.constants import ACCESS_TOKEN_TYPE
from app.schemas.base import BaseSchema


# ==========================================================
# Access Token Response
# ==========================================================


class Token(BaseSchema):
    """
    Standard JWT access token response.
    """

    access_token: str = Field(
        ...,
        description="JWT access token.",
    )

    token_type: str = Field(
        default=ACCESS_TOKEN_TYPE.lower(),
        description="Authentication scheme.",
    )


# ==========================================================
# Authentication Response
# ==========================================================


class TokenResponse(Token):
    """
    Authentication response returned after login.
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
        description="Token type.",
    )

    iat: int = Field(
        ...,
        description="Issued-at timestamp (Unix epoch).",
    )

    exp: int = Field(
        ...,
        description="Expiration timestamp (Unix epoch).",
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
    Response returned after verifying
    a JWT access token.
    """

    valid: bool = True

    user: CurrentUser


# ==========================================================
# Refresh Token (Future Support)
# ==========================================================


class RefreshToken(BaseSchema):
    """
    Reserved for future refresh token support.
    """

    refresh_token: str


# ==========================================================
# Refresh Token Response
# ==========================================================


class RefreshTokenResponse(TokenResponse):
    """
    Authentication response containing
    both access and refresh tokens.
    """

    refresh_token: str


# ==========================================================
# Token Blacklist Entry (Future Support)
# ==========================================================


class TokenBlacklistEntry(BaseSchema):
    """
    Schema representing a revoked token.

    Reserved for future token revocation support.
    """

    jti: str

    expires_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )