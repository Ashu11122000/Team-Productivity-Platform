"""
==========================================================
Note Repository
==========================================================

Enterprise repository implementation for Note persistence.

Responsibilities
----------------
✓ Encapsulate all database access for Note entities.
✓ Provide reusable query helpers.
✓ Support CRUD operations.
✓ Support owner-based queries.
✓ Support administrator queries.
✓ Support searching.
✓ Support pagination.
✓ Support sorting.
✓ Support Open Library reference queries.
✓ Support task-conversion persistence workflows.
✓ Remain free of business logic.
✓ Translate database failures consistently.

Architecture
------------
This repository is responsible ONLY for persistence.

Business rules, authorization, ownership validation,
external API communication, DTO mapping, response
serialization, and orchestration must remain inside
the service/API layers.

The repository may persist state related to external
integrations, such as:

- Open Library book references.
- NestJS task conversion state.

It must NOT communicate directly with those services.

Features
--------
✓ SQLAlchemy 2.x style queries.
✓ Repository Pattern.
✓ Structured logging.
✓ Strong SQLAlchemy statement typing.
✓ Generic CRUD support via BaseRepository.
✓ Reusable private query builders.
✓ Centralized database exception translation.
✓ Pagination and sorting helpers.
✓ Enterprise documentation.

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
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseError
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

    This repository contains persistence logic only.

    Responsibilities
    ----------------
    • Build SQLAlchemy queries.
    • Execute database operations.
    • Return Note ORM models.
    • Persist Note integration state.

    This repository MUST NOT contain:

    • Business rules.
    • Authorization.
    • Ownership policy decisions.
    • Open Library communication.
    • NestJS communication.
    • API response serialization.
    • DTO mapping.
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

    @staticmethod
    def _base_query() -> Select[tuple[Note]]:
        """
        Build the base SELECT statement for Note.

        Returns
        -------
        Select[tuple[Note]]
            Base SQLAlchemy SELECT statement.
        """

        return select(Note)

    @staticmethod
    def _owner_query(
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

        return (
            select(Note)
            .where(Note.owner_id == owner_id)
        )

    @staticmethod
    def _apply_sorting(
        statement: Select[tuple[Note]],
        *,
        sort_by: str = "newest",
    ) -> Select[tuple[Note]]:
        """
        Apply sorting to a Note SELECT statement.

        Supported values
        ----------------
        newest
            Newest notes first.

        oldest
            Oldest notes first.

        title
            Alphabetical by title.

        Unknown values
            Default to newest-first ordering.

        Parameters
        ----------
        statement:
            Existing SQLAlchemy SELECT statement.

        sort_by:
            Sorting strategy.

        Returns
        -------
        Select[tuple[Note]]
            Updated SELECT statement.
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
                    Note.id.asc(),
                )

            case _:
                return statement.order_by(
                    Note.created_at.desc(),
                    Note.id.desc(),
                )

    @staticmethod
    def _apply_pagination(
        statement: Select[tuple[Note]],
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> Select[tuple[Note]]:
        """
        Apply pagination to a Note query.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows returned.

        Returns
        -------
        Select[tuple[Note]]
            Paginated SELECT statement.
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

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        owner_id:
            Optional owner identifier.

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
        Restrict a query to notes containing a book reference.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        Returns
        -------
        Select[tuple[Note]]
            Updated SELECT statement.
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
        Filter notes by task-conversion status.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        converted:
            Desired conversion state.

        Returns
        -------
        Select[tuple[Note]]
            Updated SELECT statement.
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
        Apply a case-insensitive title/content search.

        Empty or whitespace-only queries do not add a
        search condition.

        Parameters
        ----------
        statement:
            Existing SELECT statement.

        query:
            Search keyword.

        Returns
        -------
        Select[tuple[Note]]
            Updated SELECT statement.
        """

        keyword = query.strip()

        if not keyword:
            return statement

        pattern = f"%{keyword}%"

        return statement.where(
            or_(
                Note.title.ilike(pattern),
                Note.content.ilike(pattern),
            ),
        )

    @staticmethod
    def _count_statement(
        statement: Select[tuple[Note]],
    ) -> Select[tuple[int]]:
        """
        Convert a Note SELECT statement into a COUNT query.

        Ordering is removed because it is unnecessary for
        counting and may introduce unnecessary SQL work.

        Parameters
        ----------
        statement:
            Existing Note SELECT statement.

        Returns
        -------
        Select[tuple[int]]
            COUNT SELECT statement.
        """

        subquery = (
            statement
            .order_by(None)
            .subquery()
        )

        return select(
            func.count(),
        ).select_from(subquery)

    # ======================================================
    # Query Execution Helpers
    # ======================================================

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

        Raises
        ------
        DatabaseError
            If the query fails.
        """

        logger.debug(
            "Executing Note collection query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        try:
            return list(
                self.db.scalars(statement).all(),
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "Note collection query failed.",
                extra={
                    "repository": self.__class__.__name__,
                },
            )

            raise DatabaseError(
                "Failed to retrieve notes.",
            ) from exc

    def _execute_scalar(
        self,
        statement: Select[tuple[Note]],
    ) -> Note | None:
        """
        Execute a query returning at most one Note.

        Parameters
        ----------
        statement:
            SQLAlchemy SELECT statement.

        Returns
        -------
        Note | None
            Matching Note when found.

        Raises
        ------
        DatabaseError
            If the query fails.
        """

        logger.debug(
            "Executing Note scalar query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        try:
            return self.db.scalar(statement)

        except SQLAlchemyError as exc:
            logger.exception(
                "Note scalar query failed.",
                extra={
                    "repository": self.__class__.__name__,
                },
            )

            raise DatabaseError(
                "Failed to retrieve note.",
            ) from exc

    def _execute_count(
        self,
        statement: Select[tuple[int]],
    ) -> int:
        """
        Execute a COUNT query.

        Parameters
        ----------
        statement:
            COUNT SELECT statement.

        Returns
        -------
        int
            Number of matching rows.

        Raises
        ------
        DatabaseError
            If the query fails.
        """

        logger.debug(
            "Executing Note count query.",
            extra={
                "repository": self.__class__.__name__,
            },
        )

        try:
            return int(
                self.db.scalar(statement) or 0,
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "Note count query failed.",
                extra={
                    "repository": self.__class__.__name__,
                },
            )

            raise DatabaseError(
                "Failed to count notes.",
            ) from exc

    # ======================================================
    # Single Note Queries
    # ======================================================

    def get_by_id(
        self,
        note_id: int,
    ) -> Note | None:
        """
        Retrieve a Note by primary key.

        Parameters
        ----------
        note_id:
            Note identifier.

        Returns
        -------
        Note | None
            Matching Note when found.
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
            .limit(1)
        )

        return self._execute_scalar(statement)

    def get_by_owner(
        self,
        *,
        note_id: int,
        owner_id: int,
    ) -> Note | None:
        """
        Retrieve a Note belonging to a specific owner.

        Parameters
        ----------
        note_id:
            Note identifier.

        owner_id:
            User identifier.

        Returns
        -------
        Note | None
            Matching owner Note when found.
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
            .limit(1)
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
        Retrieve notes belonging to a specific owner.

        Supports pagination and sorting.

        Parameters
        ----------
        owner_id:
            User identifier.

        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
            Owner notes.
        """

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

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

        Intended for administrator-level service operations.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows returned.

        sort_by:
            newest | oldest | title

        Returns
        -------
        list[Note]
            Notes matching the requested page.
        """

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

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
        belonging to a specific owner.

        Parameters
        ----------
        owner_id:
            User identifier.

        limit:
            Maximum number of records.

        Returns
        -------
        list[Note]
            Recently created owner notes.
        """

        self._validate_pagination(
            skip=0,
            limit=limit,
        )

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
                Note.id.desc(),
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
        Retrieve the most recently created notes.

        Intended primarily for administrator dashboard
        persistence queries.

        Parameters
        ----------
        limit:
            Maximum number of records.

        Returns
        -------
        list[Note]
            Recently created notes.
        """

        self._validate_pagination(
            skip=0,
            limit=limit,
        )

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
                Note.id.desc(),
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
        Open Library book reference.

        Parameters
        ----------
        book_reference_id:
            Open Library identifier.

        owner_id:
            Optional owner filter.

        Returns
        -------
        list[Note]
            Notes associated with the book reference.
        """

        logger.debug(
            "Listing notes by book reference.",
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
            Note.book_reference_id == book_reference_id,
        )

        statement = self._apply_sorting(
            statement,
        )

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
        Search Notes by title and content.

        Supports owner-specific and administrator-level
        persistence queries.

        Parameters
        ----------
        query:
            Search keyword.

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
            Matching notes.
        """

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

        logger.debug(
            "Searching notes.",
            extra={
                "owner_id": owner_id,
                "skip": skip,
                "limit": limit,
                "sort_by": sort_by,
                "has_query": bool(query.strip()),
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
        Count Notes matching a search query.

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
            "Counting note search results.",
            extra={
                "owner_id": owner_id,
                "has_query": bool(query.strip()),
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
            self._count_statement(statement),
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
            Notes containing book references.
        """

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

        logger.debug(
            "Listing notes with book references.",
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
            Number of notes containing book references.
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
            self._count_statement(statement),
        )

    def has_book_reference(
        self,
        note_id: int,
    ) -> bool:
        """
        Determine whether a Note has an Open Library
        book reference.

        Parameters
        ----------
        note_id:
            Note identifier.

        Returns
        -------
        bool
            True when the Note has a book reference.
        """

        logger.debug(
            "Checking Note book reference.",
            extra={
                "note_id": note_id,
            },
        )

        statement = (
            self._base_query()
            .where(Note.id == note_id)
            .where(
                Note.book_reference_id.is_not(None),
            )
            .limit(1)
        )

        return self._execute_scalar(statement) is not None

    def list_without_book_reference(
        self,
        *,
        owner_id: int | None = None,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "newest",
    ) -> list[Note]:
        """
        Retrieve notes without an Open Library reference.

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
            Notes without book references.
        """

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

        logger.debug(
            "Listing notes without book references.",
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

        This method only queries persisted conversion state.
        It does not communicate with NestJS.

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

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

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

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

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
        Mark a Note as converted into a NestJS task.

        This method persists conversion state only. The
        actual task creation must be performed by the
        service/integration layer.

        Parameters
        ----------
        note:
            Existing Note ORM instance.

        Returns
        -------
        Note
            Updated and refreshed Note.
        """

        logger.debug(
            "Marking Note as converted.",
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
        Reset a Note's task-conversion state.

        Parameters
        ----------
        note:
            Existing Note ORM instance.

        Returns
        -------
        Note
            Updated and refreshed Note.
        """

        logger.debug(
            "Resetting Note conversion state.",
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
            self._count_statement(statement),
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
            self._count_statement(statement),
        )

    # ======================================================
    # Statistics
    # ======================================================

    def count_by_owner(
        self,
        owner_id: int,
    ) -> int:
        """
        Count all notes belonging to an owner.

        Parameters
        ----------
        owner_id:
            User identifier.

        Returns
        -------
        int
            Number of notes owned by the user.
        """

        logger.debug(
            "Counting owner notes.",
            extra={
                "owner_id": owner_id,
            },
        )

        statement = self._owner_query(owner_id)

        return self._execute_count(
            self._count_statement(statement),
        )

    def count_all(self) -> int:
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
            ),
        )

    def exists_by_owner(
        self,
        *,
        note_id: int,
        owner_id: int,
    ) -> bool:
        """
        Determine whether a Note exists for an owner.

        Parameters
        ----------
        note_id:
            Note identifier.

        owner_id:
            User identifier.

        Returns
        -------
        bool
            True when the owner owns the specified Note.
        """

        logger.debug(
            "Checking owner Note existence.",
            extra={
                "note_id": note_id,
                "owner_id": owner_id,
            },
        )

        statement = (
            self._owner_query(owner_id)
            .where(Note.id == note_id)
            .limit(1)
        )

        return self._execute_scalar(statement) is not None

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
            Refreshed Note instance.
        """

        logger.debug(
            "Refreshing Note instance.",
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
        Merge a detached Note instance into the current
        SQLAlchemy session.

        Parameters
        ----------
        note:
            Detached Note ORM instance.

        Returns
        -------
        Note
            Managed and persisted Note instance.
        """

        logger.debug(
            "Attaching detached Note.",
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
            Updated and refreshed Note instance.
        """

        logger.debug(
            "Saving Note.",
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
            "Removing Note.",
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
        Remove multiple Notes.

        Parameters
        ----------
        notes:
            Collection of Note ORM instances.
        """

        if not notes:
            return

        logger.debug(
            "Removing multiple Notes.",
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
        Commit the current Note state and refresh the entity.

        Parameters
        ----------
        note:
            Existing managed Note instance.

        Returns
        -------
        Note
            Refreshed Note instance.
        """

        logger.debug(
            "Touching Note.",
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