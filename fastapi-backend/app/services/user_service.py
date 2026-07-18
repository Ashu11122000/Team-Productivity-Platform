"""
==========================================================
User Service
==========================================================

Business logic for user management.

Responsibilities
----------------
✓ User management
✓ User profile retrieval
✓ User updates
✓ User activation/deactivation
✓ Role validation
✓ Administrator operations

Authentication responsibilities such as:

- Login
- Registration
- JWT generation
- Password verification

belong to AuthService.

Database access is delegated to UserRepository.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Pydantic v2
- Docker
- Alembic
==========================================================
"""

from __future__ import annotations

from fastapi import HTTPException, status

from app.core.constants import UserRole
from app.core.logging import get_logger
from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserSummary,
    UserUpdate,
)

logger = get_logger(__name__)


class UserService:
    """
    Enterprise user service.

    Coordinates user-related business logic while
    delegating persistence to UserRepository.

    Responsibilities
    ----------------
    - User retrieval
    - User updates
    - User activation
    - User deactivation
    - Administrator operations
    """

    def __init__(
        self,
        user_repository: UserRepository,
    ) -> None:
        """
        Initialize the service.

        Parameters
        ----------
        user_repository:
            Repository responsible for all
            user persistence operations.
        """
        self.user_repository = user_repository

    # ======================================================
    # Internal Helpers
    # ======================================================

    def _is_admin(
        self,
        user: User,
    ) -> bool:
        """
        Determine whether a user has
        administrator privileges.
        """
        return user.role == UserRole.ADMIN.value

    def _require_user(
        self,
        user_id: int,
    ) -> User:
        """
        Retrieve a user or raise HTTP 404.

        Parameters
        ----------
        user_id:
            User identifier.

        Returns
        -------
        User
        """
        user = self.user_repository.get_by_id(
            user_id,
        )

        if user is None:
            logger.warning(
                "User not found: %s",
                user_id,
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
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
                "Inactive user access attempt: %s",
                user.email,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive.",
            )

        return user

    def _require_admin(
        self,
        current_user: User,
    ) -> User:
        """
        Ensure the current user is an administrator.
        """
        self._require_active_user(current_user)

        if not self._is_admin(current_user):
            logger.warning(
                "Administrator access denied for user: %s",
                current_user.email,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrator privileges are required.",
            )

        return current_user

    def _build_user_response(
        self,
        user: User,
    ) -> UserResponse:
        """
        Convert a User model into a UserResponse.
        """
        return UserResponse.model_validate(
            user,
        )

    def _build_user_summary(
        self,
        user: User,
    ) -> UserSummary:
        """
        Convert a User model into a UserSummary.
        """
        return UserSummary.model_validate(
            user,
        )
    
    def create_user(
        self,
        user_data: UserCreate,
    ) -> UserResponse:
        """
        Create a new user.

        Parameters
        ----------
        user_data:
            User registration data.

        Returns
        -------
        UserResponse
        """
        logger.info(
            "Creating user with email: %s",
            user_data.email,
        )

        if self.user_repository.email_exists(
            user_data.email,
        ):
            logger.warning(
                "Attempted registration with existing email: %s",
                user_data.email,
            )

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already registered.",
            )

        user = User(
            email=user_data.email,
            hashed_password=hash_password(
                user_data.password,
            ),
            role=UserRole.USER.value,
            is_active=True,
        )

        created_user = self.user_repository.create(
            user,
        )

        logger.info(
            "User created successfully | id=%s",
            created_user.id,
        )

        return self._build_user_response(
            created_user,
        )

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
        user = self.user_repository.get_by_email(
            email,
        )

        if user is None:
            logger.warning(
                "User not found for email: %s",
                email,
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return self._build_user_response(
            user,
        )

    def get_current_user(
        self,
        current_user: User,
    ) -> UserResponse:
        """
        Return the currently authenticated user.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        UserResponse
        """
        self._require_active_user(
            current_user,
        )

        return self._build_user_response(
            current_user,
        )

    def update_user(
        self,
        *,
        current_user: User,
        user_id: int,
        user_data: UserUpdate,
    ) -> UserResponse:
        """
        Update a user.

        Users may update their own profile.
        Administrators may update any profile.

        Parameters
        ----------
        current_user:
            Authenticated user.

        user_id:
            Target user identifier.

        user_data:
            Updated user fields.

        Returns
        -------
        UserResponse
        """
        user = self._require_user(
            user_id,
        )

        if (
            current_user.id != user.id
            and not self._is_admin(current_user)
        ):
            logger.warning(
                "Unauthorized profile update | "
                "actor=%s target=%s",
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

        update_data = user_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        if "email" in update_data:
            existing = self.user_repository.get_by_email(
                update_data["email"],
            )

            if (
                existing is not None
                and existing.id != user.id
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "Email is already registered."
                    ),
                )

        if "password" in update_data:
            user.hashed_password = hash_password(
                update_data.pop("password"),
            )

        for field, value in update_data.items():
            setattr(
                user,
                field,
                value,
            )

        updated_user = self.user_repository.update(
            user,
        )

        logger.info(
            "User updated successfully | id=%s",
            updated_user.id,
        )

        return self._build_user_response(
            updated_user,
        )
    
    def list_users(
        self,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[int, list[UserResponse]]:
        """
        Retrieve all users.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        page:
            Page number (1-based).

        limit:
            Number of records per page.

        Returns
        -------
        tuple[int, list[UserResponse]]
        """
        self._require_admin(current_user)

        skip = (page - 1) * limit

        users = self.user_repository.list_users(
            skip=skip,
            limit=limit,
        )

        total = self.user_repository.total_users()

        return (
            total,
            [
                self._build_user_response(user)
                for user in users
            ],
        )

    def list_active_users(
        self,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[int, list[UserSummary]]:
        """
        Retrieve all active users.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        page:
            Page number.

        limit:
            Page size.

        Returns
        -------
        tuple[int, list[UserSummary]]
        """
        self._require_admin(current_user)

        skip = (page - 1) * limit

        users = self.user_repository.get_active_users(
            skip=skip,
            limit=limit,
        )

        total = self.user_repository.total_active_users()

        return (
            total,
            [
                self._build_user_summary(user)
                for user in users
            ],
        )

    def search_users(
        self,
        *,
        current_user: User,
        query: str,
        page: int = 1,
        limit: int = 10,
    ) -> list[UserSummary]:
        """
        Search users by email.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        query:
            Search keyword.

        page:
            Page number.

        limit:
            Maximum records.

        Returns
        -------
        list[UserSummary]
        """
        self._require_admin(current_user)

        skip = (page - 1) * limit

        users = self.user_repository.search(
            query=query,
            skip=skip,
            limit=limit,
        )

        return [
            self._build_user_summary(user)
            for user in users
        ]

    def get_statistics(
        self,
        *,
        current_user: User,
    ) -> dict[str, int]:
        """
        Retrieve user statistics.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        Returns
        -------
        dict[str, int]
        """
        self._require_admin(current_user)

        return {
            "total_users": (
                self.user_repository.total_users()
            ),
            "active_users": (
                self.user_repository.total_active_users()
            ),
            "inactive_users": (
                self.user_repository.total_users()
                - self.user_repository.total_active_users()
            ),
        }
        
    def activate_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> UserResponse:
        """
        Activate a user account.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            User identifier.

        Returns
        -------
        UserResponse
        """
        self._require_admin(current_user)

        user = self._require_user(user_id)

        if user.is_active:
            return self._build_user_response(user)

        activated_user = self.user_repository.activate(
            user,
        )

        logger.info(
            "User activated | id=%s",
            activated_user.id,
        )

        return self._build_user_response(
            activated_user,
        )

    def deactivate_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> UserResponse:
        """
        Deactivate a user account.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            User identifier.

        Returns
        -------
        UserResponse
        """
        self._require_admin(current_user)

        if current_user.id == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot deactivate your own account.",
            )

        user = self._require_user(user_id)

        if not user.is_active:
            return self._build_user_response(user)

        deactivated_user = self.user_repository.deactivate(
            user,
        )

        logger.info(
            "User deactivated | id=%s",
            deactivated_user.id,
        )

        return self._build_user_response(
            deactivated_user,
        )

    def delete_user(
        self,
        *,
        current_user: User,
        user_id: int,
    ) -> None:
        """
        Permanently delete a user.

        Administrator only.

        Parameters
        ----------
        current_user:
            Authenticated administrator.

        user_id:
            User identifier.
        """
        self._require_admin(current_user)

        if current_user.id == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot delete your own account.",
            )

        user = self._require_user(user_id)

        self.user_repository.delete(
            user,
        )

        logger.info(
            "User deleted | id=%s",
            user.id,
        )

    # ======================================================
    # Utility Methods
    # ======================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Check whether an email address
        is already registered.
        """
        return self.user_repository.email_exists(
            email,
        )

    def get_user_model(
        self,
        user_id: int,
    ) -> User:
        """
        Retrieve the underlying User ORM model.

        Intended for internal service usage.

        Parameters
        ----------
        user_id:
            User identifier.

        Returns
        -------
        User
        """
        return self._require_user(
            user_id,
        )

    def validate_admin(
        self,
        current_user: User,
    ) -> None:
        """
        Validate administrator access.

        Parameters
        ----------
        current_user:
            Authenticated user.
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
            User instance.
        """
        self._require_active_user(
            user,
        )