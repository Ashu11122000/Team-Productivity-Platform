from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Password Hashing
pwd_context = CryptContext(
    schemes = ["bcrypt"],
    deprecated="auto",
)

def hash_password(password: str) -> str:
    """
    Hash a plain text password.
    """
    return pwd_context.hash(password)

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a password against its hash
    """
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )

# JWT Utilities
def create_access_token(
    *,
    user_id: str,
    email: str,
    role: str
) -> str:
    """
    Create a JWT access token shared between FastAPI and NestJS services.
    
    JWT Payload Example:
    {
        "sub": "1",
        "email": "user@example.com"
        "role": "ADMIN,
        "iss": "team-productivity-platform",
        "aud": "team-productivity-users",
        "type": "access"
    }
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "types": "access",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict[str, Any] | None:
    """
    Decode and Validate JWT Token.
    
    Returns: 
    - Decoded payload if valid
    - None if token is invalid
    """
    try: 
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms = [settings.ALGORITHM], audience=settings.JWT_AUDIENCE, issuer=settings.JWT_ISSUER)
        return payload
    
    except JWTError: 
        return None
    
# JWT Claim Helpers
def extract_user_id(payload: dict[str, Any]) -> str | None:
    """Extract user ID from JWT payload"""
    return payload.get("sub")

def extract_user_email(payload: dict[str, Any]) -> str | None:
    """Extract email from JWT payload"""
    return payload.get("email")

def extract_user_role(payload: dict[str, Any]) -> str | None:
    """Extract role from JWT payload"""
    return payload.get("role")