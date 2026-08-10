"""
==========================================================
Security Utilities
==========================================================

Centralized security utilities for the Team Productivity Platform.

Responsibilities
----------------
- Password hashing using Argon2id through pwdlib.
- Password verification.
- JWT access-token creation.
- JWT decoding and validation.
- JWT application-claim validation.
- Authentication helper functions.
- Security-related structured logging.
- Type-safe security utilities.

Architecture
------------
This module contains security logic only.

It intentionally does not depend on FastAPI's HTTPException.
Application-level authentication failures use the project's
ApplicationError hierarchy and are converted into HTTP responses
by the centralized exception handling layer.

JWT Contract
------------
FastAPI is the authentication authority for the platform.

The existing JWT contract is preserved:

- Algorithm: HS256
- Issuer: team-productivity-platform
- Audience: team-productivity-api
- Subject (sub): authenticated user's email
- user_id: authenticated user's ID
- role: authenticated user's role
- type: access
- iat: issued-at timestamp
- exp: expiration timestamp

Python Version
--------------
3.12+
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any, Final

from jose import ExpiredSignatureError, JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings
from app.core.constants import (
    ACCESS_TOKEN_TYPE,
    AUTHORIZATION_HEADER,
    INVALID_TOKEN_MESSAGE,
    JWT_AUDIENCE_CLAIM,
    JWT_EXPIRES_CLAIM,
    JWT_ISSUER_CLAIM,
    JWT_SUBJECT,
    TOKEN_EXPIRED_MESSAGE,
)
from app.core.exceptions import AuthenticationError
from app.core.logging import get_logger
from app.utils.datetime import utc_now


logger = get_logger(__name__)


# ==========================================================
# Module Constants
# ==========================================================


# ----------------------------------------------------------
# JWT Claim Names
# ----------------------------------------------------------

CLAIM_SUBJECT: Final[str] = JWT_SUBJECT

CLAIM_USER_ID: Final[str] = "user_id"

CLAIM_ROLE: Final[str] = "role"

CLAIM_TOKEN_TYPE: Final[str] = "type"

CLAIM_ISSUER: Final[str] = JWT_ISSUER_CLAIM

CLAIM_AUDIENCE: Final[str] = JWT_AUDIENCE_CLAIM

CLAIM_ISSUED_AT: Final[str] = "iat"

CLAIM_EXPIRES_AT: Final[str] = JWT_EXPIRES_CLAIM


# ----------------------------------------------------------
# Authentication Scheme
# ----------------------------------------------------------

AUTHENTICATION_SCHEME: Final[str] = "Bearer"


# ----------------------------------------------------------
# JWT Required Claims
# ----------------------------------------------------------

_REQUIRED_CLAIMS: Final[tuple[str, ...]] = (
    CLAIM_SUBJECT,
    CLAIM_USER_ID,
    CLAIM_ROLE,
    CLAIM_TOKEN_TYPE,
    CLAIM_ISSUER,
    CLAIM_AUDIENCE,
)


# ==========================================================
# Password Hashing
# ==========================================================


_password_hasher = PasswordHash.recommended()


# ==========================================================
# Password Utilities
# ==========================================================


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using the recommended pwdlib
    password-hashing configuration.

    Parameters
    ----------
    password:
        Plain-text password supplied by the caller.

    Returns
    -------
    str
        Secure password hash.

    Raises
    ------
    ValueError
        If the password is empty or contains only whitespace.

    Notes
    -----
    Plain-text passwords are never logged.
    """

    if not password or not password.strip():
        raise ValueError(
            "Password cannot be empty."
        )

    return _password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against a stored password hash.

    Parameters
    ----------
    plain_password:
        User-provided plain-text password.

    hashed_password:
        Stored password hash.

    Returns
    -------
    bool
        True when the password matches the stored hash.

    Raises
    ------
    ValueError
        If either argument is empty.

    Notes
    -----
    Passwords and password hashes are never written to logs.
    """

    if not plain_password or not plain_password.strip():
        raise ValueError(
            "Password cannot be empty."
        )

    if not hashed_password or not hashed_password.strip():
        raise ValueError(
            "Password hash cannot be empty."
        )

    return _password_hasher.verify(
        plain_password,
        hashed_password,
    )


# ==========================================================
# JWT Expiration Helpers
# ==========================================================


def _default_access_token_expiry() -> timedelta:
    """
    Return the configured access-token lifetime.
    """

    return timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )


def _issued_at_timestamp() -> int:
    """
    Return the current UTC Unix timestamp.
    """

    return int(
        utc_now().timestamp()
    )


def _expiry_timestamp(
    expires_delta: timedelta | None,
) -> int:
    """
    Calculate the JWT expiration timestamp.

    Parameters
    ----------
    expires_delta:
        Optional custom lifetime.

    Returns
    -------
    int
        UTC Unix timestamp representing token expiration.
    """

    lifetime = (
        expires_delta
        if expires_delta is not None
        else _default_access_token_expiry()
    )

    if lifetime.total_seconds() <= 0:
        raise ValueError(
            "Token expiration duration must be greater than zero."
        )

    return int(
        (
            utc_now()
            + lifetime
        ).timestamp()
    )


# ==========================================================
# JWT Payload Construction
# ==========================================================


def _build_access_token_payload(
    *,
    user_id: str,
    email: str,
    role: str,
    expires_delta: timedelta | None = None,
) -> dict[str, Any]:
    """
    Build the access-token JWT payload.

    The claim names and values intentionally preserve the
    existing FastAPI/NestJS JWT contract.
    """

    issued_at = _issued_at_timestamp()

    return {
        CLAIM_SUBJECT: email,
        CLAIM_USER_ID: user_id,
        CLAIM_ROLE: role,
        CLAIM_TOKEN_TYPE: ACCESS_TOKEN_TYPE,
        CLAIM_ISSUER: settings.JWT_ISSUER,
        CLAIM_AUDIENCE: settings.JWT_AUDIENCE,
        CLAIM_ISSUED_AT: issued_at,
        CLAIM_EXPIRES_AT: _expiry_timestamp(
            expires_delta,
        ),
    }


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
    user_id:
        Authenticated user's unique identifier.

    email:
        Authenticated user's email address.

    role:
        Authenticated user's application role.

    expires_delta:
        Optional custom token lifetime.

    Returns
    -------
    str
        Signed JWT access token.

    Raises
    ------
    ValueError
        If a required value is missing or the expiration duration
        is invalid.

    Security
    --------
    The token itself is never logged.
    """

    normalized_user_id = user_id.strip()
    normalized_email = email.strip()
    normalized_role = role.strip()

    if not normalized_user_id:
        raise ValueError(
            "User ID cannot be empty."
        )

    if not normalized_email:
        raise ValueError(
            "Email cannot be empty."
        )

    if not normalized_role:
        raise ValueError(
            "Role cannot be empty."
        )

    payload = _build_access_token_payload(
        user_id=normalized_user_id,
        email=normalized_email,
        role=normalized_role,
        expires_delta=expires_delta,
    )

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

    logger.debug(
        "Access token created.",
        extra={
            "user_id": normalized_user_id,
            "role": normalized_role,
            "token_type": ACCESS_TOKEN_TYPE,
        },
    )

    return token

    # ==========================================================
