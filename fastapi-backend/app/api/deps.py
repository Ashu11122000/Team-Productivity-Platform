"""
===============================================================================
API Dependency Injection Layer
===============================================================================

Enterprise dependency injection module for the Team Productivity Platform.

This module centralizes reusable FastAPI dependencies for:

• Database sessions
• OAuth2 bearer-token extraction
• JWT authentication
• Repository construction
• Service construction
• Current-user resolution
• Active-user validation
• Administrator authorization
• Role-based access control
• Optional authentication
• ``typing.Annotated`` dependency aliases

Architecture
------------

HTTP Request
      │
      ▼
FastAPI Dependency Injection
      │
      ├── Authentication
      ├── Authorization
      ├── Database Session
      ├── Repository Providers
      └── Service Providers
      │
      ▼
Business Services
      │
      ▼
Repositories
      │
      ▼
SQLAlchemy
      │
      ▼
PostgreSQL

Design Principles
-----------------

• Dependency Injection
• Single Responsibility Principle
• Repository Pattern
• Service Layer Pattern
• Clean Architecture
• Explicit typing
• Request-scoped dependencies
• Centralized authentication
• Centralized authorization
• OpenAPI compatibility
• No unnecessary infrastructure

Compatible With
---------------

• FastAPI
• SQLAlchemy 2.x
• PostgreSQL
• Alembic
• Pydantic v2
• Python 3.12+
• Docker
===============================================================================
"""

from __future__ import annotations

from collections.abc import Callable, Generator
from typing import Annotated, TypeAlias

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.constants import UserRole
from app.core.logging import get_logger
from app.core.security import decode_access_token, get_user_id
from app.db.session import get_db
from app.exceptions import (
    AuthenticationError,
    AuthorizationError,
    InactiveUserError,
    UserNotFoundError,
)
from app.models.user import User
from app.repositories.note_repository import NoteRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.note_service import NoteService
from app.services.user_service import UserService


# =============================================================================
# Module Constants
# =============================================================================

TOKEN_URL = "/api/v1/auth/login"

OAUTH2_SCHEME_NAME = "JWT"

OAUTH2_DESCRIPTION = "JWT Bearer Authentication"

DEFAULT_LOGGER_NAME = __name__


# =============================================================================
# Logging Constants
# =============================================================================

LOG_DATABASE = "Database dependency"

LOG_REPOSITORY = "Repository dependency"

LOG_SERVICE = "Service dependency"

LOG_AUTHENTICATION = "Authentication dependency"

LOG_AUTHORIZATION = "Authorization dependency"

LOG_RBAC = "Role-based access control"

LOG_INITIALIZATION = "Dependency initialization"


# =============================================================================
# Type Aliases
# =============================================================================

DatabaseGenerator: TypeAlias = Generator[
    Session,
    None,
    None,
]

RepositoryFactory: TypeAlias = UserRepository

NoteRepositoryFactory: TypeAlias = NoteRepository

AuthenticationService: TypeAlias = AuthService

UserManagementService: TypeAlias = UserService

NotesService: TypeAlias = NoteService

AuthenticatedUser: TypeAlias = User


# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(
    DEFAULT_LOGGER_NAME,
)


# =============================================================================
# OAuth2 Configuration
# =============================================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=TOKEN_URL,
    scheme_name=OAUTH2_SCHEME_NAME,
    description=OAUTH2_DESCRIPTION,
)

optional_oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=TOKEN_URL,
    scheme_name=OAUTH2_SCHEME_NAME,
    description=OAUTH2_DESCRIPTION,
    auto_error=False,
)


# =============================================================================
# Database Dependency
# =============================================================================


def get_db_session() -> DatabaseGenerator:
    """
    Provide a request-scoped SQLAlchemy database session.

    The actual session lifecycle is delegated to ``app.db.session.get_db``.
    This wrapper gives the API layer a stable dependency boundary.

    Yields
    ------
    Session
        Active SQLAlchemy database session.
    """
    logger.debug(
        "%s requested.",
        LOG_DATABASE,
    )

    yield from get_db()


# =============================================================================
# Database Dependency Alias
# =============================================================================

DBSession = Annotated[
    Session,
    Depends(get_db_session),
]

