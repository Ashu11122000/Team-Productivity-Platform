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
Enterprise authentication service responsible for authentication and
authorization business logic.

This service coordinates:

• User registration
• User authentication
• Credential validation
• JWT access-token generation
• Password verification
• Password changes
• Current-user retrieval
• JWT identity validation
• Administrator validation
• DTO ↔ ORM transformation
• Structured logging

All persistence operations are delegated to UserRepository.

This service intentionally contains no SQLAlchemy query logic.

Authentication Ownership
------------------------
FastAPI is the single source of truth for authentication and JWT generation.

NestJS consumes and validates the JWT contract issued by FastAPI.

Authentication ownership must remain inside FastAPI.

Exception Architecture
-----------------------
Service methods raise application-level exceptions.

They do not construct HTTP responses directly.

Expected flow:

AuthService
    ↓
ApplicationError
    ↓
Global Exception Handler
    ↓
HTTP Response

This keeps authentication business logic independent from
the HTTP transport layer.

Password Security
-----------------
Passwords are handled through the centralized security layer.

The service never:

• Stores plaintext passwords
• Logs plaintext passwords
• Returns password hashes
• Implements hashing algorithms directly

The security layer owns the hashing implementation.

JWT Security
------------
JWT creation is delegated to app.core.security.create_access_token().

The service is responsible for deciding:

• Which user identity is placed into the token
• Which role is included
• When a token may be issued
• Whether the account is active

The security layer is responsible for:

• JWT encoding
• JWT claims construction
• Cryptographic signing
• Token expiration
• JWT validation

Repository Responsibilities
---------------------------
UserRepository is responsible for:

• User persistence
• User lookup
• Email lookup
• CRUD operations
• Transaction persistence

Service Responsibilities
------------------------
AuthService is responsible for:

• Registration
• Login
• Credential verification
• Password hashing coordination
• JWT generation orchestration
• Active-account validation
• User identity validation
• Administrator validation
• Business rules
• DTO mapping
• Structured logging

Microservice Ownership
----------------------
FastAPI owns:

• Authentication
• Authorization
• JWT generation
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
• Structured Logging
• Security First

Thread Safety
-------------
The service contains no shared mutable request state.

Repository dependencies are injected into the service.

Future Extension Points
-----------------------
The architecture is prepared for:

• Refresh token rotation
• Refresh token revocation
• Token blacklisting
• OAuth2
• Google Login
• GitHub Login
• Microsoft Login
• SSO
• MFA
• Email verification
• Password reset
• Account lockout
• Login throttling
• Session management
• Device management
• Audit logging
• Domain events
• OpenTelemetry
• Metrics
• Distributed caching
• Message queues
• Multi-tenancy

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from datetime import timedelta
from typing import Final, TypeAlias

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
# Application Exception Imports
# =============================================================================

