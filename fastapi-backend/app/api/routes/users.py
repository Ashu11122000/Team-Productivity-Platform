"""
===============================================================================
Users Router
===============================================================================

Enterprise FastAPI router responsible for exposing all User Management REST APIs.

Responsibilities
----------------
• Receive HTTP requests
• Validate request payloads
• Validate path and query parameters
• Authenticate users
• Delegate business logic to UserService
• Return response DTOs
• Generate OpenAPI documentation

Architecture
------------
                HTTP Request
                     │
                     ▼
                Users Router
                     │
                     ▼
                UserService
                     │
                     ▼
              UserRepository
                     │
                     ▼
                PostgreSQL

Design Principles
-----------------
• Thin Controller Pattern
• Service Layer Architecture
• Dependency Injection
• Repository Pattern
• Single Responsibility Principle
• OpenAPI First Design
• Enterprise Ready
• Clean Architecture

Business Rules
--------------
This router NEVER contains business logic.

All business rules are delegated to:

    • UserService

The router is responsible only for coordinating HTTP communication.

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• Pydantic v2
• Python 3.12+
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

__all__ = [
    "router",
]

# =============================================================================
# Module Constants
# =============================================================================

DEFAULT_PAGE: int = 1

DEFAULT_PAGE_SIZE: int = 20

MIN_PAGE_SIZE: int = 1

MAX_PAGE_SIZE: int = 100

MIN_PAGE_NUMBER: int = 1

MIN_SEARCH_LENGTH: int = 1

ROUTER_PREFIX: str = "/users"

USER_TAG: str = "Users"

# =============================================================================
# Router Configuration
# =============================================================================

router = APIRouter(
    prefix=ROUTER_PREFIX,
    tags=[USER_TAG],
)

# =============================================================================
# Type Aliases
# =============================================================================

UserResponseList = list[UserResponse]

UserSummaryList = list[UserSummary]

UserStatistics = dict[str, int]

# =============================================================================
# Default Query Values
# =============================================================================

DEFAULT_PAGE_QUERY = DEFAULT_PAGE

DEFAULT_PAGE_SIZE_QUERY = DEFAULT_PAGE_SIZE

# =============================================================================
# End Module Configuration
# =============================================================================
# =============================================================================
# Shared Path Parameter Aliases
# =============================================================================

UserId = Annotated[
    int,
    Path(
        ge=1,
        description="Unique user identifier.",
    ),
]

# =============================================================================
# Shared Pagination Query Aliases
# =============================================================================

PageNumber = Annotated[
    int,
    Query(
        ge=MIN_PAGE_NUMBER,
        description="Page number starting from 1.",
    ),
]

PageSize = Annotated[
    int,
    Query(
        ge=MIN_PAGE_SIZE,
        le=MAX_PAGE_SIZE,
        description="Maximum number of users returned.",
    ),
]

# =============================================================================
# Search Query Alias
# =============================================================================

SearchQuery = Annotated[
    str,
    Query(
        min_length=MIN_SEARCH_LENGTH,
        description="Search users by email address.",
    ),
]

# =============================================================================
# Route Summaries
# =============================================================================

GET_CURRENT_USER_SUMMARY = "Get Current User"

LIST_USERS_SUMMARY = "List Users"

GET_USER_SUMMARY = "Get User"

UPDATE_USER_SUMMARY = "Update User"

DELETE_USER_SUMMARY = "Delete User"

LIST_ACTIVE_USERS_SUMMARY = "List Active Users"

SEARCH_USERS_SUMMARY = "Search Users"

USER_STATISTICS_SUMMARY = "User Statistics"

ACTIVATE_USER_SUMMARY = "Activate User"

DEACTIVATE_USER_SUMMARY = "Deactivate User"

# =============================================================================
# Response Descriptions
# =============================================================================

CURRENT_USER_RESPONSE = "Authenticated user."

USER_LIST_RESPONSE = "List of users."

USER_RESPONSE = "Requested user."

UPDATED_USER_RESPONSE = "Updated user."

DELETED_USER_RESPONSE = "User deleted successfully."

ACTIVE_USERS_RESPONSE = "List of active users."

SEARCH_USERS_RESPONSE = "Matching users."

USER_STATISTICS_RESPONSE = "Platform user statistics."

ACTIVATED_USER_RESPONSE = "Activated user."

DEACTIVATED_USER_RESPONSE = "Deactivated user."

# =============================================================================
# End Parameter Aliases
# =============================================================================

# =============================================================================
# Current User Endpoints
# =============================================================================

@router.get(
    "/me",
    response_model=UserResponse,
    summary=GET_CURRENT_USER_SUMMARY,
    response_description=CURRENT_USER_RESPONSE,
)
def get_current_user_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Retrieve the currently authenticated user.

    Responsibilities
    ----------------
    • Authenticate the incoming request.
    • Delegate user retrieval to the service layer.
    • Return the authenticated user's profile.

    Business Rules
    --------------
    • Authentication is required.
    • The authenticated user may retrieve only their own profile.
    • Business validation is performed by ``UserService``.

    Parameters
    ----------
    current_user:
        Authenticated user injected by the authentication dependency.

    user_service:
        User service responsible for business logic.

    Returns
    -------
    UserResponse
        Authenticated user's profile information.
    """
    return user_service.get_current_user(
        current_user=current_user,
    )