DatabaseDependency: TypeAlias = DBSession


# =============================================================================
# OAuth2 Token Dependency Aliases
# =============================================================================

OAuth2Token = Annotated[
    str,
    Depends(oauth2_scheme),
]

OptionalOAuth2Token = Annotated[
    str | None,
    Depends(optional_oauth2_scheme),
]

AccessToken: TypeAlias = OAuth2Token

OptionalAccessToken: TypeAlias = OptionalOAuth2Token

BearerToken: TypeAlias = OAuth2Token

OptionalBearerToken: TypeAlias = OptionalOAuth2Token


# =============================================================================
# Repository Providers
# =============================================================================


def get_user_repository(
    db: DatabaseDependency,
) -> RepositoryFactory:
    """
    Provide a request-scoped UserRepository.

    Parameters
    ----------
    db:
        Active SQLAlchemy database session.

    Returns
    -------
    UserRepository
        Repository bound to the current database session.
    """
    logger.debug(
        "%s created: UserRepository.",
        LOG_REPOSITORY,
    )

    return UserRepository(
        db=db,
    )


def get_note_repository(
    db: DatabaseDependency,
) -> NoteRepositoryFactory:
    """
    Provide a request-scoped NoteRepository.

    Parameters
    ----------
    db:
        Active SQLAlchemy database session.

    Returns
    -------
    NoteRepository
        Repository bound to the current database session.
    """
    logger.debug(
        "%s created: NoteRepository.",
        LOG_REPOSITORY,
    )

    return NoteRepository(
        db=db,
    )


# =============================================================================
# Repository Dependency Aliases
# =============================================================================

UserRepositoryDep = Annotated[
    RepositoryFactory,
    Depends(get_user_repository),
]

NoteRepositoryDep = Annotated[
    NoteRepositoryFactory,
    Depends(get_note_repository),
]

# =============================================================================
# Service Providers
# =============================================================================


def get_auth_service(
    repository: UserRepositoryDep,
) -> AuthenticationService:
    """
    Provide a request-scoped AuthService.

    Parameters
    ----------
    repository:
        User repository dependency.

    Returns
    -------
    AuthService
        Authentication service configured with the user repository.
    """
    logger.debug(
        "%s created: AuthService.",
        LOG_SERVICE,
    )

    return AuthService(
        user_repository=repository,
    )


def get_user_service(
    repository: UserRepositoryDep,
) -> UserManagementService:
    """
    Provide a request-scoped UserService.

    Parameters
    ----------
    repository:
        User repository dependency.

    Returns
    -------
    UserService
        User-management service configured with the user repository.
    """
    logger.debug(
        "%s created: UserService.",
        LOG_SERVICE,
    )

    return UserService(
        user_repository=repository,
    )


def get_note_service(
    repository: NoteRepositoryDep,
) -> NotesService:
    """
    Provide a request-scoped NoteService.

    Parameters
    ----------
    repository:
        Note repository dependency.

    Returns
    -------
    NoteService
        Note-management service configured with the note repository.
    """
    logger.debug(
        "%s created: NoteService.",
        LOG_SERVICE,
    )

    return NoteService(
        note_repository=repository,
    )


# =============================================================================
# Service Dependency Aliases
# =============================================================================

AuthServiceDep = Annotated[
    AuthenticationService,
    Depends(get_auth_service),
]

UserServiceDep = Annotated[
    UserManagementService,
    Depends(get_user_service),
]

NoteServiceDep = Annotated[
    NotesService,
    Depends(get_note_service),
]


# =============================================================================
# Authentication Dependency
# =============================================================================


