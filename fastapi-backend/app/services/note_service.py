"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.services.note_service
Architecture: Clean Architecture | Service Layer | Repository Pattern
Python: 3.12+
Framework: FastAPI
Database: PostgreSQL
ORM: SQLAlchemy 2.x
Validation: Pydantic v2

===============================================================================

Overview
--------
Enterprise service responsible for all business logic related to Note
management.

The NoteService represents the business layer between API routers/dependency
providers and the NoteRepository.

The service is intentionally free from:

- SQLAlchemy query construction
- SQLAlchemy Session management
- Database transaction implementation
- HTTP transport handling
- Response envelope construction

Persistence is delegated to NoteRepository.

Responsibilities
----------------
✓ Create notes
✓ Retrieve notes
✓ Update notes
✓ Delete notes
✓ Search notes
✓ Pagination orchestration
✓ Sorting normalization
✓ Ownership validation
✓ Administrator authorization
✓ Statistics
✓ Open Library note filtering
✓ NestJS task-conversion preparation
✓ ORM → DTO transformation
✓ Structured logging
✓ Business-rule enforcement

Architecture
------------
Request
    │
    ▼
FastAPI Router
    │
    ▼
Dependency Injection
    │
    ├── Current User
    │
    └── NoteRepository
            │
            ▼
       NoteService
            │
            ▼
      NoteRepository
            │
            ▼
       SQLAlchemy
            │
            ▼
        PostgreSQL

Important Architectural Rules
------------------------------
1. Routers handle HTTP transport concerns.
2. Dependencies provide authenticated users and repositories.
3. Services contain business logic.
4. Repositories contain persistence logic.
5. Services must not construct repositories manually.
6. Services must not use SQLAlchemy queries.
7. Services must not use SQLAlchemy Session directly.
8. Services must not raise FastAPI HTTPException.
9. Application exceptions are translated by the global exception handler.
10. FastAPI owns Notes and Open Library integration.
11. NestJS owns Tasks, Categories, Tags, Notifications, Dashboard,
    Analytics, and Activity Logs.

Microservice Ownership
----------------------
FastAPI owns:

- Authentication
- Users
- Notes
- Open Library integration

NestJS owns:

- Tasks
- Categories
- Tags
- Notifications
- Dashboard
- Analytics
- Activity Logs

Note-to-task conversion in this service currently prepares the note state for
future NestJS synchronization. Actual NestJS task creation belongs to the
NestJS integration layer.

Design Principles
-----------------
- SOLID
- Clean Architecture
- Repository Pattern
- Service Layer Pattern
- Dependency Inversion
- Single Responsibility Principle
- Stateless service design
- Explicit type hints
- Structured logging
- Centralized exception handling
- DTO/ORM separation
- Enterprise documentation standards

Thread Safety
-------------
The service maintains no mutable shared request state.

The repository is supplied through dependency injection and is scoped to the
request/database lifecycle by the application's dependency system.

Future Extension Points
-----------------------
The service can later coordinate:

- Distributed caching
- Domain events
- Message queues
- Background workers
- Audit logging
- Metrics
- OpenTelemetry tracing
- Search indexing
- Open Library synchronization
- NestJS task synchronization

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from typing import Final, TypeAlias

# =============================================================================
# Application Core Imports
# =============================================================================

from app.core.constants import UserRole
from app.core.logging import get_logger

# =============================================================================
# Application Exception Imports
# =============================================================================

from app.exceptions import (
    AuthorizationError,
    NoteAlreadyConvertedError,
    NoteNotFoundError,
)

# =============================================================================
# Domain Model Imports
# =============================================================================

from app.models.note import Note
from app.models.user import User

# =============================================================================
# Repository Imports
# =============================================================================

from app.repositories.note_repository import NoteRepository

# =============================================================================
# Schema Imports
# =============================================================================

from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteToTaskResponse,
    NoteUpdate,
)

# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    "NoteService",
]

# =============================================================================
# Module Constants
# =============================================================================

DEFAULT_PAGE: Final[int] = 1

DEFAULT_PAGE_SIZE: Final[int] = 10

