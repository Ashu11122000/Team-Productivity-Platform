"""
==========================================================
User Repository
==========================================================

Enterprise repository implementation for User persistence.

Responsibilities
----------------
✓ Encapsulate all database access for User entities
✓ Provide reusable query helpers
✓ Support CRUD operations
✓ Support email lookups
✓ Support active/inactive user queries
✓ Support search
✓ Support pagination
✓ Support statistics
✓ Remain free of business logic

Architecture
------------
This repository is responsible ONLY for persistence.

Business rules such as:

• Password hashing
• Authentication
• JWT generation
• Authorization
• Email verification
• Password reset
• Account recovery

must remain inside the service layer.

Features
--------
✓ SQLAlchemy 2.x style queries
✓ Repository Pattern
✓ Structured logging
✓ Generic CRUD support via BaseRepository
✓ Reusable private query builders
✓ Enterprise documentation

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
from sqlalchemy.orm import Session

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
    • Return ORM models.

    This repository MUST NOT contain:

    • Business rules
    • Password hashing
    • JWT creation
    • Authentication
    • Authorization
    • Email verification
    • Response serialization
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
            Active SQLAlchemy session.
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

    def _base_query(self) -> Select[tuple[User]]:
        """
        Build the base SELECT statement for the User model.

        Returns
        -------
        Select[tuple[User]]
            Base SQLAlchemy SELECT statement.
        """

        return select(User)

    def _active_query(self) -> Select[tuple[User]]:
        """
        Build a query for active users.

        Returns
        -------
        Select[tuple[User]]
            Active-user SELECT statement.
        """

        return self._base_query().where(
            User.is_active.is_(True),
        )

    def _inactive_query(self) -> Select[tuple[User]]:
        """
        Build a query for inactive users.

        Returns
        -------
        Select[tuple[User]]
            Inactive-user SELECT statement.
        """

        return self._base_query().where(
            User.is_active.is_(False),
        )

    @staticmethod
    def _apply_search(
        statement: Select[tuple[User]],
        *,
        query: str,
    ) -> Select[tuple[User]]:
        """
        Apply a case-insensitive search across
        user name and email.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

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
                User.full_name.ilike(pattern),
                User.email.ilike(pattern),
            )
        )

    @staticmethod
    def _apply_sorting(
        statement: Select[tuple[User]],
        *,
        sort_by: str = "newest",
    ) -> Select[tuple[User]]:
        """
        Apply sorting to a SELECT statement.

        Supported values
        ----------------
        newest
            Most recently created users.

        oldest
            Earliest created users.

        name
            Alphabetical by full name.

        email
            Alphabetical by email address.

        Unknown values default to ``newest``.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        sort_by:
            Sorting strategy.

        Returns
        -------
        Select[tuple[User]]
            Updated statement.
        """

        strategy = sort_by.strip().lower()

        match strategy:
            case "oldest":
                return statement.order_by(
                    User.created_at.asc(),
                )

            case "name":
                return statement.order_by(
                    User.full_name.asc(),
                )

            case "email":
                return statement.order_by(
                    User.email.asc(),
                )

            case _:
                return statement.order_by(
                    User.created_at.desc(),
                )

    @staticmethod
    def _apply_pagination(
        statement: Select[tuple[User]],
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> Select[tuple[User]]:
        """
        Apply pagination to a SELECT statement.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.

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
    def _count_statement(
        statement: Select[Any],
    ) -> Select[tuple[int]]:
        """
        Convert a SELECT statement into an equivalent
        COUNT query.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        Returns
        -------
        Select[tuple[int]]
            COUNT statement.
        """

        return (
            select(func.count())
            .select_from(
                statement.order_by(None).subquery()
            )
        )

    def _execute_scalar(
        self,
        statement: Select[tuple[User]],
    ) -> User | None:
        """
        Execute a query returning a single User.

        Parameters
        ----------
        statement:
            SQLAlchemy SELECT statement.

        Returns
        -------
        User | None
            Matching user if found.
        """

        logger.debug(
            "Executing User scalar lookup.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        return self.db.scalar(statement)

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
        """

        logger.debug(
            "Executing User scalar query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        return list(
            self.db.scalars(statement).all()
        )

    def _execute_count(
        self,
        statement: Select[tuple[int]],
    ) -> int:
        """
        Execute a COUNT statement.

        Parameters
        ----------
        statement:
            COUNT SELECT statement.

        Returns
        -------
        int
            Number of matching rows.
        """

        logger.debug(
            "Executing User count query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        return int(
            self.db.scalar(statement)
            or 0
        )
        
        # ======================================================
    # Lookup Methods
    # ======================================================

    def get_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve a user by email address.

        Email matching is case-insensitive.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User | None
            Matching user if found.
        """

        logger.debug(
            "Retrieving user by email.",
            extra={
                "email": email.lower(),
            },
        )

        statement = self._base_query().where(
            func.lower(User.email) == email.lower(),
        )

        return self._execute_scalar(statement)

    def get_active_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve an active user by email.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User | None
            Active matching user if found.
        """

        logger.debug(
            "Retrieving active user by email.",
            extra={
                "email": email.lower(),
            },
        )

        statement = self._active_query().where(
            func.lower(User.email) == email.lower(),
        )

        return self._execute_scalar(statement)

    def get_inactive_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Retrieve an inactive user by email.

        Parameters
        ----------
        email:
            User email address.

        Returns
        -------
        User | None
            Inactive matching user if found.
        """

        logger.debug(
            "Retrieving inactive user by email.",
            extra={
                "email": email.lower(),
            },
        )

        statement = self._inactive_query().where(
            func.lower(User.email) == email.lower(),
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
        Retrieve all users.

        Supports
        --------
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | name | email

        Returns
        -------
        list[User]
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
        Retrieve active users.

        Supports
        --------
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | name | email

        Returns
        -------
        list[User]
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
        Retrieve inactive users.

        Supports
        --------
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of users returned.

        sort_by:
            newest | oldest | name | email

        Returns
        -------
        list[User]
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

    def list_recent_users(
        self,
        *,
        limit: int = 10,
    ) -> list[User]:
        """
        Retrieve the most recently registered users.

        Intended primarily for administrator dashboards.

        Parameters
        ----------
        limit:
            Maximum number of users returned.

        Returns
        -------
        list[User]
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
        Search users by full name or email.

        Search is case-insensitive.

        Supports
        --------
        ✓ Full name search
        ✓ Email search
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        query:
            Search keyword.

        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.

        sort_by:
            newest | oldest | name | email

        Returns
        -------
        list[User]
            Matching users.
        """

        logger.debug(
            "Searching users.",
            extra={
                "query": query,
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
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
        Count users matching a search query.

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
            "Counting search results.",
            extra={
                "query": query,
            },
        )

        statement = self._base_query()

        statement = self._apply_search(
            statement,
            query=query,
        )

        return self._execute_count(
            self._count_statement(statement)
        )

    # ======================================================
    # Existence Checks
    # ======================================================

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email address already exists.

        Parameters
        ----------
        email:
            Email address to check.

        Returns
        -------
        bool
        """

        logger.debug(
            "Checking email existence.",
            extra={
                "email": email.lower(),
            },
        )

        return (
            self.get_by_email(email)
            is not None
        )

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
        """

        return self.email_exists(email)

    def is_email_available(
        self,
        email: str,
    ) -> bool:
        """
        Determine whether an email address is available
        for registration.

        Parameters
        ----------
        email:
            Email address.

        Returns
        -------
        bool
            True if the email is not already in use.
        """

        logger.debug(
            "Checking email availability.",
            extra={
                "email": email.lower(),
            },
        )

        return not self.email_exists(email)

    # ======================================================
    # User Counts
    # ======================================================

    def count_active(
        self,
    ) -> int:
        """
        Count active users.

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
            )
        )

    def count_inactive(
        self,
    ) -> int:
        """
        Count inactive users.

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
            )
        )
        
        # ======================================================
    # State Changes
    # ======================================================

    def activate(
        self,
        user: User,
    ) -> User:
        """
        Activate a user account.

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
                "email": user.email,
            },
        )

        user.is_active = True

        return self.update(user)

    def deactivate(
        self,
        user: User,
    ) -> User:
        """
        Deactivate a user account.

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
                "email": user.email,
            },
        )

        user.is_active = False

        return self.update(user)

    def toggle_active(
        self,
        user: User,
    ) -> User:
        """
        Toggle the active status of a user.

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

    # ======================================================
    # Statistics
    # ======================================================

    def total_users(
        self,
    ) -> int:
        """
        Count all users.

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
            )
        )

    def total_active_users(
        self,
    ) -> int:
        """
        Count active users.

        Returns
        -------
        int
            Total number of active users.
        """

        logger.debug(
            "Counting total active users.",
        )

        return self._execute_count(
            self._count_statement(
                self._active_query(),
            )
        )

    def total_inactive_users(
        self,
    ) -> int:
        """
        Count inactive users.

        Returns
        -------
        int
            Total number of inactive users.
        """

        logger.debug(
            "Counting total inactive users.",
        )

        return self._execute_count(
            self._count_statement(
                self._inactive_query(),
            )
        )

    def active_percentage(
        self,
    ) -> float:
        """
        Calculate the percentage of active users.

        Returns
        -------
        float
            Percentage of active users rounded to
            two decimal places.
        """

        logger.debug(
            "Calculating active user percentage.",
        )

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
            Percentage of inactive users rounded to
            two decimal places.
        """

        logger.debug(
            "Calculating inactive user percentage.",
        )

        total = self.total_users()

        if total == 0:
            return 0.0

        inactive = self.total_inactive_users()

        return round(
            (inactive / total) * 100,
            2,
        )
        
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
        Attach (merge) a detached User instance into the
        current SQLAlchemy session.

        Parameters
        ----------
        user:
            Detached ORM instance.

        Returns
        -------
        User
            Managed ORM instance.
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

        Convenience wrapper around
        :meth:`BaseRepository.update`.

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
                "email": user.email,
            },
        )

        return self.update(user)

    def remove(
        self,
        user: User,
    ) -> None:
        """
        Remove a User from the database.

        Parameters
        ----------
        user:
            Existing User ORM instance.
        """

        logger.debug(
            "Removing user.",
            extra={
                "user_id": user.id,
                "email": user.email,
            },
        )

        self.delete(user)

    def remove_many(
        self,
        users: list[User],
    ) -> None:
        """
        Remove multiple users.

        Parameters
        ----------
        users:
            Collection of User ORM instances.
        """

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
        Commit pending changes and refresh the entity.

        This is useful when database-side defaults,
        triggers, or computed columns may have changed
        after persistence.

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