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
# OAuth2
# ==========================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT",
    description="JWT Bearer authentication",
)

# ==========================================================
# Database Dependency
# ==========================================================


def get_db_session() -> Generator[Session, None, None]:
    """
    Database session dependency.

    This is a thin wrapper around the application's
    SQLAlchemy session dependency to keep all API
    dependencies centralized.

    Yields
    ------
    Session
        SQLAlchemy database session.
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
    Create a UserRepository instance.

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
    Create a NoteRepository instance.

    Parameters
    ----------
    db:
        Active SQLAlchemy session.

    Returns
    -------
    NoteRepository
    """

    return NoteRepository(db)


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
    Create AuthService.

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
    Create UserService.

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
    Create NoteService.

    Returns
    -------
    NoteService
    """

    return NoteService(
        note_repository=repository,
    )


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
    Retrieve the authenticated user from the JWT access token.

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
        Authenticated user.

    Raises
    ------
    AuthenticationError
        Invalid or malformed token.

    UserNotFoundError
        User referenced by the token does not exist.

    InactiveUserError
        User account is inactive.
    """

    try:
        payload = decode_access_token(token)
    except Exception as exc:
        logger.warning(
            "JWT decoding failed.",
            exc_info=exc,
        )
        raise AuthenticationError(
            "Invalid or expired authentication token."
        ) from exc

    user_id = payload.get("user_id")

    if user_id is None:
        raise AuthenticationError(
            "Authentication token is missing the user identifier."
        )

    user = auth_service.get_user(
        user_id=int(user_id),
    )

    if user is None:
        raise UserNotFoundError()

    auth_service.ensure_active_user(user)

    return user

    # ==========================================================
# Optional Authentication
# ==========================================================


def get_optional_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    auth_service: AuthServiceDep,
) -> User | None:
    """
    Retrieve the authenticated user if a valid JWT is supplied.

    Unlike ``get_current_user()``, this dependency returns
    ``None`` when authentication information is unavailable
    or invalid.

    This dependency is intended for endpoints that support
    both anonymous and authenticated users.

    Parameters
    ----------
    token:
        Optional bearer token.

    auth_service:
        Authentication service.

    Returns
    -------
    User | None
        Authenticated user if available; otherwise ``None``.
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

        if user is None:
            return None

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
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
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

    auth_service.ensure_active_user(
        current_user,
    )

    return current_user


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

    Raises
    ------
    AuthorizationError
        If the user is not an administrator.
    """

    auth_service.ensure_admin(
        current_user,
    )

    return current_user


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

    def dependency(
        current_user: CurrentActiveUser,
    ) -> User:

        user_role = (
            current_user.role.value
            if hasattr(current_user.role, "value")
            else current_user.role
        )

        required = (
            required_role.value
            if hasattr(required_role, "value")
            else required_role
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
        role.value if hasattr(role, "value") else role
        for role in allowed_roles
    }

    def dependency(
        current_user: CurrentActiveUser,
    ) -> User:

        user_role = (
            current_user.role.value
            if hasattr(current_user.role, "value")
            else current_user.role
        )

        if user_role not in allowed:
            raise AuthorizationError(
                "Access denied."
            )

        return current_user

    return dependency


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]

# ==========================================================
# Dependency Alias Exports
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
    # Authentication
    # ------------------------------------------------------
    "get_current_user",
    "get_optional_current_user",
    "get_current_active_user",
    "get_current_admin",

    # ------------------------------------------------------
    # Annotated User Dependencies
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