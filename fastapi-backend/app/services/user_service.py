"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.services.user_service
Author: Enterprise Engineering Team
Architecture: Clean Architecture | Service Layer
Python: 3.12+
Framework: FastAPI
Database: PostgreSQL
ORM: SQLAlchemy 2.x
Validation: Pydantic v2

===============================================================================

Overview
--------
Enterprise business service responsible for all user management operations.

This service acts as the business layer between the FastAPI routers and the
repository layer. It coordinates authorization, validation, business rules,
response mapping, profile management, account lifecycle operations, and
administrator workflows while delegating all persistence operations to
``UserRepository``.

Authentication responsibilities including:

• User registration
• Login
• JWT generation
• Refresh tokens
• Password verification
• Password reset

belong exclusively to ``AuthService``.

This service intentionally contains **no SQLAlchemy query logic**. Database
interaction is fully delegated to the repository layer in accordance with
Clean Architecture and the Repository Pattern.

Responsibilities
----------------
✓ User creation

✓ User retrieval

✓ User profile management

✓ User updates

✓ Account activation

✓ Account deactivation

✓ Permanent deletion

✓ Administrator operations

✓ User search

✓ Pagination

✓ User statistics

✓ DTO ↔ ORM transformation

✓ Business validation

✓ Structured logging

Architecture
------------
Client
    │
    ▼
FastAPI Router
    │
    ▼
Authentication Dependency
    │
    ▼
UserService
    │
    ▼
UserRepository
    │
    ▼
SQLAlchemy ORM
    │
    ▼
PostgreSQL

The service layer never performs SQLAlchemy queries directly.

Repository Responsibilities
---------------------------
UserRepository is responsible for:

• CRUD operations

• Search

• Pagination

• Filtering

• Sorting

• Aggregate queries

• Transaction persistence

Service Responsibilities
------------------------
UserService is responsible for:

• Business rules

• Authorization

• Role validation

• Profile ownership validation

• Input normalization

• Password hashing coordination

• DTO ↔ ORM mapping

• Administrator workflows

• Statistics orchestration

• Structured logging

Microservice Responsibilities
-----------------------------
FastAPI owns:

• Authentication

• Users

• Notes

• Open Library Integration

NestJS owns:

• Tasks

• Categories

• Tags

• Notifications

• Analytics

• Dashboard

• Activity Logs

These ownership boundaries must never change.

Design Principles
-----------------
• SOLID

• Clean Architecture

• Repository Pattern

• Service Layer Pattern

• Dependency Inversion

• Separation of Concerns

• Explicit Type Hints

• Stateless Business Logic

• Structured Logging

• Enterprise Documentation

Thread Safety
-------------
This service contains no shared mutable state.

Every request receives its own SQLAlchemy session through dependency
injection, making the implementation naturally thread-safe for concurrent
ASGI applications.

Future Extension Points
-----------------------
The architecture is intentionally prepared for:

• Distributed caching

• Audit logging

• Domain events

• Event sourcing

• Background workers

• OpenTelemetry tracing

• Metrics collection

• Message queues

• Identity federation

• SSO integration

• RBAC expansion

• Multi-tenancy

without requiring changes to the public service API.

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from typing import Final, TypeAlias

# =============================================================================
# Third-Party Imports
# =============================================================================

from fastapi import HTTPException, status

# =============================================================================
# Application Core Imports
# =============================================================================

from app.core.constants import UserRole
from app.core.logging import get_logger
from app.core.security import hash_password

# =============================================================================
# Domain Model Imports
# =============================================================================

from app.models.user import User

# =============================================================================
# Repository Imports
# =============================================================================

from app.repositories.user_repository import UserRepository

# =============================================================================
# Schema Imports
# =============================================================================

from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserSummary,
    UserUpdate,
)

# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    "UserService",
]

# =============================================================================
# Module Constants
# =============================================================================

DEFAULT_PAGE: Final[int] = 1

DEFAULT_PAGE_SIZE: Final[int] = 10

DEFAULT_ADMIN_PAGE_SIZE: Final[int] = 20

