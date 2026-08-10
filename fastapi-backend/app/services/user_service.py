"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.services.user_service
Architecture: Clean Architecture | Service Layer | Repository Pattern
Python: 3.12+
Framework: FastAPI
Database: PostgreSQL
ORM: SQLAlchemy 2.x
Validation: Pydantic v2

===============================================================================

Overview
--------
Enterprise business service responsible for all User management operations.

This service acts as the business layer between FastAPI routers and the
UserRepository.

The service coordinates:

• User creation
• User retrieval
• User profile management
• User updates
• Account activation
• Account deactivation
• Permanent deletion
• Administrator workflows
• User search
• Pagination
• User statistics
• Authorization
• Business validation
• Password hashing coordination
• DTO ↔ ORM transformation
• Structured logging

Authentication responsibilities remain exclusively inside AuthService.

AuthService owns:

• Login
• Password verification
• JWT generation
• Access tokens
• Refresh tokens
• Password reset
• Authentication workflows

UserService owns user-management business rules.

The service intentionally contains no SQLAlchemy query construction.

All persistence operations are delegated to UserRepository.

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

Repository Responsibilities
---------------------------
UserRepository is responsible for:

• CRUD persistence
• Email lookup
• Search
• Pagination
• Sorting
• Filtering
• Counts
• Account-state persistence
• Repository utilities
• Soft-delete-aware queries

The repository does NOT contain:

• Password hashing
• Password verification
• JWT generation
• Authentication
• Authorization
• Duplicate-email policy
• Role validation
• Password reset logic

Service Responsibilities
------------------------
UserService is responsible for:

• Business rules
• Authorization
• Role validation
• Account lifecycle policy
• Profile ownership
• Input normalization
• Password hashing coordination
• DTO mapping
• Administrator workflows
• Statistics orchestration
• Structured logging

Microservice Ownership
----------------------
FastAPI owns:

• Authentication
• Users
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

These ownership boundaries must remain stable.

Exception Architecture
-----------------------
Service methods raise application exceptions.

They do NOT directly construct HTTP responses.

Expected flow:

Service
    ↓
ApplicationError
    ↓
Global Exception Handler
    ↓
HTTP Response

This keeps business logic independent from the HTTP transport layer.

Security
--------
Passwords must never be:

• Stored as plaintext
• Logged
• Returned in response schemas

Password hashing is coordinated by this service through the centralized
security layer.

Thread Safety
-------------
The service maintains no mutable shared request state.

Repository instances are provided through dependency injection.

Future Extension Points
-----------------------
The architecture is prepared for:

• Audit logging
• Domain events
• Distributed caching
• OpenTelemetry tracing
• Metrics
• Message queues
• Background workers
• Multi-tenancy
• SSO
• Identity federation
• Advanced RBAC
• Event sourcing

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from typing import Final, TypeAlias

# =============================================================================
# Application Core Imports
# =============================================================================

from app.core.constants import UserRole
from app.core.logging import get_logger
from app.core.security import hash_password

# =============================================================================
# Application Exception Imports
# =============================================================================

from app.exceptions import (
    AuthorizationError,
    EmailAlreadyExistsError,
    InactiveUserError,
    UserNotFoundError,
)

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

SUPPORTED_SORT_OPTIONS: Final[frozenset[str]] = frozenset(
    {
        "newest",
        "oldest",
        "email",
        "role",
        "last_login",
    }
)

PROTECTED_UPDATE_FIELDS: Final[frozenset[str]] = frozenset(
    {
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
    }
)

ADMIN_ONLY_UPDATE_FIELDS: Final[frozenset[str]] = frozenset(
    {
        "role",
        "is_active",
    }
)

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
# Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# User Service
# =============================================================================


