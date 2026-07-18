"""
==========================================================
Authentication API Routes
==========================================================

REST API endpoints for authentication.

Responsibilities
----------------
- Register users
- Authenticate users
- Return JWT access tokens
- Return the currently authenticated user

Business logic remains in the service layer and security
utilities. Routes are intentionally thin.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- Python 3.12+
==========================================================
"""

from __future__ import annotations

from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import (
    create_access_token,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
)
from app.schemas.user import UserResponse
from app.services.user_service import UserService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register User",
    response_description="Successfully registered user.",
)
def register(
    user: RegisterRequest,
    db: DatabaseSession,
) -> dict:
    """
    Register a new user account.
    """

    existing_user = UserService.get_user_by_email(
        db=db,
        email=user.email,
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered.",
        )

    new_user = UserService.create_user(
        db=db,
        email=user.email,
        password=user.password,
    )

    return {
        "success": True,
        "message": "User registered successfully.",
        "data": {
            "user_id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
        },
    }


@router.post(
    "/login",
    summary="Login User",
    response_description="JWT access token.",
)
def login(
    user: LoginRequest,
    db: DatabaseSession,
) -> dict:
    """
    Authenticate a user and return a JWT access token.
    """

    db_user = UserService.get_user_by_email(
        db=db,
        email=user.email,
    )

    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password.",
        )

    if not verify_password(
        user.password,
        db_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(
        user_id=str(db_user.id),
        email=db_user.email,
        role=db_user.role,
    )

    return {
        "success": True,
        "message": "Login successful.",
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "email": db_user.email,
                "role": db_user.role,
            },
        },
    }


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Current User",
    response_description="Authenticated user.",
)
def get_me(
    current_user: CurrentUser,
) -> UserResponse:
    """
    Return the currently authenticated user.
    """

    return current_user