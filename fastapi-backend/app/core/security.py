"""
==========================================================
Security Utilities
==========================================================

Provides:

✓ Password hashing (Argon2)
✓ Password verification
✓ JWT Access Token creation
✓ JWT decoding
✓ JWT validation
✓ Authentication helpers

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- python-jose
- pwdlib
==========================================================
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import HTTPException, status
from jose import ExpiredSignatureError, JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings
from app.core.constants import (
    ACCESS_TOKEN_TYPE,
    INVALID_TOKEN_MESSAGE,
    TOKEN_EXPIRED_MESSAGE,
)
from app.core.logging import get_logger

logger = get_logger(__name__)

# ==========================================================
# Password Hashing
# ==========================================================

_password_hasher = PasswordHash.recommended()

# ==========================================================
# Password Utilities
# ==========================================================


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using Argon2.
    """

    return _password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against its hash.
    """

    return _password_hasher.verify(
        plain_password,
        hashed_password,
    )


# ==========================================================
# JWT Utilities
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
    """

    now = datetime.now(UTC)

    expire = now + (
        expires_delta
        or timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload: dict[str, Any] = {
        "sub": email,
        "user_id": user_id,
        "role": role,
        "type": ACCESS_TOKEN_TYPE.lower(),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict[str, Any]:
    """
    Decode and validate a JWT access token.
    """

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

    except ExpiredSignatureError as exc:
        logger.warning("Expired JWT received.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=TOKEN_EXPIRED_MESSAGE,
        ) from exc

    except JWTError as exc:
        logger.warning("Invalid JWT received.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN_MESSAGE,
        ) from exc

    required_claims = (
        "sub",
        "user_id",
        "role",
        "type",
    )

    for claim in required_claims:
        if claim not in payload:
            logger.warning(
                "JWT missing required claim: %s",
                claim,
            )

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=INVALID_TOKEN_MESSAGE,
            )

    return payload


def get_token_subject(
    token: str,
) -> str:
    """
    Return the authenticated user's email.
    """

    payload = decode_access_token(token)

    return str(payload["sub"])


def get_user_id(
    token: str,
) -> str:
    """
    Return the authenticated user's ID.
    """

    payload = decode_access_token(token)

    return str(payload["user_id"])


def get_user_role(
    token: str,
) -> str:
    """
    Return the authenticated user's role.
    """

    payload = decode_access_token(token)

    return str(payload["role"])