"""
==========================================================
Note Repository
==========================================================

Repository responsible for all Note database operations.

Responsibilities
----------------
✓ CRUD operations
✓ Owner-based queries
✓ Administrator queries
✓ Search
✓ Pagination
✓ Sorting
✓ Open Library support
✓ NestJS task conversion support

Business logic MUST remain inside the service layer.

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

from typing import Any

from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session

from app.models.note import Note
from app.repositories.base_repository import BaseRepository


class NoteRepository(BaseRepository[Note]):
    """
    Repository responsible for all Note database
    operations.

    This repository contains ONLY persistence logic.

    Authorization, ownership validation, Open Library
    communication and NestJS communication belong to the
    service layer.
    """

    # =====================================================
    # Constructor
    # =====================================================

    def __init__(
        self,
        db: Session,
    ) -> None:
        """
        Initialize the repository.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.
        """
        super().__init__(
            db=db,
            model=Note,
        )

    # =====================================================
    # Internal Query Helpers
    # =====================================================

    @staticmethod
    def _apply_sorting(
        statement: Select[Any],
        *,
        sort_by: str = "newest",
    ) -> Select[Any]:
        """
        Apply ordering to a SQLAlchemy statement.

        Supported values
        ----------------
        newest
            Recently created first.

        oldest
            Oldest created first.

        title
            Alphabetical by title.

        Unknown values fall back to newest.
        """
        strategy = sort_by.lower().strip()

        if strategy == "oldest":
            return statement.order_by(
                Note.created_at.asc(),
            )

        if strategy == "title":
            return statement.order_by(
                Note.title.asc(),
            )

        return statement.order_by(
            Note.created_at.desc(),
        )

    @staticmethod
    def _apply_pagination(
        statement: Select[Any],
        *,
        skip: int,
        limit: int,
    ) -> Select[Any]:
        """
        Apply pagination to a statement.
        """
        return (
            statement
            .offset(skip)
            .limit(limit)
        )

    def _base_query(self) -> Select[Any]:
        """
        Base query for Note.

        Returns
        -------
        Select
            SQLAlchemy Select object.
        """
        return select(Note)

    def _owner_query(
        self,
        owner_id: int,
    ) -> Select[Any]:
        """
        Base query filtered by owner.
        """
        return (
            self._base_query()
            .where(
                Note.owner_id == owner_id,
            )
        )

    def _search_query(
        self,
        statement: Select[Any],
        query: str,
    ) -> Select[Any]:
        """
        Apply search conditions.

        Searches both title and content.

        Parameters
        ----------
        statement:
            Existing SQLAlchemy query.

        query:
            Search keyword.
        """
        pattern = f"%{query.strip()}%"

        return statement.where(
            or_(
                Note.title.ilike(pattern),
                Note.content.ilike(pattern),
            )
        )
        
            # =====================================================
    # Single Note Queries
    # =====================================================

    def get_by_id(
        self,
        note_id: int,
    ) -> Note | None:
        """
        Retrieve a note by its primary key.

        Parameters
        ----------
        note_id:
            Note identifier.

        Returns
        -------
        Note | None
        """
        return self.db.scalar(
            self._base_query().where(
                Note.id == note_id,
            )
        )

    def get_by_owner(
        self,
        *,
        note_id: int,
        owner_id: int,
    ) -> Note | None:
        """
        Retrieve a note belonging to a specific owner.

        Parameters
        ----------
        note_id:
            Note identifier.

        owner_id:
            Owner identifier.

        Returns
        -------
        Note | None
        """
        statement = (
            self._owner_query(owner_id)
            .where(
                Note.id == note_id,
            )
        )

        return self.db.scalar(statement)

    # =====================================================
    # Listing
    # =====================================================

    def list_by_owner(
        self,
        owner_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve notes belonging to a specific user.

        Supports
        --------
        ✓ Pagination
        ✓ Sorting
        """
        statement = self._owner_query(
            owner_id,
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

        return list(
            self.db.scalars(
                statement,
            ).all()
        )

    def list_all(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve all notes.

        Intended for administrator usage.

        Supports
        --------
        ✓ Pagination
        ✓ Sorting
        """
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

        return list(
            self.db.scalars(
                statement,
            ).all()
        )

    def list_recent_by_owner(
        self,
        owner_id: int,
        *,
        limit: int = 10,
    ) -> list[Note]:
        """
        Retrieve the most recently created notes
        belonging to a user.

        Parameters
        ----------
        owner_id:
            User identifier.

        limit:
            Maximum records.

        Returns
        -------
        list[Note]
        """
        statement = (
            self._owner_query(owner_id)
            .order_by(
                Note.created_at.desc(),
            )
            .limit(limit)
        )

        return list(
            self.db.scalars(
                statement,
            ).all()
        )
        
            # =====================================================
    # Search
    # =====================================================

    def search(
        self,
        *,
        owner_id: int | None = None,
        query: str,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Search notes by title and content.

        Supports
        --------
        ✓ Owner filtering
        ✓ Administrator search
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, search all notes
            (administrator usage).

        query:
            Search keyword.

        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
        """
        #
        # Start with the appropriate base query.
        #
        if owner_id is None:
            statement = self._base_query()
        else:
            statement = self._owner_query(
                owner_id,
            )

        #
        # Apply search.
        #
        statement = self._search_query(
            statement,
            query,
        )

        #
        # Apply sorting.
        #
        statement = self._apply_sorting(
            statement,
            sort_by=sort_by,
        )

        #
        # Apply pagination.
        #
        statement = self._apply_pagination(
            statement,
            skip=skip,
            limit=limit,
        )

        return list(
            self.db.scalars(
                statement,
            ).all()
        )

    def search_count(
        self,
        *,
        owner_id: int | None = None,
        query: str,
    ) -> int:
        """
        Count notes matching a search query.

        Supports both administrator and
        owner-specific searches.

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, count across all notes.

        query:
            Search keyword.

        Returns
        -------
        int
        """
        pattern = f"%{query.strip()}%"

        statement = (
            select(func.count())
            .select_from(Note)
        )

        if owner_id is not None:
            statement = statement.where(
                Note.owner_id == owner_id,
            )

        statement = statement.where(
            or_(
                Note.title.ilike(pattern),
                Note.content.ilike(pattern),
            )
        )

        return int(
            self.db.scalar(statement)
            or 0
        )
        
            # =====================================================
    # Open Library
    # =====================================================

    def list_with_book_reference(
        self,
        *,
        owner_id: int | None = None,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve notes linked to an Open Library book.

        Supports
        --------
        ✓ Administrator queries
        ✓ Owner-specific queries
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, returns notes for all users.

        skip:
            Number of records to skip.

        limit:
            Maximum number of records.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
        """
        if owner_id is None:
            statement = self._base_query()
        else:
            statement = self._owner_query(
                owner_id,
            )

        statement = statement.where(
            Note.book_reference_id.is_not(None),
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

        return list(
            self.db.scalars(
                statement,
            ).all()
        )

    def count_with_book_reference(
        self,
        *,
        owner_id: int | None = None,
    ) -> int:
        """
        Count notes linked to an Open Library book.

        Supports
        --------
        ✓ Administrator queries
        ✓ Owner-specific queries

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, counts across all users.

        Returns
        -------
        int
        """
        statement = (
            select(func.count())
            .select_from(Note)
            .where(
                Note.book_reference_id.is_not(None),
            )
        )

        if owner_id is not None:
            statement = statement.where(
                Note.owner_id == owner_id,
            )

        return int(
            self.db.scalar(statement)
            or 0
        )
        
            # =====================================================
    # NestJS Task Conversion
    # =====================================================

    def list_convertible_to_task(
        self,
        *,
        owner_id: int | None = None,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve notes that have not yet been converted
        into NestJS tasks.

        Supports
        --------
        ✓ Administrator queries
        ✓ Owner-specific queries
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, retrieve notes belonging to all users.

        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
        """
        if owner_id is None:
            statement = self._base_query()
        else:
            statement = self._owner_query(
                owner_id,
            )

        statement = statement.where(
            Note.is_converted_to_task.is_(False),
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

        return list(
            self.db.scalars(
                statement,
            ).all()
        )

    def list_converted_to_task(
        self,
        *,
        owner_id: int | None = None,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve notes that have already been converted
        into NestJS tasks.

        Supports
        --------
        ✓ Administrator queries
        ✓ Owner-specific queries
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, retrieve notes belonging to all users.

        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
        """
        if owner_id is None:
            statement = self._base_query()
        else:
            statement = self._owner_query(
                owner_id,
            )

        statement = statement.where(
            Note.is_converted_to_task.is_(True),
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

        return list(
            self.db.scalars(
                statement,
            ).all()
        )

    def mark_as_converted(
        self,
        note: Note,
    ) -> Note:
        """
        Mark a note as converted to a NestJS task.

        Parameters
        ----------
        note:
            Existing Note ORM instance.

        Returns
        -------
        Note
            Updated note.
        """
        note.is_converted_to_task = True

        return self.update(
            note,
        )

    def count_convertible_to_task(
        self,
        *,
        owner_id: int | None = None,
    ) -> int:
        """
        Count notes pending task conversion.

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, count notes across all users.

        Returns
        -------
        int
        """
        statement = (
            select(func.count())
            .select_from(Note)
            .where(
                Note.is_converted_to_task.is_(False),
            )
        )

        if owner_id is not None:
            statement = statement.where(
                Note.owner_id == owner_id,
            )

        return int(
            self.db.scalar(statement)
            or 0
        )

    def count_converted(
        self,
        *,
        owner_id: int | None = None,
    ) -> int:
        """
        Count notes that have already been converted
        into NestJS tasks.

        Parameters
        ----------
        owner_id:
            Owner identifier.

            If None, count notes across all users.

        Returns
        -------
        int
        """
        statement = (
            select(func.count())
            .select_from(Note)
            .where(
                Note.is_converted_to_task.is_(True),
            )
        )

        if owner_id is not None:
            statement = statement.where(
                Note.owner_id == owner_id,
            )

        return int(
            self.db.scalar(statement)
            or 0
        )
        
            # =====================================================
    # Statistics
    # =====================================================

    def count_by_owner(
        self,
        owner_id: int,
    ) -> int:
        """
        Count notes belonging to a specific user.

        Parameters
        ----------
        owner_id:
            Owner identifier.

        Returns
        -------
        int
        """
        statement = (
            select(func.count())
            .select_from(Note)
            .where(
                Note.owner_id == owner_id,
            )
        )

        return int(
            self.db.scalar(statement)
            or 0
        )

    def count_all(
        self,
    ) -> int:
        """
        Count all notes.

        Returns
        -------
        int
        """
        statement = (
            select(func.count())
            .select_from(Note)
        )

        return int(
            self.db.scalar(statement)
            or 0
        )

    def total_converted_notes(
        self,
        owner_id: int,
    ) -> int:
        """
        Return the number of converted notes
        for a specific user.

        Parameters
        ----------
        owner_id:
            Owner identifier.

        Returns
        -------
        int
        """
        return self.count_converted(
            owner_id=owner_id,
        )

    def total_pending_conversion(
        self,
        owner_id: int,
    ) -> int:
        """
        Return the number of notes waiting
        for task conversion.

        Parameters
        ----------
        owner_id:
            Owner identifier.

        Returns
        -------
        int
        """
        return self.count_convertible_to_task(
            owner_id=owner_id,
        )

    # =====================================================
    # Utility Methods
    # =====================================================

    def exists(
        self,
        note_id: int,
    ) -> bool:
        """
        Determine whether a note exists.

        Parameters
        ----------
        note_id:
            Note identifier.

        Returns
        -------
        bool
        """
        statement = (
            select(func.count())
            .select_from(Note)
            .where(
                Note.id == note_id,
            )
        )

        return (
            int(
                self.db.scalar(statement)
                or 0
            )
            > 0
        )

    def owner_exists(
        self,
        *,
        note_id: int,
        owner_id: int,
    ) -> bool:
        """
        Determine whether a note exists
        for a specific owner.

        Parameters
        ----------
        note_id:
            Note identifier.

        owner_id:
            Owner identifier.

        Returns
        -------
        bool
        """
        statement = (
            select(func.count())
            .select_from(Note)
            .where(
                Note.id == note_id,
                Note.owner_id == owner_id,
            )
        )

        return (
            int(
                self.db.scalar(statement)
                or 0
            )
            > 0
        )

    def refresh_note(
        self,
        note: Note,
    ) -> Note:
        """
        Refresh a note from the database.

        Parameters
        ----------
        note:
            ORM instance.

        Returns
        -------
        Note
        """
        self.refresh(
            note,
        )

        return note
    
    