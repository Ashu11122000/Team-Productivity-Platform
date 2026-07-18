"""
==========================================================
User Repository
==========================================================

Repository responsible for all User database operations.

Responsibilities
----------------
- User CRUD operations
- Email lookups
- Active/inactive user queries
- User existence checks
- User search
- Pagination

Business logic such as:

- Password hashing
- JWT creation
- Authentication
- Authorization
- Email verification

belongs in the service layer.

Compatible With
---------------
- SQLAlchemy 2.x
- PostgreSQL
- FastAPI
- Alembic
- Python 3.12+
==========================================================
"""

from __future__ import annotations

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for User model."""

    def __init__(self, db: Session) -> None:
        super().__init__(db, User)

    # ======================================================
    # Lookup Methods
    # ======================================================

    def get_by_email(self, email: str) -> User | None:
        """
        Retrieve a user by email address.
        """
        statement = select(User).where(
            func.lower(User.email) == email.lower()
        )

        return self.db.scalar(statement)

    def get_active_by_email(self, email: str) -> User | None:
        """
        Retrieve an active user by email.
        """
        statement = select(User).where(
            func.lower(User.email) == email.lower(),
            User.is_active.is_(True),
        )

        return self.db.scalar(statement)

    # ======================================================
    # Existence Checks
    # ======================================================

    def email_exists(self, email: str) -> bool:
        """
        Check whether an email already exists.
        """
        return self.get_by_email(email) is not None

    # ======================================================
    # User Listings
    # ======================================================

    def list_users(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """
        Return users ordered by newest first.
        """
        statement = (
            select(User)
            .order_by(User.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def get_active_users(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """
        Return active users.
        """
        statement = (
            select(User)
            .where(User.is_active.is_(True))
            .order_by(User.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    # ======================================================
    # Search
    # ======================================================

    def search(
        self,
        query: str,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """
        Search users by name or email.
        """
        pattern = f"%{query.strip()}%"

        statement = (
            select(User)
            .where(
                or_(
                    User.full_name.ilike(pattern),
                    User.email.ilike(pattern),
                )
            )
            .order_by(User.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    # ======================================================
    # State Changes
    # ======================================================

    def activate(self, user: User) -> User:
        """
        Activate a user.
        """
        user.is_active = True
        return self.update(user)

    def deactivate(self, user: User) -> User:
        """
        Deactivate a user.
        """
        user.is_active = False
        return self.update(user)

    # ======================================================
    # Statistics
    # ======================================================

    def total_users(self) -> int:
        """
        Return total number of users.
        """
        statement = select(func.count()).select_from(User)

        return int(self.db.scalar(statement) or 0)

    def total_active_users(self) -> int:
        """
        Return total active users.
        """
        statement = (
            select(func.count())
            .select_from(User)
            .where(User.is_active.is_(True))
        )

        return int(self.db.scalar(statement) or 0)