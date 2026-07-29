"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.services.note_service
Author: Enterprise Engineering Team
Architecture: Clean Architecture | Service Layer
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

This service represents the business layer between the API routers and the
repository layer. It coordinates validation, authorization, ownership checks,
data transformation, business rules, logging, and future cross-service
communication while delegating all persistence operations to the
``NoteRepository``.

The service intentionally contains **no SQLAlchemy query logic**. Database
interaction is fully delegated to the repository layer in accordance with
Clean Architecture and the Single Responsibility Principle (SRP).

Responsibilities
----------------
✓ Create notes

✓ Retrieve notes

✓ Update notes

✓ Delete notes

✓ Search notes

✓ Pagination

✓ Ownership validation

✓ Administrator authorization

✓ Statistics

✓ Open Library integration support

✓ NestJS task conversion support

✓ DTO ↔ ORM transformation

✓ Structured logging

✓ Business validation

Architecture
------------
Client
    │
    ▼
FastAPI Router
    │
    ▼
NoteService
    │
    ▼
NoteRepository
    │
    ▼
PostgreSQL

The service never performs direct SQL operations.

Repository ownership
--------------------
This service delegates persistence to:

    app.repositories.note_repository.NoteRepository

The repository is responsible for:

• CRUD operations
• Search
• Pagination
• Counting
• Filtering
• Sorting
• Transaction persistence

The service is responsible for:

• Authorization
• Ownership validation
• Business rules
• Input normalization
• Response mapping
• Cross-module orchestration

Microservice Responsibilities
-----------------------------
FastAPI owns:

• Authentication
• Users
• Notes
• Open Library Integration

NestJS owns:

• Tasks
• Categories
• Tags
• Notifications
• Dashboard
• Analytics
• Activity Logs

This ownership boundary must never be violated.

Design Principles
-----------------
• SOLID

• Clean Architecture

• Repository Pattern

• Dependency Inversion

• Single Responsibility Principle

• Explicit typing

• Stateless service methods

• Structured logging

• Centralized validation

• Centralized exception handling

• Production-ready implementation

Thread Safety
-------------
This service is stateless.

No mutable shared state is maintained between requests.

Every request receives its own SQLAlchemy session through dependency
injection.

Future Extension Points
-----------------------
The architecture intentionally allows seamless integration of:

• Distributed caching

• Audit logging

• Domain events

• Message queues

• Background workers

• Metrics collection

• OpenTelemetry tracing

• Event sourcing

without changing the public service API.

Notes
-----
Business logic belongs here.

Persistence belongs in repositories.

HTTP transport concerns belong in routers.

Copyright
---------
Enterprise Team Productivity Platform.
All Rights Reserved.
===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from typing import Final, TypeAlias

# =============================================================================
# Third-Party Imports
# =============================================================================

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

# =============================================================================
# Application Core Imports
# =============================================================================

from app.core.constants import UserRole
from app.core.logging import get_logger

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
# Module Logger
# =============================================================================

logger = get_logger(__name__)

# =============================================================================
# Note Service
# =============================================================================