# =============================================================================
# End Current User Endpoints
# =============================================================================

# =============================================================================
# User Retrieval Endpoints
# =============================================================================

@router.get(
    "",
    response_model=UserResponseList,
    summary=LIST_USERS_SUMMARY,
    response_description=USER_LIST_RESPONSE,
)
def list_users_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
    page: PageNumber = DEFAULT_PAGE_QUERY,
    limit: PageSize = DEFAULT_PAGE_SIZE_QUERY,
) -> UserResponseList:
    """
    Retrieve a paginated list of users.

    Administrator access is required.

    Responsibilities
    ----------------
    • Authenticate the current user.
    • Validate pagination parameters.
    • Delegate retrieval to the service layer.
    • Return the requested page of users.

    Business Rules
    --------------
    • Only administrators may access this endpoint.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    current_user:
        Authenticated administrator.

    user_service:
        User service responsible for business logic.

    page:
        Requested page number.

    limit:
        Maximum number of users returned.

    Returns
    -------
    UserResponseList
        Collection of platform users.
    """
    _, users = user_service.list_users(
        current_user=current_user,
        page=page,
        limit=limit,
    )

    return users


# =============================================================================
# Get User
# =============================================================================

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary=GET_USER_SUMMARY,
    response_description=USER_RESPONSE,
)
def get_user_api(
    user_id: UserId,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Retrieve a user by identifier.

    Responsibilities
    ----------------
    • Validate the user identifier.
    • Delegate retrieval to the service layer.
    • Return the requested user.

    Business Rules
    --------------
    • User existence is validated by ``UserService``.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    user_service:
        User service responsible for business logic.

    Returns
    -------
    UserResponse
        Requested user profile.
    """
    return user_service.get_user_by_id(
        user_id=user_id,
    )


# =============================================================================
# End User Retrieval Endpoints
# =============================================================================
# =============================================================================
# Profile Management Endpoints
# =============================================================================

@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary=UPDATE_USER_SUMMARY,
    response_description=UPDATED_USER_RESPONSE,
)
def update_user_api(
    user_id: UserId,
    user_data: UserUpdate,
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Update a user's profile.

    Users may update their own profile.
    Administrators may update any user's profile.

    Responsibilities
    ----------------
    • Validate the user identifier.
    • Validate the request payload.
    • Authenticate the current user.
    • Delegate update logic to the service layer.
    • Return the updated user profile.

    Business Rules
    --------------
    • Users may update their own account.
    • Administrators may update any account.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    user_data:
        Updated user profile information.

    current_user:
        Authenticated user.

    user_service:
        User service responsible for business logic.

    Returns
    -------
    UserResponse
        Updated user profile.
    """
    return user_service.update_user(
        current_user=current_user,
        user_id=user_id,
        user_data=user_data,
    )


# =============================================================================
# Delete User
# =============================================================================

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary=DELETE_USER_SUMMARY,
    response_description=DELETED_USER_RESPONSE,
)
def delete_user_api(
    user_id: UserId,
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> None:
    """
    Delete a user account.

    Users may delete their own account.
    Administrators may delete any account except their own.

    Responsibilities
    ----------------
    • Validate the user identifier.
    • Authenticate the current user.
    • Delegate deletion to the service layer.
    • Return HTTP 204 when deletion succeeds.

    Business Rules
    --------------
    • Users may delete their own account.
    • Administrators may delete other user accounts.
    • Administrators cannot delete their own account.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    current_user:
        Authenticated user.

    user_service:
        User service responsible for business logic.
    """
    user_service.delete_user(
        current_user=current_user,
        user_id=user_id,
    )


# =============================================================================
# End Profile Management Endpoints
# =============================================================================
# =============================================================================
# Administrator Endpoints
# =============================================================================

@router.get(
    "/active",
    response_model=UserSummaryList,
    summary=LIST_ACTIVE_USERS_SUMMARY,
    response_description=ACTIVE_USERS_RESPONSE,
)
def list_active_users_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
    page: PageNumber = DEFAULT_PAGE_QUERY,
    limit: PageSize = DEFAULT_PAGE_SIZE_QUERY,
) -> UserSummaryList:
    """
    Retrieve a paginated list of active users.

    Administrator access is required.

    Responsibilities
    ----------------
    • Authenticate the current user.
    • Validate pagination parameters.
    • Delegate retrieval to the service layer.
    • Return active users.

    Business Rules
    --------------
    • Only administrators may access this endpoint.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    current_user:
        Authenticated administrator.

    user_service:
        User service responsible for business logic.

    page:
        Requested page number.

    limit:
        Maximum number of users returned.

    Returns
    -------
    UserSummaryList
        Collection of active users.
    """
    _, users = user_service.list_active_users(
        current_user=current_user,
        page=page,
        limit=limit,
    )

    return users


