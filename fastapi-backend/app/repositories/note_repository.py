"""
==========================================================
Note Repository
==========================================================

Repository responsible for all Note database operations.

Responsibilities
----------------
- CRUD operations specific to notes
- Owner-based note retrieval
- Note searching
- Open Library note queries
- Task conversion queries
- Pagination support

Business logic such as:

- Authorization
- Ownership validation
- Open Library API calls
- NestJS API communication

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

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.note import Note
from app.repositories.base_repository import BaseRepository


class NoteRepository(BaseRepository[Note]):
    """
    Repository for Note model.
    """

    def __init__(self, db: Session) -> None:
        super().__init__(db, Note)

    # ======================================================
    # Single Note Queries
    # ======================================================

    def get_by_owner(
        self,
        *,
        note_id: int,
        owner_id: int,
    ) -> Note | None:
        """
        Retrieve a note owned by a specific user.
        """
        statement = select(Note).where(
            Note.id == note_id,
            Note.owner_id == owner_id,
        )

        return self.db.scalar(statement)

    # ======================================================
    # Listing
    # ======================================================

    def list_by_owner(
        self,
        owner_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Note]:
        """
        Retrieve notes belonging to a specific owner.
        """
        statement = (
            select(Note)
            .where(Note.owner_id == owner_id)
            .order_by(Note.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def list_recent_by_owner(
        self,
        owner_id: int,
        *,
        limit: int = 10,
    ) -> list[Note]:
        """
        Retrieve the most recent notes for a user.
        """
        statement = (
            select(Note)
            .where(Note.owner_id == owner_id)
            .order_by(Note.created_at.desc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    # ======================================================
    # Search
    # ======================================================

    def search(
        self,
        owner_id: int,
        query: str,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Note]:
        """
        Search notes by title or content.
        """
        pattern = f"%{query.strip()}%"

        statement = (
            select(Note)
            .where(
                Note.owner_id == owner_id,
                or_(
                    Note.title.ilike(pattern),
                    Note.content.ilike(pattern),
                ),
            )
            .order_by(Note.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    # ======================================================
    # Open Library
    # ======================================================

    def list_with_book_reference(
        self,
        owner_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Note]:
        """
        Retrieve notes linked to an Open Library book.
        """
        statement = (
            select(Note)
            .where(
                Note.owner_id == owner_id,
                Note.book_reference_id.is_not(None),
            )
            .order_by(Note.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    # ======================================================
    # NestJS Integration
    # ======================================================

    def list_convertible_to_task(
        self,
        owner_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Note]:
        """
        Retrieve notes that have not yet been converted to tasks.
        """
        statement = (
            select(Note)
            .where(
                Note.owner_id == owner_id,
                Note.is_converted_to_task.is_(False),
            )
            .order_by(Note.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def list_converted_to_task(
        self,
        owner_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Note]:
        """
        Retrieve notes already converted to tasks.
        """
        statement = (
            select(Note)
            .where(
                Note.owner_id == owner_id,
                Note.is_converted_to_task.is_(True),
            )
            .order_by(Note.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def mark_as_converted(
        self,
        note: Note,
    ) -> Note:
        """
        Mark a note as converted to a NestJS task.
        """
        note.is_converted_to_task = True
        return self.update(note)

    # ======================================================
    # Statistics
    # ======================================================

    def total_notes(
        self,
        owner_id: int,
    ) -> int:
        """
        Return the total number of notes for a user.
        """
        statement = (
            select(Note)
            .where(Note.owner_id == owner_id)
        )

        return len(self.db.scalars(statement).all())

    def total_converted_notes(
        self,
        owner_id: int,
    ) -> int:
        """
        Return the number of notes converted to tasks.
        """
        statement = (
            select(Note)
            .where(
                Note.owner_id == owner_id,
                Note.is_converted_to_task.is_(True),
            )
        )

        return len(self.db.scalars(statement).all())

    def total_pending_conversion(
        self,
        owner_id: int,
    ) -> int:
        """
        Return the number of notes pending task conversion.
        """
        statement = (
            select(Note)
            .where(
                Note.owner_id == owner_id,
                Note.is_converted_to_task.is_(False),
            )
        )

        return len(self.db.scalars(statement).all())