"""
==========================================================
User Model
==========================================================

Represents a platform user.

Responsibilities
----------------
✓ Authentication
✓ Authorization
✓ User Management
✓ Ownership of Notes

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
==========================================================
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    PASSWORD_MAX_LENGTH,
    UserRole,
)
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.note import Note


class User(Base):
    """
    User database model.
    """

    __tablename__ = "users"

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
        default=UserRole.USER.value,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # ======================================================
    # Audit Fields
    # ======================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    # ======================================================
    # Relationships
    # ======================================================

    notes: Mapped[list["Note"]] = relationship(
        "Note",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # ======================================================
    # Representation
    # ======================================================

    def __repr__(self) -> str:
        """
        Return a developer-friendly representation.
        """

        return (
            f"User("
            f"id={self.id}, "
            f"email='{self.email}', "
            f"role='{self.role}', "
            f"is_active={self.is_active}"
            f")"
        )