"""
==========================================================
Authentication Service
==========================================================

Business logic for authentication and authorization.

Responsibilities
----------------
✓ User registration
✓ User authentication
✓ JWT access token generation
✓ Password verification
✓ Password changes
✓ Refresh token support
✓ User identity validation

This service contains business logic only.

Database access is delegated to UserRepository.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- PostgreSQL
- Docker
- Alembic
==========================================================
"""

from __future__ import annotations

from datetime import timedelta

from fastapi import HTTPException, status

from app.core.config import settings
from app.core.constants import UserRole
from app.core.logging import get_logger
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
)
from app.schemas.token import (
    CurrentUser,
    JWTClaims,
    TokenPayload,
)
from app.schemas.user import (
    UserCreate,
    UserResponse,
)

logger = get_logger(__name__)


class AuthService:
    """
    Enterprise authentication service.

    This class coordinates authentication-related
    business logic while delegating persistence to
    UserRepository.

    Responsibilities
    ----------------
    - Register users
    - Authenticate users
    - Generate JWT access tokens
    - Validate credentials
    - Change passwords
    """

    def __init__(
        self,
        user_repository: UserRepository,
    ) -> None:
        """
        Initialize the authentication service.

        Parameters
        ----------
        user_repository:
            Repository used for all user
            persistence operations.
        """
        self.user_repository = user_repository

    # ======================================================
    # Internal Helpers
    # ======================================================

    @property
    def access_token_expiry_seconds(self) -> int:
        """
        Access token lifetime in seconds.
        """
        return settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    def _get_user_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve a user by email.
        """
        return self.user_repository.get_by_email(email)

    def _require_user(
        self,
        email: str,
    ) -> User:
        """
        Retrieve a user or raise HTTP 401.
        """
        user = self._get_user_by_email(email)

        if user is None:
            logger.warning(
                "Authentication failed for unknown email: %s",
                email,
            )

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        return user

    def _require_active_user(
        self,
        user: User,
    ) -> User:
        """
        Ensure the user account is active.
        """
        if not user.is_active:
            logger.warning(
                "Inactive user attempted authentication: %s",
                user.email,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive.",
            )

        return user

    def _verify_credentials(
        self,
        *,
        plain_password: str,
        hashed_password: str,
    ) -> None:
        """
        Validate a user's password.
        """
        if not verify_password(
            plain_password,
            hashed_password,
        ):
            logger.warning("Invalid password supplied.")

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

    def _generate_access_token(
        self,
        user: User,
    ) -> str:
        """
        Generate a JWT access token.
        """
        return create_access_token(
            user_id=str(user.id),
            email=user.email,
            role=user.role,
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
            ),
        )

    def _build_user_response(
        self,
        user: User,
    ) -> UserResponse:
        """
        Convert a User model into a UserResponse.
        """
        return UserResponse.model_validate(user)

    def _build_auth_response(
        self,
        *,
        user: User,
        access_token: str,
    ) -> AuthResponse:
        """
        Construct the standard authentication response.
        """
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=self.access_token_expiry_seconds,
            user=self._build_user_response(user),
        )
        
            
    def register(
        self,
        request: RegisterRequest,
    ) -> AuthResponse:
        """
        Register a new user.

        Parameters
        ----------
        request:
            Registration request.

        Returns
        -------
        AuthResponse
            Authentication response containing
            a JWT access token and user details.
        """
        logger.info(
            "Registering new user: %s",
            request.email,
        )

        if self.user_repository.email_exists(request.email):
            logger.warning(
                "Registration failed. Email already exists: %s",
                request.email,
            )

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered.",
            )

        user = User(
            email=request.email,
            hashed_password=hash_password(request.password),
            role=UserRole.USER.value,
            is_active=True,
        )

        created_user = self.user_repository.create(user)

        access_token = self._generate_access_token(
            created_user,
        )

        logger.info(
            "User registered successfully: %s",
            created_user.email,
        )

        return self._build_auth_response(
            user=created_user,
            access_token=access_token,
        )

    # ======================================================
    # Authentication
    # ======================================================

    def authenticate_user(
        self,
        *,
        email: str,
        password: str,
    ) -> User:
        """
        Authenticate a user by email and password.

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
        user = self._require_user(email)

        self._require_active_user(user)

        self._verify_credentials(
            plain_password=password,
            hashed_password=user.hashed_password,
        )

        logger.info(
            "User authenticated successfully: %s",
            user.email,
        )

        return user

    def login(
        self,
        request: LoginRequest,
    ) -> AuthResponse:
        """
        Authenticate a user and generate
        a JWT access token.

        Parameters
        ----------
        request:
            Login request.

        Returns
        -------
        AuthResponse
            Authentication response.
        """
        user = self.authenticate_user(
            email=request.email,
            password=request.password,
        )

        access_token = self._generate_access_token(
            user,
        )

        logger.info(
            "Login successful: %s",
            user.email,
        )

        return self._build_auth_response(
            user=user,
            access_token=access_token,
        )
    
    def change_password(
        self,
        *,
        user: User,
        request: ChangePasswordRequest,
    ) -> UserResponse:
        """
        Change the authenticated user's password.

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
        self._verify_credentials(
            plain_password=request.current_password,
            hashed_password=user.hashed_password,
        )

        if verify_password(
            request.new_password,
            user.hashed_password,
        ):
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

        updated_user = self.user_repository.update(user)

        logger.info(
            "Password changed successfully for user: %s",
            updated_user.email,
        )

        return self._build_user_response(
            updated_user,
        )

    # ======================================================
    # User Retrieval
    # ======================================================

    def get_current_user(
        self,
        *,
        user_id: int,
    ) -> CurrentUser:
        """
        Retrieve the currently authenticated user.

        Parameters
        ----------
        user_id:
            Authenticated user's identifier.

        Returns
        -------
        CurrentUser
        """
        user = self.user_repository.get_by_id(
            user_id,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        self._require_active_user(user)

        return CurrentUser(
            id=user.id,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
        )

    def get_user_from_claims(
        self,
        claims: JWTClaims,
    ) -> User:
        """
        Retrieve the authenticated user from
        validated JWT claims.

        Parameters
        ----------
        claims:
            Validated JWT claims.

        Returns
        -------
        User
        """
        user = self.user_repository.get_by_id(
            claims.user_id,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        self._require_active_user(user)

        return user

    # ======================================================
    # Token Helpers
    # ======================================================

    def verify_token_payload(
        self,
        payload: TokenPayload,
    ) -> CurrentUser:
        """
        Validate a decoded JWT payload.

        Parameters
        ----------
        payload:
            Decoded JWT payload.

        Returns
        -------
        CurrentUser
        """
        user = self.user_repository.get_by_id(
            payload.user_id,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials.",
            )

        self._require_active_user(user)

        return CurrentUser(
            id=user.id,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
        )

    def refresh_access_token(
        self,
        current_user: User,
    ) -> AuthResponse:
        """
        Generate a fresh access token for an
        authenticated user.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        AuthResponse
        """
        self._require_active_user(
            current_user,
        )

        access_token = self._generate_access_token(
            current_user,
        )

        logger.info(
            "Access token refreshed for user: %s",
            current_user.email,
        )

        return self._build_auth_response(
            user=current_user,
            access_token=access_token,
        )
        
    def ensure_active_user(
        self,
        user: User,
    ) -> User:
            return self._require_active_user(user)

    def ensure_admin(
        self,
        user: User,
    ) -> User:
        """
        Ensure that the authenticated user has
        administrator privileges.

        Parameters
        ----------
        user:
            Authenticated user.

        Returns
        -------
        User
            The validated administrator.
        """
        self._require_active_user(user)

        if user.role != UserRole.ADMIN.value:
            logger.warning(
                "Unauthorized admin access attempt by user: %s",
                user.email,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrator privileges are required.",
            )

        return user

    # ======================================================
    # Logout
    # ======================================================

    def logout(self) -> None:
        """
        Logout the current user.

        Notes
        -----
        JWT authentication is stateless. Therefore,
        logout simply acknowledges the operation.

        Token blacklisting can be implemented later
        without changing this service interface.
        """
        logger.info("User logged out successfully.")

    # ======================================================
    # Health / Utility
    # ======================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Check whether an email address is already
        registered.

        Parameters
        ----------
        email:
            Email address.

        Returns
        -------
        bool
        """
        return self.user_repository.email_exists(email)

    def get_user(
        self,
        *,
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
        """
        user = self.user_repository.get_by_id(user_id)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return user

    def validate_credentials(
        self,
        *,
        email: str,
        password: str,
    ) -> bool:
        """
        Validate a user's credentials.

        Returns
        -------
        bool
            True if the credentials are valid.

        Raises
        ------
        HTTPException
            If authentication fails.
        """
        self.authenticate_user(
            email=email,
            password=password,
        )

        return True