# Internal JWT Decoding
# ==========================================================


def _decode_jwt(
    token: str,
) -> dict[str, Any]:
    """
    Decode and cryptographically validate a JWT.

    The JWT library validates:

    - Signature
    - Algorithm
    - Expiration
    - Issuer
    - Audience

    Parameters
    ----------
    token:
        Encoded JWT.

    Returns
    -------
    dict[str, Any]
        Decoded JWT payload.

    Raises
    ------
    ExpiredSignatureError
        When the token has expired.

    JWTError
        When JWT decoding or validation fails.
    """

    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[
            settings.ALGORITHM,
        ],
        issuer=settings.JWT_ISSUER,
        audience=settings.JWT_AUDIENCE,
    )


# ==========================================================
# JWT Claim Validation
# ==========================================================


def _validate_required_claims(
    payload: dict[str, Any],
) -> None:
    """
    Validate that all required application claims are present.

    Parameters
    ----------
    payload:
        Decoded JWT payload.

    Raises
    ------
    ValueError
        If one or more required claims are missing.
    """

    missing_claims = tuple(
        claim
        for claim in _REQUIRED_CLAIMS
        if claim not in payload
    )

    if missing_claims:
        logger.warning(
            "JWT is missing required claims.",
            extra={
                "missing_claims": list(missing_claims),
            },
        )

        raise ValueError(
            "JWT is missing required claims."
        )