# =============================================================================
# Search Users
# =============================================================================

@router.get(
    "/search",
    response_model=UserSummaryList,
    summary=SEARCH_USERS_SUMMARY,
    response_description=SEARCH_USERS_RESPONSE,
)
def search_users_api(
    query: SearchQuery,
    current_user: CurrentUser,
    user_service: UserServiceDep,
    page: PageNumber = DEFAULT_PAGE_QUERY,
    limit: PageSize = DEFAULT_PAGE_SIZE_QUERY,
) -> UserSummaryList:
    """
    Search users by email address.

    Administrator access is required.

    Responsibilities
    ----------------
    • Authenticate the current user.
    • Validate the search query.
    • Validate pagination parameters.
    • Delegate search logic to the service layer.
    • Return matching users.

    Business Rules
    --------------
    • Only administrators may perform user searches.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    query:
        Search keyword.

    current_user:
        Authenticated administrator.

    user_service:
        User service responsible for business logic.

    page:
        Requested page number.

    limit:
        Maximum number of users returned.

    Returns
    -------
    UserSummaryList
        Users matching the search criteria.
    """
    return user_service.search_users(
        current_user=current_user,
        query=query,
        page=page,
        limit=limit,
    )


# =============================================================================
# User Statistics
# =============================================================================

@router.get(
    "/statistics",
    response_model=UserStatistics,
    summary=USER_STATISTICS_SUMMARY,
    response_description=USER_STATISTICS_RESPONSE,
)
def get_statistics_api(
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserStatistics:
    """
    Retrieve platform-wide user statistics.

    Administrator access is required.

    Responsibilities
    ----------------
    • Authenticate the current user.
    • Delegate statistics retrieval to the service layer.
    • Return aggregated platform statistics.

    Business Rules
    --------------
    • Only administrators may access user statistics.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    current_user:
        Authenticated administrator.

    user_service:
        User service responsible for business logic.

    Returns
    -------
    UserStatistics
        Aggregated user statistics.
    """
    return user_service.get_statistics(
        current_user=current_user,
    )


# =============================================================================
# End Administrator Endpoints
# =============================================================================

# =============================================================================
# Account Administration Endpoints
# =============================================================================

@router.patch(
    "/{user_id}/activate",
    response_model=UserResponse,
    summary=ACTIVATE_USER_SUMMARY,
    response_description=ACTIVATED_USER_RESPONSE,
)
def activate_user_api(
    user_id: UserId,
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Activate a user account.

    Administrator access is required.

    Responsibilities
    ----------------
    • Validate the user identifier.
    • Authenticate the current user.
    • Delegate activation to the service layer.
    • Return the activated user.

    Business Rules
    --------------
    • Only administrators may activate user accounts.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    current_user:
        Authenticated administrator.

    user_service:
        User service responsible for business logic.

    Returns
    -------
    UserResponse
        Activated user profile.
    """
    return user_service.activate_user(
        current_user=current_user,
        user_id=user_id,
    )


# =============================================================================
# Deactivate User
# =============================================================================

@router.patch(
    "/{user_id}/deactivate",
    response_model=UserResponse,
    summary=DEACTIVATE_USER_SUMMARY,
    response_description=DEACTIVATED_USER_RESPONSE,
)
def deactivate_user_api(
    user_id: UserId,
    current_user: CurrentUser,
    user_service: UserServiceDep,
) -> UserResponse:
    """
    Deactivate a user account.

    Administrator access is required.

    Responsibilities
    ----------------
    • Validate the user identifier.
    • Authenticate the current user.
    • Delegate deactivation to the service layer.
    • Return the updated user.

    Business Rules
    --------------
    • Only administrators may deactivate user accounts.
    • Authorization is enforced by ``UserService``.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    current_user:
        Authenticated administrator.

    user_service:
        User service responsible for business logic.

    Returns
    -------
    UserResponse
        Deactivated user profile.
    """
    return user_service.deactivate_user(
        current_user=current_user,
        user_id=user_id,
    )


# =============================================================================
# End Users Router
# =============================================================================