"""
===============================================================================
API Dependency Injection Layer
===============================================================================

Enterprise dependency injection module for the Team Productivity Platform.

This module centralizes every dependency used throughout the API layer,
providing a single source of truth for repositories, services, authentication,
authorization, database sessions, and dependency aliases.

Responsibilities
----------------
• Database session management
• OAuth2 authentication
• JWT authentication
• Repository dependency providers
• Service dependency providers
• Authentication dependencies
• Authorization dependencies
• Role-based access control (RBAC)
• Dependency aliases using ``typing.Annotated``

Architecture
------------
HTTP Request
      │
      ▼
 FastAPI Dependency Injection
      │
      ▼
 Authentication
 Repository Providers
 Service Providers
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
• Clean Architecture
• Service Layer Pattern
• Repository Pattern
• Single Responsibility Principle
• Enterprise Ready
• OpenAPI Compatible

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• PostgreSQL
• Docker
• Alembic
• Pydantic v2
• Python 3.12+
===============================================================================
"""

from __future__ import annotations

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.constants import UserRole
from app.core.logging import get_logger
from app.core.security import decode_access_token
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

__all__ = []

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

LOG_DATABASE = "Database Dependency"

LOG_REPOSITORY = "Repository Dependency"

LOG_SERVICE = "Service Dependency"

LOG_AUTHENTICATION = "Authentication Dependency"

LOG_AUTHORIZATION = "Authorization Dependency"

LOG_RBAC = "Role-Based Access Control"

LOG_INITIALIZATION = "Dependency Initialization"

# =============================================================================
# Type Aliases
# =============================================================================

DatabaseGenerator = Generator[
    Session,
    None,
    None,
]

RepositoryFactory = UserRepository

NoteRepositoryFactory = NoteRepository

AuthenticationService = AuthService

UserManagementService = UserService

NotesService = NoteService

AuthenticatedUser = User

# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(
    DEFAULT_LOGGER_NAME,
)

# =============================================================================
# End Module Foundation
# =============================================================================

# =============================================================================
# OAuth2 Configuration
# =============================================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=TOKEN_URL,
    scheme_name=OAUTH2_SCHEME_NAME,
    description=OAUTH2_DESCRIPTION,
)

# =============================================================================
# Database Dependency
# =============================================================================


