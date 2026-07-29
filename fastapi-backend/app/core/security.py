"""
==========================================================
Security Utilities
==========================================================

Responsibilities
----------------
Provides reusable security utilities for authentication and
authorization across the application.

Features
--------
✓ Password hashing using Argon2
✓ Password verification
✓ JWT access token creation
✓ JWT decoding
✓ JWT validation
✓ Authentication helper functions
✓ Enterprise logging
✓ Type-safe utilities

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- python-jose
- pwdlib

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from jose import JWTError, ExpiredSignatureError, jwt
from pwdlib import PasswordHash

from app.core.config import settings
from app.core.constants import (
    ACCESS_TOKEN_TYPE,
    INVALID_TOKEN_MESSAGE,
    TOKEN_EXPIRED_MESSAGE,
)
from app.core.logging import get_logger
from app.utils.datetime import utc_now

logger = get_logger(__name__)

# ==========================================================
# Module Constants
# ==========================================================

# ----------------------------------------------------------
# JWT Claim Names
# ----------------------------------------------------------

CLAIM_SUBJECT = "sub"
CLAIM_USER_ID = "user_id"
CLAIM_ROLE = "role"
CLAIM_TOKEN_TYPE = "type"
CLAIM_ISSUER = "iss"
CLAIM_AUDIENCE = "aud"
CLAIM_ISSUED_AT = "iat"
CLAIM_EXPIRES_AT = "exp"

# ----------------------------------------------------------
# Authentication Scheme
# ----------------------------------------------------------

AUTHENTICATION_SCHEME = "Bearer"

# ==========================================================
# Password Hashing Configuration
# ==========================================================

# ----------------------------------------------------------
# Configure Argon2 Password Hasher
# ----------------------------------------------------------
#
# PasswordHash.recommended() automatically selects the
# strongest algorithm and parameters supported by pwdlib.
#
# Currently this resolves to Argon2id.
#

_password_hasher = PasswordHash.recommended()

# ==========================================================
# Password Utilities
# ==========================================================


def hash_password(password: str) -> str:
    """
    Hash a plain-text password.

    Parameters
    ----------
    password : str
        Plain-text password.

    Returns
    -------
    str
        Secure Argon2 hash.

    Raises
    ------
    ValueError
        If the password is empty.
    """

    if not password:
        raise ValueError("Password cannot be empty.")

    logger.debug("Hashing user password.")

    return _password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a password against its stored hash.

    Parameters
    ----------
    plain_password : str
        User supplied password.

    hashed_password : str
        Stored Argon2 hash.

    Returns
    -------
    bool
        True if the password is valid.

    Raises
    ------
    ValueError
        If either argument is empty.
    """

    if not plain_password:
        raise ValueError("Password cannot be empty.")

    if not hashed_password:
        raise ValueError("Password hash cannot be empty.")

    logger.debug("Verifying password hash.")

    return _password_hasher.verify(
        plain_password,
        hashed_password,
    )

# ==========================================================
# JWT Helper Functions
# ==========================================================


def _default_access_token_expiry() -> timedelta:
    """
    Return the configured access token lifetime.

    Returns
    -------
    timedelta
        Configured access token duration.
    """

    return timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )


def _issued_at_timestamp() -> int:
    """
    Return the current UTC timestamp.

    Returns
    -------
    int
        Unix timestamp.
    """

    return int(utc_now().timestamp())


def _expiry_timestamp(
    expires_delta: timedelta | None,
) -> int:
    """
    Calculate JWT expiration timestamp.

    Parameters
    ----------
    expires_delta : timedelta | None
        Optional custom expiration duration.

    Returns
    -------
    int
        Expiration Unix timestamp.
    """

    lifetime = expires_delta or _default_access_token_expiry()

    return int(
        (utc_now() + lifetime).timestamp()
    )


