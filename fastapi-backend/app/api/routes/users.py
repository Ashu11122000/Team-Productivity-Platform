"""
==========================================================
Users API Routes
==========================================================

REST API endpoints for user management.

Responsibilities
----------------
- Retrieve authenticated user information
- Retrieve users (admin)
- Retrieve user by ID
- Update user profile
- Delete user

Business logic is delegated to UserService.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- Python 3.12+
"""

from __future__ import annotations

from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    Path,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    UserUpdate,
)
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User",
    response_description="Authenticated user.",
)
def get_current_user_api(
    current_user: CurrentUser,
) -> UserResponse:
    """
    Return the currently authenticated user.
    """
    return current_user


@router.get(
    "",
    response_model=list[UserResponse],
    summary="List Users",
    response_description="List of users.",
)
def list_users_api(
    page: Annotated[
        int,
        Query(
            ge=1,
            description="Page number.",
        ),
    ] = 1,
    limit: Annotated[
        int,
        Query(
            ge=1,
            le=100,
            description="Number of users per page.",
        ),
    ] = 20,
    db: DatabaseSession = None,
    current_user: CurrentUser = None,
) -> list[UserResponse]:
    """
    Return paginated users.

    Accessible only by administrators.
    """
    _, users = UserService.list_users(
        db=db,
        current_user=current_user,
        page=page,
        limit=limit,
    )

    return users


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get User",
    response_description="Requested user.",
)
def get_user_api(
    user_id: Annotated[
        int,
        Path(
            ge=1,
            description="User identifier.",
        ),
    ],
    db: DatabaseSession,
    current_user: CurrentUser,
) -> UserResponse:
    """
    Retrieve a user by identifier.
    """
    return UserService.get_user_by_id(
        db=db,
        current_user=current_user,
        user_id=user_id,
    )


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update User",
    response_description="Updated user.",
)
def update_user_api(
    user_id: Annotated[
        int,
        Path(
            ge=1,
            description="User identifier.",
        ),
    ],
    user_data: UserUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> UserResponse:
    """
    Update a user's profile.

    A user may update their own profile.
    Administrators may update any user.
    """
    return UserService.update_user(
        db=db,
        current_user=current_user,
        user_id=user_id,
        user_data=user_data,
    )


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete User",
)
def delete_user_api(
    user_id: Annotated[
        int,
        Path(
            ge=1,
            description="User identifier.",
        ),
    ],
    db: DatabaseSession,
    current_user: CurrentUser,
) -> None:
    """
    Delete a user.

    A user may delete their own account.
    Administrators may delete any user.
    """
    UserService.delete_user(
        db=db,
        current_user=current_user,
        user_id=user_id,
    )