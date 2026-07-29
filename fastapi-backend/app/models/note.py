"""
==========================================================
Note Model
==========================================================

Responsibilities
----------------
Represents a user-owned note within the Team Productivity
Platform.

Features
--------
✓ Store personal notes
✓ Associate notes with users
✓ Support Open Library integration
✓ Support conversion to NestJS tasks
✓ Track audit timestamps
✓ Optimized database indexes

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
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    false,
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
from app.utils.datetime import utc_now

if TYPE_CHECKING:
    from app.models.user import User


class Note(Base):
    """
    Database model representing a user note.

    Each note belongs to exactly one user and may optionally
    reference an Open Library book. Notes can also be marked
    as converted into tasks for synchronization with the
    NestJS Task service.

    Relationships
    -------------
    owner
        The user who owns this note.
    """

    __tablename__ = "notes"

    # ------------------------------------------------------
    # Database Indexes
    #
    # These indexes optimize the most common query patterns:
    #
    # - Fetch notes for a specific user
    # - Sort notes by creation time
    # - Search notes by title
    # - Retrieve notes converted into tasks
    # ------------------------------------------------------

    __table_args__ = (
        Index("idx_notes_owner_id", "owner_id"),
        Index("idx_notes_created_at", "created_at"),
        Index("idx_notes_title", "title"),
        Index(
            "idx_notes_owner_created_at",
            "owner_id",
            "created_at",
        ),
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
    # Note Information
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
        nullable=False,
        default=False,
        server_default=false(),
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

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="notes",
        lazy="selectin",
    )

    # ======================================================
    # Representation
    # ======================================================

    def __repr__(self) -> str:
        """
        Return a developer-friendly string representation.

        Returns
        -------
        str
            Readable representation of the Note instance.
        """

        return (
            "Note("
            f"id={self.id}, "
            f"title={self.title!r}, "
            f"owner_id={self.owner_id}, "
            f"is_converted_to_task={self.is_converted_to_task}"
            ")"
        )


__all__ = [
    "Note",
]