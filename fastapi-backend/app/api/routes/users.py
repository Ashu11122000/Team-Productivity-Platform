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

Business logic is delegated entirely to UserService.

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
    Path,
    Query,
    status,
)

from app.api.deps import (
    CurrentUser,
    UserServiceDep,
)
from app.schemas.user import (
    UserResponse,
    UserSummary,
    UserUpdate,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

# ==========================================================
# Current User
# ==========================================================


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User",
    response_description="Authenticated user.",
)
def get_current_user_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Return the currently authenticated user.
    """

    return user_service.get_current_user(
        current_user,
    )


# ==========================================================
# List Users
# ==========================================================


@router.get(
    "",
    response_model=list[UserResponse],
    summary="List Users",
    response_description="List of users.",
)
def list_users_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
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
            description="Users per page.",
        ),
    ] = 20,
) -> list[UserResponse]:
    """
    Return a paginated list of users.

    Administrator access required.
    """

    _, users = user_service.list_users(
        current_user=current_user,
        page=page,
        limit=limit,
    )

    return users


# ==========================================================
# Get User
# ==========================================================

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
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Retrieve a user by identifier.
    """

    return user_service.get_user_by_id(
        user_id=user_id,
    )


# ==========================================================
# Update User
# ==========================================================


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
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Update a user's profile.

    Users may update their own profile.
    Administrators may update any profile.
    """

    return user_service.update_user(
        current_user=current_user,
        user_id=user_id,
        user_data=user_data,
    )


# ==========================================================
# Delete User
# ==========================================================


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete User",
    response_description="User deleted successfully.",
)
def delete_user_api(
    user_id: Annotated[
        int,
        Path(
            ge=1,
            description="User identifier.",
        ),
    ],
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> None:
    """
    Delete a user.

    Users may delete their own account.
    Administrators may delete any account except their own.
    """

    user_service.delete_user(
        current_user=current_user,
        user_id=user_id,
    )


# ==========================================================
# Active Users
# ==========================================================

@router.get(
    "/active",
    response_model=list[UserSummary],
    summary="List Active Users",
    response_description="List of active users.",
)
def list_active_users_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
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
            description="Users per page.",
        ),
    ] = 20,
) -> list[UserSummary]:
    """
    Return a paginated list of active users.

    Administrator access required.
    """

    _, users = user_service.list_active_users(
        current_user=current_user,
        page=page,
        limit=limit,
    )

    return users


# ==========================================================
# Search Users
# ==========================================================


@router.get(
    "/search",
    response_model=list[UserSummary],
    summary="Search Users",
    response_description="Matching users.",
)
def search_users_api(
    query: Annotated[
        str,
        Query(
            min_length=1,
            description="Search query.",
        ),
    ],
    current_user: CurrentUser,
    user_service: UserServiceDep,
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
            description="Users per page.",
        ),
    ] = 20,
) -> list[UserSummary]:
    """
    Search users by email.

    Administrator access required.
    """

    return user_service.search_users(
        current_user=current_user,
        query=query,
        page=page,
        limit=limit,
    )


# ==========================================================
# User Statistics
# ==========================================================


@router.get(
    "/statistics",
    response_model=dict[str, int],
    summary="User Statistics",
    response_description="Platform user statistics.",
)
def get_statistics_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> dict[str, int]:
    """
    Retrieve platform user statistics.

    Administrator access required.
    """

    return user_service.get_statistics(
        current_user=current_user,
    )


# ==========================================================
# Activate User
# ==========================================================

@router.patch(
    "/{user_id}/activate",
    response_model=UserResponse,
    summary="Activate User",
    response_description="Activated user.",
)
def activate_user_api(
    user_id: Annotated[
        int,
        Path(
            ge=1,
            description="User identifier.",
        ),
    ],
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Activate a user account.

    Administrator access required.
    """

    return user_service.activate_user(
        current_user=current_user,
        user_id=user_id,
    )


# ==========================================================
# Deactivate User
# ==========================================================


@router.patch(
    "/{user_id}/deactivate",
    response_model=UserResponse,
    summary="Deactivate User",
    response_description="Deactivated user.",
)
def deactivate_user_api(
    user_id: Annotated[
        int,
        Path(
            ge=1,
            description="User identifier.",
        ),
    ],
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Deactivate a user account.

    Administrator access required.
    """

    return user_service.deactivate_user(
        current_user=current_user,
        user_id=user_id,
    )


# ==========================================================
# Module Exports
# ==========================================================

__all__ = [
    "router",
]