"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.api.routes.users

Architecture:
    Clean Architecture
    Thin Controller Pattern
    Service Layer Pattern
    Repository Pattern

Python:
    3.12+

Framework:
    FastAPI

Database:
    PostgreSQL

ORM:
    SQLAlchemy 2.x

Validation:
    Pydantic v2
===============================================================================

Overview
--------
Enterprise FastAPI router responsible for exposing all User Management REST
APIs.

This router acts strictly as the HTTP transport layer between API clients and
the UserService business layer.

The router is intentionally thin and contains no business logic.

Responsibilities
----------------
• Receive HTTP requests
• Validate request payloads
• Validate path parameters
• Validate query parameters
• Obtain the authenticated user
• Inject UserService
• Delegate business operations to UserService
• Return response DTOs
• Define HTTP status codes
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
                SQLAlchemy
                     │
                     ▼
                PostgreSQL

Layer Responsibilities
-----------------------

Router
    • HTTP transport
    • Request validation
    • Dependency injection
    • Response serialization
    • OpenAPI metadata

UserService
    • Business rules
    • Authorization
    • User lifecycle
    • User validation
    • Profile management
    • Administrator workflows

UserRepository
    • Persistence
    • CRUD
    • Queries
    • Pagination
    • Filtering
    • Sorting
    • Aggregates

Business Rules
--------------
This router NEVER contains business logic.

All business rules are delegated to:

    app.services.user_service.UserService

In particular, the router does not determine:

• Whether a user is an administrator
• Whether a user may update another account
• Whether a user may delete an account
• Whether an account may be activated
• Whether an account may be deactivated
• Whether a user may access administrator endpoints

Those decisions belong to UserService.

Authentication
--------------
Authentication is supplied through the established API dependency layer.

The router uses:

    CurrentUser

for the authenticated user and:

    UserServiceDep

for the UserService dependency.

Microservice Ownership
----------------------
FastAPI owns:

• Authentication
• Users
• Profiles
• Notes
• Open Library integration

NestJS owns:

• Tasks
• Categories
• Tags
• Notifications
• Analytics
• Dashboard
• Activity Logs

This router must not implement NestJS-owned business logic.

Design Principles
-----------------
• Thin Controller Pattern
• Clean Architecture
• Service Layer Architecture
• Dependency Injection
• Repository Pattern
• Single Responsibility Principle
• Explicit typing
• OpenAPI-first documentation
• Centralized business logic
• Production-oriented implementation

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• Pydantic v2
• PostgreSQL
• Python 3.12+

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from typing import Annotated, TypeAlias

# =============================================================================
# Third-Party Imports
# =============================================================================

from fastapi import (
    APIRouter,
    Path,
    Query,
    status,
)

# =============================================================================
# Application Dependencies
# =============================================================================

from app.api.deps import (
    CurrentUser,
    UserServiceDep,
)

# =============================================================================
# Schema Imports
# =============================================================================

from app.schemas.user import (
    UserResponse,
    UserSummary,
    UserUpdate,
)

# =============================================================================
# Public Module Exports
# =============================================================================

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

UserResponseList: TypeAlias = list[UserResponse]

UserSummaryList: TypeAlias = list[UserSummary]

UserStatistics: TypeAlias = dict[str, int]

# =============================================================================
# Default Query Values
# =============================================================================

DEFAULT_PAGE_QUERY: int = DEFAULT_PAGE

DEFAULT_PAGE_SIZE_QUERY: int = DEFAULT_PAGE_SIZE

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
        description="Maximum number of users returned per page.",
    ),
]

# =============================================================================
# Search Query Alias
# =============================================================================

SearchQuery = Annotated[
    str,
    Query(
        min_length=MIN_SEARCH_LENGTH,
        description="Search users by email address or supported user fields.",
    ),
]

# =============================================================================
# Route Summaries
# =============================================================================

GET_CURRENT_USER_SUMMARY: str = "Get Current User"

LIST_USERS_SUMMARY: str = "List Users"

LIST_ACTIVE_USERS_SUMMARY: str = "List Active Users"

SEARCH_USERS_SUMMARY: str = "Search Users"

USER_STATISTICS_SUMMARY: str = "User Statistics"

ACTIVATE_USER_SUMMARY: str = "Activate User"

DEACTIVATE_USER_SUMMARY: str = "Deactivate User"