def get_current_user(
    token: AccessToken,
    auth_service: AuthServiceDep,
) -> AuthenticatedUser:
    """
    Resolve the currently authenticated user.

    Authentication workflow
    -----------------------

    Authorization Header
            │
            ▼
       Extract JWT
            │
            ▼
    Decode + Validate JWT
            │
            ▼
      Extract user_id
            │
            ▼
      Load User
            │
            ▼
      Validate User
            │
            ▼
    Return Active User

    The JWT validation itself is delegated to ``app.core.security``.
    This dependency is responsible for connecting the validated JWT identity
    to the application's user/service layer.

    Parameters
    ----------
    token:
        JWT bearer access token.

    auth_service:
        Authentication service.

    Returns
    -------
    User
        Authenticated active user.

    Raises
    ------
    AuthenticationError
        If the JWT is invalid, malformed, incomplete, or contains an
        invalid user identifier.

    UserNotFoundError
        If the referenced user does not exist.

    InactiveUserError
        If the user account is inactive.
    """
    logger.debug(
        "%s started.",
        LOG_AUTHENTICATION,
    )

    try:
        # ---------------------------------------------------------------------
        # Resolve the user identifier through the centralized security layer.
        #
        # get_user_id() internally calls decode_access_token(), which performs
        # the application's JWT validation contract.
        # ---------------------------------------------------------------------

        user_id = get_user_id(
            token,
        )

        # ---------------------------------------------------------------------
        # Convert the JWT user identifier to the database identifier type.
        #
        # The existing service contract expects an integer user_id.
        # ---------------------------------------------------------------------

        try:
            numeric_user_id = int(user_id)
        except (TypeError, ValueError) as exc:
            logger.warning(
                "%s failed: invalid user identifier.",
                LOG_AUTHENTICATION,
            )

            raise AuthenticationError(
                "Authentication token contains an invalid user identifier.",
            ) from exc

        # ---------------------------------------------------------------------
        # Retrieve the authenticated user through the service layer.
        # ---------------------------------------------------------------------

        user = auth_service.get_user(
            user_id=numeric_user_id,
        )

        # ---------------------------------------------------------------------
        # Ensure the account is active.
        # ---------------------------------------------------------------------

        auth_service.ensure_active_user(
            user,
        )

        logger.debug(
            "%s completed successfully.",
            LOG_AUTHENTICATION,
            extra={
                "user_id": numeric_user_id,
            },
        )

        return user

    except (
        AuthenticationError,
        UserNotFoundError,
        InactiveUserError,
    ):
        logger.warning(
            "%s failed.",
            LOG_AUTHENTICATION,
        )
        raise

    except Exception as exc:
        logger.exception(
            "%s failed unexpectedly.",
            LOG_AUTHENTICATION,
        )

        raise AuthenticationError(
            "Authentication failed.",
        ) from exc


# =============================================================================
# Optional Authentication Dependency
# =============================================================================


def get_optional_current_user(
    token: OptionalAccessToken,
    auth_service: AuthServiceDep,
) -> AuthenticatedUser | None:
    """
    Resolve the authenticated user when authentication is optional.

    Behavior
    --------
    No token:
        Return ``None``.

    Valid token:
        Return the authenticated active user.

    Invalid token:
        Return ``None``.

    Missing user:
        Return ``None``.

    Inactive user:
        Return ``None``.

    This dependency is intended for endpoints that support both anonymous
    and authenticated access.

    Parameters
    ----------
    token:
        Optional JWT bearer access token.

    auth_service:
        Authentication service.

    Returns
    -------
    User | None
        Authenticated active user when authentication succeeds;
        otherwise ``None``.
    """
    logger.debug(
        "%s started.",
        LOG_AUTHENTICATION,
    )

    # -------------------------------------------------------------------------
    # Anonymous request
    # -------------------------------------------------------------------------

    if token is None:
        logger.debug(
            "%s skipped: anonymous request.",
            LOG_AUTHENTICATION,
        )

        return None

    try:
        # ---------------------------------------------------------------------
        # Resolve user identifier through the centralized security layer.
        # ---------------------------------------------------------------------

        user_id = get_user_id(
            token,
        )

        # ---------------------------------------------------------------------
        # Convert the JWT user identifier to the database identifier type.
        # ---------------------------------------------------------------------

        try:
            numeric_user_id = int(user_id)
        except (TypeError, ValueError):
            logger.debug(
                "%s ignored: invalid user identifier.",
                LOG_AUTHENTICATION,
            )

            return None

        # ---------------------------------------------------------------------
        # Retrieve user.
        # ---------------------------------------------------------------------

        user = auth_service.get_user(
            user_id=numeric_user_id,
        )

        # ---------------------------------------------------------------------
        # Validate user state.
        # ---------------------------------------------------------------------

        auth_service.ensure_active_user(
            user,
        )

        logger.debug(
            "%s completed successfully.",
            LOG_AUTHENTICATION,
            extra={
                "user_id": numeric_user_id,
            },
        )

        return user

    except (
        AuthenticationError,
        UserNotFoundError,
        InactiveUserError,
        ValueError,
        TypeError,
    ):
        # Optional authentication must not convert an anonymous/invalid
        # optional credential into an authentication failure for the endpoint.
        logger.debug(
            "%s ignored invalid optional authentication.",
            LOG_AUTHENTICATION,
        )

        return None