def get_db_session() -> DatabaseGenerator:
    """
    Provide a SQLAlchemy database session.

    Responsibilities
    ----------------
    • Create a database session.
    • Delegate session lifecycle to ``get_db``.
    • Provide a consistent database dependency.
    • Ensure proper cleanup after request completion.

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

# =============================================================================
# OAuth2 Token Dependency Aliases
# =============================================================================

OAuth2Token = Annotated[
    str,
    Depends(oauth2_scheme),
]

OptionalOAuth2Token = Annotated[
    str | None,
    Depends(oauth2_scheme),
]

# =============================================================================
# Common Dependency Type Aliases
# =============================================================================

DatabaseDependency = DBSession

AccessToken = OAuth2Token

OptionalAccessToken = OptionalOAuth2Token

# =============================================================================
# End Core Dependencies
# =============================================================================
# =============================================================================
# Repository Providers
# =============================================================================

def get_user_repository(
    db: DatabaseDependency,
) -> RepositoryFactory:
    """
    Create a UserRepository instance.

    Responsibilities
    ----------------
    • Receive an active database session.
    • Create a repository instance.
    • Provide the repository to the service layer.
    • Maintain a single repository per request.

    Parameters
    ----------
    db:
        Active SQLAlchemy database session.

    Returns
    -------
    RepositoryFactory
        Configured UserRepository instance.
    """
    logger.debug(
        "%s created: UserRepository",
        LOG_REPOSITORY,
    )

    return UserRepository(
        db=db,
    )


def get_note_repository(
    db: DatabaseDependency,
) -> NoteRepositoryFactory:
    """
    Create a NoteRepository instance.

    Responsibilities
    ----------------
    • Receive an active database session.
    • Create a repository instance.
    • Provide the repository to the service layer.
    • Maintain a single repository per request.

    Parameters
    ----------
    db:
        Active SQLAlchemy database session.

    Returns
    -------
    NoteRepositoryFactory
        Configured NoteRepository instance.
    """
    logger.debug(
        "%s created: NoteRepository",
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
# End Repository Providers
# =============================================================================
# =============================================================================
# Service Providers
# =============================================================================

def get_auth_service(
    repository: UserRepositoryDep,
) -> AuthenticationService:
    """
    Create an AuthService instance.

    Responsibilities
    ----------------
    • Receive repository dependencies.
    • Construct the authentication service.
    • Provide the service to API endpoints.
    • Maintain one service instance per request.

    Parameters
    ----------
    repository:
        User repository dependency.

    Returns
    -------
    AuthenticationService
        Configured authentication service.
    """
    logger.debug(
        "%s created: AuthService",
        LOG_SERVICE,
    )

    return AuthService(
        user_repository=repository,
    )


def get_user_service(
    repository: UserRepositoryDep,
) -> UserManagementService:
    """
    Create a UserService instance.

    Responsibilities
    ----------------
    • Receive repository dependencies.
    • Construct the user service.
    • Provide the service to API endpoints.
    • Maintain one service instance per request.

    Parameters
    ----------
    repository:
        User repository dependency.

    Returns
    -------
    UserManagementService
        Configured user service.
    """
    logger.debug(
        "%s created: UserService",
        LOG_SERVICE,
    )

    return UserService(
        user_repository=repository,
    )


def get_note_service(
    repository: NoteRepositoryDep,
) -> NotesService:
    """
    Create a NoteService instance.

    Responsibilities
    ----------------
    • Receive repository dependencies.
    • Construct the note service.
    • Provide the service to API endpoints.
    • Maintain one service instance per request.

    Parameters
    ----------
    repository:
        Note repository dependency.

    Returns
    -------
    NotesService
        Configured note service.
    """
    logger.debug(
        "%s created: NoteService",
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
# End Service Providers
# =============================================================================
# =============================================================================
# Authentication Dependency
# =============================================================================

def get_current_user(
    token: AccessToken,
    auth_service: AuthServiceDep,
) -> AuthenticatedUser:
    """
    Retrieve the currently authenticated user.

    Workflow
    --------
    Authorization Header
            │
            ▼
       Extract JWT Token
            │
            ▼
       Decode Access Token
            │
            ▼
      Validate Token Claims
            │
            ▼
      Load User From Database
            │
            ▼
      Validate User Status
            │
            ▼
     Return Authenticated User

    Responsibilities
    ----------------
    • Validate the JWT access token.
    • Decode authentication claims.
    • Load the authenticated user.
    • Verify that the user account is active.
    • Return the authenticated ORM user.

    Parameters
    ----------
    token:
        JWT bearer access token.

    auth_service:
        Authentication service.

    Returns
    -------
    AuthenticatedUser
        Authenticated active user.

    Raises
    ------
    AuthenticationError
        Invalid, expired, malformed, or incomplete token.

    UserNotFoundError
        Referenced user does not exist.

    InactiveUserError
        User account is inactive.
    """
    logger.debug(
        "%s started.",
        LOG_AUTHENTICATION,
    )

    try:
        # ---------------------------------------------------------------------
        # Decode JWT
        # ---------------------------------------------------------------------
        payload = decode_access_token(
            token,
        )

        # ---------------------------------------------------------------------
        # Extract User Identifier
        # ---------------------------------------------------------------------
        user_id = payload.get("user_id")

        if user_id is None:
            logger.warning(
                "%s failed: Missing user_id claim.",
                LOG_AUTHENTICATION,
            )

            raise AuthenticationError(
                "Authentication token is missing the user identifier.",
            )

        # ---------------------------------------------------------------------
        # Retrieve User
        # ---------------------------------------------------------------------
        user = auth_service.get_user(
            user_id=int(user_id),
        )

        # ---------------------------------------------------------------------
        # Validate User State
        # ---------------------------------------------------------------------
        auth_service.ensure_active_user(
            user,
        )

        logger.debug(
            "%s completed successfully.",
            LOG_AUTHENTICATION,
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
            exc_info=exc,
        )

        raise AuthenticationError(
            "Authentication failed.",
        ) from exc


# =============================================================================
# End Authentication Dependency
# =============================================================================
# =============================================================================
# Optional Authentication Dependency
# =============================================================================

def get_optional_current_user(
    token: OptionalAccessToken,
    auth_service: AuthServiceDep,
) -> AuthenticatedUser | None:
    """
    Retrieve the currently authenticated user if available.

    This dependency enables endpoints that support both anonymous and
    authenticated access.

    Workflow
    --------
    Authorization Header
            │
            ▼
      Token Present?
       │          │
      No         Yes
       │          │
       ▼          ▼
    Return None  Decode JWT
                     │
                     ▼
              Validate Claims
                     │
                     ▼
               Load User
                     │
                     ▼
            Validate Active User
                     │
                     ▼
             Return Authenticated User

    Responsibilities
    ----------------
    • Accept optional authentication.
    • Ignore missing bearer tokens.
    • Validate JWT when provided.
    • Return the authenticated user.
    • Return None for anonymous requests.

    Parameters
    ----------
    token:
        Optional JWT bearer token.

    auth_service:
        Authentication service.

    Returns
    -------
    AuthenticatedUser | None
        Authenticated user if validation succeeds;
        otherwise None.
    """
    logger.debug(
        "%s started.",
        LOG_AUTHENTICATION,
    )

    # -------------------------------------------------------------------------
    # Anonymous Request
    # -------------------------------------------------------------------------
    if token is None:
        logger.debug(
            "%s skipped (anonymous request).",
            LOG_AUTHENTICATION,
        )

        return None

    try:
        # ---------------------------------------------------------------------
        # Decode JWT
        # ---------------------------------------------------------------------
        payload = decode_access_token(
            token,
        )

        # ---------------------------------------------------------------------
        # Extract User Identifier
        # ---------------------------------------------------------------------
        user_id = payload.get("user_id")

        if user_id is None:
            logger.debug(
                "%s skipped (missing user_id claim).",
                LOG_AUTHENTICATION,
            )

            return None

        # ---------------------------------------------------------------------
        # Retrieve User
        # ---------------------------------------------------------------------
        user = auth_service.get_user(
            user_id=int(user_id),
        )

        # ---------------------------------------------------------------------
        # Validate User Status
        # ---------------------------------------------------------------------
        auth_service.ensure_active_user(
            user,
        )

        logger.debug(
            "%s completed successfully.",
            LOG_AUTHENTICATION,
        )

        return user

    except Exception:
        logger.debug(
            "%s ignored invalid optional authentication.",
            LOG_AUTHENTICATION,
        )

        return None


# =============================================================================
# Optional Authentication Dependency Alias
# =============================================================================

OptionalCurrentUser = Annotated[
    AuthenticatedUser | None,
    Depends(get_optional_current_user),
]

# =============================================================================
# End Optional Authentication Dependency
# =============================================================================

# =============================================================================
# Active User Dependency
# =============================================================================

def get_current_active_user(
    current_user: CurrentUser,
    auth_service: AuthServiceDep,
) -> AuthenticatedUser:
    """
    Ensure the authenticated user account is active.

    Workflow
    --------
    Authenticated User
            │
            ▼
      Validate User Status
            │
            ▼
      Return Active User

    Responsibilities
    ----------------
    • Receive the authenticated user.
    • Verify that the account is active.
    • Return the validated user.

    Parameters
    ----------
    current_user:
        Authenticated user.

    auth_service:
        Authentication service.

    Returns
    -------
    AuthenticatedUser
        Active authenticated user.

    Raises
    ------
    InactiveUserError
        If the account is inactive.
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
    Ensure the authenticated user has administrator privileges.

    Workflow
    --------
    Authenticated User
            │
            ▼
      Validate Active User
            │
            ▼
      Validate Administrator
            │
            ▼
      Return Administrator

    Responsibilities
    ----------------
    • Receive the active authenticated user.
    • Verify administrator privileges.
    • Return the validated administrator.

    Parameters
    ----------
    current_user:
        Active authenticated user.

    auth_service:
        Authentication service.

    Returns
    -------
    AuthenticatedUser
        Authenticated administrator.

    Raises
    ------
    AuthorizationError
        If the user is not an administrator.
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
# End Authorization Dependencies
# =============================================================================