GET_USER_SUMMARY: str = "Get User"

UPDATE_USER_SUMMARY: str = "Update User"

DELETE_USER_SUMMARY: str = "Delete User"

# =============================================================================
# Response Descriptions
# =============================================================================

CURRENT_USER_RESPONSE: str = "Authenticated user."

USER_LIST_RESPONSE: str = "List of users."

ACTIVE_USERS_RESPONSE: str = "List of active users."

SEARCH_USERS_RESPONSE: str = "Matching users."

USER_STATISTICS_RESPONSE: str = "Platform user statistics."

ACTIVATED_USER_RESPONSE: str = "Activated user."

DEACTIVATED_USER_RESPONSE: str = "Deactivated user."

USER_RESPONSE: str = "Requested user."

UPDATED_USER_RESPONSE: str = "Updated user."

DELETED_USER_RESPONSE: str = "User deleted successfully."

# =============================================================================
# Current User Endpoint
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
    Retrieve the currently authenticated user's profile.

    Authentication is required.

    Business logic is delegated entirely to UserService.

    Parameters
    ----------
    current_user:
        Authenticated user supplied by the authentication dependency.

    user_service:
        Injected UserService instance.

    Returns
    -------
    UserResponse
        Authenticated user's profile.
    """
    return user_service.get_current_user(
        current_user=current_user,
    )


# =============================================================================
# User Collection Endpoints
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

    UserService performs the authorization check and delegates persistence to
    UserRepository.

    Parameters
    ----------
    current_user:
        Authenticated user.

    user_service:
        Injected UserService instance.

    page:
        One-based page number.

    limit:
        Maximum number of users returned.

    Returns
    -------
    UserResponseList
        Users returned for the requested page.
    """
    _, users = user_service.list_users(
        current_user=current_user,
        page=page,
        limit=limit,
    )

    return users


# =============================================================================
# Active Users
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

    Parameters
    ----------
    current_user:
        Authenticated user.

    user_service:
        Injected UserService instance.

    page:
        One-based page number.

    limit:
        Maximum number of users returned.

    Returns
    -------
    UserSummaryList
        Active users returned for the requested page.
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
    Search users using the configured UserRepository search capabilities.

    Administrator access is required.

    Parameters
    ----------
    query:
        Search keyword.

    current_user:
        Authenticated user.

    user_service:
        Injected UserService instance.

    page:
        One-based page number.

    limit:
        Maximum number of users returned.

    Returns
    -------
    UserSummaryList
        Matching users.
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

    Parameters
    ----------
    current_user:
        Authenticated user.

    user_service:
        Injected UserService instance.

    Returns
    -------
    UserStatistics
        Aggregated platform user statistics.
    """
    return user_service.get_statistics(
        current_user=current_user,
    )


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

    Authorization and business rules are delegated to UserService.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    current_user:
        Authenticated administrator.

    user_service:
        Injected UserService instance.

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

    Administrators cannot deactivate their own account.

    Authorization and business rules are delegated to UserService.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    current_user:
        Authenticated administrator.

    user_service:
        Injected UserService instance.

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
# User Retrieval
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

    User existence validation is delegated to UserService.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    user_service:
        Injected UserService instance.

    Returns
    -------
    UserResponse
        Requested user profile.
    """
    return user_service.get_user_by_id(
        user_id=user_id,
    )


# =============================================================================
# User Profile Update
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

    UserService determines whether the authenticated user is authorized to
    update the requested account.

    Supported authorization behavior:

    • Users may update their own profile.
    • Administrators may update another user's profile.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    user_data:
        Updated user profile data.

    current_user:
        Authenticated user.

    user_service:
        Injected UserService instance.

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
# User Deletion
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
    Permanently delete a user account.

    Administrator access is required.

    Business rules enforced by UserService include:

    • Only administrators may delete users.
    • Administrators cannot delete their own account.
    • The target user must exist.

    The router does not implement these rules itself.

    Parameters
    ----------
    user_id:
        Unique user identifier.

    current_user:
        Authenticated administrator.

    user_service:
        Injected UserService instance.

    Returns
    -------
    None
        HTTP 204 No Content is returned after successful deletion.
    """
    user_service.delete_user(
        current_user=current_user,
        user_id=user_id,
    )

    return None


# =============================================================================
# End Users Router
# =============================================================================