DEFAULT_ADMIN_PAGE_SIZE: Final[int] = 20

DEFAULT_SORT_ORDER: Final[str] = "newest"

SORT_NEWEST: Final[str] = "newest"

SORT_OLDEST: Final[str] = "oldest"

SORT_TITLE: Final[str] = "title"

SUPPORTED_SORT_OPTIONS: Final[frozenset[str]] = frozenset(
    {
        SORT_NEWEST,
        SORT_OLDEST,
        SORT_TITLE,
    }
)

# =============================================================================
# Type Aliases
# =============================================================================

PaginationResult: TypeAlias = tuple[int, list[NoteResponse]]

StatisticsResult: TypeAlias = dict[str, int]

# =============================================================================
# Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# Note Service
# =============================================================================


class NoteService:
    """
    Enterprise service responsible for Note business operations.

    The service receives NoteRepository through constructor dependency
    injection. It never creates the repository itself.

    Parameters
    ----------
    note_repository:
        Repository responsible for Note persistence operations.

    Responsibilities
    ----------------
    - Note CRUD
    - Note ownership validation
    - Administrator authorization
    - Search
    - Pagination
    - Sorting
    - Statistics
    - Open Library note filtering
    - NestJS conversion preparation
    - ORM → response mapping
    - Business validation
    - Structured logging
    """

    # =========================================================================
    # Service Metadata
    # =========================================================================

    SERVICE_NAME: Final[str] = "NoteService"

    SERVICE_VERSION: Final[str] = "1.0.0"

    DOMAIN_NAME: Final[str] = "notes"

    # =========================================================================
    # Pagination Defaults
    # =========================================================================

    DEFAULT_PAGE: Final[int] = DEFAULT_PAGE

    DEFAULT_PAGE_SIZE: Final[int] = DEFAULT_PAGE_SIZE

    DEFAULT_ADMIN_PAGE_SIZE: Final[int] = DEFAULT_ADMIN_PAGE_SIZE

    # =========================================================================
    # Sorting
    # =========================================================================

    DEFAULT_SORT_ORDER: Final[str] = DEFAULT_SORT_ORDER

    SUPPORTED_SORT_OPTIONS: Final[frozenset[str]] = (
        SUPPORTED_SORT_OPTIONS
    )

    # =========================================================================
    # Authorization
    # =========================================================================

    ADMIN_ROLE: Final[str] = UserRole.ADMIN.value

    # =========================================================================
    # Logging Messages
    # =========================================================================

    LOG_CREATE: Final[str] = "Create Note"

    LOG_READ: Final[str] = "Read Note"

    LOG_UPDATE: Final[str] = "Update Note"

    LOG_DELETE: Final[str] = "Delete Note"

    LOG_SEARCH: Final[str] = "Search Notes"

    LOG_STATISTICS: Final[str] = "Note Statistics"

    LOG_CONVERT: Final[str] = "Convert Note"

    LOG_ADMIN: Final[str] = "Administrator Note Operation"

    # =========================================================================
    # Constructor
    # =========================================================================

    def __init__(
        self,
        note_repository: NoteRepository,
    ) -> None:
        """
        Initialize the NoteService.

        Repository construction is intentionally performed by the dependency
        injection layer rather than inside the service.

        Parameters
        ----------
        note_repository:
            Injected NoteRepository instance.
        """
        self.note_repository = note_repository

        logger.debug(
            "NoteService initialized.",
            extra={
                "service": self.SERVICE_NAME,
                "version": self.SERVICE_VERSION,
                "domain": self.DOMAIN_NAME,
                "repository": note_repository.__class__.__name__,
            },
        )

    # =========================================================================
    # Authorization Helpers
    # =========================================================================

    def _is_admin(
        self,
        user: User,
    ) -> bool:
        """
        Determine whether a user has administrator privileges.

        Parameters
        ----------
        user:
            Authenticated application user.

        Returns
        -------
        bool
            True when the user has the administrator role.
        """
        return user.role == self.ADMIN_ROLE

    def _owner_scope(
        self,
        user: User,
    ) -> int | None:
        """
        Determine the repository ownership scope.

        Administrators receive global scope.

        Regular users receive owner-specific scope.

        Parameters
        ----------
        user:
            Authenticated application user.

        Returns
        -------
        int | None
            User ID for owner scope or None for administrator scope.
        """
        if self._is_admin(user):
            return None

        return user.id

    def ensure_admin(
        self,
        current_user: User,
    ) -> User:
        """
        Ensure that the authenticated user is an administrator.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        User
            The authenticated administrator.

        Raises
        ------
        AuthorizationError
            If the authenticated user is not an administrator.
        """
        if self._is_admin(current_user):
            return current_user

        logger.warning(
            "%s | administrator access denied | user_id=%s",
            self.LOG_ADMIN,
            current_user.id,
        )

        raise AuthorizationError()

    # =========================================================================
    # Note Retrieval Helpers
    # =========================================================================

    def _require_note(
        self,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note or raise NoteNotFoundError.

        Parameters
        ----------
        note_id:
            Note identifier.

        Returns
        -------
        Note
            Existing Note ORM model.

        Raises
        ------
        NoteNotFoundError
            If the requested note does not exist.
        """
        logger.debug(
            "%s | retrieving note | note_id=%s",
            self.LOG_READ,
            note_id,
        )

        note = self.note_repository.get_by_id(
            note_id,
        )

        if note is None:
            logger.warning(
                "%s | note not found | note_id=%s",
                self.LOG_READ,
                note_id,
            )

            raise NoteNotFoundError()

        return note

    def _validate_access(
        self,
        *,
        current_user: User,
        note: Note,
    ) -> None:
        """
        Validate resource-level access to a note.

        Administrators can access every note.

        Regular users can access only notes they own.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note:
            Note being accessed.

        Raises
        ------
        AuthorizationError
            If the user does not have access to the note.
        """
        if self._is_admin(current_user):
            return

        if note.owner_id == current_user.id:
            return

        logger.warning(
            "%s | access denied | user_id=%s owner_id=%s note_id=%s",
            self.LOG_READ,
            current_user.id,
            note.owner_id,
            note.id,
        )

        raise AuthorizationError()

    def _get_authorized_note(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note and validate resource-level authorization.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        Note
            Authorized Note ORM model.
        """
        note = self._require_note(
            note_id,
        )

        self._validate_access(
            current_user=current_user,
            note=note,
        )

        return note

    # =========================================================================
    # Response Mapping Helpers
    # =========================================================================

    @staticmethod
    def _build_note_response(
        note: Note,
    ) -> NoteResponse:
        """
        Convert a Note ORM model into NoteResponse.

        Parameters
        ----------
        note:
            SQLAlchemy Note model.

        Returns
        -------
        NoteResponse
            Serialized note response.
        """
        return NoteResponse.model_validate(
            note,
        )

    @classmethod
    def _build_note_response_collection(
        cls,
        notes: list[Note],
    ) -> list[NoteResponse]:
        """
        Convert multiple Note ORM models into response schemas.

        Parameters
        ----------
        notes:
            Note ORM models.

        Returns
        -------
        list[NoteResponse]
            Serialized note responses.
        """
        return [
            cls._build_note_response(note)
            for note in notes
        ]

    # =========================================================================
    # Pagination Helpers
    # =========================================================================

    @staticmethod
    def _normalize_page(
        page: int,
    ) -> int:
        """
        Normalize a one-based page number.

        Parameters
        ----------
        page:
            Requested page.

        Returns
        -------
        int
            Valid one-based page.
        """
        return max(
            page,
            DEFAULT_PAGE,
        )

    @staticmethod
    def _normalize_limit(
        limit: int,
    ) -> int:
        """
        Normalize a requested page size.

        Parameters
        ----------
        limit:
            Requested page size.

        Returns
        -------
        int
            Positive page size.
        """
        return max(
            limit,
            1,
        )

    @classmethod
    def _calculate_offset(
        cls,
        *,
        page: int,
        limit: int,
    ) -> int:
        """
        Calculate the repository pagination offset.

        Parameters
        ----------
        page:
            One-based page number.

        limit:
            Page size.

        Returns
        -------
        int
            Zero-based repository offset.
        """
        normalized_page = cls._normalize_page(
            page,
        )

        normalized_limit = cls._normalize_limit(
            limit,
        )

        return (
            normalized_page - 1
        ) * normalized_limit

    # =========================================================================
    # Sorting Helpers
    # =========================================================================

    @classmethod
    def _normalize_sort_order(
        cls,
        sort_by: str | None,
    ) -> str:
        """
        Normalize a requested sort strategy.

        Unknown values fall back to the established newest-first strategy,
        matching NoteRepository behavior.

        Parameters
        ----------
        sort_by:
            Requested sort strategy.

        Returns
        -------
        str
            Supported sort strategy.
        """
        if not sort_by:
            return cls.DEFAULT_SORT_ORDER

        normalized = sort_by.strip().lower()

        if normalized in cls.SUPPORTED_SORT_OPTIONS:
            return normalized

        return cls.DEFAULT_SORT_ORDER

    # =========================================================================
    # Update Helpers
    # =========================================================================

    @staticmethod
    def _normalize_update_data(
        note_data: NoteUpdate,
    ) -> dict[str, object]:
        """
        Normalize an incoming NoteUpdate payload.

        Only explicitly provided fields are included.

        String values are trimmed before being applied to the ORM model.

        Parameters
        ----------
        note_data:
            Incoming update schema.

        Returns
        -------
        dict[str, object]
            Normalized update data.
        """
        update_data = note_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        for field, value in update_data.items():
            if isinstance(value, str):
                update_data[field] = value.strip()

        return update_data

    @staticmethod
    def _apply_updates(
        *,
        note: Note,
        update_data: dict[str, object],
    ) -> Note:
        """
        Apply normalized update fields to a Note ORM model.

        Parameters
        ----------
        note:
            Existing Note model.

        update_data:
            Normalized update values.

        Returns
        -------
        Note
            Updated Note model.
        """
        for field, value in update_data.items():
            if hasattr(note, field):
                setattr(
                    note,
                    field,
                    value,
                )

        return note

    # =========================================================================
    # Create Operations
    # =========================================================================

    def create_note(
        self,
        *,
        current_user: User,
        note_data: NoteCreate,
    ) -> NoteResponse:
        """
        Create a new note owned by the authenticated user.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_data:
            Note creation payload.

        Returns
        -------
        NoteResponse
            Newly created note.
        """
        logger.info(
            "%s | user_id=%s",
            self.LOG_CREATE,
            current_user.id,
        )

        title = note_data.title.strip()

        content = (
            note_data.content.strip()
            if note_data.content is not None
            else None
        )

        note = Note(
            title=title,
            content=content,
            owner_id=current_user.id,
        )

        created_note = self.note_repository.create(
            note,
        )

        logger.info(
            "%s | success | note_id=%s owner_id=%s",
            self.LOG_CREATE,
            created_note.id,
            created_note.owner_id,
        )

        return self._build_note_response(
            created_note,
        )

    # =========================================================================
    # Read Operations
    # =========================================================================

    def get_note_by_id(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> NoteResponse:
        """
        Retrieve a single authorized note.

        Administrators may retrieve any note.

        Regular users may retrieve only their own notes.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        NoteResponse
            Requested note.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            self.LOG_READ,
            note_id,
            current_user.id,
        )

        note = self._get_authorized_note(
            current_user=current_user,
            note_id=note_id,
        )

        logger.info(
            "%s | success | note_id=%s",
            self.LOG_READ,
            note.id,
        )

        return self._build_note_response(
            note,
        )

    # =========================================================================
    # Update Operations
    # =========================================================================

    def update_note(
        self,
        *,
        current_user: User,
        note_id: int,
        note_data: NoteUpdate,
    ) -> NoteResponse:
        """
        Update an existing authorized note.

        Administrators may update any note.

        Regular users may update only their own notes.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        note_data:
            Updated note fields.

        Returns
        -------
        NoteResponse
            Updated note.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            self.LOG_UPDATE,
            note_id,
            current_user.id,
        )

        note = self._get_authorized_note(
            current_user=current_user,
            note_id=note_id,
        )

        update_data = self._normalize_update_data(
            note_data,
        )

        self._apply_updates(
            note=note,
            update_data=update_data,
        )

        updated_note = self.note_repository.update(
            note,
        )

        logger.info(
            "%s | success | note_id=%s owner_id=%s",
            self.LOG_UPDATE,
            updated_note.id,
            updated_note.owner_id,
        )

        return self._build_note_response(
            updated_note,
        )

    # =========================================================================
    # Delete Operations
    # =========================================================================

    def delete_note(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> None:
        """
        Delete an existing authorized note.

        Administrators may delete any note.

        Regular users may delete only their own notes.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            self.LOG_DELETE,
            note_id,
            current_user.id,
        )

        note = self._get_authorized_note(
            current_user=current_user,
            note_id=note_id,
        )

        self.note_repository.delete(
            note,
        )

        logger.info(
            "%s | success | note_id=%s owner_id=%s",
            self.LOG_DELETE,
            note.id,
            note.owner_id,
        )

    # =========================================================================
    # List / Search Operations
    # =========================================================================

    def get_notes(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        search: str | None = None,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve notes visible to the authenticated user.

        Administrators receive global note scope.

        Regular users receive owner-specific note scope.

        Parameters
        ----------
        current_user:
            Authenticated user.

        page:
            One-based page number.

        limit:
            Number of records per page.

        search:
            Optional title/content search query.

        sort_by:
            newest | oldest | title

        Returns
        -------
        PaginationResult
            Tuple containing total count and serialized notes.
        """
        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        owner_id = self._owner_scope(
            current_user,
        )

        has_search = bool(
            search and search.strip(),
        )

        logger.info(
            "%s | user_id=%s page=%s limit=%s search_applied=%s "
            "sort=%s admin=%s",
            self.LOG_SEARCH,
            current_user.id,
            normalized_page,
            normalized_limit,
            has_search,
            normalized_sort,
            self._is_admin(current_user),
        )

        if has_search:
            notes = self.note_repository.search(
                owner_id=owner_id,
                query=search.strip(),
                skip=offset,
                limit=normalized_limit,
                sort_by=normalized_sort,
            )

            total = self.note_repository.search_count(
                owner_id=owner_id,
                query=search.strip(),
            )

        elif owner_id is None:
            notes = self.note_repository.list_all(
                skip=offset,
                limit=normalized_limit,
                sort_by=normalized_sort,
            )

            total = self.note_repository.count_all()

        else:
            notes = self.note_repository.list_by_owner(
                owner_id,
                skip=offset,
                limit=normalized_limit,
                sort_by=normalized_sort,
            )

            total = self.note_repository.count_by_owner(
                owner_id,
            )

        logger.info(
            "%s | success | returned=%s total=%s",
            self.LOG_SEARCH,
            len(notes),
            total,
        )

        return (
            total,
            self._build_note_response_collection(
                notes,
            ),
        )

    # =========================================================================
    # Recent Notes
    # =========================================================================

    def get_recent_notes(
        self,
        *,
        current_user: User,
        limit: int = DEFAULT_PAGE_SIZE,
    ) -> list[NoteResponse]:
        """
        Retrieve recently created notes visible to the current user.

        Administrators receive recent notes across the entire system.

        Regular users receive recent notes belonging to themselves.

        Parameters
        ----------
        current_user:
            Authenticated user.

        limit:
            Maximum number of notes.

        Returns
        -------
        list[NoteResponse]
            Recent notes.
        """
        normalized_limit = self._normalize_limit(
            limit,
        )

        logger.info(
            "%s | recent | user_id=%s limit=%s",
            self.LOG_SEARCH,
            current_user.id,
            normalized_limit,
        )

        if self._is_admin(current_user):
            notes = self.note_repository.list_all(
                skip=0,
                limit=normalized_limit,
                sort_by=SORT_NEWEST,
            )
        else:
            notes = self.note_repository.list_recent_by_owner(
                current_user.id,
                limit=normalized_limit,
            )

        return self._build_note_response_collection(
            notes,
        )

    # =========================================================================
    # Open Library Operations
    # =========================================================================

    def get_notes_with_book_reference(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve notes linked to an Open Library book reference.

        Administrators receive global scope.

        Regular users receive owner-specific scope.

        Parameters
        ----------
        current_user:
            Authenticated user.

        page:
            One-based page number.

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | title

        Returns
        -------
        PaginationResult
            Total count and serialized notes.
        """
        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        owner_id = self._owner_scope(
            current_user,
        )

        logger.info(
            "%s | book-reference notes | user_id=%s page=%s limit=%s",
            self.LOG_SEARCH,
            current_user.id,
            normalized_page,
            normalized_limit,
        )

        notes = self.note_repository.list_with_book_reference(
            owner_id=owner_id,
            skip=offset,
            limit=normalized_limit,
            sort_by=normalized_sort,
        )

        # The repository provides the exact count query. Using len(notes)
        # would incorrectly report only the current page size.
        total = self.note_repository.count_with_book_reference(
            owner_id=owner_id,
        )

        return (
            total,
            self._build_note_response_collection(
                notes,
            ),
        )

    # =========================================================================
    # Administrator Operations
    # =========================================================================

    def get_all_notes_admin(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_ADMIN_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve all notes in the system.

        Administrator authorization is required.

        Parameters
        ----------
        current_user:
            Authenticated user.

        page:
            One-based page number.

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | title

        Returns
        -------
        PaginationResult
            Total system note count and serialized notes.

        Raises
        ------
        AuthorizationError
            If the current user is not an administrator.
        """
        self.ensure_admin(
            current_user,
        )

        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        logger.info(
            "%s | admin_id=%s page=%s limit=%s sort=%s",
            self.LOG_ADMIN,
            current_user.id,
            normalized_page,
            normalized_limit,
            normalized_sort,
        )

        notes = self.note_repository.list_all(
            skip=offset,
            limit=normalized_limit,
            sort_by=normalized_sort,
        )

        total = self.note_repository.count_all()

        logger.info(
            "%s | success | returned=%s total=%s",
            self.LOG_ADMIN,
            len(notes),
            total,
        )

        return (
            total,
            self._build_note_response_collection(
                notes,
            ),
        )

    # =========================================================================
    # Statistics
    # =========================================================================

    def get_statistics(
        self,
        *,
        current_user: User,
    ) -> StatisticsResult:
        """
        Retrieve note statistics.

        Administrators receive global statistics.

        Regular users receive statistics limited to their own notes.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        StatisticsResult
            Note statistics.
        """
        logger.info(
            "%s | user_id=%s admin=%s",
            self.LOG_STATISTICS,
            current_user.id,
            self._is_admin(current_user),
        )

        owner_id = self._owner_scope(
            current_user,
        )

        statistics: StatisticsResult = {
            "total_notes": (
                self.note_repository.count_all()
                if owner_id is None
                else self.note_repository.count_by_owner(
                    owner_id,
                )
            ),
            "converted_notes": (
                self.note_repository.count_converted(
                    owner_id=owner_id,
                )
            ),
            "pending_conversion": (
                self.note_repository.count_convertible_to_task(
                    owner_id=owner_id,
                )
            ),
            "book_reference_notes": (
                self.note_repository.count_with_book_reference(
                    owner_id=owner_id,
                )
            ),
        }

        logger.info(
            "%s | success | user_id=%s",
            self.LOG_STATISTICS,
            current_user.id,
        )

        return statistics

    # =========================================================================
    # Note → NestJS Task Conversion
    # =========================================================================

    def convert_note_to_task(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> NoteToTaskResponse:
        """
        Prepare a note for NestJS task synchronization.

        The current architecture marks the note as converted in FastAPI.

        Actual task creation belongs to the NestJS Task service and should be
        performed through a future dedicated integration/event mechanism.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        NoteToTaskResponse
            Conversion preparation response.

        Raises
        ------
        NoteNotFoundError
            If the note does not exist.

        AuthorizationError
            If the current user cannot access the note.

        NoteAlreadyConvertedError
            If the note has already been converted.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            self.LOG_CONVERT,
            note_id,
            current_user.id,
        )

        note = self._get_authorized_note(
            current_user=current_user,
            note_id=note_id,
        )

        if note.is_converted_to_task:
            logger.warning(
                "%s | already converted | note_id=%s",
                self.LOG_CONVERT,
                note.id,
            )

            raise NoteAlreadyConvertedError()

        updated_note = self.note_repository.mark_as_converted(
            note,
        )

        logger.info(
            "%s | prepared | note_id=%s owner_id=%s",
            self.LOG_CONVERT,
            updated_note.id,
            updated_note.owner_id,
        )

        return NoteToTaskResponse(
            note_id=updated_note.id,
            task_created=False,
            message=(
                "Task conversion request prepared successfully. "
                "NestJS synchronization is pending."
            ),
        )

    # =========================================================================
    # Convertible Notes
    # =========================================================================

    def get_convertible_notes(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve notes that have not yet been converted to tasks.

        Administrators receive global scope.

        Regular users receive owner-specific scope.

        Parameters
        ----------
        current_user:
            Authenticated user.

        page:
            One-based page number.

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | title

        Returns
        -------
        PaginationResult
            Total convertible notes and serialized notes.
        """
        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        owner_id = self._owner_scope(
            current_user,
        )

        logger.info(
            "%s | convertible | user_id=%s page=%s limit=%s",
            self.LOG_SEARCH,
            current_user.id,
            normalized_page,
            normalized_limit,
        )

        notes = self.note_repository.list_convertible_to_task(
            owner_id=owner_id,
            skip=offset,
            limit=normalized_limit,
            sort_by=normalized_sort,
        )

        total = self.note_repository.count_convertible_to_task(
            owner_id=owner_id,
        )

        return (
            total,
            self._build_note_response_collection(
                notes,
            ),
        )

    # =========================================================================
    # Converted Notes
    # =========================================================================

    def get_converted_notes(
        self,
        *,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve notes that have already been converted to tasks.

        Administrators receive global scope.

        Regular users receive owner-specific scope.

        Parameters
        ----------
        current_user:
            Authenticated user.

        page:
            One-based page number.

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | title

        Returns
        -------
        PaginationResult
            Total converted notes and serialized notes.
        """
        normalized_page = self._normalize_page(
            page,
        )

        normalized_limit = self._normalize_limit(
            limit,
        )

        normalized_sort = self._normalize_sort_order(
            sort_by,
        )

        offset = self._calculate_offset(
            page=normalized_page,
            limit=normalized_limit,
        )

        owner_id = self._owner_scope(
            current_user,
        )

        logger.info(
            "%s | converted | user_id=%s page=%s limit=%s",
            self.LOG_SEARCH,
            current_user.id,
            normalized_page,
            normalized_limit,
        )

        notes = self.note_repository.list_converted_to_task(
            owner_id=owner_id,
            skip=offset,
            limit=normalized_limit,
            sort_by=normalized_sort,
        )

        total = self.note_repository.count_converted(
            owner_id=owner_id,
        )

        return (
            total,
            self._build_note_response_collection(
                notes,
            ),
        )

    # =========================================================================
    # Utility Operations
    # =========================================================================

    def note_exists(
        self,
        note_id: int,
    ) -> bool:
        """
        Determine whether a note exists.

        This is a persistence existence check and does not perform
        authorization.

        Parameters
        ----------
        note_id:
            Note identifier.

        Returns
        -------
        bool
            True if the note exists.
        """
        return self.note_repository.exists(
            note_id,
        )

    def get_note_model(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> Note:
        """
        Retrieve an authorized Note ORM model.

        This method is intended for internal application workflows that
        genuinely require the ORM model.

        It must not be used as a replacement for normal API response schemas.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        Note
            Authorized Note ORM model.
        """
        return self._get_authorized_note(
            current_user=current_user,
            note_id=note_id,
        )