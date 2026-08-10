"""
==========================================================
User Repository
==========================================================

Enterprise repository implementation for User persistence.

Responsibilities
----------------
✓ Encapsulate all database access for User entities.
✓ Provide reusable query helpers.
✓ Support CRUD operations through BaseRepository.
✓ Support email lookups.
✓ Support active/inactive user queries.
✓ Support verified/unverified user queries.
✓ Support user search.
✓ Support pagination.
✓ Support sorting.
✓ Support user statistics.
✓ Support account state persistence.
✓ Respect soft-delete semantics.
✓ Remain free of business logic.

Architecture
------------
This repository is responsible ONLY for persistence.

Business rules such as:

• Password hashing.
• Authentication.
• JWT generation.
• Authorization.
• Email verification.
• Password reset.
• Account recovery.
• Duplicate-email policy.
• Role validation.

must remain inside the service layer.

The repository may persist state changes such as
``is_active`` or ``is_verified``, but it must not decide
whether those changes are allowed.

Features
--------
✓ SQLAlchemy 2.x style queries.
✓ Repository Pattern.
✓ Structured logging.
✓ Generic CRUD support via BaseRepository.
✓ Reusable private query builders.
✓ Soft-delete aware queries.
✓ Strong SQLAlchemy statement typing.
✓ Case-insensitive email lookups.
✓ Search across supported User fields.
✓ Enterprise documentation.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- psycopg v3
- Alembic
- Python 3.12+

==========================================================
"""

from __future__ import annotations

from typing import Any

from sqlalchemy import Select
from sqlalchemy import func
from sqlalchemy import or_
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseError
from app.core.logging import get_logger
from app.models.user import User
from app.repositories.base_repository import BaseRepository

# ==========================================================
# Logger
# ==========================================================

logger = get_logger(__name__)

# ==========================================================
# Repository
# ==========================================================


