"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.services.auth_service

Architecture:
    Clean Architecture
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
Enterprise authentication service responsible for all authentication and
authorization business logic.

This service coordinates user authentication, registration, credential
validation, JWT generation, password management, token validation, and user
identity verification while delegating all persistence operations to
``UserRepository``.

This module intentionally contains **no SQLAlchemy query logic**.

All database interaction is delegated to the repository layer according to
Clean Architecture and the Repository Pattern.

Responsibilities
----------------
✓ User registration

✓ User authentication

✓ Credential validation

✓ JWT access token generation

✓ Refresh token generation

✓ Password verification

✓ Password changes

✓ Current user retrieval

✓ JWT payload validation

✓ User identity validation

✓ Administrator validation

✓ DTO ↔ ORM transformation

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
AuthService
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

• CRUD operations

• User retrieval

• Email lookup

• Transaction persistence

• User updates

Service Responsibilities
------------------------
AuthService is responsible for:

• Registration

• Login

• Password validation

• Password hashing coordination

• JWT generation

• Refresh token generation

• User identity validation

• Active account validation

• Administrator validation

• Response mapping

• Business rules

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

Authentication must always remain owned by FastAPI.

Design Principles
-----------------
• SOLID

• Clean Architecture

• Repository Pattern

• Service Layer Pattern

• Dependency Inversion

• Separation of Concerns

• Explicit Type Hints

• Stateless Design

• Enterprise Documentation

• Structured Logging

Thread Safety
-------------
This service contains no shared mutable state.

Every request receives an independent SQLAlchemy session through dependency
injection, making the implementation naturally thread-safe for concurrent
ASGI applications.

Future Extension Points
-----------------------
The architecture is intentionally prepared for:

• Refresh token rotation

• Token blacklisting

• OAuth2 providers

• Google Login

• GitHub Login

• Microsoft Login

• Single Sign-On (SSO)

• Multi-factor Authentication (MFA)

• Email verification

• Password reset

• Account lockout

• Audit logging

• Domain events

• OpenTelemetry tracing

• Metrics collection

• Distributed caching

• Message queues

without requiring changes to the public service API.

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from datetime import timedelta
from typing import Final, TypeAlias

# =============================================================================
# Third-Party Imports
# =============================================================================

from fastapi import HTTPException, status

# =============================================================================
# Application Configuration
# =============================================================================

from app.core.config import settings

# =============================================================================
# Application Core Imports
# =============================================================================

from app.core.constants import UserRole
from app.core.logging import get_logger
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)

# =============================================================================
# Domain Models
# =============================================================================

from app.models.user import User

# =============================================================================
# Repository Imports
# =============================================================================

from app.repositories.user_repository import UserRepository

# =============================================================================
# Authentication Schemas
# =============================================================================

from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
)

# =============================================================================
# Token Schemas
# =============================================================================

from app.schemas.token import (
    CurrentUser,
    JWTClaims,
    TokenPayload,
)

# =============================================================================
# User Schemas
# =============================================================================

from app.schemas.user import (
    UserCreate,
    UserResponse,
)

# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    "AuthService",
]

# =============================================================================
# Module Constants
# =============================================================================

DEFAULT_TOKEN_TYPE: Final[str] = "bearer"

DEFAULT_USER_ROLE: Final[str] = UserRole.USER.value

ADMIN_ROLE: Final[str] = UserRole.ADMIN.value

ACCESS_TOKEN_EXPIRY_MINUTES: Final[int] = (
    settings.ACCESS_TOKEN_EXPIRE_MINUTES
)

# =============================================================================
# Logging Constants
# =============================================================================

LOG_REGISTER: Final[str] = "Register User"

LOG_LOGIN: Final[str] = "User Login"

LOG_LOGOUT: Final[str] = "User Logout"

LOG_AUTHENTICATE: Final[str] = "Authenticate User"

LOG_REFRESH: Final[str] = "Refresh Token"

LOG_CHANGE_PASSWORD: Final[str] = "Change Password"

LOG_CURRENT_USER: Final[str] = "Current User"

LOG_VALIDATE: Final[str] = "Validate Credentials"

LOG_ADMIN: Final[str] = "Administrator Validation"

LOG_TOKEN: Final[str] = "Generate JWT"

# =============================================================================
# Type Aliases
# =============================================================================

AuthenticationResult: TypeAlias = AuthResponse

UserIdentity: TypeAlias = CurrentUser