from app.exceptions import (
    AuthenticationError,
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
# Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# Authentication Service
# =============================================================================


class AuthService:
    """
    Enterprise authentication and authorization service.

    This service represents the authentication business layer.

    It coordinates:

    • Registration
    • Login
    • Credential verification
    • Password management
    • JWT generation
    • Current-user retrieval
    • JWT identity validation
    • Administrator validation

    Persistence is delegated completely to UserRepository.

    HTTP response construction is delegated to the global exception
    handling layer.
    """

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
    # Roles
    # =========================================================================

    DEFAULT_USER_ROLE: Final[str] = DEFAULT_USER_ROLE

    ADMIN_ROLE: Final[str] = ADMIN_ROLE

    # =========================================================================
    # Logging
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
    # Constructor
    # =========================================================================

    def __init__(
        self,
        user_repository: UserRepository,
    ) -> None:
        """
        Initialize AuthService.

        Parameters
        ----------
        user_repository:
            Repository responsible for user persistence and lookup.

        Notes
        -----
        The service is stateless and receives its repository through
        dependency injection.
        """
        self.user_repository = user_repository

        logger.debug(
            "AuthService initialized.",
            extra={
                "service": self.SERVICE_NAME,
                "version": self.SERVICE_VERSION,
                "domain": self.DOMAIN_NAME,
                "repository": (
                    user_repository.__class__.__name__
                ),
            },
        )

    # =========================================================================
    # Repository Helper
    # =========================================================================

    def _repository(self) -> UserRepository:
        """
        Return the configured repository instance.

        Returns
        -------
        UserRepository
            Injected repository.
        """
        return self.user_repository

    # =========================================================================
    # Token Properties
    # =========================================================================

    @property
    def access_token_expiry_seconds(
        self,
    ) -> int:
        """
        Return the configured access-token lifetime.

        Returns
        -------
        int
            Access-token lifetime in seconds.
        """
        return (
            self.ACCESS_TOKEN_EXPIRY_MINUTES
            * 60
        )

    # =========================================================================
    # Email Normalization
    # =========================================================================

    @staticmethod
    def _normalize_email(
        email: str,
    ) -> str:
        """
        Normalize an email address before repository operations.

        Parameters
        ----------
        email:
            User email.

        Returns
        -------
        str
            Normalized email.
        """
        return email.strip().lower()

    # =========================================================================
    # User Lookup Helpers
    # =========================================================================

    def _get_user_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve a user by email.

        Parameters
        ----------
        email:
            User email.

        Returns
        -------
        User | None
            Matching user, if found.
        """
        normalized_email = (
            self._normalize_email(email)
        )

        return self._repository().get_by_email(
            normalized_email,
        )

    # =========================================================================
    # Authentication User Lookup
    # =========================================================================

    def _require_authentication_user(
        self,
        email: str,
    ) -> User:
        """
        Retrieve the user required for authentication.

        A generic AuthenticationError is raised when the user does not exist.

        This prevents authentication workflows from exposing whether an
        email address is registered.

        Parameters
        ----------
        email:
            User email.

        Returns
        -------
        User
            Existing user.

        Raises
        ------
        AuthenticationError
            If no user exists for the supplied email.
        """
        user = self._get_user_by_email(
            email,
        )

        if user is not None:
            return user

        logger.warning(
            "%s | authentication failed | unknown account",
            self.LOG_AUTHENTICATE,
        )

        raise AuthenticationError()

    # =========================================================================
    # User Retrieval Helper
    # =========================================================================

    def _require_user(
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
            self.LOG_VALIDATE,
            user_id,
        )

        raise UserNotFoundError()

    # =========================================================================
    # Active User Validation
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
            self.LOG_AUTHENTICATE,
            user.id,
        )

        raise InactiveUserError()

    # =========================================================================
    # Credential Verification
    # =========================================================================

    def _verify_credentials(
        self,
        *,
        plain_password: str,
        hashed_password: str,
    ) -> None:
        """
        Verify a password against its stored hash.

        Parameters
        ----------
        plain_password:
            Password supplied by the user.

        hashed_password:
            Stored password hash.

        Raises
        ------
        AuthenticationError
            If password verification fails.
        """
        if verify_password(
            plain_password,
            hashed_password,
        ):
            return

        logger.warning(
            "%s | password verification failed",
            self.LOG_VALIDATE,
        )

        raise AuthenticationError()

    # =========================================================================
    # JWT Generation
    # =========================================================================

    def _generate_access_token(
        self,
        user: User,
    ) -> str:
        """
        Generate a JWT access token for a user.

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
            email=str(user.email),
            role=str(user.role),
            expires_delta=timedelta(
                minutes=(
                    self.ACCESS_TOKEN_EXPIRY_MINUTES
                ),
            ),
        )

    # =========================================================================
    # Response Builders
    # =========================================================================

    @staticmethod
    def _build_user_response(
        user: User,
    ):
        """
        Convert a User ORM model into UserResponse.

        The UserResponse schema intentionally excludes sensitive password
        storage fields.
        """
        from app.schemas.user import UserResponse

        return UserResponse.model_validate(
            user,
        )

    @staticmethod
    def _build_current_user(
        user: User,
    ) -> CurrentUser:
        """
        Convert a User ORM model into CurrentUser.

        Parameters
        ----------
        user:
            User ORM model.

        Returns
        -------
        CurrentUser
            Current authenticated-user representation.
        """
        return CurrentUser(
            id=user.id,
            email=user.email,
            role=str(user.role),
            is_active=user.is_active,
        )

    def _build_auth_response(
        self,
        *,
        user: User,
        access_token: str,
    ) -> AuthenticationResult:
        """
        Build the standard authentication response.

        Parameters
        ----------
        user:
            Authenticated user.

        access_token:
            JWT access token.

        Returns
        -------
        AuthenticationResult
            Authentication response.
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
    # Authorization
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
            True when the user is an administrator.
        """
        role = user.role

        if isinstance(
            role,
            UserRole,
        ):
            return role.value == self.ADMIN_ROLE

        return str(role) == self.ADMIN_ROLE

    # =========================================================================
    # Administrator Validation
    # =========================================================================

    def _require_admin(
        self,
        user: User,
    ) -> User:
        """
        Ensure a user has administrator privileges.

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
        InactiveUserError
            If the account is inactive.

        AuthorizationError
            If the user is not an administrator.
        """
        self._require_active_user(
            user,
        )

        if self._is_admin(user):
            return user

        logger.warning(
            "%s denied | user_id=%s",
            self.LOG_ADMIN,
            user.id,
        )

        raise AuthorizationError()

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
        • New accounts are active.
        • Successful registration returns an access token.

        Parameters
        ----------
        request:
            Registration request.

        Returns
        -------
        AuthenticationResult
            Authentication response.

        Raises
        ------
        EmailAlreadyExistsError
            If the email is already registered.
        """
        email = self._normalize_email(
            str(request.email),
        )

        logger.info(
            "%s | registration requested",
            self.LOG_REGISTER,
        )

        repository = self._repository()

        if repository.email_exists(
            email,
        ):
            logger.warning(
                "%s | duplicate registration attempt",
                self.LOG_REGISTER,
            )

            raise EmailAlreadyExistsError()

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

        access_token = (
            self._generate_access_token(
                created_user,
            )
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
        Authenticate a user using email and password.

        Parameters
        ----------
        email:
            User email address.

        password:
            Plain-text password.

        Returns
        -------
        User
            Authenticated user.

        Raises
        ------
        AuthenticationError
            If the credentials are invalid.

        InactiveUserError
            If the account is inactive.
        """
        logger.info(
            "%s | authentication requested",
            self.LOG_AUTHENTICATE,
        )

        user = self._require_authentication_user(
            email,
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

        Parameters
        ----------
        request:
            Login request.

        Returns
        -------
        AuthenticationResult
            Access token and authenticated user.

        Raises
        ------
        AuthenticationError
            If the credentials are invalid.

        InactiveUserError
            If the account is inactive.
        """
        logger.info(
            "%s | login requested",
            self.LOG_LOGIN,
        )

        user = self.authenticate_user(
            email=str(request.email),
            password=request.password,
        )

        access_token = (
            self._generate_access_token(
                user,
            )
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
    # Change Password
    # =========================================================================

    def change_password(
        self,
        *,
        user: User,
        request: ChangePasswordRequest,
    ):
        """
        Change the authenticated user's password.

        Business Rules
        --------------
        • Account must be active.
        • Current password must be valid.
        • New password must differ from current password.
        • New password is hashed before persistence.

        Parameters
        ----------
        user:
            Authenticated user.

        request:
            Password change request.

        Returns
        -------
        UserResponse
            Updated user.

        Raises
        ------
        InactiveUserError
            If the account is inactive.

        AuthenticationError
            If the current password is invalid.

        AuthorizationError
            If the new password is identical to the current password.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_CHANGE_PASSWORD,
            user.id,
        )

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
                "%s denied | same password | user_id=%s",
                self.LOG_CHANGE_PASSWORD,
                user.id,
            )

            raise AuthorizationError()

        user.hashed_password = hash_password(
            request.new_password,
        )

        updated_user = self._repository().update(
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

        Raises
        ------
        UserNotFoundError
            If the user no longer exists.

        InactiveUserError
            If the account is inactive.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_CURRENT_USER,
            user_id,
        )

        user = self._require_user(
            user_id,
        )

        self._require_active_user(
            user,
        )

        return self._build_current_user(
            user,
        )

    # =========================================================================
    # JWT Claims → User
    # =========================================================================

    def get_user_from_claims(
        self,
        claims: JWTIdentity,
    ) -> User:
        """
        Resolve a validated JWT identity to the current ORM user.

        Parameters
        ----------
        claims:
            Validated JWT identity.

        Returns
        -------
        User
            Current authenticated user.

        Raises
        ------
        UserNotFoundError
            If the user no longer exists.

        InactiveUserError
            If the account is inactive.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_VALIDATE,
            claims.user_id,
        )

        user = self._require_user(
            claims.user_id,
        )

        self._require_active_user(
            user,
        )

        return user

    # =========================================================================
    # Token Payload Validation
    # =========================================================================

    def verify_token_payload(
        self,
        payload: DecodedToken,
    ) -> UserIdentity:
        """
        Validate a decoded JWT payload against the current user state.

        Parameters
        ----------
        payload:
            Validated JWT payload.

        Returns
        -------
        UserIdentity
            Current authenticated identity.

        Raises
        ------
        UserNotFoundError
            If the referenced user does not exist.

        InactiveUserError
            If the account is inactive.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_VALIDATE,
            payload.user_id,
        )

        user = self._require_user(
            payload.user_id,
        )

        self._require_active_user(
            user,
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
        Issue a fresh access token for an authenticated active user.

        Important
        ---------
        This method does NOT implement full refresh-token rotation.

        The current architecture reserves refresh-token rotation,
        revocation, and lifecycle management for future support.

        This method only issues another access token after the current
        authenticated user has been validated.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        AuthenticationResult
            Fresh access token and current user.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_REFRESH,
            current_user.id,
        )

        self._require_active_user(
            current_user,
        )

        access_token = (
            self._generate_access_token(
                current_user,
            )
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
    # Active User Validation
    # =========================================================================

    def ensure_active_user(
        self,
        user: User,
    ) -> User:
        """
        Validate that a user account is active.

        Parameters
        ----------
        user:
            User ORM model.

        Returns
        -------
        User
            Active user.
        """
        return self._require_active_user(
            user,
        )

    # =========================================================================
    # Administrator Validation
    # =========================================================================

    def ensure_admin(
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
    # Logout
    # =========================================================================

    def logout(
        self,
        user: User,
    ) -> None:
        """
        Logout an authenticated user.

        Current JWT Design
        ------------------
        The current access-token implementation is stateless.

        Therefore logout does not revoke a JWT.

        The client is expected to discard its access token.

        Future support may introduce:

        • Refresh-token revocation
        • Token blacklisting
        • Session tracking
        • Device management
        • Multi-device logout

        Parameters
        ----------
        user:
            Authenticated user.
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

    # =========================================================================
    # Utility: Email Exists
    # =========================================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email address exists.

        Parameters
        ----------
        email:
            Email address.

        Returns
        -------
        bool
            True when the email exists.
        """
        normalized_email = (
            self._normalize_email(email)
        )

        return self._repository().email_exists(
            normalized_email,
        )

    # =========================================================================
    # Utility: Get User
    # =========================================================================

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
            User ORM model.

        Raises
        ------
        UserNotFoundError
            If the user does not exist.
        """
        return self._require_user(
            user_id,
        )

    # =========================================================================
    # Utility: Validate Credentials
    # =========================================================================

    def validate_credentials(
        self,
        *,
        email: str,
        password: str,
    ) -> User:
        """
        Validate authentication credentials.

        This is a public service-level wrapper around authenticate_user().

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

    @classmethod
    def domain_name(
        cls,
    ) -> str:
        """
        Return the service domain.
        """
        return cls.DOMAIN_NAME