def _validate_string_claim(
    payload: dict[str, Any],
    claim_name: str,
) -> str:
    """
    Validate and return a required non-empty string claim.

    Parameters
    ----------
    payload:
        JWT payload.

    claim_name:
        Claim to validate.

    Returns
    -------
    str
        Normalized claim value.

    Raises
    ------
    ValueError
        If the claim is missing, not a string, or empty.
    """

    value = payload.get(claim_name)

    if not isinstance(value, str):
        raise ValueError(
            f"JWT claim '{claim_name}' is invalid."
        )

    normalized_value = value.strip()

    if not normalized_value:
        raise ValueError(
            f"JWT claim '{claim_name}' is empty."
        )

    return normalized_value


def _validate_token_type(
    payload: dict[str, Any],
) -> None:
    """
    Validate that the JWT is an access token.

    Parameters
    ----------
    payload:
        Decoded JWT payload.

    Raises
    ------
    ValueError
        If the token type is invalid.
    """

    token_type = _validate_string_claim(
        payload,
        CLAIM_TOKEN_TYPE,
    )

    expected_type = ACCESS_TOKEN_TYPE

    if token_type.lower() != expected_type.lower():
        logger.warning(
            "JWT token type is invalid.",
            extra={
                "expected_token_type": expected_type,
                "received_token_type": token_type,
            },
        )

        raise ValueError(
            "Invalid JWT token type."
        )


def _validate_issuer(
    payload: dict[str, Any],
) -> None:
    """
    Validate the JWT issuer claim.

    Although the JWT library already validates the issuer,
    this explicit application-level check keeps the expected
    JWT contract visible and defensive.
    """

    issuer = _validate_string_claim(
        payload,
        CLAIM_ISSUER,
    )

    if issuer != settings.JWT_ISSUER:
        raise ValueError(
            "Invalid JWT issuer."
        )


def _validate_audience(
    payload: dict[str, Any],
) -> None:
    """
    Validate the JWT audience claim.

    The JWT library already validates the audience during decode.
    This method performs an additional application-level check.
    """

    audience = payload.get(
        CLAIM_AUDIENCE,
    )

    if isinstance(audience, str):
        audiences = {
            audience,
        }

    elif isinstance(audience, list):
        audiences = {
            value
            for value in audience
            if isinstance(value, str)
        }

    else:
        raise ValueError(
            "Invalid JWT audience."
        )

    if settings.JWT_AUDIENCE not in audiences:
        raise ValueError(
            "Invalid JWT audience."
        )


def _validate_payload(
    payload: dict[str, Any],
) -> dict[str, Any]:
    """
    Perform application-level validation of a decoded JWT.

    Parameters
    ----------
    payload:
        Decoded JWT payload.

    Returns
    -------
    dict[str, Any]
        Validated payload.

    Raises
    ------
    ValueError
        If the JWT does not satisfy the application contract.
    """

    _validate_required_claims(
        payload,
    )

    _validate_string_claim(
        payload,
        CLAIM_SUBJECT,
    )

    _validate_string_claim(
        payload,
        CLAIM_USER_ID,
    )

    _validate_string_claim(
        payload,
        CLAIM_ROLE,
    )

    _validate_token_type(
        payload,
    )

    _validate_issuer(
        payload,
    )

    _validate_audience(
        payload,
    )

    return payload


# ==========================================================
# JWT Decoding & Authentication Validation
# ==========================================================


