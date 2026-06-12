from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings

# Password Hashing (Pwdlib + Argon2)
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Hash a plain text password.
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

# JWT Utilities
def create_access_token(
    *,
    user_id: str,
    email: str,
    role: str,
) -> str:
    """
    Create JWT access token shared between
    FastAPI and NestJS services.
    """

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "type": "access",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict[str, Any] | None:
    """
    Decode and validate JWT token.
    """

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )

        return payload

    except JWTError:
        return None

# JWT Claim Helpers
def extract_user_id(
    payload: dict[str, Any],
) -> str | None:
    return payload.get("sub")


def extract_user_email(
    payload: dict[str, Any],
) -> str | None:
    return payload.get("email")


def extract_user_role(
    payload: dict[str, Any],
) -> str | None:
    return payload.get("role")