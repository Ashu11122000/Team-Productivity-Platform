"""
==========================================================
Note Repository
==========================================================

Enterprise repository implementation for Note persistence.

Responsibilities
----------------
✓ Encapsulate all database access for Note entities
✓ Provide reusable query helpers
✓ Support CRUD operations
✓ Support owner-based queries
✓ Support administrator queries
✓ Support searching
✓ Support pagination
✓ Support sorting
✓ Support Open Library integration
✓ Support NestJS task conversion workflows
✓ Remain free of business logic

Architecture
------------
This repository is responsible ONLY for persistence.

Business rules, authorization, ownership validation,
external API communication, DTO mapping and orchestration
must remain inside the service layer.

Features
--------
✓ SQLAlchemy 2.x style queries
✓ Repository Pattern
✓ Structured logging
✓ Type-safe queries
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
from app.models.note import Note
from app.repositories.base_repository import BaseRepository

# ==========================================================
# Logger
# ==========================================================

logger = get_logger(__name__)

# ==========================================================
# Repository
# ==========================================================


class NoteRepository(BaseRepository[Note]):
    """
    Repository responsible for Note persistence.

    This repository contains ONLY persistence logic.

    Responsibilities
    ----------------
    • Build SQLAlchemy queries.
    • Execute database operations.
    • Return ORM models.

    This repository MUST NOT contain:

    • Business rules
    • Authorization
    • Ownership validation
    • Open Library communication
    • NestJS communication
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
        Initialize the Note repository.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.
        """

        super().__init__(
            db=db,
            model=Note,
        )

        logger.debug(
            "NoteRepository initialized.",
            extra={
                "repository": self.__class__.__name__,
                "model": Note.__name__,
            },
        )
        
        # ======================================================
    # Internal Query Helpers
    # ======================================================

    def _base_query(self) -> Select[tuple[Note]]:
        """
        Build the base SELECT statement for the Note model.

        Returns
        -------
        Select[tuple[Note]]
            Base SQLAlchemy SELECT statement.
        """

        return select(Note)

    def _owner_query(
        self,
        owner_id: int,
    ) -> Select[tuple[Note]]:
        """
        Build a query scoped to a specific owner.

        Parameters
        ----------
        owner_id:
            User identifier.

        Returns
        -------
        Select[tuple[Note]]
            Owner-filtered SELECT statement.
        """

        return self._base_query().where(
            Note.owner_id == owner_id,
        )

    @staticmethod
    def _apply_sorting(
        statement: Select[tuple[Note]],
        *,
        sort_by: str = "newest",
    ) -> Select[tuple[Note]]:
        """
        Apply sorting to a SELECT statement.

        Supported values
        ----------------
        newest
            Newest notes first.

        oldest
            Oldest notes first.

        title
            Alphabetical by title.

        Unknown values default to ``newest``.

        Parameters
        ----------
        statement:
            Existing SQLAlchemy statement.

        sort_by:
            Sorting strategy.

        Returns
        -------
        Select[tuple[Note]]
            Updated statement.
        """

        strategy = sort_by.strip().lower()

        match strategy:
            case "oldest":
                return statement.order_by(
                    Note.created_at.asc(),
                )

            case "title":
                return statement.order_by(
                    Note.title.asc(),
                )

            case _:
                return statement.order_by(
                    Note.created_at.desc(),
                )

    @staticmethod
    def _apply_pagination(
        statement: Select[tuple[Note]],
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> Select[tuple[Note]]:
        """
        Apply pagination to a query.

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
        Select[tuple[Note]]
            Paginated statement.
        """

        return (
            statement
            .offset(skip)
            .limit(limit)
        )

    @staticmethod
    def _apply_owner_filter(
        statement: Select[tuple[Note]],
        *,
        owner_id: int | None,
    ) -> Select[tuple[Note]]:
        """
        Apply an optional owner filter.

        If ``owner_id`` is None, the original statement is
        returned unchanged.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        owner_id:
            Owner identifier.

        Returns
        -------
        Select[tuple[Note]]
            Updated SELECT statement.
        """

        if owner_id is None:
            return statement

        return statement.where(
            Note.owner_id == owner_id,
        )

    @staticmethod
    def _apply_book_reference_filter(
        statement: Select[tuple[Note]],
    ) -> Select[tuple[Note]]:
        """
        Restrict the query to notes linked to an
        Open Library book.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        Returns
        -------
        Select[tuple[Note]]
        """

        return statement.where(
            Note.book_reference_id.is_not(None),
        )

    @staticmethod
    def _apply_conversion_filter(
        statement: Select[tuple[Note]],
        *,
        converted: bool,
    ) -> Select[tuple[Note]]:
        """
        Filter notes by conversion status.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        converted:
            Desired conversion state.

        Returns
        -------
        Select[tuple[Note]]
        """

        return statement.where(
            Note.is_converted_to_task.is_(converted),
        )

    @staticmethod
    def _apply_search(
        statement: Select[tuple[Note]],
        *,
        query: str,
    ) -> Select[tuple[Note]]:
        """
        Apply a case-insensitive search.

        Searches both title and content.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        query:
            Search keyword.

        Returns
        -------
        Select[tuple[Note]]
        """

        keyword = query.strip()

        if not keyword:
            return statement

        pattern = f"%{keyword}%"

        return statement.where(
            or_(
                Note.title.ilike(pattern),
                Note.content.ilike(pattern),
            )
        )

    @staticmethod
    def _count_statement(
        statement: Select[Any],
    ):
        """
        Convert a Note SELECT statement into an equivalent
        COUNT query.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        Returns
        -------
        Select
            COUNT statement.
        """

        return (
            select(func.count())
            .select_from(
                statement.order_by(None).subquery()
            )
        )

    def _execute_scalars(
        self,
        statement: Select[tuple[Note]],
    ) -> list[Note]:
        """
        Execute a query returning multiple Note objects.

        Parameters
        ----------
        statement:
            SQLAlchemy SELECT statement.

        Returns
        -------
        list[Note]
            Retrieved notes.
        """

        logger.debug(
            "Executing Note scalar query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        return list(
            self.db.scalars(statement).all()
        )

    def _execute_scalar(
        self,
        statement: Select[tuple[Note]],
    ) -> Note | None:
        """
        Execute a query returning a single Note.

        Parameters
        ----------
        statement:
            SQLAlchemy SELECT statement.

        Returns
        -------
        Note | None
            Matching note if found.
        """

        logger.debug(
            "Executing Note scalar lookup.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        return self.db.scalar(statement)

    def _execute_count(
        self,
        statement,
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
            "Executing Note count query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        return int(
            self.db.scalar(statement)
            or 0
        )
        
        # ======================================================
    # Single Note Queries
    # ======================================================

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
            Matching note if found, otherwise None.
        """

        logger.debug(
            "Retrieving note by identifier.",
            extra={
                "note_id": note_id,
            },
        )

        statement = (
            self._base_query()
            .where(Note.id == note_id)
        )

        return self._execute_scalar(statement)

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
            User identifier.

        Returns
        -------
        Note | None
        """

        logger.debug(
            "Retrieving owner note.",
            extra={
                "note_id": note_id,
                "owner_id": owner_id,
            },
        )

        statement = (
            self._owner_query(owner_id)
            .where(Note.id == note_id)
        )

        return self._execute_scalar(statement)

    # ======================================================
    # Listing
    # ======================================================

    def list_by_owner(
        self,
        owner_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve notes belonging to a user.

        Supports
        --------
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        owner_id:
            User identifier.

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

        logger.debug(
            "Listing notes by owner.",
            extra={
                "owner_id": owner_id,
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._owner_query(owner_id)

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

        Parameters
        ----------
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

        logger.debug(
            "Listing all notes.",
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

    def list_recent_by_owner(
        self,
        owner_id: int,
        *,
        limit: int = 10,
    ) -> list[Note]:
        """
        Retrieve the most recently created notes
        belonging to a specific user.

        Parameters
        ----------
        owner_id:
            User identifier.

        limit:
            Maximum records returned.

        Returns
        -------
        list[Note]
        """

        logger.debug(
            "Listing recent owner notes.",
            extra={
                "owner_id": owner_id,
                "limit": limit,
            },
        )

        statement = (
            self._owner_query(owner_id)
            .order_by(
                Note.created_at.desc(),
            )
            .limit(limit)
        )

        return self._execute_scalars(statement)

    def list_recent(
        self,
        *,
        limit: int = 10,
    ) -> list[Note]:
        """
        Retrieve the most recently created notes
        across all users.

        Intended primarily for administrator dashboards.

        Parameters
        ----------
        limit:
            Maximum number of records.

        Returns
        -------
        list[Note]
        """

        logger.debug(
            "Listing recent notes.",
            extra={
                "limit": limit,
            },
        )

        statement = (
            self._base_query()
            .order_by(
                Note.created_at.desc(),
            )
            .limit(limit)
        )

        return self._execute_scalars(statement)

    def list_by_book_reference(
        self,
        *,
        book_reference_id: str,
        owner_id: int | None = None,
    ) -> list[Note]:
        """
        Retrieve notes associated with a specific
        Open Library book.

        Parameters
        ----------
        book_reference_id:
            Open Library identifier.

        owner_id:
            Optional owner filter.

        Returns
        -------
        list[Note]
        """

        logger.debug(
            "Listing notes by book reference.",
            extra={
                "book_reference_id": book_reference_id,
                "owner_id": owner_id,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = statement.where(
            Note.book_reference_id == book_reference_id,
        )

        statement = self._apply_sorting(statement)

        return self._execute_scalars(statement)
    
        # ======================================================
    # Search Operations
    # ======================================================

    def search(
        self,
        *,
        query: str,
        owner_id: int | None = None,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Search notes by title and content.

        Supports
        --------
        ✓ Administrator search
        ✓ Owner-specific search
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        query:
            Search keyword.

        owner_id:
            Optional owner filter.

        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
            Matching notes.
        """

        logger.debug(
            "Searching notes.",
            extra={
                "query": query,
                "owner_id": owner_id,
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

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
        owner_id: int | None = None,
    ) -> int:
        """
        Count notes matching a search query.

        Parameters
        ----------
        query:
            Search keyword.

        owner_id:
            Optional owner filter.

        Returns
        -------
        int
            Number of matching notes.
        """

        logger.debug(
            "Counting search results.",
            extra={
                "query": query,
                "owner_id": owner_id,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = self._apply_search(
            statement,
            query=query,
        )

        return self._execute_count(
            self._count_statement(statement)
        )

    # ======================================================
    # Open Library Queries
    # ======================================================

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
            Optional owner filter.

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

        logger.debug(
            "Listing notes with book references.",
            extra={
                "owner_id": owner_id,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = self._apply_book_reference_filter(
            statement,
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

    def count_with_book_reference(
        self,
        *,
        owner_id: int | None = None,
    ) -> int:
        """
        Count notes linked to an Open Library book.

        Parameters
        ----------
        owner_id:
            Optional owner filter.

        Returns
        -------
        int
        """

        logger.debug(
            "Counting notes with book references.",
            extra={
                "owner_id": owner_id,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = self._apply_book_reference_filter(
            statement,
        )

        return self._execute_count(
            self._count_statement(statement)
        )

    def has_book_reference(
        self,
        note_id: int,
    ) -> bool:
        """
        Determine whether a note is linked to
        an Open Library book.

        Parameters
        ----------
        note_id:
            Note identifier.

        Returns
        -------
        bool
        """

        logger.debug(
            "Checking book reference.",
            extra={
                "note_id": note_id,
            },
        )

        statement = (
            self._base_query()
            .where(Note.id == note_id)
            .where(
                Note.book_reference_id.is_not(None)
            )
        )

        return (
            self._execute_scalar(statement)
            is not None
        )

    def list_without_book_reference(
        self,
        *,
        owner_id: int | None = None,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve notes without an Open Library
        reference.

        Parameters
        ----------
        owner_id:
            Optional owner filter.

        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.

        sort_by:
            Sorting strategy.

        Returns
        -------
        list[Note]
        """

        logger.debug(
            "Listing notes without book references.",
            extra={
                "owner_id": owner_id,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = statement.where(
            Note.book_reference_id.is_(None),
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
    
        # ======================================================
    # NestJS Task Conversion
    # ======================================================

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
            Optional owner filter.

        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
            Notes awaiting task conversion.
        """

        logger.debug(
            "Listing notes pending task conversion.",
            extra={
                "owner_id": owner_id,
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = self._apply_conversion_filter(
            statement,
            converted=False,
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
            Optional owner filter.

        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
            Converted notes.
        """

        logger.debug(
            "Listing converted notes.",
            extra={
                "owner_id": owner_id,
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = self._apply_conversion_filter(
            statement,
            converted=True,
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

    def mark_as_converted(
        self,
        note: Note,
    ) -> Note:
        """
        Mark a note as successfully converted into
        a NestJS task.

        Parameters
        ----------
        note:
            Existing Note ORM instance.

        Returns
        -------
        Note
            Updated Note instance.
        """

        logger.debug(
            "Marking note as converted.",
            extra={
                "note_id": note.id,
            },
        )

        note.is_converted_to_task = True

        return self.update(note)

    def mark_as_not_converted(
        self,
        note: Note,
    ) -> Note:
        """
        Reset the conversion status of a note.

        Useful when a task is deleted or a conversion
        workflow needs to be rolled back.

        Parameters
        ----------
        note:
            Existing Note ORM instance.

        Returns
        -------
        Note
            Updated Note instance.
        """

        logger.debug(
            "Resetting note conversion status.",
            extra={
                "note_id": note.id,
            },
        )

        note.is_converted_to_task = False

        return self.update(note)

    def count_convertible_to_task(
        self,
        *,
        owner_id: int | None = None,
    ) -> int:
        """
        Count notes awaiting task conversion.

        Parameters
        ----------
        owner_id:
            Optional owner filter.

        Returns
        -------
        int
            Number of convertible notes.
        """

        logger.debug(
            "Counting convertible notes.",
            extra={
                "owner_id": owner_id,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = self._apply_conversion_filter(
            statement,
            converted=False,
        )

        return self._execute_count(
            self._count_statement(statement)
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
            Optional owner filter.

        Returns
        -------
        int
            Number of converted notes.
        """

        logger.debug(
            "Counting converted notes.",
            extra={
                "owner_id": owner_id,
            },
        )

        statement = self._base_query()

        statement = self._apply_owner_filter(
            statement,
            owner_id=owner_id,
        )

        statement = self._apply_conversion_filter(
            statement,
            converted=True,
        )

        return self._execute_count(
            self._count_statement(statement)
        )
        
        # ======================================================
    # Statistics
    # ======================================================

    def count_by_owner(
        self,
        owner_id: int,
    ) -> int:
        """
        Count all notes belonging to a specific owner.

        Parameters
        ----------
        owner_id:
            User identifier.

        Returns
        -------
        int
            Total number of notes.
        """

        logger.debug(
            "Counting owner notes.",
            extra={
                "owner_id": owner_id,
            },
        )

        statement = self._owner_query(owner_id)

        return self._execute_count(
            self._count_statement(statement)
        )

    def count_all(
        self,
    ) -> int:
        """
        Count all notes.

        Returns
        -------
        int
            Total number of notes.
        """

        logger.debug(
            "Counting all notes.",
        )

        return self._execute_count(
            self._count_statement(
                self._base_query(),
            )
        )

    def exists_by_owner(
        self,
        *,
        note_id: int,
        owner_id: int,
    ) -> bool:
        """
        Determine whether a note exists for
        the specified owner.

        Parameters
        ----------
        note_id:
            Note identifier.

        owner_id:
            User identifier.

        Returns
        -------
        bool
        """

        logger.debug(
            "Checking owner note existence.",
            extra={
                "note_id": note_id,
                "owner_id": owner_id,
            },
        )

        statement = (
            self._owner_query(owner_id)
            .where(
                Note.id == note_id,
            )
        )

        return (
            self._execute_scalar(statement)
            is not None
        )

    def refresh_note(
        self,
        note: Note,
    ) -> Note:
        """
        Refresh a Note instance from the database.

        Parameters
        ----------
        note:
            Existing ORM instance.

        Returns
        -------
        Note
            Refreshed Note.
        """

        logger.debug(
            "Refreshing note instance.",
            extra={
                "note_id": note.id,
            },
        )

        self.refresh(note)

        return note

    # ======================================================
    # Repository Utilities
    # ======================================================

    def attach(
        self,
        note: Note,
    ) -> Note:
        """
        Merge a detached Note instance into the
        current SQLAlchemy session.

        Parameters
        ----------
        note:
            Detached ORM instance.

        Returns
        -------
        Note
            Managed ORM instance.
        """

        logger.debug(
            "Attaching detached note.",
            extra={
                "note_id": note.id,
            },
        )

        return self.merge(note)

    def save(
        self,
        note: Note,
    ) -> Note:
        """
        Persist changes to an existing Note.

        This is a convenience wrapper around
        BaseRepository.update().

        Parameters
        ----------
        note:
            Existing Note instance.

        Returns
        -------
        Note
        """

        logger.debug(
            "Saving note.",
            extra={
                "note_id": note.id,
            },
        )

        return self.update(note)

    def remove(
        self,
        note: Note,
    ) -> None:
        """
        Remove a Note from the database.

        Parameters
        ----------
        note:
            Existing Note instance.
        """

        logger.debug(
            "Removing note.",
            extra={
                "note_id": note.id,
            },
        )

        self.delete(note)

    def remove_many(
        self,
        notes: list[Note],
    ) -> None:
        """
        Remove multiple notes.

        Parameters
        ----------
        notes:
            Collection of Note objects.
        """

        logger.debug(
            "Removing multiple notes.",
            extra={
                "count": len(notes),
            },
        )

        self.delete_many(notes)

    def touch(
        self,
        note: Note,
    ) -> Note:
        """
        Persist changes and refresh the entity.

        Parameters
        ----------
        note:
            Existing Note instance.

        Returns
        -------
        Note
            Refreshed Note instance.
        """

        logger.debug(
            "Touching note.",
            extra={
                "note_id": note.id,
            },
        )

        return self._commit_and_refresh(note)


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "NoteRepository",
]