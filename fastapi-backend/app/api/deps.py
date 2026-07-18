"""
==========================================================
API Dependencies
==========================================================

Centralized dependency injection for the Team Productivity
Platform.

Responsibilities
----------------
- OAuth2 authentication
- Database dependency injection
- Repository providers
- Service providers
- Current user authentication
- Role-based access control (RBAC)
- Dependency aliases using Annotated

Architecture
------------
Request
    ↓
Dependencies
    ↓
Services
    ↓
Repositories
    ↓
SQLAlchemy
    ↓
PostgreSQL

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Docker
- Alembic
- Pydantic v2
- Python 3.12+
==========================================================
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

logger = get_logger(__name__)

# ==========================================================
# OAuth2 Authentication
# ==========================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT",
    description="JWT Bearer Authentication",
)

# ==========================================================
# Database Dependency
# ==========================================================


def get_db_session() -> Generator[Session, None, None]:
    """
    Provide a SQLAlchemy database session.

    This wraps the application's database dependency so
    every API dependency originates from this module.

    Yields
    ------
    Session
        Active SQLAlchemy session.
    """
    yield from get_db()


DBSession = Annotated[
    Session,
    Depends(get_db_session),
]

# ==========================================================
# Repository Providers
# ==========================================================


def get_user_repository(
    db: DBSession,
) -> UserRepository:
    """
    Return a UserRepository instance.

    Parameters
    ----------
    db:
        Active SQLAlchemy session.

    Returns
    -------
    UserRepository
    """
    return UserRepository(db)


def get_note_repository(
    db: DBSession,
) -> NoteRepository:
    """
    Return a NoteRepository instance.

    Parameters
    ----------
    db:
        Active SQLAlchemy session.

    Returns
    -------
    NoteRepository
    """
    return NoteRepository(db)


# ==========================================================
# Repository Dependency Aliases
# ==========================================================

UserRepositoryDep = Annotated[
    UserRepository,
    Depends(get_user_repository),
]

NoteRepositoryDep = Annotated[
    NoteRepository,
    Depends(get_note_repository),
]

# ==========================================================
# Service Providers
# ==========================================================


def get_auth_service(
    repository: UserRepositoryDep,
) -> AuthService:
    """
    Create an AuthService instance.

    Parameters
    ----------
    repository:
        User repository dependency.

    Returns
    -------
    AuthService
    """
    return AuthService(
        user_repository=repository,
    )


def get_user_service(
    repository: UserRepositoryDep,
) -> UserService:
    """
    Create a UserService instance.

    Parameters
    ----------
    repository:
        User repository dependency.

    Returns
    -------
    UserService
    """
    return UserService(
        user_repository=repository,
    )


def get_note_service(
    repository: NoteRepositoryDep,
) -> NoteService:
    """
    Create a NoteService instance.

    Parameters
    ----------
    repository:
        Note repository dependency.

    Returns
    -------
    NoteService
    """
    return NoteService(
        note_repository=repository,
    )


# ==========================================================
# Service Dependency Aliases
# ==========================================================

AuthServiceDep = Annotated[
    AuthService,
    Depends(get_auth_service),
]

UserServiceDep = Annotated[
    UserService,
    Depends(get_user_service),
]

NoteServiceDep = Annotated[
    NoteService,
    Depends(get_note_service),
]


# ==========================================================
# Authentication Dependencies
# ==========================================================


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    auth_service: AuthServiceDep,
) -> User:
    """
    Retrieve the authenticated user from a JWT.

    Workflow
    --------
    Authorization Header
            ↓
        Decode JWT
            ↓
        Validate Claims
            ↓
        Load User
            ↓
        Validate Active
            ↓
        Return ORM User

    Parameters
    ----------
    token:
        JWT bearer token.

    auth_service:
        Authentication service.

    Returns
    -------
    User
        Authenticated ORM user.

    Raises
    ------
    AuthenticationError
        Invalid, expired or malformed token.

    UserNotFoundError
        User referenced by the token does not exist.

    InactiveUserError
        User account is inactive.
    """

    try:
        payload = decode_access_token(token)

        user_id = payload.get("user_id")

        if user_id is None:
            raise AuthenticationError(
                "Authentication token is missing the user identifier."
            )

        user = auth_service.get_user(
            user_id=int(user_id),
        )

        auth_service.ensure_active_user(user)

        return user

    except (
        AuthenticationError,
        UserNotFoundError,
        InactiveUserError,
    ):
        raise

    except Exception as exc:
        logger.exception(
            "Authentication dependency failed.",
            exc_info=exc,
        )

        raise AuthenticationError(
            "Authentication failed."
        ) from exc


# ==========================================================
# Optional Authentication
# ==========================================================


def get_optional_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    auth_service: AuthServiceDep,
) -> User | None:
    """
    Return the authenticated user if authentication
    succeeds, otherwise return None.

    Intended for endpoints supporting both anonymous
    and authenticated access.
    """

    if not token:
        return None

    try:
        payload = decode_access_token(token)

        user_id = payload.get("user_id")

        if user_id is None:
            return None

        user = auth_service.get_user(
            user_id=int(user_id),
        )

        auth_service.ensure_active_user(user)

        return user

    except Exception:
        logger.debug(
            "Ignoring invalid optional authentication token."
        )
        return None


OptionalCurrentUser = Annotated[
    User | None,
    Depends(get_optional_current_user),
]


# ==========================================================
# Active User Dependency
# ==========================================================


def get_current_active_user(
    current_user: CurrentUser,
    auth_service: AuthServiceDep,
) -> User:
    """
    Ensure the authenticated user account is active.

    Parameters
    ----------
    current_user:
        Authenticated user.

    auth_service:
        Authentication service.

    Returns
    -------
    User
        Active authenticated user.
    """

    return auth_service.ensure_active_user(
        current_user,
    )


CurrentActiveUser = Annotated[
    User,
    Depends(get_current_active_user),
]


# ==========================================================
# Administrator Dependency
# ==========================================================


def get_current_admin(
    current_user: CurrentActiveUser,
    auth_service: AuthServiceDep,
) -> User:
    """
    Ensure the authenticated user has administrator
    privileges.

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
    """

    return auth_service.ensure_admin(
        current_user,
    )


CurrentAdmin = Annotated[
    User,
    Depends(get_current_admin),
]


# ==========================================================
# Role-Based Access Control (RBAC)
# ==========================================================


def require_role(
    required_role: UserRole,
):
    """
    Restrict an endpoint to a single role.

    Example
    -------
    @router.get(...)
    def endpoint(
        _: Annotated[
            User,
            Depends(require_role(UserRole.ADMIN)),
        ],
    ):
        ...
    """

    required = (
        required_role.value
        if isinstance(required_role, UserRole)
        else str(required_role)
    )

    def dependency(
        current_user: CurrentActiveUser,
    ) -> User:
        user_role = (
            current_user.role.value
            if isinstance(current_user.role, UserRole)
            else str(current_user.role)
        )

        if user_role != required:
            raise AuthorizationError(
                "Insufficient permissions."
            )

        return current_user

    return dependency


def require_roles(
    *allowed_roles: UserRole,
):
    """
    Restrict an endpoint to one or more roles.

    Example
    -------
    Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.MANAGER,
        )
    )
    """

    allowed = {
        role.value
        if isinstance(role, UserRole)
        else str(role)
        for role in allowed_roles
    }

    def dependency(
        current_user: CurrentActiveUser,
    ) -> User:
        user_role = (
            current_user.role.value
            if isinstance(current_user.role, UserRole)
            else str(current_user.role)
        )

        if user_role not in allowed:
            raise AuthorizationError(
                "Access denied."
            )

        return current_user

    return dependency


# ==========================================================
# Current User Dependency Alias
# ==========================================================

CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


# ==========================================================
# OAuth2 Dependency Aliases
# ==========================================================

OAuth2Token = Annotated[
    str,
    Depends(oauth2_scheme),
]

OptionalOAuth2Token = Annotated[
    str | None,
    Depends(oauth2_scheme),
]


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    # ------------------------------------------------------
    # OAuth
    # ------------------------------------------------------
    "oauth2_scheme",
    "OAuth2Token",
    "OptionalOAuth2Token",

    # ------------------------------------------------------
    # Database
    # ------------------------------------------------------
    "get_db_session",
    "DBSession",

    # ------------------------------------------------------
    # Repository Providers
    # ------------------------------------------------------
    "get_user_repository",
    "get_note_repository",
    "UserRepositoryDep",
    "NoteRepositoryDep",

    # ------------------------------------------------------
    # Service Providers
    # ------------------------------------------------------
    "get_auth_service",
    "get_user_service",
    "get_note_service",
    "AuthServiceDep",
    "UserServiceDep",
    "NoteServiceDep",

    # ------------------------------------------------------
    # Authentication Dependencies
    # ------------------------------------------------------
    "get_current_user",
    "get_optional_current_user",
    "get_current_active_user",
    "get_current_admin",

    # ------------------------------------------------------
    # Annotated Dependency Aliases
    # ------------------------------------------------------
    "CurrentUser",
    "CurrentActiveUser",
    "CurrentAdmin",
    "OptionalCurrentUser",

    # ------------------------------------------------------
    # RBAC
    # ------------------------------------------------------
    "require_role",
    "require_roles",
]

logger.info(
    "API dependency providers initialized successfully."
)