# =============================================================================
# Authentication Dependency Aliases
# =============================================================================

CurrentUser = Annotated[
    AuthenticatedUser,
    Depends(get_current_user),
]

OptionalCurrentUser = Annotated[
    AuthenticatedUser | None,
    Depends(get_optional_current_user),
]


# =============================================================================
# Active User Dependency
# =============================================================================


def get_current_active_user(
    current_user: CurrentUser,
    auth_service: AuthServiceDep,
) -> AuthenticatedUser:
    """
    Ensure that the authenticated user's account is active.

    Authentication has already been performed by ``get_current_user``.
    This dependency performs the explicit active-account validation required
    by endpoints that need an active user.

    Parameters
    ----------
    current_user:
        Authenticated user resolved by ``get_current_user``.

    auth_service:
        Authentication service.

    Returns
    -------
    User
        Active authenticated user.

    Raises
    ------
    InactiveUserError
        If the authenticated user's account is inactive.
    """
    logger.debug(
        "%s started.",
        LOG_AUTHORIZATION,
    )

    user = auth_service.ensure_active_user(
        current_user,
    )

    logger.debug(
        "%s completed successfully.",
        LOG_AUTHORIZATION,
    )

    return user


# =============================================================================
# Active User Dependency Alias
# =============================================================================

CurrentActiveUser = Annotated[
    AuthenticatedUser,
    Depends(get_current_active_user),
]


# =============================================================================
# Administrator Dependency
# =============================================================================


def get_current_admin(
    current_user: CurrentActiveUser,
    auth_service: AuthServiceDep,
) -> AuthenticatedUser:
    """
    Ensure that the authenticated user has administrator privileges.

    The user must first satisfy the active-user dependency and must then pass
    the authentication service's administrator authorization check.

    Parameters
    ----------
    current_user:
        Active authenticated user.

    auth_service:
        Authentication service.

    Returns
    -------
    User
        Authenticated administrator.

    Raises
    ------
    AuthorizationError
        If the authenticated user does not have administrator privileges.
    """
    logger.debug(
        "%s started.",
        LOG_AUTHORIZATION,
    )

    administrator = auth_service.ensure_admin(
        current_user,
    )

    logger.debug(
        "%s completed successfully.",
        LOG_AUTHORIZATION,
    )

    return administrator


# =============================================================================
# Administrator Dependency Alias
# =============================================================================

CurrentAdmin = Annotated[
    AuthenticatedUser,
    Depends(get_current_admin),
]


# =============================================================================
# Role Normalization
# =============================================================================


def _normalize_role(
    role: UserRole | str,
) -> str:
    """
    Normalize a user role to its string representation.

    Parameters
    ----------
    role:
        UserRole enum member or string representation.

    Returns
    -------
    str
        Normalized role string.
    """
    if isinstance(role, UserRole):
        return role.value

    return str(role).strip()


# =============================================================================
# Role-Based Access Control
# =============================================================================


def require_role(
    required_role: UserRole,
) -> Callable[..., AuthenticatedUser]:
    """
    Create a FastAPI dependency requiring a specific user role.

    Example
    -------
    ``Depends(require_role(UserRole.ADMIN))``

    Parameters
    ----------
    required_role:
        Role required to access the protected endpoint.

    Returns
    -------
    Callable
        FastAPI dependency callable.

    Raises
    ------
    AuthorizationError
        When the authenticated user's role does not match the required role.
    """
    required = _normalize_role(
        required_role,
    )

    logger.debug(
        "%s configured for role: %s.",
        LOG_RBAC,
        required,
    )

    def dependency(
        current_user: CurrentActiveUser,
    ) -> AuthenticatedUser:
        """
        Validate that the current user has the required role.
        """
        user_role = _normalize_role(
            current_user.role,
        )

        if user_role != required:
            logger.warning(
                "%s denied. Required=%s Current=%s.",
                LOG_RBAC,
                required,
                user_role,
            )

            raise AuthorizationError(
                "Insufficient permissions.",
            )

        logger.debug(
            "%s granted.",
            LOG_RBAC,
        )

        return current_user

    return dependency


