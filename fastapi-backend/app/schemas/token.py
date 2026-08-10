"""
===============================================================================
Token Schemas
===============================================================================

Reusable Pydantic schemas for JWT authentication and authorization.

Responsibilities
----------------
• Represent access tokens.
• Represent refresh tokens.
• Validate decoded JWT payloads.
• Represent authenticated JWT claims.
• Represent the current authenticated user.
• Represent token verification responses.
• Provide a future refresh-token contract.
• Provide a future token-revocation contract.

JWT Contract
------------
FastAPI is the JWT authority for the platform.

The JWT contract includes the authenticated user's:

• user_id
• email / subject
• role

Additional standard JWT claims such as issuer, audience, issued-at,
expiration, token type, JTI, and NBF are supported.

Compatible With
---------------
• FastAPI
• Pydantic v2
• python-jose
• SQLAlchemy 2.x
• Python 3.12+
"""

from __future__ import annotations

from datetime import datetime

from pydantic import EmailStr, Field

from app.core.constants import ACCESS_TOKEN_TYPE
from app.schemas.base import BaseSchema


# =============================================================================
# Access Token
# =============================================================================


class Token(BaseSchema):
    """
    JWT access-token response.

    Attributes
    ----------
    access_token:
        Signed JWT access token.

    token_type:
        Authentication scheme used with the access token.
    """

    access_token: str = Field(
        ...,
        min_length=1,
        description="Signed JWT access token.",
    )

    token_type: str = Field(
        default=ACCESS_TOKEN_TYPE.lower(),
        min_length=1,
        description="Authentication scheme.",
    )


# =============================================================================
# Token Response
# =============================================================================


class TokenResponse(Token):
    """
    Authentication response returned after successful authentication.

    Extends the basic token representation with the token lifetime.
    """

    expires_in: int = Field(
        ...,
        ge=1,
        description="Access token lifetime in seconds.",
    )


# =============================================================================
# JWT Payload
# =============================================================================


class TokenPayload(BaseSchema):
    """
    Complete decoded JWT payload.

    This schema represents claims after the JWT has been decoded and
    cryptographically validated by the security layer.

    ``sub`` intentionally represents the authenticated user's email,
    matching the established JWT contract.
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
        min_length=1,
        description="Authenticated user's role.",
    )

    type: str = Field(
        ...,
        min_length=1,
        description="JWT token type.",
    )

    iss: str = Field(
        ...,
        min_length=1,
        description="JWT issuer.",
    )

    aud: str = Field(
        ...,
        min_length=1,
        description="JWT audience.",
    )

    iat: int = Field(
        ...,
        ge=0,
        description="Issued-at timestamp as a Unix timestamp.",
    )

    exp: int = Field(
        ...,
        ge=0,
        description="Expiration timestamp as a Unix timestamp.",
    )

    jti: str | None = Field(
        default=None,
        min_length=1,
        description="JWT identifier.",
    )

    nbf: int | None = Field(
        default=None,
        ge=0,
        description="Not-before timestamp as a Unix timestamp.",
    )


# =============================================================================
# JWT Claims
# =============================================================================


class JWTClaims(BaseSchema):
    """
    Application-level authenticated identity extracted from a validated JWT.

    This is a simplified representation of the complete ``TokenPayload`` and
    contains only the identity and authorization information required by
    application code.
    """

    user_id: int = Field(
        ...,
        ge=1,
        description="Authenticated user's ID.",
    )

    email: EmailStr = Field(
        ...,
        description="Authenticated user's email.",
    )

    role: str = Field(
        ...,
        min_length=1,
        description="Authenticated user's role.",
    )


# =============================================================================
# Current User
# =============================================================================


class CurrentUser(BaseSchema):
    """
    Representation of the currently authenticated application user.

    This schema combines JWT identity information with the user's current
    account state.
    """

    id: int = Field(
        ...,
        ge=1,
        description="Authenticated user's ID.",
    )

    email: EmailStr = Field(
        ...,
        description="Authenticated user's email.",
    )

    role: str = Field(
        ...,
        min_length=1,
        description="Authenticated user's role.",
    )

    is_active: bool = Field(
        ...,
        description="Whether the authenticated account is active.",
    )


# =============================================================================
# Token Verification Response
# =============================================================================


class TokenVerificationResponse(BaseSchema):
    """
    Response returned after successfully validating a JWT.

    ``valid`` defaults to ``True`` because this response represents a
    successful token-validation operation.
    """

    valid: bool = Field(
        default=True,
        description="Whether the supplied token is valid.",
    )

    user: CurrentUser = Field(
        ...,
        description="Authenticated user associated with the token.",
    )


# =============================================================================
# Refresh Token
# =============================================================================


class RefreshToken(BaseSchema):
    """
    Refresh-token representation.

    Reserved for the platform's future refresh-token rotation and
    lifecycle-management flow.
    """

    refresh_token: str = Field(
        ...,
        min_length=1,
        description="JWT refresh token.",
    )


# =============================================================================
# Refresh Token Response
# =============================================================================


class RefreshTokenResponse(TokenResponse):
    """
    Authentication response containing both access and refresh tokens.

    Reserved for the platform's refresh-token authentication flow.
    """

    refresh_token: str = Field(
        ...,
        min_length=1,
        description="JWT refresh token.",
    )


# =============================================================================
# Token Blacklist Entry
# =============================================================================


class TokenBlacklistEntry(BaseSchema):
    """
    Represents a revoked JWT.

    Reserved for future token-revocation support.

    Attributes
    ----------
    jti:
        Unique JWT identifier.

    expires_at:
        UTC expiration timestamp of the revoked token.
    """

    jti: str = Field(
        ...,
        min_length=1,
        description="JWT unique identifier.",
    )

    expires_at: datetime = Field(
        ...,
        description="UTC expiration timestamp.",
    )


# =============================================================================
# Public Exports
# =============================================================================

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