"""
===============================================================================
Note Model
===============================================================================

Database model representing a user-owned note within the
Team Productivity Platform.

Responsibilities
----------------
• Store personal notes.
• Associate notes with users.
• Support Open Library integration.
• Support conversion to NestJS tasks.
• Track audit timestamps.
• Provide optimized database indexes.

Ownership
---------
Every note belongs to exactly one User.

Integrations
------------
Open Library
    ``book_reference_id`` stores an external book reference.

NestJS
    ``is_converted_to_task`` tracks whether the note has been
    converted into a task handled by the NestJS service.

Database
--------
PostgreSQL

ORM
---
SQLAlchemy 2.x

Migrations
----------
Alembic

Python
------
3.12+
"""

from __future__ import annotations

from datetime import datetime
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
from sqlalchemy.orm import Mapped, mapped_column, relationship

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
    Database model representing a user-owned note.

    Each note belongs to exactly one user and may optionally
    reference an Open Library book.

    A note can also be marked as converted into a task for
    synchronization with the NestJS Task service.

    Attributes
    ----------
    id:
        Database-generated integer primary key.

    title:
        Note title.

    content:
        Optional note content.

    owner_id:
        ID of the User who owns the note.

    book_reference_id:
        Optional external Open Library book identifier.

    is_converted_to_task:
        Indicates whether this note has been converted into
        a NestJS task.

    created_at:
        UTC timestamp indicating when the note was created.

    updated_at:
        UTC timestamp indicating when the note was last updated.

    owner:
        User who owns this note.
    """

    __tablename__ = "notes"

    # =========================================================================
    # Database Indexes
    # =========================================================================
    #
    # These indexes support the established query patterns:
    #
    # • Fetch notes belonging to a specific user.
    # • Sort/filter notes by creation time.
    # • Search/filter notes by title.
    # • Retrieve notes that have been converted into tasks.
    # • Efficiently fetch a user's notes ordered by creation time.
    #
    # Existing indexes are intentionally preserved to avoid unnecessary
    # migration churn before repository query patterns are finalized.
    #
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

    # =========================================================================
    # Primary Key
    # =========================================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    # =========================================================================
    # Note Information
    # =========================================================================

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

    # =========================================================================
    # Ownership
    # =========================================================================

    owner_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    # =========================================================================
    # Open Library Integration
    # =========================================================================

    book_reference_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # =========================================================================
    # NestJS Task Integration
    # =========================================================================

    is_converted_to_task: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=false(),
    )

    # =========================================================================
    # Audit Timestamps
    # =========================================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    # =========================================================================
    # Relationships
    # =========================================================================

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="notes",
        lazy="select",
    )

    # =========================================================================
    # Representation
    # =========================================================================

    def __repr__(self) -> str:
        """
        Return a developer-friendly representation of the note.

        The owner relationship is intentionally excluded so that
        representation does not traverse the relationship or
        accidentally trigger additional database loading.

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