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

Business logic remains entirely inside AuthService.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- Python 3.12+
==========================================================
"""

from __future__ import annotations

from fastapi import APIRouter, status

from app.api.deps import (
    AuthServiceDep,
    CurrentUser,
)
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
)
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register User",
    response_description="Successfully registered user.",
)
def register(
    request: RegisterRequest,
    auth_service: AuthServiceDep,
) -> AuthResponse:
    """
    Register a new user account.

    Business logic is delegated to AuthService.
    """

    return auth_service.register(request)


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Login User",
    response_description="JWT access token.",
)
def login(
    request: LoginRequest,
    auth_service: AuthServiceDep,
) -> AuthResponse:
    """
    Authenticate a user.

    Business logic is delegated to AuthService.
    """

    return auth_service.login(request)


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Current User",
    response_description="Authenticated user.",
)
def get_me(
    current_user: CurrentUser,
) -> UserResponse:
    """
    Return the currently authenticated user.
    """

    return UserResponse.model_validate(current_user)