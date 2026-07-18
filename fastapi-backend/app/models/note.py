"""
==========================================================
Note Model
==========================================================

Represents a user note within the Team Productivity
Platform.

Responsibilities
----------------
✓ Store personal notes
✓ Associate notes with users
✓ Support Open Library integration
✓ Support conversion to NestJS tasks

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

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.constants import (
    NOTE_CONTENT_MAX_LENGTH,
    NOTE_TITLE_MAX_LENGTH,
)
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Note(Base):
    """
    Note database model.
    """

    __tablename__ = "notes"

    __table_args__ = (
        Index("idx_notes_owner_id", "owner_id"),
        Index("idx_notes_created_at", "created_at"),
        Index("idx_notes_title", "title"),
        Index(
            "idx_notes_converted_to_task",
            "is_converted_to_task",
        ),
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
    # Note Data
    # ======================================================

    title: Mapped[str] = mapped_column(
        String(NOTE_TITLE_MAX_LENGTH),
        nullable=False,
    )

    content: Mapped[str | None] = mapped_column(
        Text().with_variant(
            String(NOTE_CONTENT_MAX_LENGTH),
            "sqlite",
        ),
        nullable=True,
    )

    # ======================================================
    # Ownership
    # ======================================================

    owner_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    # ======================================================
    # Open Library Integration
    # ======================================================

    book_reference_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # ======================================================
    # NestJS Integration
    # ======================================================

    is_converted_to_task: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
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

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="notes",
    )

    # ======================================================
    # Representation
    # ======================================================

    def __repr__(self) -> str:
        """
        Return a developer-friendly representation.
        """

        return (
            f"Note("
            f"id={self.id}, "
            f"title='{self.title}', "
            f"owner_id={self.owner_id}, "
            f"is_converted_to_task={self.is_converted_to_task}"
            f")"
        )