def decode_access_token(
    token: str,
) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Parameters
    ----------
    token:
        Encoded JWT access token.

    Returns
    -------
    dict[str, Any]
        Validated JWT payload.

    Raises
    ------
    AuthenticationError
        When the token is empty, expired, malformed,
        cryptographically invalid, or violates the
        application JWT contract.

    Notes
    -----
    The raw token is never logged.

    Internal JWT library errors are never returned directly
    to API consumers.
    """

    if not token or not token.strip():
        logger.warning(
            "Empty JWT received."
        )

        raise AuthenticationError(
            message=INVALID_TOKEN_MESSAGE,
        )

    try:
        payload = _decode_jwt(
            token.strip(),
        )

        validated_payload = _validate_payload(
            payload,
        )

        logger.debug(
            "JWT successfully validated.",
            extra={
                "user_id": validated_payload.get(
                    CLAIM_USER_ID,
                ),
                "role": validated_payload.get(
                    CLAIM_ROLE,
                ),
                "token_type": validated_payload.get(
                    CLAIM_TOKEN_TYPE,
                ),
            },
        )

        return validated_payload

    except ExpiredSignatureError as exc:
        logger.warning(
            "JWT authentication failed because the token expired."
        )

        raise AuthenticationError(
            message=TOKEN_EXPIRED_MESSAGE,
        ) from exc

    except ValueError as exc:
        logger.warning(
            "JWT application validation failed.",
            extra={
                "reason": str(exc),
            },
        )

        raise AuthenticationError(
            message=INVALID_TOKEN_MESSAGE,
        ) from exc

    except JWTError as exc:
        logger.warning(
            "JWT cryptographic validation failed."
        )

        raise AuthenticationError(
            message=INVALID_TOKEN_MESSAGE,
        ) from exc
        
    # ==========================================================
# Authentication Helper Functions
# ==========================================================


def get_token_subject(
    token: str,
) -> str:
    """
    Return the authenticated user's email from the JWT subject.

    Parameters
    ----------
    token:
        Encoded JWT access token.

    Returns
    -------
    str
        Authenticated user's email.

    Raises
    ------
    AuthenticationError
        If the token is invalid or the subject is missing.
    """

    payload = decode_access_token(
        token,
    )

    subject = payload.get(
        CLAIM_SUBJECT,
    )

    if not isinstance(subject, str) or not subject.strip():
        logger.warning(
            "JWT subject is missing or invalid."
        )

        raise AuthenticationError(
            message=INVALID_TOKEN_MESSAGE,
        )

    return subject.strip()


def get_user_id(
    token: str,
) -> str:
    """
    Return the authenticated user's ID from the JWT.

    Parameters
    ----------
    token:
        Encoded JWT access token.

    Returns
    -------
    str
        Authenticated user's ID.

    Raises
    ------
    AuthenticationError
        If the token is invalid or the user ID is missing.
    """

    payload = decode_access_token(
        token,
    )

    user_id = payload.get(
        CLAIM_USER_ID,
    )

    if not isinstance(user_id, str) or not user_id.strip():
        logger.warning(
            "JWT user ID is missing or invalid."
        )

        raise AuthenticationError(
            message=INVALID_TOKEN_MESSAGE,
        )

    return user_id.strip()


def get_user_role(
    token: str,
) -> str:
    """
    Return the authenticated user's role from the JWT.

    Parameters
    ----------
    token:
        Encoded JWT access token.

    Returns
    -------
    str
        Authenticated user's role.

    Raises
    ------
    AuthenticationError
        If the token is invalid or the role is missing.
    """

    payload = decode_access_token(
        token,
    )

    role = payload.get(
        CLAIM_ROLE,
    )

    if not isinstance(role, str) or not role.strip():
        logger.warning(
            "JWT role is missing or invalid."
        )

        raise AuthenticationError(
            message=INVALID_TOKEN_MESSAGE,
        )

    return role.strip()


# ==========================================================
# Public Exports
# ==========================================================

__all__ = (
    "AUTHENTICATION_SCHEME",
    "CLAIM_AUDIENCE",
    "CLAIM_EXPIRES_AT",
    "CLAIM_ISSUED_AT",
    "CLAIM_ISSUER",
    "CLAIM_ROLE",
    "CLAIM_SUBJECT",
    "CLAIM_TOKEN_TYPE",
    "CLAIM_USER_ID",
    "create_access_token",
    "decode_access_token",
    "get_token_subject",
    "get_user_id",
    "get_user_role",
    "hash_password",
    "verify_password",
)