class UserRepository(BaseRepository[User]):
    """
    Repository responsible for User persistence.

    This repository contains ONLY persistence logic.

    Responsibilities
    ----------------
    • Build SQLAlchemy queries.
    • Execute database operations.
    • Return User ORM models.
    • Persist User state.

    This repository MUST NOT contain:

    • Business rules.
    • Password hashing.
    • Password verification.
    • JWT creation.
    • Authentication.
    • Authorization.
    • Email verification policy.
    • Password reset logic.
    • Account recovery logic.
    • Response serialization.
    """

    # ======================================================
    # Constructor
    # ======================================================

    def __init__(
        self,
        db: Session,
    ) -> None:
        """
        Initialize the User repository.

        Parameters
        ----------
        db:
            Active SQLAlchemy database session.
        """

        super().__init__(
            db=db,
            model=User,
        )

        logger.debug(
            "UserRepository initialized.",
            extra={
                "repository": self.__class__.__name__,
                "model": User.__name__,
            },
        )

    # ======================================================
    # Internal Query Helpers
    # ======================================================

    @staticmethod
    def _base_query() -> Select[tuple[User]]:
        """
        Build the base User SELECT statement.

        The base query excludes soft-deleted users.

        Returns
        -------
        Select[tuple[User]]
            Base SQLAlchemy SELECT statement.
        """

        return (
            select(User)
            .where(
                User.deleted_at.is_(None),
            )
        )

    @staticmethod
    def _active_query() -> Select[tuple[User]]:
        """
        Build a query for active, non-deleted users.

        Returns
        -------
        Select[tuple[User]]
            Active-user SELECT statement.
        """

        return (
            UserRepository._base_query()
            .where(
                User.is_active.is_(True),
            )
        )

    @staticmethod
    def _inactive_query() -> Select[tuple[User]]:
        """
        Build a query for inactive, non-deleted users.

        Returns
        -------
        Select[tuple[User]]
            Inactive-user SELECT statement.
        """

        return (
            UserRepository._base_query()
            .where(
                User.is_active.is_(False),
            )
        )

    @staticmethod
    def _verified_query() -> Select[tuple[User]]:
        """
        Build a query for verified, non-deleted users.

        Returns
        -------
        Select[tuple[User]]
            Verified-user SELECT statement.
        """

        return (
            UserRepository._base_query()
            .where(
                User.is_verified.is_(True),
            )
        )

    @staticmethod
    def _unverified_query() -> Select[tuple[User]]:
        """
        Build a query for unverified, non-deleted users.

        Returns
        -------
        Select[tuple[User]]
            Unverified-user SELECT statement.
        """

        return (
            UserRepository._base_query()
            .where(
                User.is_verified.is_(False),
            )
        )

    @staticmethod
    def _apply_search(
        statement: Select[tuple[User]],
        *,
        query: str,
    ) -> Select[tuple[User]]:
        """
        Apply a case-insensitive User search.

        The current User model does not contain ``full_name``.
        Therefore search is performed across fields that
        actually belong to the User model.

        Search fields
        -------------
        • email
        • role

        Parameters
        ----------
        statement:
            Existing SQLAlchemy SELECT statement.

        query:
            Search keyword.

        Returns
        -------
        Select[tuple[User]]
            Updated SELECT statement.
        """

        keyword = query.strip()

        if not keyword:
            return statement

        pattern = f"%{keyword}%"

        return statement.where(
            or_(
                User.email.ilike(pattern),
                User.role.ilike(pattern),
            ),
        )

    @staticmethod
    def _apply_sorting(
        statement: Select[tuple[User]],
        *,
        sort_by: str = "newest",
    ) -> Select[tuple[User]]:
        """
        Apply sorting to a User SELECT statement.

        Supported values
        ----------------
        newest
            Most recently created users first.

        oldest
            Earliest created users first.

        email
            Alphabetical by email.

        role
            Alphabetical by role.

        last_login
            Most recently logged-in users first.

        Unknown values
            Default to newest-first ordering.

        Parameters
        ----------
        statement:
            Existing SQLAlchemy SELECT statement.

        sort_by:
            Sorting strategy.

        Returns
        -------
        Select[tuple[User]]
            Updated SELECT statement.
        """

        strategy = sort_by.strip().lower()

        match strategy:
            case "oldest":
                return statement.order_by(
                    User.created_at.asc(),
                    User.id.asc(),
                )

            case "email":
                return statement.order_by(
                    User.email.asc(),
                    User.id.asc(),
                )

            case "role":
                return statement.order_by(
                    User.role.asc(),
                    User.id.asc(),
                )

            case "last_login":
                return statement.order_by(
                    User.last_login_at.desc().nullslast(),
                    User.id.desc(),
                )

            case _:
                return statement.order_by(
                    User.created_at.desc(),
                    User.id.desc(),
                )

    @staticmethod
    def _apply_pagination(
        statement: Select[tuple[User]],
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> Select[tuple[User]]:
        """
        Apply pagination to a User SELECT statement.

        Pagination validation belongs to the validation/service
        layer. This helper only translates validated values
        into SQLAlchemy OFFSET/LIMIT operations.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows returned.

        Returns
        -------
        Select[tuple[User]]
            Paginated SELECT statement.
        """

        return (
            statement
            .offset(skip)
            .limit(limit)
        )

    @staticmethod
    def _apply_verified_filter(
        statement: Select[tuple[User]],
        *,
        verified: bool | None,
    ) -> Select[tuple[User]]:
        """
        Apply an optional verification-state filter.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        verified:
            Desired verification state.

        Returns
        -------
        Select[tuple[User]]
            Updated SELECT statement.
        """

        if verified is None:
            return statement

        return statement.where(
            User.is_verified.is_(verified),
        )

    @staticmethod
    def _count_statement(
        statement: Select[tuple[User]],
    ) -> Select[tuple[int]]:
        """
        Convert a User SELECT statement into a COUNT query.

        Existing ordering is removed before constructing the
        count subquery.

        Parameters
        ----------
        statement:
            Existing User SELECT statement.

        Returns
        -------
        Select[tuple[int]]
            COUNT SELECT statement.
        """

        subquery = (
            statement
            .order_by(None)
            .subquery()
        )

        return select(
            func.count(),
        ).select_from(subquery)

    # ======================================================
    # Query Execution Helpers
    # ======================================================

    def _execute_scalar(
        self,
        statement: Select[tuple[User]],
    ) -> User | None:
        """
        Execute a query returning at most one User.

        Parameters
        ----------
        statement:
            SQLAlchemy SELECT statement.

        Returns
        -------
        User | None
            Matching User when found.

        Raises
        ------
        DatabaseError
            If database execution fails.
        """

        logger.debug(
            "Executing User scalar query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        try:
            return self.db.scalar(statement)

        except SQLAlchemyError as exc:
            logger.exception(
                "User scalar query failed.",
                extra={
                    "repository": self.__class__.__name__,
                },
            )

            raise DatabaseError(
                "Failed to retrieve user.",
            ) from exc

    def _execute_scalars(
        self,
        statement: Select[tuple[User]],
    ) -> list[User]:
        """
        Execute a query returning multiple User objects.

        Parameters
        ----------
        statement:
            SQLAlchemy SELECT statement.

        Returns
        -------
        list[User]
            Retrieved users.

        Raises
        ------
        DatabaseError
            If database execution fails.
        """

        logger.debug(
            "Executing User collection query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        try:
            return list(
                self.db.scalars(statement).all(),
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "User collection query failed.",
                extra={
                    "repository": self.__class__.__name__,
                },
            )

            raise DatabaseError(
                "Failed to retrieve users.",
            ) from exc

    def _execute_count(
        self,
        statement: Select[tuple[int]],
    ) -> int:
        """
        Execute a User COUNT query.

        Parameters
        ----------
        statement:
            COUNT SELECT statement.

        Returns
        -------
        int
            Number of matching users.

        Raises
        ------
        DatabaseError
            If database execution fails.
        """

        logger.debug(
            "Executing User count query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        try:
            return int(
                self.db.scalar(statement) or 0,
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "User count query failed.",
                extra={
                    "repository": self.__class__.__name__,
                },
            )

            raise DatabaseError(
                "Failed to count users.",
            ) from exc

    # ======================================================
    # Lookup Methods
    # ======================================================

    def get_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve a non-deleted User by email.

        Email comparison is case-insensitive.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User | None
            Matching User when found.
        """

        normalized_email = email.strip().lower()

        logger.debug(
            "Retrieving user by email.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        statement = (
            self._base_query()
            .where(
                func.lower(User.email) == normalized_email,
            )
            .limit(1)
        )

        return self._execute_scalar(statement)

    def get_active_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve an active User by email.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User | None
            Active matching User when found.
        """

        normalized_email = email.strip().lower()

        logger.debug(
            "Retrieving active user by email.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        statement = (
            self._active_query()
            .where(
                func.lower(User.email) == normalized_email,
            )
            .limit(1)
        )

        return self._execute_scalar(statement)

    def get_inactive_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve an inactive User by email.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User | None
            Inactive matching User when found.
        """

        normalized_email = email.strip().lower()

        logger.debug(
            "Retrieving inactive user by email.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        statement = (
            self._inactive_query()
            .where(
                func.lower(User.email) == normalized_email,
            )
            .limit(1)
        )

        return self._execute_scalar(statement)

    # ======================================================
    # User Listings
    # ======================================================

    def list_users(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[User]:
        """
        Retrieve non-deleted users.

        Supports pagination and sorting.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        list[User]
            Users matching the requested page.
        """

        logger.debug(
            "Listing users.",
            extra={
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._base_query()

        statement = self._apply_sorting(
            statement,
            sort_by=sort_by,
        )

        statement = self._apply_pagination(
            statement,
            skip=skip,
            limit=limit,
        )

        return self._execute_scalars(statement)

    def list_active_users(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[User]:
        """
        Retrieve active, non-deleted users.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        list[User]
            Active users.
        """

        logger.debug(
            "Listing active users.",
            extra={
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._active_query()

        statement = self._apply_sorting(
            statement,
            sort_by=sort_by,
        )

        statement = self._apply_pagination(
            statement,
            skip=skip,
            limit=limit,
        )

        return self._execute_scalars(statement)

    def list_inactive_users(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[User]:
        """
        Retrieve inactive, non-deleted users.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        list[User]
            Inactive users.
        """

        logger.debug(
            "Listing inactive users.",
            extra={
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._inactive_query()

        statement = self._apply_sorting(
            statement,
            sort_by=sort_by,
        )

        statement = self._apply_pagination(
            statement,
            skip=skip,
            limit=limit,
        )

        return self._execute_scalars(statement)

    def list_verified_users(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[User]:
        """
        Retrieve verified, non-deleted users.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        list[User]
            Verified users.
        """

        logger.debug(
            "Listing verified users.",
            extra={
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._verified_query()

        statement = self._apply_sorting(
            statement,
            sort_by=sort_by,
        )

        statement = self._apply_pagination(
            statement,
            skip=skip,
            limit=limit,
        )

        return self._execute_scalars(statement)

    def list_unverified_users(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[User]:
        """
        Retrieve unverified, non-deleted users.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        list[User]
            Unverified users.
        """

        logger.debug(
            "Listing unverified users.",
            extra={
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._unverified_query()

        statement = self._apply_sorting(
            statement,
            sort_by=sort_by,
        )

        statement = self._apply_pagination(
            statement,
            skip=skip,
            limit=limit,
        )

        return self._execute_scalars(statement)

    def list_recent_users(
        self,
        *,
        limit: int = 10,
    ) -> list[User]:
        """
        Retrieve the most recently registered users.

        Parameters
        ----------
        limit:
            Maximum number of users returned.

        Returns
        -------
        list[User]
            Recently registered users.
        """

        logger.debug(
            "Listing recent users.",
            extra={
                "limit": limit,
            },
        )

        statement = (
            self._base_query()
            .order_by(
                User.created_at.desc(),
                User.id.desc(),
            )
            .limit(limit)
        )

        return self._execute_scalars(statement)

    # ======================================================
    # Search Operations
    # ======================================================

    def search(
        self,
        *,
        query: str,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[User]:
        """
        Search non-deleted users.

        The current User model supports search across:

        • Email
        • Role

        Parameters
        ----------
        query:
            Search keyword.

        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | email | role | last_login

        Returns
        -------
        list[User]
            Matching users.
        """

        logger.debug(
            "Searching users.",
            extra={
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
                "has_query": bool(query.strip()),
            },
        )

        statement = self._base_query()

        statement = self._apply_search(
            statement,
            query=query,
        )

        statement = self._apply_sorting(
            statement,
            sort_by=sort_by,
        )

        statement = self._apply_pagination(
            statement,
            skip=skip,
            limit=limit,
        )

        return self._execute_scalars(statement)

    def search_count(
        self,
        *,
        query: str,
    ) -> int:
        """
        Count non-deleted users matching a search query.

        Parameters
        ----------
        query:
            Search keyword.

        Returns
        -------
        int
            Number of matching users.
        """

        logger.debug(
            "Counting user search results.",
            extra={
                "has_query": bool(query.strip()),
            },
        )

        statement = self._base_query()

        statement = self._apply_search(
            statement,
            query=query,
        )

        return self._execute_count(
            self._count_statement(statement),
        )

    # ======================================================
    # Existence Checks
    # ======================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether a non-deleted User exists
        with the supplied email.

        Parameters
        ----------
        email:
            Email address to check.

        Returns
        -------
        bool
            True when the email already exists.
        """

        normalized_email = email.strip().lower()

        logger.debug(
            "Checking user email existence.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        statement = (
            select(User.id)
            .where(
                User.deleted_at.is_(None),
                func.lower(User.email) == normalized_email,
            )
            .limit(1)
        )

        try:
            return self.db.scalar(statement) is not None

        except SQLAlchemyError as exc:
            logger.exception(
                "User email existence query failed.",
                extra={
                    "repository": self.__class__.__name__,
                },
            )

            raise DatabaseError(
                "Failed to check user email.",
            ) from exc

    def exists_by_email(
        self,
        email: str,
    ) -> bool:
        """
        Alias for :meth:`email_exists`.

        Parameters
        ----------
        email:
            Email address.

        Returns
        -------
        bool
            True when the email exists.
        """

        return self.email_exists(email)

    def is_email_available(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email is available.

        This method only performs persistence lookup.
        Registration policy belongs to the service layer.

        Parameters
        ----------
        email:
            Email address.

        Returns
        -------
        bool
            True when no non-deleted user has the email.
        """

        return not self.email_exists(email)

    # ======================================================
    # Verification Statistics
    # ======================================================

    def count_verified(
        self,
    ) -> int:
        """
        Count verified, non-deleted users.

        Returns
        -------
        int
            Number of verified users.
        """

        logger.debug(
            "Counting verified users.",
        )

        return self._execute_count(
            self._count_statement(
                self._verified_query(),
            ),
        )

    def count_unverified(
        self,
    ) -> int:
        """
        Count unverified, non-deleted users.

        Returns
        -------
        int
            Number of unverified users.
        """

        logger.debug(
            "Counting unverified users.",
        )

        return self._execute_count(
            self._count_statement(
                self._unverified_query(),
            ),
        )

    # ======================================================
    # User Counts
    # ======================================================

    def count_active(
        self,
    ) -> int:
        """
        Count active, non-deleted users.

        Returns
        -------
        int
            Number of active users.
        """

        logger.debug(
            "Counting active users.",
        )

        return self._execute_count(
            self._count_statement(
                self._active_query(),
            ),
        )

    def count_inactive(
        self,
    ) -> int:
        """
        Count inactive, non-deleted users.

        Returns
        -------
        int
            Number of inactive users.
        """

        logger.debug(
            "Counting inactive users.",
        )

        return self._execute_count(
            self._count_statement(
                self._inactive_query(),
            ),
        )

    def total_users(
        self,
    ) -> int:
        """
        Count all non-deleted users.

        Returns
        -------
        int
            Total number of users.
        """

        logger.debug(
            "Counting total users.",
        )

        return self._execute_count(
            self._count_statement(
                self._base_query(),
            ),
        )

    def total_active_users(
        self,
    ) -> int:
        """
        Count active, non-deleted users.

        Returns
        -------
        int
            Total number of active users.
        """

        return self.count_active()

    def total_inactive_users(
        self,
    ) -> int:
        """
        Count inactive, non-deleted users.

        Returns
        -------
        int
            Total number of inactive users.
        """

        return self.count_inactive()

    def total_verified_users(
        self,
    ) -> int:
        """
        Count verified, non-deleted users.

        Returns
        -------
        int
            Total number of verified users.
        """

        return self.count_verified()

    def total_unverified_users(
        self,
    ) -> int:
        """
        Count unverified, non-deleted users.

        Returns
        -------
        int
            Total number of unverified users.
        """

        return self.count_unverified()

    def active_percentage(
        self,
    ) -> float:
        """
        Calculate the percentage of active users.

        Returns
        -------
        float
            Active-user percentage rounded to two decimals.
        """

        total = self.total_users()

        if total == 0:
            return 0.0

        active = self.total_active_users()

        return round(
            (active / total) * 100,
            2,
        )

    def inactive_percentage(
        self,
    ) -> float:
        """
        Calculate the percentage of inactive users.

        Returns
        -------
        float
            Inactive-user percentage rounded to two decimals.
        """

        total = self.total_users()

        if total == 0:
            return 0.0

        inactive = self.total_inactive_users()

        return round(
            (inactive / total) * 100,
            2,
        )

    def verified_percentage(
        self,
    ) -> float:
        """
        Calculate the percentage of verified users.

        Returns
        -------
        float
            Verified-user percentage rounded to two decimals.
        """

        total = self.total_users()

        if total == 0:
            return 0.0

        verified = self.total_verified_users()

        return round(
            (verified / total) * 100,
            2,
        )

    def unverified_percentage(
        self,
    ) -> float:
        """
        Calculate the percentage of unverified users.

        Returns
        -------
        float
            Unverified-user percentage rounded to two decimals.
        """

        total = self.total_users()

        if total == 0:
            return 0.0

        unverified = self.total_unverified_users()

        return round(
            (unverified / total) * 100,
            2,
        )

    # ======================================================
    # State Changes
    # ======================================================

    def activate(
        self,
        user: User,
    ) -> User:
        """
        Persist an active account state.

        The service layer remains responsible for deciding
        whether activation is allowed.

        Parameters
        ----------
        user:
            Existing User ORM instance.

        Returns
        -------
        User
            Updated User instance.
        """

        logger.debug(
            "Activating user.",
            extra={
                "user_id": user.id,
            },
        )

        user.is_active = True

        return self.update(user)

    def deactivate(
        self,
        user: User,
    ) -> User:
        """
        Persist an inactive account state.

        The service layer remains responsible for deciding
        whether deactivation is allowed.

        Parameters
        ----------
        user:
            Existing User ORM instance.

        Returns
        -------
        User
            Updated User instance.
        """

        logger.debug(
            "Deactivating user.",
            extra={
                "user_id": user.id,
            },
        )

        user.is_active = False

        return self.update(user)

    def toggle_active(
        self,
        user: User,
    ) -> User:
        """
        Toggle the persisted active state of a User.

        Parameters
        ----------
        user:
            Existing User ORM instance.

        Returns
        -------
        User
            Updated User instance.
        """

        logger.debug(
            "Toggling user active status.",
            extra={
                "user_id": user.id,
                "current_status": user.is_active,
            },
        )

        user.is_active = not user.is_active

        return self.update(user)

    def mark_verified(
        self,
        user: User,
    ) -> User:
        """
        Persist the verified state of a User.

        The service layer is responsible for the actual
        email-verification business workflow.

        Parameters
        ----------
        user:
            Existing User ORM instance.

        Returns
        -------
        User
            Updated User instance.
        """

        logger.debug(
            "Marking user as verified.",
            extra={
                "user_id": user.id,
            },
        )

        user.is_verified = True

        return self.update(user)

    def mark_unverified(
        self,
        user: User,
    ) -> User:
        """
        Persist the unverified state of a User.

        Parameters
        ----------
        user:
            Existing User ORM instance.

        Returns
        -------
        User
            Updated User instance.
        """

        logger.debug(
            "Marking user as unverified.",
            extra={
                "user_id": user.id,
            },
        )

        user.is_verified = False

        return self.update(user)

    # ======================================================
    # Repository Utilities
    # ======================================================

    def refresh_user(
        self,
        user: User,
    ) -> User:
        """
        Refresh a User instance from the database.

        Parameters
        ----------
        user:
            Existing ORM instance.

        Returns
        -------
        User
            Refreshed User instance.
        """

        logger.debug(
            "Refreshing user instance.",
            extra={
                "user_id": user.id,
            },
        )

        self.refresh(user)

        return user

    def attach(
        self,
        user: User,
    ) -> User:
        """
        Merge a detached User instance into the current
        SQLAlchemy session.

        Parameters
        ----------
        user:
            Detached User ORM instance.

        Returns
        -------
        User
            Managed User ORM instance.
        """

        logger.debug(
            "Attaching detached user.",
            extra={
                "user_id": user.id,
            },
        )

        return self.merge(user)

    def save(
        self,
        user: User,
    ) -> User:
        """
        Persist changes to an existing User.

        Convenience wrapper around BaseRepository.update().

        Parameters
        ----------
        user:
            Existing User ORM instance.

        Returns
        -------
        User
            Updated User instance.
        """

        logger.debug(
            "Saving user.",
            extra={
                "user_id": user.id,
            },
        )

        return self.update(user)

    def remove(
        self,
        user: User,
    ) -> None:
        """
        Permanently remove a User.

        This method intentionally delegates to the generic
        BaseRepository delete operation. If the application
        requires soft deletion, the service layer should use
        the model's soft-delete behavior instead.

        Parameters
        ----------
        user:
            Existing User ORM instance.
        """

        logger.debug(
            "Removing user.",
            extra={
                "user_id": user.id,
            },
        )

        self.delete(user)

    def remove_many(
        self,
        users: list[User],
    ) -> None:
        """
        Permanently remove multiple Users.

        Parameters
        ----------
        users:
            Collection of User ORM instances.
        """

        if not users:
            return

        logger.debug(
            "Removing multiple users.",
            extra={
                "count": len(users),
            },
        )

        self.delete_many(users)

    def touch(
        self,
        user: User,
    ) -> User:
        """
        Commit pending changes and refresh the User entity.

        Parameters
        ----------
        user:
            Existing User ORM instance.

        Returns
        -------
        User
            Refreshed User instance.
        """

        logger.debug(
            "Touching user.",
            extra={
                "user_id": user.id,
            },
        )

        return self._commit_and_refresh(user)


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "UserRepository",
]