def _build_access_token_payload(
    *,
    user_id: str,
    email: str,
    role: str,
    expires_delta: timedelta | None = None,
) -> dict[str, Any]:
    """
    Build a JWT payload for an access token.

    Parameters
    ----------
    user_id : str
        Authenticated user's ID.

    email : str
        Authenticated user's email.

    role : str
        Authenticated user's role.

    expires_delta : timedelta | None
        Optional custom token lifetime.

    Returns
    -------
    dict[str, Any]
        JWT payload.
    """

    issued_at = _issued_at_timestamp()

    payload: dict[str, Any] = {
        CLAIM_SUBJECT: email,
        CLAIM_USER_ID: user_id,
        CLAIM_ROLE: role,
        CLAIM_TOKEN_TYPE: ACCESS_TOKEN_TYPE.lower(),
        CLAIM_ISSUER: settings.JWT_ISSUER,
        CLAIM_AUDIENCE: settings.JWT_AUDIENCE,
        CLAIM_ISSUED_AT: issued_at,
        CLAIM_EXPIRES_AT: _expiry_timestamp(
            expires_delta,
        ),
    }

    return payload

# ==========================================================
# JWT Token Creation
# ==========================================================


def create_access_token(
    *,
    user_id: str,
    email: str,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a signed JWT access token.

    Parameters
    ----------
    user_id : str
        Authenticated user's unique identifier.

    email : str
        Authenticated user's email address.

    role : str
        Authenticated user's role.

    expires_delta : timedelta | None, optional
        Optional custom token lifetime.

    Returns
    -------
    str
        Encoded JWT access token.

    Raises
    ------
    ValueError
        If required values are missing.
    """

    # --------------------------------------------------
    # Validate required values.
    # --------------------------------------------------

    if not user_id:
        raise ValueError("User ID cannot be empty.")

    if not email:
        raise ValueError("Email cannot be empty.")

    if not role:
        raise ValueError("Role cannot be empty.")

    payload = _build_access_token_payload(
        user_id=user_id,
        email=email,
        role=role,
        expires_delta=expires_delta,
    )

    logger.info(
        "Creating access token.",
        extra={
            "user_id": user_id,
            "email": email,
            "role": role,
        },
    )

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


# ==========================================================
# Internal JWT Validation Helpers
# ==========================================================

_REQUIRED_CLAIMS: tuple[str, ...] = (
    CLAIM_SUBJECT,
    CLAIM_USER_ID,
    CLAIM_ROLE,
    CLAIM_TOKEN_TYPE,
    CLAIM_ISSUER,
    CLAIM_AUDIENCE,
)


def _decode_jwt(
    token: str,
) -> dict[str, Any]:
    """
    Decode a JWT without performing application-specific
    validation.

    Parameters
    ----------
    token : str
        Encoded JWT.

    Returns
    -------
    dict[str, Any]
        Decoded JWT payload.

    Raises
    ------
    ExpiredSignatureError
        If the token has expired.

    JWTError
        If decoding fails.
    """

    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
        issuer=settings.JWT_ISSUER,
        audience=settings.JWT_AUDIENCE,
    )


def _validate_required_claims(
    payload: dict[str, Any],
) -> None:
    """
    Ensure all required JWT claims are present.

    Parameters
    ----------
    payload : dict[str, Any]
        JWT payload.

    Raises
    ------
    ValueError
        If one or more required claims are missing.
    """

    for claim in _REQUIRED_CLAIMS:
        if claim not in payload:
            logger.warning(
                "JWT missing required claim.",
                extra={
                    "claim": claim,
                },
            )
            raise ValueError(
                f"Missing required JWT claim: {claim}",
            )


def _validate_token_type(
    payload: dict[str, Any],
) -> None:
    """
    Validate that the JWT is an access token.

    Parameters
    ----------
    payload : dict[str, Any]
        JWT payload.

    Raises
    ------
    ValueError
        If the token type is invalid.
    """

    token_type = str(
        payload.get(CLAIM_TOKEN_TYPE, "")
    ).lower()

    expected = ACCESS_TOKEN_TYPE.lower()

    if token_type != expected:
        logger.warning(
            "Invalid JWT token type.",
            extra={
                "expected": expected,
                "received": token_type,
            },
        )

        raise ValueError(
            f"Invalid token type: {token_type}",
        )


def _validate_payload(
    payload: dict[str, Any],
) -> dict[str, Any]:
    """
    Perform application-level JWT payload validation.

    Parameters
    ----------
    payload : dict[str, Any]
        Decoded JWT payload.

    Returns
    -------
    dict[str, Any]
        Validated payload.

    Raises
    ------
    ValueError
        If payload validation fails.
    """

    _validate_required_claims(payload)
    _validate_token_type(payload)

    return payload

# ==========================================================
# JWT Decoding & Validation
# ==========================================================

from fastapi import HTTPException, status


def decode_access_token(
    token: str,
) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Parameters
    ----------
    token : str
        Encoded JWT access token.

    Returns
    -------
    dict[str, Any]
        Validated JWT payload.

    Raises
    ------
    HTTPException
        If the token is invalid or expired.
    """

    if not token:
        logger.warning("Empty JWT received.")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN_MESSAGE,
            headers={
                "WWW-Authenticate": AUTHENTICATION_SCHEME,
            },
        )

    try:
        # --------------------------------------------------
        # Decode the JWT using configured validation.
        # --------------------------------------------------
        payload = _decode_jwt(token)

        # --------------------------------------------------
        # Perform application-level validation.
        # --------------------------------------------------
        validated_payload = _validate_payload(payload)

        logger.debug(
            "JWT successfully validated.",
            extra={
                "user_id": validated_payload.get(
                    CLAIM_USER_ID,
                ),
            },
        )

        return validated_payload

    except ExpiredSignatureError as exc:
        logger.warning(
            "JWT has expired.",
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=TOKEN_EXPIRED_MESSAGE,
            headers={
                "WWW-Authenticate": AUTHENTICATION_SCHEME,
            },
        ) from exc

    except ValueError as exc:
        logger.warning(
            "JWT payload validation failed.",
            extra={
                "reason": str(exc),
            },
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN_MESSAGE,
            headers={
                "WWW-Authenticate": AUTHENTICATION_SCHEME,
            },
        ) from exc

    except JWTError as exc:
        logger.warning(
            "JWT decoding failed.",
            extra={
                "error": str(exc),
            },
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN_MESSAGE,
            headers={
                "WWW-Authenticate": AUTHENTICATION_SCHEME,
            },
        ) from exc


# ==========================================================
# Authentication Helper Functions
# ==========================================================


def get_token_subject(
    token: str,
) -> str:
    """
    Return the authenticated user's email.

    Parameters
    ----------
    token : str
        Encoded JWT access token.

    Returns
    -------
    str
        User email.
    """

    payload = decode_access_token(token)

    return str(payload[CLAIM_SUBJECT])


def get_user_id(
    token: str,
) -> str:
    """
    Return the authenticated user's ID.

    Parameters
    ----------
    token : str
        Encoded JWT access token.

    Returns
    -------
    str
        User identifier.
    """

    payload = decode_access_token(token)

    return str(payload[CLAIM_USER_ID])


def get_user_role(
    token: str,
) -> str:
    """
    Return the authenticated user's role.

    Parameters
    ----------
    token : str
        Encoded JWT access token.

    Returns
    -------
    str
        User role.
    """

    payload = decode_access_token(token)

    return str(payload[CLAIM_ROLE])


# ==========================================================
# Public Exports
# ==========================================================

__all__ = (
    "hash_password",
    "verify_password",
    "create_access_token",
    "decode_access_token",
    "get_token_subject",
    "get_user_id",
    "get_user_role",
)