# =============================================================================
# Role-Based Access Control (RBAC)
# =============================================================================

def require_role(
    required_role: UserRole,
):
    """
    Create a dependency that restricts endpoint access to a single role.

    Workflow
    --------
    Current Active User
            │
            ▼
      Resolve User Role
            │
            ▼
     Compare Required Role
            │
            ▼
      Authorized?
       │          │
      Yes         No
       │          │
       ▼          ▼
    Return User   Raise AuthorizationError

    Responsibilities
    ----------------
    • Validate the authenticated user's role.
    • Restrict endpoint access to a single role.
    • Return the authenticated user when authorized.

    Parameters
    ----------
    required_role:
        Role required to access the endpoint.

    Returns
    -------
    Callable
        FastAPI dependency callable.
    """

    required = (
        required_role.value
        if isinstance(required_role, UserRole)
        else str(required_role)
    )

    logger.debug(
        "%s configured for role: %s",
        LOG_RBAC,
        required,
    )

    def dependency(
        current_user: CurrentActiveUser,
    ) -> AuthenticatedUser:
        """
        Validate that the authenticated user possesses
        the required role.
        """

        user_role = (
            current_user.role.value
            if isinstance(current_user.role, UserRole)
            else str(current_user.role)
        )

        if user_role != required:
            logger.warning(
                "%s denied. Required=%s Current=%s",
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
# Multiple Role Dependency
# =============================================================================

def require_roles(
    *allowed_roles: UserRole,
):
    """
    Create a dependency that restricts endpoint access to
    one or more roles.

    Workflow
    --------
    Current Active User
            │
            ▼
      Resolve User Role
            │
            ▼
    Check Allowed Roles
            │
            ▼
      Authorized?
       │          │
      Yes         No
       │          │
       ▼          ▼
    Return User   Raise AuthorizationError

    Responsibilities
    ----------------
    • Validate the authenticated user's role.
    • Restrict endpoint access to one or more roles.
    • Return the authenticated user when authorized.

    Parameters
    ----------
    allowed_roles:
        Roles permitted to access the endpoint.

    Returns
    -------
    Callable
        FastAPI dependency callable.
    """

    allowed = {
        role.value
        if isinstance(role, UserRole)
        else str(role)
        for role in allowed_roles
    }

    logger.debug(
        "%s configured for roles: %s",
        LOG_RBAC,
        ", ".join(sorted(allowed)),
    )

    def dependency(
        current_user: CurrentActiveUser,
    ) -> AuthenticatedUser:
        """
        Validate that the authenticated user possesses
        one of the permitted roles.
        """

        user_role = (
            current_user.role.value
            if isinstance(current_user.role, UserRole)
            else str(current_user.role)
        )

        if user_role not in allowed:
            logger.warning(
                "%s denied. Allowed=%s Current=%s",
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
# End Role-Based Access Control
# =============================================================================
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

CurrentActiveUser = Annotated[
    AuthenticatedUser,
    Depends(get_current_active_user),
]

CurrentAdmin = Annotated[
    AuthenticatedUser,
    Depends(get_current_admin),
]

# =============================================================================
# OAuth2 Dependency Aliases
# =============================================================================

OAuth2Token = Annotated[
    str,
    Depends(oauth2_scheme),
]

OptionalOAuth2Token = Annotated[
    str | None,
    Depends(oauth2_scheme),
]

# =============================================================================
# Dependency Alias Groups
# =============================================================================

# Authentication
AuthenticationDependency = CurrentUser

# Authorization
ActiveUserDependency = CurrentActiveUser

AdministratorDependency = CurrentAdmin

# Optional Authentication
OptionalAuthenticationDependency = OptionalCurrentUser

# OAuth2 Tokens
BearerToken = OAuth2Token

OptionalBearerToken = OptionalOAuth2Token

# =============================================================================
# End Dependency Aliases
# =============================================================================


# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [

    # -------------------------------------------------------------------------
    # OAuth2 Configuration
    # -------------------------------------------------------------------------
    "oauth2_scheme",
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
    "CurrentActiveUser",
    "CurrentAdmin",
    "OptionalCurrentUser",

    "AuthenticationDependency",
    "ActiveUserDependency",
    "AdministratorDependency",
    "OptionalAuthenticationDependency",

    # -------------------------------------------------------------------------
    # Authorization
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

# =============================================================================
# End Module
# =============================================================================