# =============================================================================
# Multiple-Role RBAC
# =============================================================================


def require_roles(
    *allowed_roles: UserRole,
) -> Callable[..., AuthenticatedUser]:
    """
    Create a FastAPI dependency allowing multiple user roles.

    Example
    -------
    ``Depends(require_roles(UserRole.ADMIN, UserRole.MANAGER))``

    Parameters
    ----------
    allowed_roles:
        One or more roles permitted to access the endpoint.

    Returns
    -------
    Callable
        FastAPI dependency callable.

    Raises
    ------
    ValueError
        If no allowed roles are supplied.
    """
    if not allowed_roles:
        raise ValueError(
            "At least one allowed role must be provided.",
        )

    allowed = {
        _normalize_role(role)
        for role in allowed_roles
    }

    logger.debug(
        "%s configured for roles: %s.",
        LOG_RBAC,
        ", ".join(sorted(allowed)),
    )

    def dependency(
        current_user: CurrentActiveUser,
    ) -> AuthenticatedUser:
        """
        Validate that the current user has one of the allowed roles.
        """
        user_role = _normalize_role(
            current_user.role,
        )

        if user_role not in allowed:
            logger.warning(
                "%s denied. Allowed=%s Current=%s.",
                LOG_RBAC,
                ", ".join(sorted(allowed)),
                user_role,
            )

            raise AuthorizationError(
                "Access denied.",
            )

        logger.debug(
            "%s granted.",
            LOG_RBAC,
        )

        return current_user

    return dependency

# =============================================================================
# Authentication Dependency Aliases
# =============================================================================

AuthenticationDependency = CurrentUser

OptionalAuthenticationDependency = OptionalCurrentUser

ActiveUserDependency = CurrentActiveUser

AdministratorDependency = CurrentAdmin


# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    # -------------------------------------------------------------------------
    # OAuth2 Configuration
    # -------------------------------------------------------------------------
    "oauth2_scheme",
    "optional_oauth2_scheme",
    "OAuth2Token",
    "OptionalOAuth2Token",
    "BearerToken",
    "OptionalBearerToken",

    # -------------------------------------------------------------------------
    # Database Dependencies
    # -------------------------------------------------------------------------
    "get_db_session",
    "DBSession",
    "DatabaseDependency",

    # -------------------------------------------------------------------------
    # Repository Providers
    # -------------------------------------------------------------------------
    "get_user_repository",
    "get_note_repository",
    "UserRepositoryDep",
    "NoteRepositoryDep",

    # -------------------------------------------------------------------------
    # Service Providers
    # -------------------------------------------------------------------------
    "get_auth_service",
    "get_user_service",
    "get_note_service",
    "AuthServiceDep",
    "UserServiceDep",
    "NoteServiceDep",

    # -------------------------------------------------------------------------
    # Authentication Dependencies
    # -------------------------------------------------------------------------
    "get_current_user",
    "get_optional_current_user",
    "get_current_active_user",
    "get_current_admin",

    # -------------------------------------------------------------------------
    # Authentication Aliases
    # -------------------------------------------------------------------------
    "CurrentUser",
    "OptionalCurrentUser",
    "CurrentActiveUser",
    "CurrentAdmin",

    "AuthenticationDependency",
    "OptionalAuthenticationDependency",
    "ActiveUserDependency",
    "AdministratorDependency",

    # -------------------------------------------------------------------------
    # Role-Based Access Control
    # -------------------------------------------------------------------------
    "require_role",
    "require_roles",
]


# =============================================================================
# Module Initialization
# =============================================================================

logger.info(
    "%s initialized successfully.",
    LOG_INITIALIZATION,
)