DEFAULT_SORT_ORDER: Final[str] = "newest"

DEFAULT_USER_ROLE: Final[str] = UserRole.USER.value

ADMIN_ROLE: Final[str] = UserRole.ADMIN.value

MAX_PAGE_SIZE: Final[int] = 100

MIN_PAGE_SIZE: Final[int] = 1

MIN_PAGE_NUMBER: Final[int] = 1

# =============================================================================
# Logging Constants
# =============================================================================

LOG_CREATE: Final[str] = "Create User"

LOG_READ: Final[str] = "Read User"

LOG_UPDATE: Final[str] = "Update User"

LOG_DELETE: Final[str] = "Delete User"

LOG_ACTIVATE: Final[str] = "Activate User"

LOG_DEACTIVATE: Final[str] = "Deactivate User"

LOG_SEARCH: Final[str] = "Search Users"

LOG_LIST: Final[str] = "List Users"

LOG_STATISTICS: Final[str] = "User Statistics"

LOG_ADMIN: Final[str] = "Administrator Operation"

# =============================================================================
# Type Aliases
# =============================================================================

UserResponseList: TypeAlias = list[UserResponse]

UserSummaryList: TypeAlias = list[UserSummary]

PaginatedUsers: TypeAlias = tuple[int, UserResponseList]

PaginatedUserSummaries: TypeAlias = tuple[int, UserSummaryList]

UserStatistics: TypeAlias = dict[str, int]

# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)

# =============================================================================
# User Service
# =============================================================================


