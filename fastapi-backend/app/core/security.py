"""
==========================================================
Security Utilities
==========================================================

Provides:

✓ Password hashing (Argon2)
✓ Password verification
✓ JWT Access Token creation
✓ JWT decoding & validation

Compatible with:

- FastAPI
- SQLAlchemy 2.0
- Pydantic v2
- python-jose
==========================================================
"""

from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import HTTPException, status
from jose import ExpiredSignatureError, JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings

# ==========================================================
# Password Hashing
# ==========================================================

password_hash = PasswordHash.recommended()

# ==========================================================
# Password Utilities
# ==========================================================

def hash_password(password: str) -> str:
    """
    Hash a plain text password using Argon2.
    """
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a password against its hash.
    """
    return password_hash.verify(
        plain_password,
        hashed_password,
    )

# ==========================================================
# JWT Utilities
# ==========================================================

def create_access_token(
    user_id: str,
    email: str,
    role: str,
) -> str:
    """
    Create a JWT access token.
    """

    now = datetime.now(timezone.utc)

    expire = now + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": email,
        "user_id": user_id,
        "role": role,
        "type": "access",
        "iat": now,
        "exp": expire,
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

        return payload

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired",
        )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )


def get_token_subject(
    token: str,
) -> str:
    """
    Return the authenticated user's email.
    """

    payload = decode_access_token(token)

    subject = payload.get("sub")

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    return subject