class UserService:
    """
    Enterprise service responsible for User business operations.

    This class coordinates business rules and delegates persistence to
    UserRepository.

    Authentication remains outside this service.

    -----------------------------------------------------------------------
    Core Responsibilities
    -----------------------------------------------------------------------

    • User creation
    • User retrieval
    • User updates
    • Profile management
    • Account activation
    • Account deactivation
    • User deletion
    • Administrator operations
    • Search
    • Pagination
    • Statistics
    • Authorization
    • DTO transformation
    • Password hashing coordination
    """

    # =========================================================================
    # Service Metadata
    # =========================================================================

    SERVICE_NAME: Final[str] = "UserService"

    SERVICE_VERSION: Final[str] = "1.0.0"

    DOMAIN_NAME: Final[str] = "users"

    # =========================================================================
    # Pagination
    # =========================================================================

    DEFAULT_PAGE: Final[int] = DEFAULT_PAGE

    DEFAULT_PAGE_SIZE: Final[int] = DEFAULT_PAGE_SIZE

    DEFAULT_ADMIN_PAGE_SIZE: Final[int] = DEFAULT_ADMIN_PAGE_SIZE

    MAX_PAGE_SIZE: Final[int] = MAX_PAGE_SIZE

    MIN_PAGE_SIZE: Final[int] = MIN_PAGE_SIZE

    MIN_PAGE_NUMBER: Final[int] = MIN_PAGE_NUMBER

    # =========================================================================
    # Roles
    # =========================================================================

    USER_ROLE: Final[str] = DEFAULT_USER_ROLE

    ADMIN_ROLE: Final[str] = ADMIN_ROLE

    # =========================================================================
    # Logging
    # =========================================================================

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

    # =========================================================================
    # Constructor
    # =========================================================================

    def __init__(
        self,
        user_repository: UserRepository,
    ) -> None:
        """
        Initialize UserService.

        Parameters
        ----------
        user_repository:
            Injected UserRepository responsible for persistence.
        """
        self.user_repository = user_repository

        logger.debug(
            "UserService initialized.",
            extra={
                "service": self.SERVICE_NAME,
                "version": self.SERVICE_VERSION,
                "domain": self.DOMAIN_NAME,
                "repository": user_repository.__class__.__name__,
            },
        )

    # =========================================================================
    # Repository Helper
    # =========================================================================

    def _repository(self) -> UserRepository:
        """
        Return the configured repository.

        Returns
        -------
        UserRepository
            Injected repository instance.
        """
        return self.user_repository

    # =========================================================================
    # Role Helpers
    # =========================================================================

    def _is_admin(
        self,
        user: User,
    ) -> bool:
        """
        Determine whether a user is an administrator.

        Parameters
        ----------
        user:
            User ORM model.

        Returns
        -------
        bool
            True when the user has administrator privileges.
        """
        role = user.role

        if isinstance(role, UserRole):
            return role.value == self.ADMIN_ROLE

        return str(role) == self.ADMIN_ROLE

    # =========================================================================
    # Active Account Validation
    # =========================================================================

    def _require_active_user(
        self,
        user: User,
    ) -> User:
        """
        Ensure that a user account is active.

        Parameters
        ----------
        user:
            User ORM model.

        Returns
        -------
        User
            Active user.

        Raises
        ------
        InactiveUserError
            If the account is inactive.
        """
        if user.is_active:
            return user

        logger.warning(
            "%s | inactive account | user_id=%s",
            self.LOG_READ,
            user.id,
        )

        raise InactiveUserError()

    # =========================================================================
    # Administrator Authorization
    # =========================================================================

    def _require_admin(
        self,
        current_user: User,
    ) -> User:
        """
        Ensure the current user is an administrator.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        User
            Authenticated administrator.

        Raises
        ------
        InactiveUserError
            If the administrator account is inactive.

        AuthorizationError
            If the current user is not an administrator.
        """
        self._require_active_user(
            current_user,
        )

        if self._is_admin(current_user):
            return current_user

        logger.warning(
            "%s denied | user_id=%s",
            self.LOG_ADMIN,
            current_user.id,
        )

        raise AuthorizationError()

    # =========================================================================
    # User Ownership Authorization
    # =========================================================================

    def _require_self_or_admin(
        self,
        *,
        current_user: User,
        target_user: User,
    ) -> None:
        """
        Ensure the current user can modify the target user.

        Users may modify themselves.

        Administrators may modify any user.

        Parameters
        ----------
        current_user:
            Authenticated actor.

        target_user:
            User being modified.

        Raises
        ------
        AuthorizationError
            If access is not permitted.
        """
        if current_user.id == target_user.id:
            return

        if self._is_admin(current_user):
            return

        logger.warning(
            "%s denied | actor_id=%s target_id=%s",
            self.LOG_UPDATE,
            current_user.id,
            target_user.id,
        )

        raise AuthorizationError()

    # =========================================================================
    # User Retrieval
    # =========================================================================

    def _require_user(
        self,
        user_id: int,
    ) -> User:
        """
        Retrieve a user or raise UserNotFoundError.

        Parameters
        ----------
        user_id:
            User identifier.

        Returns
        -------
        User
            Existing User ORM model.

        Raises
        ------
        UserNotFoundError
            If the user does not exist.
        """
        user = self._repository().get_by_id(
            user_id,
        )

        if user is not None:
            return user

        logger.warning(
            "%s | user_id=%s not found",
            self.LOG_READ,
            user_id,
        )

        raise UserNotFoundError()

    # =========================================================================
    # Response Builders
    # =========================================================================

    @staticmethod
    def _build_user_response(
        user: User,
    ) -> UserResponse:
        """
        Convert User ORM model into UserResponse.

        Password hashes are intentionally excluded because UserResponse
        does not expose password storage fields.
        """
        return UserResponse.model_validate(
            user,
        )

    @staticmethod
    def _build_user_summary(
        user: User,
    ) -> UserSummary:
        """
        Convert User ORM model into lightweight UserSummary.
        """
        return UserSummary.model_validate(
            user,
        )

    @classmethod
    def _build_user_responses(
        cls,
        users: list[User],
    ) -> UserResponseList:
        """
        Convert multiple User ORM models into response DTOs.
        """
        return [
            cls._build_user_response(user)
            for user in users
        ]

    @classmethod
    def _build_user_summaries(
        cls,
        users: list[User],
    ) -> UserSummaryList:
        """
        Convert multiple User ORM models into summary DTOs.
        """
        return [
            cls._build_user_summary(user)
            for user in users
        ]

    # =========================================================================
    # Pagination Helpers
    # =========================================================================

    @classmethod
    def _normalize_page(
        cls,
        page: int,
    ) -> int:
        """
        Normalize a one-based page number.

        Parameters
        ----------
        page:
            Requested page.

        Returns
        -------
        int
            Valid page number.
        """
        return max(
            page,
            cls.MIN_PAGE_NUMBER,
        )

    @classmethod
    def _normalize_limit(
        cls,
        limit: int,
    ) -> int:
        """
        Normalize a requested page size.

        Parameters
        ----------
        limit:
            Requested page size.

        Returns
        -------
        int
            Page size bounded by service limits.
        """
        return min(
            max(
                limit,
                cls.MIN_PAGE_SIZE,
            ),
            cls.MAX_PAGE_SIZE,
        )

    @classmethod
    def _calculate_offset(
        cls,
        *,
        page: int,
        limit: int,
    ) -> int:
        """
        Calculate SQL OFFSET from page and limit.

        Parameters
        ----------
        page:
            One-based page number.

        limit:
            Number of records per page.

        Returns
        -------
        int
            Zero-based offset.
        """
        normalized_page = cls._normalize_page(
            page,
        )

        normalized_limit = cls._normalize_limit(
            limit,
        )

        return (
            normalized_page - 1
        ) * normalized_limit

    # =========================================================================
    # Sorting Helpers
    # =========================================================================

    @classmethod
    def _normalize_sort_order(
        cls,
        sort_by: str | None,
    ) -> str:
        """
        Normalize the requested sorting strategy.

        Supported repository values are:

        • newest
        • oldest
        • email
        • role
        • last_login

        Parameters
        ----------
        sort_by:
            Requested sorting strategy.

        Returns
        -------
        str
            Supported sorting strategy.
        """
        if not sort_by:
            return DEFAULT_SORT_ORDER

        normalized = sort_by.strip().lower()

        if normalized in SUPPORTED_SORT_OPTIONS:
            return normalized

        return DEFAULT_SORT_ORDER

    # =========================================================================
    # Update Data Normalization
    # =========================================================================

    def _normalize_update_data(
        self,
        user_data: UserUpdate,
    ) -> dict[str, object]:
        """
        Normalize UserUpdate data.

        Responsibilities
        ----------------
        • Exclude fields that were not supplied.
        • Exclude None values.
        • Remove protected persistence fields.
        • Trim string values.

        Parameters
        ----------
        user_data:
            Incoming update DTO.

        Returns
        -------
        dict[str, object]
            Normalized update dictionary.
        """
        update_data = user_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        for field in PROTECTED_UPDATE_FIELDS:
            update_data.pop(
                field,
                None,
            )

        for field, value in update_data.items():
            if isinstance(value, str):
                update_data[field] = value.strip()

        return update_data

    # =========================================================================
    # Create User
    # =========================================================================

    def create_user(
        self,
        user_data: UserCreate,
    ) -> UserResponse:
        """
        Create a new user.

        Business Rules
        --------------
        • Email must be unique.
        • Password must be hashed.
        • New users receive the default USER role.
        • New users are active.

        Authentication workflows such as JWT generation remain outside this
        service.

        Parameters
        ----------
        user_data:
            User creation payload.

        Returns
        -------
        UserResponse
            Newly created user.

        Raises
        ------
        EmailAlreadyExistsError
            If the email is already registered.
        """
        email = str(
            user_data.email,
        ).strip().lower()

        logger.info(
            "%s | user creation requested",
            self.LOG_CREATE,
        )

        repository = self._repository()

        if repository.email_exists(
            email,
        ):
            logger.warning(
                "%s | duplicate email attempt",
                self.LOG_CREATE,
            )

            raise EmailAlreadyExistsError()

        user = User(
            email=email,
            hashed_password=hash_password(
                user_data.password,
            ),
            role=self.USER_ROLE,
            is_active=True,
        )

        created_user = repository.create(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_CREATE,
            created_user.id,
        )

        return self._build_user_response(
            created_user,
        )

    # =========================================================================
    # Get User By ID
    # =========================================================================

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
            Requested user.

        Raises
        ------
        UserNotFoundError
            If the user does not exist.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_READ,
            user_id,
        )

        user = self._require_user(
            user_id,
        )

        return self._build_user_response(
            user,
        )

    # =========================================================================
    # Get User By Email
    # =========================================================================

    def get_user_by_email(
        self,
        email: str,
    ) -> UserResponse:
        """
        Retrieve a user by email address.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        UserResponse
            Matching user.

        Raises
        ------
        UserNotFoundError
            If the user does not exist.
        """
        logger.info(
            "%s | email lookup requested",
            self.LOG_READ,
        )

        normalized_email = (
            email.strip().lower()
        )

        user = self._repository().get_by_email(
            normalized_email,
        )

        if user is None:
            logger.warning(
                "%s | user not found by email",
                self.LOG_READ,
            )

            raise UserNotFoundError()

        return self._build_user_response(
            user,
        )

    # =========================================================================
    # Current User
    # =========================================================================

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
            Current user.
        """
        logger.info(
            "%s | current user | user_id=%s",
            self.LOG_READ,
            current_user.id,
        )

        self._require_active_user(
            current_user,
        )

        return self._build_user_response(
            current_user,
        )

    # =========================================================================
    # Email Existence
    # =========================================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email is registered.

        Parameters
        ----------
        email:
            Email address.

        Returns
        -------
        bool
            True if the email exists.
        """
        normalized_email = (
            email.strip().lower()
        )

        return self._repository().email_exists(
            normalized_email,
        )

    # =========================================================================
    # Update User
    # =========================================================================

    def update_user(
        self,
        *,
        current_user: User,
        user_id: int,
        user_data: UserUpdate,
    ) -> UserResponse:
        """
        Update a user profile.

        Authorization Rules
        --------------------
        • Users may update their own profile.
        • Administrators may update any user.
        • Only administrators may change role.
        • Only administrators may change is_active.
        • Passwords are hashed before persistence.
        • Email addresses must remain unique.

        Parameters
        ----------
        current_user:
            Authenticated actor.

        user_id:
            Target user identifier.

        user_data:
            Update payload.

        Returns
        -------
        UserResponse
            Updated user.

        Raises
        ------
        UserNotFoundError
            If the target user does not exist.

        AuthorizationError
            If the actor is not permitted to perform the operation.

        EmailAlreadyExistsError
            If the requested email belongs to another user.
        """
        logger.info(
            "%s | actor_id=%s target_id=%s",
            self.LOG_UPDATE,
            current_user.id,
            user_id,
        )

        self._require_active_user(
            current_user,
        )

        user = self._require_user(
            user_id,
        )

        self._require_self_or_admin(
            current_user=current_user,
            target_user=user,
        )

        update_data = self._normalize_update_data(
            user_data,
        )

        repository = self._repository()

        is_admin = self._is_admin(
            current_user,
        )

        # =====================================================================
        # Administrator-Only Fields
        # =====================================================================

        restricted_fields = (
            ADMIN_ONLY_UPDATE_FIELDS
            & update_data.keys()
        )

        if restricted_fields and not is_admin:
            logger.warning(
                "%s denied | restricted_fields=%s actor_id=%s",
                self.LOG_UPDATE,
                sorted(restricted_fields),
                current_user.id,
            )

            raise AuthorizationError()

        # =====================================================================
        # Email Update
        # =====================================================================

        email = update_data.get(
            "email",
        )

        if email is not None:
            normalized_email = (
                str(email).strip().lower()
            )

            existing_user = repository.get_by_email(
                normalized_email,
            )

            if (
                existing_user is not None
                and existing_user.id != user.id
            ):
                logger.warning(
                    "%s | duplicate email during update",
                    self.LOG_UPDATE,
                )

                raise EmailAlreadyExistsError()

            user.email = normalized_email

        # =====================================================================
        # Password Update
        # =====================================================================

        password = update_data.get(
            "password",
        )

        if password is not None:
            user.hashed_password = hash_password(
                str(password),
            )

        # =====================================================================
        # Role Update
        # =====================================================================

        if "role" in update_data:
            user.role = update_data["role"]

        # =====================================================================
        # Active State Update
        # =====================================================================

        if "is_active" in update_data:
            user.is_active = update_data[
                "is_active"
            ]

        # =====================================================================
        # Remove Fields Already Applied Explicitly
        # =====================================================================

        update_data.pop(
            "email",
            None,
        )

        update_data.pop(
            "password",
            None,
        )

        update_data.pop(
            "role",
            None,
        )

        update_data.pop(
            "is_active",
            None,
        )

        # =====================================================================
        # Apply Any Future Supported Fields
        # =====================================================================

        for field, value in update_data.items():
            if hasattr(
                user,
                field,
            ):
                setattr(
                    user,
                    field,
                    value,
                )

        updated_user = repository.update(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_UPDATE,
            updated_user.id,
        )

        return self._build_user_response(
            updated_user,
        )

    # =========================================================================
    # List Users
    # =========================================================================

    def list_users(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginatedUsers:
        """
        Retrieve paginated users.

        Administrator authorization is required.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        page:
            One-based page number.

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        PaginatedUsers
            Tuple containing total count and current-page users.
        """
        self._require_admin(
            current_user,
        )

        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        logger.info(
            "%s | admin_id=%s page=%s limit=%s sort=%s",
            self.LOG_LIST,
            current_user.id,
            normalized_page,
            normalized_limit,
            normalized_sort,
        )

        repository = self._repository()

        users = repository.list_users(
            skip=offset,
            limit=normalized_limit,
            sort_by=normalized_sort,
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
            self._build_user_responses(
                users,
            ),
        )

    # =========================================================================
    # Active Users
    # =========================================================================

    def list_active_users(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginatedUserSummaries:
        """
        Retrieve paginated active users.

        Administrator authorization is required.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        page:
            One-based page number.

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        PaginatedUserSummaries
            Total count and current-page summaries.
        """
        self._require_admin(
            current_user,
        )

        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        logger.info(
            "%s | active users | admin_id=%s",
            self.LOG_LIST,
            current_user.id,
        )

        repository = self._repository()

        users = repository.list_active_users(
            skip=offset,
            limit=normalized_limit,
            sort_by=normalized_sort,
        )

        total = repository.total_active_users()

        return (
            total,
            self._build_user_summaries(
                users,
            ),
        )

    # =========================================================================
    # Search Users
    # =========================================================================

    def search_users(
        self,
        *,
        current_user: User,
        query: str,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> UserSummaryList:
        """
        Search users.

        Administrator authorization is required.

        The current repository searches supported User fields such as:

        • email
        • role

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        query:
            Search keyword.

        page:
            One-based page number.

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        UserSummaryList
            Matching user summaries.
        """
        self._require_admin(
            current_user,
        )

        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        normalized_query = query.strip()

        logger.info(
            "%s | admin_id=%s page=%s limit=%s",
            self.LOG_SEARCH,
            current_user.id,
            normalized_page,
            normalized_limit,
        )

        repository = self._repository()

        users = repository.search(
            query=normalized_query,
            skip=offset,
            limit=normalized_limit,
            sort_by=normalized_sort,
        )

        logger.info(
            "%s completed | returned=%s",
            self.LOG_SEARCH,
            len(users),
        )

        return self._build_user_summaries(
            users,
        )

    # =========================================================================
    # Search User Count
    # =========================================================================

    def search_user_count(
        self,
        *,
        current_user: User,
        query: str,
    ) -> int:
        """
        Count users matching a search query.

        Administrator authorization is required.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        query:
            Search keyword.

        Returns
        -------
        int
            Number of matching users.
        """
        self._require_admin(
            current_user,
        )

        return self._repository().search_count(
            query=query.strip(),
        )

    # =========================================================================
    # User Statistics
    # =========================================================================

    def get_statistics(
        self,
        *,
        current_user: User,
    ) -> UserStatistics:
        """
        Retrieve user statistics.

        Administrator authorization is required.

        Returns
        -------
        UserStatistics
            User account statistics.

        Statistics
        ----------
        total_users
        active_users
        inactive_users
        """
        self._require_admin(
            current_user,
        )

        logger.info(
            "%s | admin_id=%s",
            self.LOG_STATISTICS,
            current_user.id,
        )

        repository = self._repository()

        statistics: UserStatistics = {
            "total_users": repository.total_users(),
            "active_users": repository.total_active_users(),
            "inactive_users": repository.total_inactive_users(),
        }

        logger.info(
            "%s completed | admin_id=%s",
            self.LOG_STATISTICS,
            current_user.id,
        )

        return statistics

    # =========================================================================
    # Account Activation
    # =========================================================================

    def activate_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> UserResponse:
        """
        Activate a user account.

        Administrator authorization is required.

        Activating an already active account is intentionally idempotent.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            Target user identifier.

        Returns
        -------
        UserResponse
            Activated user.
        """
        self._require_admin(
            current_user,
        )

        logger.info(
            "%s | admin_id=%s target_id=%s",
            self.LOG_ACTIVATE,
            current_user.id,
            user_id,
        )

        user = self._require_user(
            user_id,
        )

        if user.is_active:
            logger.info(
                "%s skipped | already active | user_id=%s",
                self.LOG_ACTIVATE,
                user.id,
            )

            return self._build_user_response(
                user,
            )

        activated_user = (
            self._repository().activate(
                user,
            )
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_ACTIVATE,
            activated_user.id,
        )

        return self._build_user_response(
            activated_user,
        )

    # =========================================================================
    # Account Deactivation
    # =========================================================================

    def deactivate_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> UserResponse:
        """
        Deactivate a user account.

        Administrator authorization is required.

        Administrators cannot deactivate themselves.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            Target user identifier.

        Returns
        -------
        UserResponse
            Deactivated user.

        Raises
        ------
        AuthorizationError
            If the administrator attempts self-deactivation.
        """
        self._require_admin(
            current_user,
        )

        logger.info(
            "%s | admin_id=%s target_id=%s",
            self.LOG_DEACTIVATE,
            current_user.id,
            user_id,
        )

        if current_user.id == user_id:
            logger.warning(
                "%s denied | self-deactivation | user_id=%s",
                self.LOG_DEACTIVATE,
                current_user.id,
            )

            raise AuthorizationError()

        user = self._require_user(
            user_id,
        )

        if not user.is_active:
            logger.info(
                "%s skipped | already inactive | user_id=%s",
                self.LOG_DEACTIVATE,
                user.id,
            )

            return self._build_user_response(
                user,
            )

        deactivated_user = (
            self._repository().deactivate(
                user,
            )
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_DEACTIVATE,
            deactivated_user.id,
        )

        return self._build_user_response(
            deactivated_user,
        )

    # =========================================================================
    # Permanent User Deletion
    # =========================================================================

    def delete_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> None:
        """
        Permanently delete a user.

        Administrator authorization is required.

        Administrators cannot delete themselves.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            Target user identifier.

        Raises
        ------
        AuthorizationError
            If the administrator attempts self-deletion.

        UserNotFoundError
            If the target user does not exist.
        """
        self._require_admin(
            current_user,
        )

        logger.info(
            "%s | admin_id=%s target_id=%s",
            self.LOG_DELETE,
            current_user.id,
            user_id,
        )

        if current_user.id == user_id:
            logger.warning(
                "%s denied | self-deletion | user_id=%s",
                self.LOG_DELETE,
                current_user.id,
            )

            raise AuthorizationError()

        user = self._require_user(
            user_id,
        )

        self._repository().remove(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_DELETE,
            user.id,
        )

    # =========================================================================
    # ORM Model Access
    # =========================================================================

    def get_user_model(
        self,
        user_id: int,
    ) -> User:
        """
        Retrieve the User ORM model.

        This method is intended for internal backend workflows that genuinely
        require the ORM entity.

        Parameters
        ----------
        user_id:
            User identifier.

        Returns
        -------
        User
            User ORM model.

        Raises
        ------
        UserNotFoundError
            If the user does not exist.
        """
        logger.debug(
            "%s | ORM model requested | user_id=%s",
            self.LOG_READ,
            user_id,
        )

        return self._require_user(
            user_id,
        )

    # =========================================================================
    # Validation Helpers
    # =========================================================================

    def validate_admin(
        self,
        current_user: User,
    ) -> None:
        """
        Validate administrator privileges.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Raises
        ------
        AuthorizationError
            If the user is not an administrator.
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
        InactiveUserError
            If the account is inactive.
        """
        self._require_active_user(
            user,
        )

    # =========================================================================
    # Service Metadata
    # =========================================================================

    @classmethod
    def service_name(
        cls,
    ) -> str:
        """
        Return the service name.
        """
        return cls.SERVICE_NAME

    @classmethod
    def service_version(
        cls,
    ) -> str:
        """
        Return the service version.
        """
        return cls.SERVICE_VERSION