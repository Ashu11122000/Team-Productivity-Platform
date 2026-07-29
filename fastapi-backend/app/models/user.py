"""
==========================================================
User Model
==========================================================

Responsibilities
----------------
Represents an authenticated platform user within the Team
Productivity Platform.

Features
--------
✓ Authentication
✓ Authorization (RBAC)
✓ User account management
✓ Ownership of notes
✓ Audit timestamps
✓ Optimized database indexes

JWT Claims
----------
- user_id
- email
- role

Compatible With
---------------
- SQLAlchemy 2.x
- PostgreSQL
- Alembic
- FastAPI

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    Index,
    Integer,
    String,
    false,
    true,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.constants import (
    PASSWORD_MAX_LENGTH,
    UserRole,
)
from app.db.base import Base
from app.utils.datetime import utc_now

if TYPE_CHECKING:
    from app.models.note import Note


class User(Base):
    """
    Database model representing a platform user.

    A user is responsible for authentication and
    authorization within the application and owns one or
    more notes.

    Relationships
    -------------
    notes
        Collection of notes owned by this user.
    """

    __tablename__ = "users"

    # ------------------------------------------------------
    # Database Indexes
    #
    # These indexes optimize common authentication and
    # administration queries.
    #
    # - Find user by email
    # - Filter users by role
    # - Filter active/inactive users
    # ------------------------------------------------------

    __table_args__ = (
        Index("idx_users_email", "email"),
        Index("idx_users_role", "role"),
        Index("idx_users_is_active", "is_active"),
    )

    # ======================================================
    # Primary Key
    # ======================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    # ======================================================
    # Authentication
    # ======================================================

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=False,  # Explicit index already defined above.
    )

    hashed_password: Mapped[str] = mapped_column(
        String(PASSWORD_MAX_LENGTH * 2),
        nullable=False,
    )

    # ======================================================
    # Authorization
    # ======================================================

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=UserRole.USER.value,
        server_default=UserRole.USER.value,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=true(),
    )

    # ======================================================
    # Audit Fields
    # ======================================================

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    # ======================================================
    # Relationships
    # ======================================================

    notes: Mapped[list["Note"]] = relationship(
        "Note",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )

    # ======================================================
    # Representation
    # ======================================================

    def __repr__(self) -> str:
        """
        Return a developer-friendly representation.

        Returns
        -------
        str
            Readable representation of the User instance.
        """

        return (
            "User("
            f"id={self.id}, "
            f"email={self.email!r}, "
            f"role={self.role!r}, "
            f"is_active={self.is_active}"
            ")"
        )


__all__ = [
    "User",
]