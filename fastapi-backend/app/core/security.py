from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings


# Password Hashing (Argon2)
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify password against stored hash.
    """
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    user_id: str,
    email: str,
    role: str,
) -> str:
    """
    Create JWT access token.
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": email,
        "user_id": user_id,
        "role": role,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "exp": expire,
    }

    print(
        "FASTAPI SECRET =",
        repr(settings.SECRET_KEY),
    )

    print(
        "FASTAPI SECRET LENGTH =",
        len(settings.SECRET_KEY),
    )

    print(
        "FASTAPI ISSUER =",
        settings.JWT_ISSUER,
    )

    print(
        "FASTAPI AUDIENCE =",
        settings.JWT_AUDIENCE,
    )

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict[str, Any]:
    """
    Decode and validate JWT token.
    Compatible with NestJS JWT configuration.
    """

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            issuer=settings.JWT_ISSUER,
            audience=settings.JWT_AUDIENCE,
        )

        return payload

    except JWTError as exc:
        raise JWTError(
            "Invalid or expired token"
        ) from exc