class UserService:
    """
    Enterprise service responsible for all user-related business operations.

    This service represents the business layer between the FastAPI routing
    layer and the persistence layer. It coordinates business rules,
    authorization, account lifecycle management, profile updates,
    administrator workflows, response transformation, and validation while
    delegating all persistence operations to ``UserRepository``.

    Authentication responsibilities remain exclusively within AuthService.

    -----------------------------------------------------------------------
    Architecture
    -----------------------------------------------------------------------

        HTTP Request
              │
              ▼
        FastAPI Router
              │
              ▼
        Authentication Dependency
              │
              ▼
        UserService
              │
              ▼
        UserRepository
              │
              ▼
        SQLAlchemy ORM
              │
              ▼
        PostgreSQL

    Routers
    -------
    Responsible for:

    • Request parsing

    • Dependency injection

    • Authentication dependencies

    • Calling service methods

    • Returning API responses

    This service
    ------------
    Responsible for:

    • User business logic

    • Authorization

    • Account lifecycle

    • Profile ownership validation

    • Business validation

    • Password hashing coordination

    • DTO ↔ ORM mapping

    • Pagination orchestration

    • Administrator operations

    • User statistics

    • Structured logging

    Repository
    ----------
    Responsible for:

    • CRUD operations

    • Search

    • Pagination

    • Filtering

    • Sorting

    • Aggregate queries

    • Transaction persistence

    -----------------------------------------------------------------------
    Responsibilities
    -----------------------------------------------------------------------

    ✓ User creation

    ✓ User retrieval

    ✓ User profile management

    ✓ User updates

    ✓ User activation

    ✓ User deactivation

    ✓ User deletion

    ✓ User search

    ✓ Administrator operations

    ✓ User statistics

    ✓ DTO mapping

    ✓ Business validation

    ✓ Audit-ready logging

    -----------------------------------------------------------------------
    Design Principles
    -----------------------------------------------------------------------

    • SOLID

    • Clean Architecture

    • Repository Pattern

    • Service Layer Pattern

    • Dependency Inversion

    • Separation of Concerns

    • Explicit Type Hints

    • Stateless Design

    • Structured Logging

    • Enterprise Documentation

    -----------------------------------------------------------------------
    Future Extension Points
    -----------------------------------------------------------------------

    The service is intentionally designed for future support of:

    • Audit logging

    • Domain events

    • OpenTelemetry tracing

    • Distributed caching

    • Message queues

    • Multi-tenancy

    • Identity federation

    • SSO

    • Advanced RBAC

    • Event sourcing

    • Background workers

    without requiring changes to the public API.
    """

    # =====================================================================
    # Constructor
    # =====================================================================

    def __init__(
        self,
        user_repository: UserRepository,
    ) -> None:
        """
        Initialize the service.

        Parameters
        ----------
        user_repository:
            Repository responsible for all user persistence operations.
        """
        self.user_repository = user_repository

    # =====================================================================
    # Service Metadata
    # =====================================================================

    SERVICE_NAME: Final[str] = "UserService"

    SERVICE_VERSION: Final[str] = "1.0.0"

    DOMAIN_NAME: Final[str] = "users"

    # =====================================================================
    # Pagination Defaults
    # =====================================================================

    DEFAULT_PAGE: Final[int] = DEFAULT_PAGE

    DEFAULT_PAGE_SIZE: Final[int] = DEFAULT_PAGE_SIZE

    DEFAULT_ADMIN_PAGE_SIZE: Final[int] = DEFAULT_ADMIN_PAGE_SIZE

    MAX_PAGE_SIZE: Final[int] = MAX_PAGE_SIZE

    MIN_PAGE_SIZE: Final[int] = MIN_PAGE_SIZE

    # =====================================================================
    # Role Constants
    # =====================================================================

    USER_ROLE: Final[str] = DEFAULT_USER_ROLE

    ADMIN_ROLE: Final[str] = ADMIN_ROLE

    # =====================================================================
    # Logging Prefixes
    # =====================================================================

    LOG_CREATE: Final[str] = LOG_CREATE

    LOG_READ: Final[str] = LOG_READ

    LOG_UPDATE: Final[str] = LOG_UPDATE

    LOG_DELETE: Final[str] = LOG_DELETE

    LOG_ACTIVATE: Final[str] = LOG_ACTIVATE

    LOG_DEACTIVATE: Final[str] = LOG_DEACTIVATE

    LOG_SEARCH: Final[str] = LOG_SEARCH

    LOG_LIST: Final[str] = LOG_LIST

    LOG_STATISTICS: Final[str] = LOG_STATISTICS

    LOG_ADMIN: Final[str] = LOG_ADMIN

    # =====================================================================
    # Private Helper Sections
    # =====================================================================

    # Repository helpers

    # Authorization helpers

    # Validation helpers

    # Response builders

    # Pagination helpers

    # Profile helpers

    # Statistics helpers

    # Utility helpers
        # =====================================================================
    # Repository Helpers
    # =====================================================================

    def _repository(self) -> UserRepository:
        """
        Return the configured repository instance.

        Returns
        -------
        UserRepository
            Repository responsible for all persistence operations.
        """
        return self.user_repository

    # =====================================================================
    # Authorization Helpers
    # =====================================================================

    def _is_admin(
        self,
        user: User,
    ) -> bool:
        """
        Determine whether a user has administrator privileges.

        Parameters
        ----------
        user:
            User ORM model.

        Returns
        -------
        bool
            True if the user is an administrator.
        """
        return user.role == self.ADMIN_ROLE

    def _require_admin(
        self,
        current_user: User,
    ) -> User:
        """
        Ensure the authenticated user has administrator privileges.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        User
            Administrator user.

        Raises
        ------
        HTTPException
            If administrator privileges are missing.
        """
        self._require_active_user(current_user)

        if self._is_admin(current_user):
            return current_user

        logger.warning(
            "%s | user_id=%s email=%s",
            self.LOG_ADMIN,
            current_user.id,
            current_user.email,
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator privileges are required.",
        )

    # =====================================================================
    # Validation Helpers
    # =====================================================================

    def _require_user(
        self,
        user_id: int,
    ) -> User:
        """
        Retrieve a user or raise HTTP 404.

        Parameters
        ----------
        user_id:
            Target user identifier.

        Returns
        -------
        User
            Existing ORM model.
        """
        user = self._repository().get_by_id(user_id)

        if user is not None:
            return user

        logger.warning(
            "%s | user_id=%s not found",
            self.LOG_READ,
            user_id,
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    def _require_active_user(
        self,
        user: User,
    ) -> User:
        """
        Ensure a user account is active.

        Parameters
        ----------
        user:
            User ORM model.

        Returns
        -------
        User
            Active user.
        """
        if user.is_active:
            return user

        logger.warning(
            "%s | inactive account | user_id=%s",
            self.LOG_READ,
            user.id,
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    # =====================================================================
    # Response Builders
    # =====================================================================

    def _build_user_response(
        self,
        user: User,
    ) -> UserResponse:
        """
        Convert a User ORM model into a UserResponse DTO.
        """
        return UserResponse.model_validate(user)

    def _build_user_summary(
        self,
        user: User,
    ) -> UserSummary:
        """
        Convert a User ORM model into a UserSummary DTO.
        """
        return UserSummary.model_validate(user)

    def _build_user_responses(
        self,
        users: list[User],
    ) -> UserResponseList:
        """
        Convert multiple ORM models into response DTOs.
        """
        return [
            self._build_user_response(user)
            for user in users
        ]

    def _build_user_summaries(
        self,
        users: list[User],
    ) -> UserSummaryList:
        """
        Convert multiple ORM models into summary DTOs.
        """
        return [
            self._build_user_summary(user)
            for user in users
        ]

    # =====================================================================
    # Pagination Helpers
    # =====================================================================

    def _calculate_offset(
        self,
        *,
        page: int,
        limit: int,
    ) -> int:
        """
        Calculate SQL pagination offset.

        Parameters
        ----------
        page:
            One-based page number.

        limit:
            Number of records per page.

        Returns
        -------
        int
            SQL OFFSET value.
        """
        page = max(page, self.MIN_PAGE_NUMBER)
        limit = max(
            self.MIN_PAGE_SIZE,
            min(limit, self.MAX_PAGE_SIZE),
        )

        return (page - 1) * limit

    # =====================================================================
    # Update Helpers
    # =====================================================================

    def _normalize_update_data(
        self,
        user_data: UserUpdate,
    ) -> dict[str, object]:
        """
        Normalize update payload before persistence.

        - Removes unset values.
        - Removes None values.
        - Prevents modification of protected fields.
        - Trims string values.

        Parameters
        ----------
        user_data:
            Incoming update schema.

        Returns
        -------
        dict[str, object]
            Sanitized update payload.
        """
        update_data = user_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        protected_fields = {
            "id",
            "created_at",
            "updated_at",
        }

        for field in protected_fields:
            update_data.pop(field, None)

        for field, value in update_data.items():
            if isinstance(value, str):
                update_data[field] = value.strip()

        return update_data

    # =====================================================================
    # End Helper Methods
    # =====================================================================
        # =====================================================================
    # User Creation
    # =====================================================================

    def create_user(
        self,
        user_data: UserCreate,
    ) -> UserResponse:
        """
        Create a new user account.

        Business Rules
        --------------
        • Email must be unique.
        • Password is hashed before persistence.
        • New users receive the default USER role.
        • Accounts are active by default.

        Parameters
        ----------
        user_data:
            User registration information.

        Returns
        -------
        UserResponse
            Newly created user.
        """
        logger.info(
            "%s | email=%s",
            self.LOG_CREATE,
            user_data.email,
        )

        repository = self._repository()

        if repository.email_exists(user_data.email):
            logger.warning(
                "%s | duplicate email=%s",
                self.LOG_CREATE,
                user_data.email,
            )

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered.",
            )

        user = User(
            email=user_data.email.strip(),
            hashed_password=hash_password(
                user_data.password,
            ),
            role=self.USER_ROLE,
            is_active=True,
        )

        created_user = repository.create(user)

        logger.info(
            "%s completed | id=%s",
            self.LOG_CREATE,
            created_user.id,
        )

        return self._build_user_response(
            created_user,
        )

    # =====================================================================
    # User Retrieval
    # =====================================================================

    def get_user_by_id(
        self,
        user_id: int,
    ) -> UserResponse:
        """
        Retrieve a user by identifier.

        Parameters
        ----------
        user_id:
            User identifier.

        Returns
        -------
        UserResponse
        """
        logger.info(
            "%s | id=%s",
            self.LOG_READ,
            user_id,
        )

        user = self._require_user(
            user_id,
        )

        return self._build_user_response(
            user,
        )

    def get_user_by_email(
        self,
        email: str,
    ) -> UserResponse:
        """
        Retrieve a user by email address.

        Parameters
        ----------
        email:
            User email.

        Returns
        -------
        UserResponse
        """
        logger.info(
            "%s | email=%s",
            self.LOG_READ,
            email,
        )

        user = self._repository().get_by_email(
            email.strip(),
        )

        if user is None:
            logger.warning(
                "%s | email=%s not found",
                self.LOG_READ,
                email,
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return self._build_user_response(
            user,
        )

    # =====================================================================
    # Current User
    # =====================================================================

    def get_current_user(
        self,
        current_user: User,
    ) -> UserResponse:
        """
        Retrieve the currently authenticated user.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        UserResponse
        """
        logger.info(
            "%s | current_user=%s",
            self.LOG_READ,
            current_user.id,
        )

        self._require_active_user(
            current_user,
        )

        return self._build_user_response(
            current_user,
        )

    # =====================================================================
    # Internal Utility
    # =====================================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email address is already registered.

        Parameters
        ----------
        email:
            Email address.

        Returns
        -------
        bool
        """
        return self._repository().email_exists(
            email.strip(),
        )
    
    
        # =====================================================================
    # User Update
    # =====================================================================

    def update_user(
        self,
        *,
        current_user: User,
        user_id: int,
        user_data: UserUpdate,
    ) -> UserResponse:
        """
        Update an existing user profile.

        Business Rules
        --------------
        • Users may update their own profile.
        • Administrators may update any profile.
        • Email addresses must remain unique.
        • Passwords are always stored as hashes.
        • Protected fields cannot be modified.
        • Only supplied fields are updated.

        Parameters
        ----------
        current_user:
            Currently authenticated user.

        user_id:
            Target user identifier.

        user_data:
            Incoming update payload.

        Returns
        -------
        UserResponse
            Updated user profile.

        Raises
        ------
        HTTPException
            If the user does not exist.

        HTTPException
            If the authenticated user is not authorized.

        HTTPException
            If the email address already exists.
        """
        logger.info(
            "%s | actor=%s target=%s",
            self.LOG_UPDATE,
            current_user.id,
            user_id,
        )

        user = self._require_user(
            user_id,
        )

        # ================================================================
        # Authorization
        # ================================================================

        if (
            current_user.id != user.id
            and not self._is_admin(current_user)
        ):
            logger.warning(
                "%s denied | actor=%s target=%s",
                self.LOG_UPDATE,
                current_user.id,
                user.id,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You are not authorized "
                    "to update this user."
                ),
            )

        # ================================================================
        # Normalize Update Payload
        # ================================================================

        update_data = self._normalize_update_data(
            user_data,
        )

        repository = self._repository()

        # ================================================================
        # Email Validation
        # ================================================================

        email = update_data.get("email")

        if isinstance(email, str):

            existing_user = repository.get_by_email(
                email,
            )

            if (
                existing_user is not None
                and existing_user.id != user.id
            ):
                logger.warning(
                    "%s duplicate email=%s",
                    self.LOG_UPDATE,
                    email,
                )

                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email is already registered.",
                )

        # ================================================================
        # Password Hashing
        # ================================================================

        password = update_data.pop(
            "password",
            None,
        )

        if password is not None:
            user.hashed_password = hash_password(
                password,
            )

        # ================================================================
        # Apply Updates
        # ================================================================

        for field, value in update_data.items():
            setattr(
                user,
                field,
                value,
            )

        updated_user = repository.update(
            user,
        )

        logger.info(
            "%s completed | id=%s",
            self.LOG_UPDATE,
            updated_user.id,
        )

        return self._build_user_response(
            updated_user,
        )

    # =====================================================================
    # End User Update
    # =====================================================================
        # =====================================================================
    # User Listing
    # =====================================================================

    def list_users(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
    ) -> PaginatedUsers:
        """
        Retrieve paginated users.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        page:
            One-based page number.

        limit:
            Maximum number of records.

        Returns
        -------
        PaginatedUsers
        """
        logger.info(
            "%s | page=%s limit=%s",
            self.LOG_LIST,
            page,
            limit,
        )

        self._require_admin(current_user)

        repository = self._repository()

        offset = self._calculate_offset(
            page=page,
            limit=limit,
        )

        users = repository.list_users(
            skip=offset,
            limit=limit,
        )

        total = repository.total_users()

        logger.info(
            "%s completed | total=%s returned=%s",
            self.LOG_LIST,
            total,
            len(users),
        )

        return (
            total,
            self._build_user_responses(users),
        )

    # =====================================================================
    # Active Users
    # =====================================================================

    def list_active_users(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
    ) -> PaginatedUserSummaries:
        """
        Retrieve active users.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        page:
            One-based page number.

        limit:
            Maximum records.

        Returns
        -------
        PaginatedUserSummaries
        """
        logger.info(
            "%s | active users",
            self.LOG_LIST,
        )

        self._require_admin(current_user)

        repository = self._repository()

        offset = self._calculate_offset(
            page=page,
            limit=limit,
        )

        users = repository.get_active_users(
            skip=offset,
            limit=limit,
        )

        total = repository.total_active_users()

        logger.info(
            "%s completed | active=%s returned=%s",
            self.LOG_LIST,
            total,
            len(users),
        )

        return (
            total,
            self._build_user_summaries(users),
        )

    # =====================================================================
    # User Search
    # =====================================================================

    def search_users(
        self,
        *,
        current_user: User,
        query: str,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
    ) -> UserSummaryList:
        """
        Search users.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        query:
            Search keyword.

        page:
            One-based page number.

        limit:
            Maximum records.

        Returns
        -------
        UserSummaryList
        """
        logger.info(
            "%s | query=%s",
            self.LOG_SEARCH,
            query,
        )

        self._require_admin(current_user)

        repository = self._repository()

        offset = self._calculate_offset(
            page=page,
            limit=limit,
        )

        users = repository.search(
            query=query.strip(),
            skip=offset,
            limit=limit,
        )

        logger.info(
            "%s completed | returned=%s",
            self.LOG_SEARCH,
            len(users),
        )

        return self._build_user_summaries(
            users,
        )

    # =====================================================================
    # User Statistics
    # =====================================================================

    def get_statistics(
        self,
        *,
        current_user: User,
    ) -> UserStatistics:
        """
        Retrieve user statistics.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        Returns
        -------
        UserStatistics
        """
        logger.info(
            "%s",
            self.LOG_STATISTICS,
        )

        self._require_admin(current_user)

        repository = self._repository()

        total_users = repository.total_users()

        active_users = repository.total_active_users()

        inactive_users = (
            total_users - active_users
        )

        statistics: UserStatistics = {
            "total_users": total_users,
            "active_users": active_users,
            "inactive_users": inactive_users,
        }

        logger.info(
            "%s completed",
            self.LOG_STATISTICS,
        )

        return statistics

    # =====================================================================
    # End Administrator Operations
    # =====================================================================
        # =====================================================================
    # Account Activation
    # =====================================================================

    def activate_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> UserResponse:
        """
        Activate a user account.

        Administrator only.

        Business Rules
        --------------
        • Only administrators may activate users.
        • Activating an already active account is a no-op.
        • Returns the current state of the account.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            Target user identifier.

        Returns
        -------
        UserResponse
        """
        logger.info(
            "%s | target=%s",
            self.LOG_ACTIVATE,
            user_id,
        )

        self._require_admin(current_user)

        repository = self._repository()

        user = self._require_user(
            user_id,
        )

        if user.is_active:
            logger.info(
                "%s skipped | already active | id=%s",
                self.LOG_ACTIVATE,
                user.id,
            )

            return self._build_user_response(
                user,
            )

        activated_user = repository.activate(
            user,
        )

        logger.info(
            "%s completed | id=%s",
            self.LOG_ACTIVATE,
            activated_user.id,
        )

        return self._build_user_response(
            activated_user,
        )

    # =====================================================================
    # Account Deactivation
    # =====================================================================

    def deactivate_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> UserResponse:
        """
        Deactivate a user account.

        Administrator only.

        Business Rules
        --------------
        • Only administrators may deactivate users.
        • Administrators cannot deactivate themselves.
        • Deactivating an already inactive account is a no-op.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            Target user identifier.

        Returns
        -------
        UserResponse
        """
        logger.info(
            "%s | target=%s",
            self.LOG_DEACTIVATE,
            user_id,
        )

        self._require_admin(
            current_user,
        )

        if current_user.id == user_id:
            logger.warning(
                "%s denied | self deactivation | id=%s",
                self.LOG_DEACTIVATE,
                current_user.id,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot deactivate your own account.",
            )

        repository = self._repository()

        user = self._require_user(
            user_id,
        )

        if not user.is_active:
            logger.info(
                "%s skipped | already inactive | id=%s",
                self.LOG_DEACTIVATE,
                user.id,
            )

            return self._build_user_response(
                user,
            )

        deactivated_user = repository.deactivate(
            user,
        )

        logger.info(
            "%s completed | id=%s",
            self.LOG_DEACTIVATE,
            deactivated_user.id,
        )

        return self._build_user_response(
            deactivated_user,
        )

    # =====================================================================
    # Permanent User Deletion
    # =====================================================================

    def delete_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> None:
        """
        Permanently delete a user account.

        Administrator only.

        Business Rules
        --------------
        • Only administrators may delete users.
        • Administrators cannot delete themselves.
        • Deletion is permanent.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            Target user identifier.
        """
        logger.info(
            "%s | target=%s",
            self.LOG_DELETE,
            user_id,
        )

        self._require_admin(
            current_user,
        )

        if current_user.id == user_id:
            logger.warning(
                "%s denied | self deletion | id=%s",
                self.LOG_DELETE,
                current_user.id,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot delete your own account.",
            )

        repository = self._repository()

        user = self._require_user(
            user_id,
        )

        repository.delete(
            user,
        )

        logger.info(
            "%s completed | id=%s",
            self.LOG_DELETE,
            user.id,
        )
        
        # =====================================================================
    # Utility Methods
    # =====================================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email address is already registered.

        Parameters
        ----------
        email:
            Email address to verify.

        Returns
        -------
        bool
            True if the email exists.
        """
        return self._repository().email_exists(
            email.strip(),
        )

    def get_user_model(
        self,
        user_id: int,
    ) -> User:
        """
        Retrieve the underlying ORM model.

        This method is intended for internal service-to-service
        communication where the complete SQLAlchemy model is required
        instead of a response DTO.

        Parameters
        ----------
        user_id:
            User identifier.

        Returns
        -------
        User
            SQLAlchemy ORM model.

        Raises
        ------
        HTTPException
            If the user does not exist.
        """
        logger.info(
            "%s | get ORM model | id=%s",
            self.LOG_READ,
            user_id,
        )

        return self._require_user(
            user_id,
        )

    # =====================================================================
    # Validation Helpers
    # =====================================================================

    def validate_admin(
        self,
        current_user: User,
    ) -> None:
        """
        Validate administrator privileges.

        This helper is primarily intended for other services that
        need administrator authorization without duplicating logic.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Raises
        ------
        HTTPException
            If administrator privileges are missing.
        """
        self._require_admin(
            current_user,
        )

    def validate_active_user(
        self,
        user: User,
    ) -> None:
        """
        Validate that a user account is active.

        Parameters
        ----------
        user:
            User ORM model.

        Raises
        ------
        HTTPException
            If the account is inactive.
        """
        self._require_active_user(
            user,
        )

    # =====================================================================
    # Service Metadata
    # =====================================================================

    @classmethod
    def service_name(
        cls,
    ) -> str:
        """
        Return the service name.

        Returns
        -------
        str
        """
        return cls.SERVICE_NAME

    @classmethod
    def service_version(
        cls,
    ) -> str:
        """
        Return the service version.

        Returns
        -------
        str
        """
        return cls.SERVICE_VERSION