class NoteService:
    """
    Enterprise service responsible for all note-related business operations.

    This service represents the business layer between the FastAPI routing
    layer and the persistence layer. It coordinates business rules,
    authorization, validation, normalization, response transformation,
    logging, and cross-service orchestration while delegating all database
    operations to ``NoteRepository``.

    The service is intentionally implemented as a stateless collection of
    static methods. Every request receives its own SQLAlchemy session through
    FastAPI dependency injection, ensuring thread safety and predictable
    request lifecycles.

    ------------------------------------------------------------------------
    Architecture
    ------------------------------------------------------------------------

        HTTP Request
              │
              ▼
        FastAPI Router
              │
              ▼
        Authentication
              │
              ▼
        Dependency Injection
              │
              ▼
        NoteService
              │
              ▼
        NoteRepository
              │
              ▼
        SQLAlchemy ORM
              │
              ▼
        PostgreSQL

    Routers
    -------
    Responsible for:

    • Request parsing
    • Dependency injection
    • Authentication dependencies
    • Calling service methods
    • Returning API responses

    This service
    ------------
    Responsible for:

    • Business logic
    • Ownership validation
    • Administrator authorization
    • Input normalization
    • Business rule enforcement
    • DTO ↔ ORM mapping
    • Pagination orchestration
    • Search orchestration
    • Statistics generation
    • Structured logging
    • Cross-module coordination

    Repository
    ----------
    Responsible for:

    • SQLAlchemy queries
    • CRUD operations
    • Search
    • Pagination
    • Filtering
    • Sorting
    • Aggregate queries
    • Transaction persistence

    ------------------------------------------------------------------------
    Responsibilities
    ------------------------------------------------------------------------

    ✓ Create notes

    ✓ Retrieve notes

    ✓ Update notes

    ✓ Delete notes

    ✓ Search notes

    ✓ Pagination

    ✓ Sorting

    ✓ Ownership validation

    ✓ Administrator authorization

    ✓ Statistics

    ✓ Open Library integration support

    ✓ NestJS task conversion support

    ✓ Response mapping

    ✓ Business validation

    ✓ Audit-ready logging

    ✓ Future event publishing support

    ------------------------------------------------------------------------
    Microservice Ownership
    ------------------------------------------------------------------------

    FastAPI owns:

    • Authentication
    • Users
    • Notes
    • Open Library Integration

    NestJS owns:

    • Tasks
    • Categories
    • Tags
    • Notifications
    • Dashboard
    • Analytics
    • Activity Logs

    This service must never directly implement NestJS-owned business logic.
    Interaction with those services should occur through API clients,
    asynchronous messaging, or dedicated integration layers.

    ------------------------------------------------------------------------
    Design Principles
    ------------------------------------------------------------------------

    This implementation follows:

    • SOLID principles

    • Clean Architecture

    • Repository Pattern

    • Service Layer Pattern

    • Dependency Inversion

    • Separation of Concerns

    • Stateless Design

    • Explicit Type Hints

    • Structured Logging

    • Enterprise Documentation Standards

    • Production-Ready Coding Standards

    ------------------------------------------------------------------------
    Thread Safety
    ------------------------------------------------------------------------

    The service contains no mutable shared state.

    Every request operates on an independent SQLAlchemy session supplied by
    FastAPI dependency injection.

    This makes the service naturally thread-safe and suitable for highly
    concurrent ASGI deployments.

    ------------------------------------------------------------------------
    Future Extension Points
    ------------------------------------------------------------------------

    The architecture intentionally supports future enterprise capabilities,
    including:

    • Distributed caching

    • Audit logging

    • Domain events

    • Event sourcing

    • Background jobs

    • OpenTelemetry tracing

    • Metrics collection

    • Message queues

    • Search indexing

    • Full-text search

    • AI-assisted note processing

    • Open Library synchronization

    • NestJS task synchronization

    These capabilities can be introduced without changing the public API of
    this service.

    ------------------------------------------------------------------------
    Class-Level Constants
    ------------------------------------------------------------------------
    """

    # =====================================================================
    # Service Metadata
    # =====================================================================

    SERVICE_NAME: Final[str] = "NoteService"

    SERVICE_VERSION: Final[str] = "1.0.0"

    DOMAIN_NAME: Final[str] = "notes"

    # =====================================================================
    # Pagination Defaults
    # =====================================================================

    DEFAULT_PAGE: Final[int] = DEFAULT_PAGE

    DEFAULT_PAGE_SIZE: Final[int] = DEFAULT_PAGE_SIZE

    DEFAULT_ADMIN_PAGE_SIZE: Final[int] = DEFAULT_ADMIN_PAGE_SIZE

    # =====================================================================
    # Sorting Defaults
    # =====================================================================

    DEFAULT_SORT_ORDER: Final[str] = DEFAULT_SORT_ORDER

    SUPPORTED_SORT_OPTIONS: Final[frozenset[str]] = (
        SUPPORTED_SORT_OPTIONS
    )

    # =====================================================================
    # Authorization Constants
    # =====================================================================

    ADMIN_ROLE: Final[str] = UserRole.ADMIN.value

    # =====================================================================
    # Logging Message Prefixes
    # =====================================================================

    LOG_CREATE: Final[str] = "Create Note"

    LOG_READ: Final[str] = "Read Note"

    LOG_UPDATE: Final[str] = "Update Note"

    LOG_DELETE: Final[str] = "Delete Note"

    LOG_SEARCH: Final[str] = "Search Notes"

    LOG_STATISTICS: Final[str] = "Note Statistics"

    LOG_CONVERT: Final[str] = "Convert Note"

    # =====================================================================
    # Private Helper Methods
    # =====================================================================

    # Repository helper methods

    # Authorization helper methods

    # Validation helper methods

    # Response mapping helpers

    # Pagination helpers

    # Search helpers

    # Statistics helpers

    # Conversion helpers

    # Internal utilities
    
        # =====================================================================
    # Repository Helpers
    # =====================================================================

    @staticmethod
    def _repository(
        db: Session,
    ) -> NoteRepository:
        """
        Create a NoteRepository instance.

        This method centralizes repository construction so that all service
        methods obtain a consistent repository implementation.

        Parameters
        ----------
        db:
            Active SQLAlchemy database session.

        Returns
        -------
        NoteRepository
            Repository instance bound to the supplied database session.
        """
        return NoteRepository(db)

    # =====================================================================
    # Response Mapping Helpers
    # =====================================================================

    @staticmethod
    def _response(
        note: Note,
    ) -> NoteResponse:
        """
        Convert a Note ORM model into a NoteResponse schema.

        Parameters
        ----------
        note:
            SQLAlchemy Note model.

        Returns
        -------
        NoteResponse
            Serialized response model.
        """
        return NoteResponse.model_validate(note)

    @staticmethod
    def _response_collection(
        notes: list[Note],
    ) -> list[NoteResponse]:
        """
        Convert a collection of ORM models into response schemas.

        Parameters
        ----------
        notes:
            Collection of SQLAlchemy Note models.

        Returns
        -------
        list[NoteResponse]
            Serialized response models.
        """
        return [
            NoteService._response(note)
            for note in notes
        ]

    # =====================================================================
    # Authorization Helpers
    # =====================================================================

    @staticmethod
    def _is_admin(
        user: User,
    ) -> bool:
        """
        Determine whether the authenticated user has administrator
        privileges.

        Parameters
        ----------
        user:
            Authenticated user.

        Returns
        -------
        bool
            True if the user is an administrator.
        """
        return user.role == NoteService.ADMIN_ROLE

    # =====================================================================
    # Helper Regions
    # =====================================================================

    # _require_note()
    # _validate_access()
    # _owned_note()

    # =====================================================================
    # Validation Helpers
    # =====================================================================

    # _normalize_update_data()

    # =====================================================================
    # Pagination Helpers
    # =====================================================================

    # _calculate_offset()

    # =====================================================================
    # Statistics Helpers
    # =====================================================================

    # _build_statistics()

    # =====================================================================
    # Conversion Helpers
    # =====================================================================

    # _prepare_task_conversion()

    # =====================================================================
    # CRUD Operations
    # =====================================================================
    
        # =====================================================================
    # Authorization & Ownership Helpers
    # =====================================================================

    @staticmethod
    def _require_note(
        *,
        repository: NoteRepository,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note by its identifier.

        This helper centralizes note retrieval and guarantees that a valid
        ORM object is returned. If the requested note does not exist, a
        404 error is raised.

        Parameters
        ----------
        repository:
            Active NoteRepository instance.

        note_id:
            Identifier of the requested note.

        Returns
        -------
        Note
            Existing Note ORM model.

        Raises
        ------
        HTTPException
            Raised when the note cannot be found.
        """
        logger.info(
            "%s | Retrieving note | note_id=%s",
            NoteService.LOG_READ,
            note_id,
        )

        note = repository.get_by_id(note_id)

        if note is None:
            logger.warning(
                "%s | Note not found | note_id=%s",
                NoteService.LOG_READ,
                note_id,
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found.",
            )

        return note

    @staticmethod
    def _validate_access(
        *,
        current_user: User,
        note: Note,
    ) -> None:
        """
        Validate that the authenticated user may access the supplied note.

        Administrators may access every note.

        Regular users may access only notes that they own.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note:
            Note ORM model.

        Raises
        ------
        HTTPException
            Raised when access is denied.
        """
        if NoteService._is_admin(current_user):
            return

        if note.owner_id == current_user.id:
            return

        logger.warning(
            "%s | Access denied | user_id=%s owner_id=%s note_id=%s",
            NoteService.LOG_READ,
            current_user.id,
            note.owner_id,
            note.id,
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this note.",
        )

    @staticmethod
    def _owned_note(
        *,
        repository: NoteRepository,
        current_user: User,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note and validate ownership.

        This helper combines retrieval and authorization into a single
        reusable workflow used throughout the service.

        Parameters
        ----------
        repository:
            Active NoteRepository instance.

        current_user:
            Authenticated user.

        note_id:
            Requested note identifier.

        Returns
        -------
        Note
            Authorized Note ORM model.

        Raises
        ------
        HTTPException
            404 if the note does not exist.

        HTTPException
            403 if access is denied.
        """
        note = NoteService._require_note(
            repository=repository,
            note_id=note_id,
        )

        NoteService._validate_access(
            current_user=current_user,
            note=note,
        )

        return note

    # =====================================================================
    # End Authorization Helpers
    # =====================================================================
        # =====================================================================
    # Validation Helpers
    # =====================================================================

    @staticmethod
    def _normalize_update_data(
        note_data: NoteUpdate,
    ) -> dict[str, object]:
        """
        Normalize update payload before persistence.

        This helper performs the following operations:

        • Removes unset fields
        • Removes None values
        • Prevents modification of protected fields
        • Trims string values

        Parameters
        ----------
        note_data:
            Incoming update schema.

        Returns
        -------
        dict[str, object]
            Sanitized update payload.
        """
        update_data = note_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        # Prevent modification of immutable fields.
        protected_fields = {
            "id",
            "owner_id",
            "created_at",
            "updated_at",
        }

        for field in protected_fields:
            update_data.pop(field, None)

        # Normalize string values.
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
        Apply normalized update data to a Note model.

        Parameters
        ----------
        note:
            Existing Note ORM model.

        update_data:
            Sanitized update payload.

        Returns
        -------
        Note
            Updated ORM model.
        """
        for field, value in update_data.items():
            if hasattr(note, field):
                setattr(note, field, value)

        return note

    # =====================================================================
    # Pagination Helpers
    # =====================================================================

    @staticmethod
    def _calculate_offset(
        *,
        page: int,
        limit: int,
    ) -> int:
        """
        Calculate SQL pagination offset.

        Parameters
        ----------
        page:
            One-based page number.

        limit:
            Records per page.

        Returns
        -------
        int
            SQL OFFSET value.
        """
        return max(page - 1, 0) * limit

    # =====================================================================
    # Search Helpers
    # =====================================================================

    @staticmethod
    def _owner_scope(
        current_user: User,
    ) -> int | None:
        """
        Determine the owner scope for repository queries.

        Administrators operate on all notes and therefore return ``None``.
        Regular users are restricted to their own records.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        int | None
            Owner identifier or ``None`` for administrator scope.
        """
        if NoteService._is_admin(current_user):
            return None

        return current_user.id

    # =====================================================================
    # Statistics Helpers
    # =====================================================================

    @staticmethod
    def _statistics_scope(
        current_user: User,
    ) -> int | None:
        """
        Determine the owner scope used when generating statistics.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        int | None
            Owner identifier or ``None`` for global statistics.
        """
        return NoteService._owner_scope(current_user)

    # =====================================================================
    # End Validation & Pagination Helpers
    # =====================================================================
        # =====================================================================
    # Create Operations
    # =====================================================================

    @staticmethod
    def create_note(
        *,
        db: Session,
        current_user: User,
        note_data: NoteCreate,
    ) -> NoteResponse:
        """
        Create a new note for the authenticated user.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

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
            "%s | user_id=%s email=%s",
            NoteService.LOG_CREATE,
            current_user.id,
            current_user.email,
        )

        repository = NoteService._repository(db)

        note = Note(
            title=note_data.title.strip(),
            content=note_data.content.strip(),
            owner_id=current_user.id,
        )

        optional_fields = (
            "book_reference_id",
            "book_title",
            "book_author",
        )

        for field in optional_fields:
            if hasattr(note_data, field):
                setattr(
                    note,
                    field,
                    getattr(note_data, field),
                )

        created_note = repository.create(note)

        logger.info(
            "%s | note_id=%s owner_id=%s",
            NoteService.LOG_CREATE,
            created_note.id,
            created_note.owner_id,
        )

        return NoteService._response(created_note)

    # =====================================================================
    # Read Operations
    # =====================================================================

    @staticmethod
    def get_note_by_id(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> NoteResponse:
        """
        Retrieve a single note.

        Administrators may retrieve any note.

        Regular users may retrieve only notes they own.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Requested note identifier.

        Returns
        -------
        NoteResponse
            Serialized note.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            NoteService.LOG_READ,
            note_id,
            current_user.id,
        )

        repository = NoteService._repository(db)

        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        logger.info(
            "%s | Success | note_id=%s",
            NoteService.LOG_READ,
            note.id,
        )

        return NoteService._response(note)

    @staticmethod
    def note_exists(
        *,
        db: Session,
        note_id: int,
    ) -> bool:
        """
        Determine whether a note exists.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        note_id:
            Note identifier.

        Returns
        -------
        bool
            True if the note exists, otherwise False.
        """
        repository = NoteService._repository(db)

        return repository.exists(note_id)

    # =====================================================================
    # End Create & Read Operations
    # =====================================================================
        # =====================================================================
    # Update Operations
    # =====================================================================

    @staticmethod
    def update_note(
        *,
        db: Session,
        current_user: User,
        note_id: int,
        note_data: NoteUpdate,
    ) -> NoteResponse:
        """
        Update an existing note.

        Authorization
        -------------
        • Administrators may update any note.
        • Regular users may update only their own notes.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Identifier of the note.

        note_data:
            Updated note payload.

        Returns
        -------
        NoteResponse
            Updated note.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            NoteService.LOG_UPDATE,
            note_id,
            current_user.id,
        )

        repository = NoteService._repository(db)

        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        update_data = NoteService._normalize_update_data(
            note_data,
        )

        note = NoteService._apply_updates(
            note=note,
            update_data=update_data,
        )

        updated_note = repository.update(note)

        logger.info(
            "%s | Success | note_id=%s owner_id=%s",
            NoteService.LOG_UPDATE,
            updated_note.id,
            updated_note.owner_id,
        )

        return NoteService._response(updated_note)

    # =====================================================================
    # Delete Operations
    # =====================================================================

    @staticmethod
    def delete_note(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> None:
        """
        Delete an existing note.

        Authorization
        -------------
        • Administrators may delete any note.
        • Regular users may delete only their own notes.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Identifier of the note to delete.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            NoteService.LOG_DELETE,
            note_id,
            current_user.id,
        )

        repository = NoteService._repository(db)

        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        repository.delete(note)

        logger.info(
            "%s | Success | note_id=%s owner_id=%s",
            NoteService.LOG_DELETE,
            note.id,
            note.owner_id,
        )

        return None

    # =====================================================================
    # End CRUD Operations
    # =====================================================================
        # =====================================================================
    # List Operations
    # =====================================================================

    @staticmethod
    def get_notes(
        *,
        db: Session,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        search: str | None = None,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve notes visible to the authenticated user.

        Administrators receive all notes.

        Regular users receive only their own notes.

        Supports:

        • Pagination

        • Search

        • Sorting

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        page:
            One-based page number.

        limit:
            Records per page.

        search:
            Optional search keyword.

        sort_by:
            Sort option.

        Returns
        -------
        PaginationResult
            Tuple containing total record count and serialized notes.
        """
        logger.info(
            "%s | user_id=%s page=%s limit=%s search=%s sort=%s",
            NoteService.LOG_SEARCH,
            current_user.id,
            page,
            limit,
            search,
            sort_by,
        )

        repository = NoteService._repository(db)

        owner_id = NoteService._owner_scope(
            current_user,
        )

        offset = NoteService._calculate_offset(
            page=page,
            limit=limit,
        )

        if search:
            notes = repository.search(
                owner_id=owner_id,
                query=search,
                skip=offset,
                limit=limit,
                sort_by=sort_by,
            )

            total = repository.search_count(
                owner_id=owner_id,
                query=search,
            )

        else:
            if owner_id is None:
                notes = repository.list_all(
                    skip=offset,
                    limit=limit,
                    sort_by=sort_by,
                )

                total = repository.count_all()

            else:
                notes = repository.list_by_owner(
                    owner_id,
                    skip=offset,
                    limit=limit,
                    sort_by=sort_by,
                )

                total = repository.count_by_owner(
                    owner_id,
                )

        logger.info(
            "%s | returned=%s total=%s",
            NoteService.LOG_SEARCH,
            len(notes),
            total,
        )

        return (
            total,
            NoteService._response_collection(notes),
        )

    # =====================================================================
    # Recent Notes
    # =====================================================================

    @staticmethod
    def get_recent_notes(
        *,
        db: Session,
        current_user: User,
        limit: int = DEFAULT_PAGE_SIZE,
    ) -> list[NoteResponse]:
        """
        Retrieve the most recently created notes.

        Administrators receive recent notes across the system.

        Regular users receive only their own recent notes.
        """
        logger.info(
            "%s | recent limit=%s user_id=%s",
            NoteService.LOG_SEARCH,
            limit,
            current_user.id,
        )

        repository = NoteService._repository(db)

        owner_id = NoteService._owner_scope(
            current_user,
        )

        if owner_id is None:
            notes = repository.list_all(
                skip=0,
                limit=limit,
                sort_by=SORT_NEWEST,
            )
        else:
            notes = repository.list_recent_by_owner(
                owner_id,
                limit=limit,
            )

        logger.info(
            "%s | recent returned=%s",
            NoteService.LOG_SEARCH,
            len(notes),
        )

        return NoteService._response_collection(
            notes,
        )

    # =====================================================================
    # End List Operations
    # =====================================================================
        # =====================================================================
    # Administrator Operations
    # =====================================================================

    @staticmethod
    def ensure_admin(
        current_user: User,
    ) -> User:
        """
        Ensure the authenticated user has administrator privileges.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        User
            Authenticated administrator.

        Raises
        ------
        HTTPException
            If the authenticated user is not an administrator.
        """
        if NoteService._is_admin(current_user):
            return current_user

        logger.warning(
            "Administrator access denied | user_id=%s email=%s",
            current_user.id,
            current_user.email,
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator privileges are required.",
        )

    @staticmethod
    def get_all_notes_admin(
        *,
        db: Session,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_ADMIN_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve every note in the system.

        Administrator access is required.
        """
        NoteService.ensure_admin(current_user)

        logger.info(
            "%s | admin_id=%s page=%s limit=%s",
            NoteService.LOG_SEARCH,
            current_user.id,
            page,
            limit,
        )

        repository = NoteService._repository(db)

        offset = NoteService._calculate_offset(
            page=page,
            limit=limit,
        )

        notes = repository.list_all(
            skip=offset,
            limit=limit,
            sort_by=sort_by,
        )

        total = repository.count_all()

        logger.info(
            "%s | admin returned=%s total=%s",
            NoteService.LOG_SEARCH,
            len(notes),
            total,
        )

        return (
            total,
            NoteService._response_collection(notes),
        )

    # =====================================================================
    # Statistics
    # =====================================================================

    @staticmethod
    def get_statistics(
        *,
        db: Session,
        current_user: User,
    ) -> StatisticsResult:
        """
        Retrieve note statistics.

        Administrators receive global statistics.

        Regular users receive statistics limited to their own notes.
        """
        logger.info(
            "%s | user_id=%s",
            NoteService.LOG_STATISTICS,
            current_user.id,
        )

        repository = NoteService._repository(db)

        owner_id = NoteService._statistics_scope(
            current_user,
        )

        if owner_id is None:
            statistics = {
                "total_notes": repository.count_all(),
                "converted_notes": repository.count_converted(
                    owner_id=None,
                ),
                "pending_conversion": (
                    repository.count_convertible_to_task(
                        owner_id=None,
                    )
                ),
                "book_reference_notes": (
                    repository.count_with_book_reference(
                        owner_id=None,
                    )
                ),
            }

        else:
            statistics = {
                "total_notes": repository.count_by_owner(
                    owner_id,
                ),
                "converted_notes": repository.count_converted(
                    owner_id=owner_id,
                ),
                "pending_conversion": (
                    repository.count_convertible_to_task(
                        owner_id=owner_id,
                    )
                ),
                "book_reference_notes": (
                    repository.count_with_book_reference(
                        owner_id=owner_id,
                    )
                ),
            }

        logger.info(
            "%s | completed user_id=%s",
            NoteService.LOG_STATISTICS,
            current_user.id,
        )

        return statistics

    # =====================================================================
    # End Administrator Operations
    # =====================================================================
        # =====================================================================
    # Note Conversion Operations
    # =====================================================================

    @staticmethod
    def convert_note_to_task(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> NoteToTaskResponse:
        """
        Mark a note as converted to a NestJS task.

        This operation prepares the note for synchronization with the
        NestJS Task microservice. The actual task creation is performed
        by the NestJS service.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Identifier of the note.

        Returns
        -------
        NoteToTaskResponse
            Conversion status.
        """
        logger.info(
            "%s | note_id=%s user_id=%s",
            NoteService.LOG_CONVERT,
            note_id,
            current_user.id,
        )

        repository = NoteService._repository(db)

        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        if note.is_converted_to_task:
            logger.warning(
                "%s | already converted | note_id=%s",
                NoteService.LOG_CONVERT,
                note.id,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Note has already been converted to a task.",
            )

        updated_note = repository.mark_as_converted(
            note,
        )

        logger.info(
            "%s | completed | note_id=%s owner_id=%s",
            NoteService.LOG_CONVERT,
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

    # =====================================================================
    # Internal Model Helpers
    # =====================================================================

    @staticmethod
    def get_note_model(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> Note:
        """
        Retrieve the underlying ORM model.

        This helper is intended for internal service-to-service usage where
        direct ORM access is required instead of serialized DTOs.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Requested note identifier.

        Returns
        -------
        Note
            Authorized SQLAlchemy ORM model.
        """
        repository = NoteService._repository(db)

        return NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

    # =====================================================================
    # Convertible Notes
    # =====================================================================

    @staticmethod
    def get_convertible_notes(
        *,
        db: Session,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve notes that have not yet been converted into tasks.
        """
        repository = NoteService._repository(db)

        owner_id = NoteService._owner_scope(
            current_user,
        )

        offset = NoteService._calculate_offset(
            page=page,
            limit=limit,
        )

        notes = repository.list_convertible_to_task(
            owner_id=owner_id,
            skip=offset,
            limit=limit,
            sort_by=sort_by,
        )

        total = repository.count_convertible_to_task(
            owner_id=owner_id,
        )

        return (
            total,
            NoteService._response_collection(
                notes,
            ),
        )

    # =====================================================================
    # Converted Notes
    # =====================================================================

    @staticmethod
    def get_converted_notes(
        *,
        db: Session,
        current_user: User,
        page: int = DEFAULT_PAGE,
        limit: int = DEFAULT_PAGE_SIZE,
        sort_by: str = DEFAULT_SORT_ORDER,
    ) -> PaginationResult:
        """
        Retrieve notes that have already been converted into tasks.
        """
        repository = NoteService._repository(db)

        owner_id = NoteService._owner_scope(
            current_user,
        )

        offset = NoteService._calculate_offset(
            page=page,
            limit=limit,
        )

        notes = repository.list_converted_to_task(
            owner_id=owner_id,
            skip=offset,
            limit=limit,
            sort_by=sort_by,
        )

        total = repository.count_converted(
            owner_id=owner_id,
        )

        return (
            total,
            NoteService._response_collection(
                notes,
            ),
        )