JWTIdentity: TypeAlias = JWTClaims

DecodedToken: TypeAlias = TokenPayload

# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)

# =============================================================================
# Authentication Service
# =============================================================================


class AuthService:
    """
    Enterprise authentication and authorization service.

    This service represents the business layer responsible for all
    authentication-related workflows. It coordinates registration,
    authentication, password management, JWT generation, token validation,
    identity verification, and authorization while delegating persistence
    operations to ``UserRepository``.

    The service intentionally contains **no SQLAlchemy query logic**.
    All persistence operations are delegated to the repository layer in
    accordance with Clean Architecture and the Repository Pattern.

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
          AuthService
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

    • Request validation

    • Dependency injection

    • Authentication dependencies

    • Invoking service methods

    • Returning HTTP responses

    This Service
    ------------
    Responsible for:

    • User registration

    • User authentication

    • Credential verification

    • JWT access token generation

    • Refresh token generation

    • Password hashing coordination

    • Password changes

    • Current user retrieval

    • JWT payload validation

    • Identity verification

    • Active account validation

    • Administrator validation

    • DTO ↔ ORM mapping

    • Business rule enforcement

    • Structured logging

    Repository
    ----------
    Responsible for:

    • User persistence

    • CRUD operations

    • User lookup

    • Email lookup

    • Database transactions

    • ORM lifecycle management

    -----------------------------------------------------------------------
    Responsibilities
    -----------------------------------------------------------------------

    ✓ User registration

    ✓ User authentication

    ✓ Login

    ✓ JWT access token generation

    ✓ Refresh token generation

    ✓ Password verification

    ✓ Password changes

    ✓ Current user retrieval

    ✓ JWT claims validation

    ✓ Token payload validation

    ✓ Active user validation

    ✓ Administrator validation

    ✓ DTO transformation

    ✓ Business validation

    ✓ Structured logging

    -----------------------------------------------------------------------
    Microservice Responsibilities
    -----------------------------------------------------------------------

    FastAPI owns:

    • Authentication

    • Authorization

    • JWT generation

    • Refresh tokens

    • User management

    • Notes

    • Open Library integration

    NestJS owns:

    • Tasks

    • Categories

    • Tags

    • Notifications

    • Dashboard

    • Analytics

    • Activity Logs

    Authentication responsibilities must always remain inside the FastAPI
    service to preserve a single source of truth for user identity and
    security.

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

    • Enterprise Documentation

    • Structured Logging

    • Security First

    -----------------------------------------------------------------------
    Security Principles
    -----------------------------------------------------------------------

    This service follows several security practices:

    • Passwords are never stored in plain text.

    • Password verification always uses secure hashing.

    • JWT tokens contain only required claims.

    • Authentication failures never expose sensitive information.

    • Disabled accounts cannot authenticate.

    • Authorization is validated before privileged operations.

    • Business validation occurs before persistence.

    -----------------------------------------------------------------------
    Thread Safety
    -----------------------------------------------------------------------

    This service contains no shared mutable state.

    Every request receives an independent SQLAlchemy session through
    dependency injection, making the implementation naturally thread-safe
    under concurrent ASGI workloads.

    -----------------------------------------------------------------------
    Future Extension Points
    -----------------------------------------------------------------------

    The architecture is intentionally designed for future support of:

    • Refresh token rotation

    • Refresh token revocation

    • Token blacklisting

    • OAuth2 providers

    • Google authentication

    • GitHub authentication

    • Microsoft authentication

    • Single Sign-On (SSO)

    • Multi-factor Authentication (MFA)

    • Email verification

    • Password reset

    • Account recovery

    • Account lockout policies

    • Login attempt throttling

    • Session management

    • Device management

    • Audit logging

    • Domain events

    • Distributed caching

    • OpenTelemetry tracing

    • Metrics collection

    • Message queues

    • Multi-tenancy

    without requiring changes to the public service API.
    """
    
        # =========================================================================
    # Constructor
    # =========================================================================

    def __init__(
        self,
        user_repository: UserRepository,
    ) -> None:
        """
        Initialize the authentication service.

        Parameters
        ----------
        user_repository:
            Repository responsible for all user persistence
            and retrieval operations.

        Notes
        -----
        This service is intentionally stateless. The repository
        instance is injected through FastAPI's dependency
        injection system.
        """
        self.user_repository = user_repository

    # =========================================================================
    # Service Metadata
    # =========================================================================

    SERVICE_NAME: Final[str] = "AuthService"

    SERVICE_VERSION: Final[str] = "1.0.0"

    DOMAIN_NAME: Final[str] = "authentication"

    # =========================================================================
    # JWT Configuration
    # =========================================================================

    DEFAULT_TOKEN_TYPE: Final[str] = DEFAULT_TOKEN_TYPE

    ACCESS_TOKEN_EXPIRY_MINUTES: Final[int] = (
        ACCESS_TOKEN_EXPIRY_MINUTES
    )

    # =========================================================================
    # Default Roles
    # =========================================================================

    DEFAULT_USER_ROLE: Final[str] = DEFAULT_USER_ROLE

    ADMIN_ROLE: Final[str] = ADMIN_ROLE

    # =========================================================================
    # Logging Prefixes
    # =========================================================================

    LOG_REGISTER: Final[str] = LOG_REGISTER

    LOG_LOGIN: Final[str] = LOG_LOGIN

    LOG_LOGOUT: Final[str] = LOG_LOGOUT

    LOG_AUTHENTICATE: Final[str] = LOG_AUTHENTICATE

    LOG_REFRESH: Final[str] = LOG_REFRESH

    LOG_CHANGE_PASSWORD: Final[str] = LOG_CHANGE_PASSWORD

    LOG_CURRENT_USER: Final[str] = LOG_CURRENT_USER

    LOG_VALIDATE: Final[str] = LOG_VALIDATE

    LOG_ADMIN: Final[str] = LOG_ADMIN

    LOG_TOKEN: Final[str] = LOG_TOKEN

    # =========================================================================
    # Properties
    # =========================================================================

    @property
    def access_token_expiry_seconds(
        self,
    ) -> int:
        """
        Return the configured JWT access-token lifetime.

        Returns
        -------
        int
            Token lifetime in seconds.
        """
        return self.ACCESS_TOKEN_EXPIRY_MINUTES * 60

    # =========================================================================
    # Private Helper Sections
    # =========================================================================

    # Repository helpers

    # Authentication helpers

    # Authorization helpers

    # Password helpers

    # JWT helpers

    # Response builders

    # Validation helpers

    # User lookup helpers

    # Utility helpers

    # Health helpers
    
        # =========================================================================
    # Repository Helpers
    # =========================================================================

    def _repository(self) -> UserRepository:
        """
        Return the configured repository instance.

        This helper centralizes repository access, making future migration
        to dependency injection containers or repository interfaces easier.

        Returns
        -------
        UserRepository
            Repository responsible for all user persistence operations.
        """
        return self.user_repository

    # =========================================================================
    # User Lookup Helpers
    # =========================================================================

    def _get_user_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve a user by email address.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User | None
            Matching user if found; otherwise ``None``.
        """
        return self._repository().get_by_email(
            email.strip(),
        )

    def _require_user(
        self,
        email: str,
    ) -> User:
        """
        Retrieve a user by email or raise an authentication error.

        This helper is intentionally used during authentication workflows
        where the existence of the account should not be disclosed.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User
            Existing user.

        Raises
        ------
        HTTPException
            If the user cannot be found.
        """
        user = self._get_user_by_email(
            email,
        )

        if user is not None:
            return user

        logger.warning(
            "%s | unknown email=%s",
            self.LOG_AUTHENTICATE,
            email,
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # =========================================================================
    # Validation Helpers
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
        HTTPException
            If the account is inactive.
        """
        if user.is_active:
            return user

        logger.warning(
            "%s | inactive account | user_id=%s email=%s",
            self.LOG_AUTHENTICATE,
            user.id,
            user.email,
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    # =========================================================================
    # End Repository & Validation Helpers
    # =========================================================================
        # =========================================================================
    # Password Helpers
    # =========================================================================

    def _verify_credentials(
        self,
        *,
        plain_password: str,
        hashed_password: str,
    ) -> None:
        """
        Validate user credentials.

        Parameters
        ----------
        plain_password:
            Password supplied by the user.

        hashed_password:
            Stored password hash.

        Raises
        ------
        HTTPException
            If password verification fails.
        """
        if verify_password(
            plain_password,
            hashed_password,
        ):
            return

        logger.warning(
            "%s | invalid password supplied",
            self.LOG_VALIDATE,
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # =========================================================================
    # JWT Helpers
    # =========================================================================

    def _generate_access_token(
        self,
        user: User,
    ) -> str:
        """
        Generate a JWT access token.

        Parameters
        ----------
        user:
            Authenticated user.

        Returns
        -------
        str
            Signed JWT access token.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_TOKEN,
            user.id,
        )

        return create_access_token(
            user_id=str(user.id),
            email=user.email,
            role=user.role,
            expires_delta=timedelta(
                minutes=self.ACCESS_TOKEN_EXPIRY_MINUTES,
            ),
        )

    # =========================================================================
    # Response Builders
    # =========================================================================

    def _build_user_response(
        self,
        user: User,
    ) -> UserResponse:
        """
        Convert a User ORM model into a UserResponse DTO.

        Parameters
        ----------
        user:
            SQLAlchemy ORM model.

        Returns
        -------
        UserResponse
        """
        return UserResponse.model_validate(
            user,
        )

    def _build_current_user(
        self,
        user: User,
    ) -> CurrentUser:
        """
        Convert a User ORM model into a CurrentUser DTO.

        Parameters
        ----------
        user:
            SQLAlchemy ORM model.

        Returns
        -------
        CurrentUser
        """
        return CurrentUser(
            id=user.id,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
        )

    def _build_auth_response(
        self,
        *,
        user: User,
        access_token: str,
    ) -> AuthenticationResult:
        """
        Construct the standard authentication response.

        Parameters
        ----------
        user:
            Authenticated user.

        access_token:
            Newly generated JWT.

        Returns
        -------
        AuthenticationResult
        """
        return AuthResponse(
            access_token=access_token,
            token_type=self.DEFAULT_TOKEN_TYPE,
            expires_in=self.access_token_expiry_seconds,
            user=self._build_user_response(
                user,
            ),
        )

    # =========================================================================
    # Authorization Helpers
    # =========================================================================

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
        """
        return user.role == self.ADMIN_ROLE

    def _require_admin(
        self,
        user: User,
    ) -> User:
        """
        Validate administrator privileges.

        Parameters
        ----------
        user:
            Authenticated user.

        Returns
        -------
        User
            Validated administrator.

        Raises
        ------
        HTTPException
            If administrator privileges are missing.
        """
        self._require_active_user(
            user,
        )

        if self._is_admin(user):
            return user

        logger.warning(
            "%s | user_id=%s email=%s",
            self.LOG_ADMIN,
            user.id,
            user.email,
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator privileges are required.",
        )

    # =========================================================================
    # End Helper Methods
    # =========================================================================
    
        # =========================================================================
    # Registration
    # =========================================================================

    def register(
        self,
        request: RegisterRequest,
    ) -> AuthenticationResult:
        """
        Register a new user account.

        Business Rules
        --------------
        • Email addresses must be unique.
        • Passwords are hashed before persistence.
        • New users receive the default USER role.
        • Accounts are active by default.
        • Successful registration immediately returns
          a valid JWT access token.

        Parameters
        ----------
        request:
            Registration request.

        Returns
        -------
        AuthenticationResult
            Authentication response containing the
            JWT access token and user information.
        """
        logger.info(
            "%s | email=%s",
            self.LOG_REGISTER,
            request.email,
        )

        repository = self._repository()

        email = request.email.strip()

        if repository.email_exists(email):
            logger.warning(
                "%s | duplicate email=%s",
                self.LOG_REGISTER,
                email,
            )

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered.",
            )

        user = User(
            email=email,
            hashed_password=hash_password(
                request.password,
            ),
            role=self.DEFAULT_USER_ROLE,
            is_active=True,
        )

        created_user = repository.create(
            user,
        )

        access_token = self._generate_access_token(
            created_user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_REGISTER,
            created_user.id,
        )

        return self._build_auth_response(
            user=created_user,
            access_token=access_token,
        )

    # =========================================================================
    # Authentication
    # =========================================================================

    def authenticate_user(
        self,
        *,
        email: str,
        password: str,
    ) -> User:
        """
        Authenticate a user.

        Business Rules
        --------------
        • Email must exist.
        • Account must be active.
        • Password must be valid.

        Parameters
        ----------
        email:
            User email address.

        password:
            Plain-text password.

        Returns
        -------
        User
            Authenticated ORM model.
        """
        logger.info(
            "%s | email=%s",
            self.LOG_AUTHENTICATE,
            email,
        )

        user = self._require_user(
            email.strip(),
        )

        self._require_active_user(
            user,
        )

        self._verify_credentials(
            plain_password=password,
            hashed_password=user.hashed_password,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_AUTHENTICATE,
            user.id,
        )

        return user

    # =========================================================================
    # Login
    # =========================================================================

    def login(
        self,
        request: LoginRequest,
    ) -> AuthenticationResult:
        """
        Authenticate a user and issue a JWT access token.

        Business Rules
        --------------
        • User credentials must be valid.
        • Only active users may log in.
        • A new JWT access token is generated for
          every successful login.

        Parameters
        ----------
        request:
            Login request.

        Returns
        -------
        AuthenticationResult
            Authentication response containing the
            access token and authenticated user.
        """
        logger.info(
            "%s | email=%s",
            self.LOG_LOGIN,
            request.email,
        )

        user = self.authenticate_user(
            email=request.email,
            password=request.password,
        )

        access_token = self._generate_access_token(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_LOGIN,
            user.id,
        )

        return self._build_auth_response(
            user=user,
            access_token=access_token,
        )

    # =========================================================================
    # End Registration & Authentication
    # =========================================================================
    
        # =========================================================================
    # Password Management
    # =========================================================================

    def change_password(
        self,
        *,
        user: User,
        request: ChangePasswordRequest,
    ) -> UserResponse:
        """
        Change the authenticated user's password.

        Business Rules
        --------------
        • Current password must be valid.
        • New password must differ from the current password.
        • Passwords are always stored as hashes.
        • User information is returned after the update.

        Parameters
        ----------
        user:
            Authenticated user.

        request:
            Password change request.

        Returns
        -------
        UserResponse
            Updated user information.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_CHANGE_PASSWORD,
            user.id,
        )

        repository = self._repository()

        self._require_active_user(
            user,
        )

        self._verify_credentials(
            plain_password=request.current_password,
            hashed_password=user.hashed_password,
        )

        if verify_password(
            request.new_password,
            user.hashed_password,
        ):
            logger.warning(
                "%s | identical password | user_id=%s",
                self.LOG_CHANGE_PASSWORD,
                user.id,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "New password must be different "
                    "from the current password."
                ),
            )

        user.hashed_password = hash_password(
            request.new_password,
        )

        updated_user = repository.update(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_CHANGE_PASSWORD,
            updated_user.id,
        )

        return self._build_user_response(
            updated_user,
        )

    # =========================================================================
    # Current User
    # =========================================================================

    def get_current_user(
        self,
        *,
        user_id: int,
    ) -> UserIdentity:
        """
        Retrieve the currently authenticated user.

        Parameters
        ----------
        user_id:
            Authenticated user's identifier.

        Returns
        -------
        UserIdentity
            Current authenticated user.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_CURRENT_USER,
            user_id,
        )

        repository = self._repository()

        user = repository.get_by_id(
            user_id,
        )

        if user is None:
            logger.warning(
                "%s | unknown user_id=%s",
                self.LOG_CURRENT_USER,
                user_id,
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        self._require_active_user(
            user,
        )

        return self._build_current_user(
            user,
        )

    # =========================================================================
    # JWT Claims
    # =========================================================================

    def get_user_from_claims(
        self,
        claims: JWTIdentity,
    ) -> User:
        """
        Retrieve the authenticated ORM user from validated JWT claims.

        Parameters
        ----------
        claims:
            Validated JWT claims.

        Returns
        -------
        User
            Authenticated ORM model.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_VALIDATE,
            claims.user_id,
        )

        repository = self._repository()

        user = repository.get_by_id(
            claims.user_id,
        )

        if user is None:
            logger.warning(
                "%s | invalid claims | user_id=%s",
                self.LOG_VALIDATE,
                claims.user_id,
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        self._require_active_user(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_VALIDATE,
            user.id,
        )

        return user

    # =========================================================================
    # End Password & User Retrieval
    # =========================================================================
    
        # =========================================================================
    # Token Validation
    # =========================================================================

    def verify_token_payload(
        self,
        payload: DecodedToken,
    ) -> UserIdentity:
        """
        Validate a decoded JWT payload.

        Business Rules
        --------------
        • The referenced user must exist.
        • The user account must be active.
        • A validated identity DTO is returned.

        Parameters
        ----------
        payload:
            Decoded JWT payload.

        Returns
        -------
        UserIdentity
            Authenticated user identity.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_VALIDATE,
            payload.user_id,
        )

        repository = self._repository()

        user = repository.get_by_id(
            payload.user_id,
        )

        if user is None:
            logger.warning(
                "%s | invalid payload | user_id=%s",
                self.LOG_VALIDATE,
                payload.user_id,
            )

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials.",
            )

        self._require_active_user(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_VALIDATE,
            user.id,
        )

        return self._build_current_user(
            user,
        )

    # =========================================================================
    # Access Token Refresh
    # =========================================================================

    def refresh_access_token(
        self,
        current_user: User,
    ) -> AuthenticationResult:
        """
        Generate a fresh JWT access token.

        Business Rules
        --------------
        • Only active users may refresh tokens.
        • A completely new JWT is generated.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        AuthenticationResult
            Authentication response containing a new JWT.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_REFRESH,
            current_user.id,
        )

        self._require_active_user(
            current_user,
        )

        access_token = self._generate_access_token(
            current_user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_REFRESH,
            current_user.id,
        )

        return self._build_auth_response(
            user=current_user,
            access_token=access_token,
        )

    # =========================================================================
    # Authorization Helpers
    # =========================================================================

    def ensure_active_user(
        self,
        user: User,
    ) -> User:
        """
        Validate that a user account is active.

        This method exposes the internal validation helper
        for use by other services.

        Parameters
        ----------
        user:
            Authenticated user.

        Returns
        -------
        User
            Active user.
        """
        return self._require_active_user(
            user,
        )

    def ensure_admin(
        self,
        user: User,
    ) -> User:
        """
        Validate administrator privileges.

        This method exposes administrator validation
        for other services.

        Parameters
        ----------
        user:
            Authenticated user.

        Returns
        -------
        User
            Validated administrator.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_ADMIN,
            user.id,
        )

        validated_user = self._require_admin(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_ADMIN,
            validated_user.id,
        )

        return validated_user

    # =========================================================================
    # End Token Management
    # =========================================================================
        # =========================================================================
    # Logout
    # =========================================================================

    def logout(
        self,
        user: User,
    ) -> dict[str, str]:
        """
        Logout an authenticated user.

        Notes
        -----
        JWT authentication is stateless. Therefore, logout simply informs the
        client to discard the current access token.

        Future Enhancements
        -------------------
        • Refresh token revocation
        • Redis token blacklist
        • Device session tracking
        • Multi-device logout
        • Token rotation

        Parameters
        ----------
        user:
            Authenticated user.

        Returns
        -------
        dict[str, str]
            Logout confirmation message.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_LOGOUT,
            user.id,
        )

        self._require_active_user(
            user,
        )

        logger.info(
            "%s completed | user_id=%s",
            self.LOG_LOGOUT,
            user.id,
        )

        return {
            "message": "Logout successful."
        }

    # =========================================================================
    # Utility Methods
    # =========================================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email address already exists.

        Parameters
        ----------
        email:
            Email address to search.

        Returns
        -------
        bool
            True if the email exists; otherwise False.
        """
        return self._repository().email_exists(
            email.strip(),
        )

    def get_user(
        self,
        user_id: int,
    ) -> User:
        """
        Retrieve a user by identifier.

        Parameters
        ----------
        user_id:
            User identifier.

        Returns
        -------
        User
            Existing user.

        Raises
        ------
        HTTPException
            If the user cannot be found.
        """
        user = self._repository().get_by_id(
            user_id,
        )

        if user is not None:
            return user

        logger.warning(
            "%s | unknown user_id=%s",
            self.LOG_VALIDATE,
            user_id,
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    def validate_credentials(
        self,
        *,
        email: str,
        password: str,
    ) -> User:
        """
        Public wrapper around the authentication workflow.

        Parameters
        ----------
        email:
            User email.

        password:
            Plain-text password.

        Returns
        -------
        User
            Authenticated user.
        """
        return self.authenticate_user(
            email=email,
            password=password,
        )

    # =========================================================================
    # Service Metadata
    # =========================================================================

    @property
    def service_name(
        self,
    ) -> str:
        """
        Return the service name.
        """
        return self.SERVICE_NAME

    @property
    def service_version(
        self,
    ) -> str:
        """
        Return the service version.
        """
        return self.SERVICE_VERSION

    @property
    def domain_name(
        self,
    ) -> str:
        """
        Return the bounded domain name.
        """
        return self.DOMAIN_NAME
