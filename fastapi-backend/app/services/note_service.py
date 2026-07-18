"""
==========================================================
Note Service
==========================================================

Business logic for note management.

Responsibilities
----------------
✓ Create notes
✓ Retrieve notes
✓ Update notes
✓ Delete notes
✓ Search notes
✓ Pagination
✓ Ownership validation
✓ Administrator access
✓ Open Library integration support
✓ NestJS task conversion support

This service contains business logic only.

Database access is delegated to NoteRepository.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Pydantic v2
- Docker
- Alembic
==========================================================
"""

from __future__ import annotations

from fastapi import HTTPException, status

from app.core.constants import UserRole
from app.core.logging import get_logger
from app.models.note import Note
from app.models.user import User
from app.repositories.note_repository import NoteRepository
from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteToTaskResponse,
    NoteUpdate,
)

logger = get_logger(__name__)


class NoteService:
    """
    Enterprise Note Service.

    Coordinates note-related business logic while
    delegating persistence to NoteRepository.

    Responsibilities
    ----------------
    - Note CRUD
    - Ownership validation
    - Administrator access
    - Note search
    - Pagination
    - Open Library support
    - NestJS integration
    """

    def __init__(
        self,
        note_repository: NoteRepository,
    ) -> None:
        """
        Initialize the service.

        Parameters
        ----------
        note_repository:
            Repository responsible for all
            Note persistence operations.
        """
        self.note_repository = note_repository

    # ======================================================
    # Internal Helpers
    # ======================================================

    def _is_admin(
        self,
        user: User,
    ) -> bool:
        """
        Determine whether a user is an administrator.
        """
        return user.role == UserRole.ADMIN.value

    def _require_note(
        self,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note or raise HTTP 404.
        """
        note = self.note_repository.get_by_id(
            note_id,
        )

        if note is None:
            logger.warning(
                "Requested note does not exist: %s",
                note_id,
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found.",
            )

        return note

    def _validate_access(
        self,
        *,
        current_user: User,
        note: Note,
    ) -> None:
        """
        Validate that the current user has access
        to the requested note.
        """
        if self._is_admin(current_user):
            return

        if note.owner_id != current_user.id:
            logger.warning(
                "Unauthorized note access | "
                "user=%s note=%s",
                current_user.id,
                note.id,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this note.",
            )

    def _build_note_response(
        self,
        note: Note,
    ) -> NoteResponse:
        """
        Convert a Note model into a NoteResponse.
        """
        return NoteResponse.model_validate(
            note,
        )

    def _get_owned_note(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note and validate ownership.
        """
        note = self._require_note(
            note_id,
        )

        self._validate_access(
            current_user=current_user,
            note=note,
        )

        return note

    # ======================================================
    # CRUD Operations
    # (Continues in Part 2)
    # ======================================================
    
    def create_note(
        self,
        *,
        current_user: User,
        note_data: NoteCreate,
    ) -> NoteResponse:
        """
        Create a new note.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_data:
            Note creation payload.

        Returns
        -------
        NoteResponse
        """
        logger.info(
            "Creating note for user: %s",
            current_user.email,
        )

        note = Note(
            title=note_data.title,
            content=note_data.content,
            owner_id=current_user.id,
        )

        created_note = self.note_repository.create(
            note,
        )

        logger.info(
            "Note created successfully | id=%s owner=%s",
            created_note.id,
            created_note.owner_id,
        )

        return self._build_note_response(
            created_note,
        )

    def get_note_by_id(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> NoteResponse:
        """
        Retrieve a single note.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        NoteResponse
        """
        note = self._get_owned_note(
            current_user=current_user,
            note_id=note_id,
        )

        return self._build_note_response(
            note,
        )

    def update_note(
        self,
        *,
        current_user: User,
        note_id: int,
        note_data: NoteUpdate,
    ) -> NoteResponse:
        """
        Update an existing note.

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
        """
        note = self._get_owned_note(
            current_user=current_user,
            note_id=note_id,
        )

        update_data = note_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        for field, value in update_data.items():
            setattr(
                note,
                field,
                value,
            )

        updated_note = self.note_repository.update(
            note,
        )

        logger.info(
            "Note updated successfully | id=%s",
            updated_note.id,
        )

        return self._build_note_response(
            updated_note,
        )

    def delete_note(
        self,
        *,
        current_user: User,
        note_id: int,
    ) -> None:
        """
        Delete a note.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.
        """
        note = self._get_owned_note(
            current_user=current_user,
            note_id=note_id,
        )

        self.note_repository.delete(
            note,
        )

        logger.info(
            "Note deleted successfully | id=%s",
            note.id,
        )
        
        def get_notes(
            self,
            *,
            current_user: User,
            page: int = 1,
            limit: int = 10,
            search: str | None = None,
        ) -> tuple[int, list[NoteResponse]]:
            """
            Retrieve notes for the authenticated user.

            Supports
            --------
            - Pagination
            - Search
            - Administrator access

            Parameters
            ----------
            current_user:
                Authenticated user.

            page:
                Page number (1-based).

            limit:
                Number of records per page.

            search:
                Optional search term.

            Returns
            -------
            tuple[int, list[NoteResponse]]
                Total records and notes.
            """
            skip = (page - 1) * limit

            if self._is_admin(current_user):
                if search:
                    notes = self.note_repository.search(
                        current_user.id,
                        search,
                        skip=skip,
                        limit=limit,
                    )
                else:
                    notes = self.note_repository.list_all(
                        skip=skip,
                        limit=limit,
                    )

                total = self.note_repository.count_all()

            else:
                if search:
                    notes = self.note_repository.search(
                        current_user.id,
                        search,
                        skip=skip,
                        limit=limit,
                    )
                else:
                    notes = self.note_repository.list_by_owner(
                        current_user.id,
                        skip=skip,
                        limit=limit,
                    )

                total = self.note_repository.count_by_owner(
                    current_user.id,
                )

            return (
                total,
                [
                    self._build_note_response(note)
                    for note in notes
                ],
            )

    def get_recent_notes(
        self,
        *,
        current_user: User,
        limit: int = 10,
    ) -> list[NoteResponse]:
        """
        Retrieve recent notes for the current user.
        """
        notes = self.note_repository.list_recent_by_owner(
            current_user.id,
            limit=limit,
        )

        return [
            self._build_note_response(note)
            for note in notes
        ]

    def get_notes_with_book_reference(
        self,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve notes linked to Open Library.
        """
        skip = (page - 1) * limit

        notes = self.note_repository.list_with_book_reference(
            current_user.id,
            skip=skip,
            limit=limit,
        )

        total = len(notes)

        return (
            total,
            [
                self._build_note_response(note)
                for note in notes
            ],
        )

    def get_all_notes_admin(
        self,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve all notes.

        Administrator only.
        """
        if not self._is_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrator privileges are required.",
            )

        skip = (page - 1) * limit

        notes = self.note_repository.list_all(
            skip=skip,
            limit=limit,
        )

        total = self.note_repository.count_all()

        return (
            total,
            [
                self._build_note_response(note)
                for note in notes
            ],
        )

    def get_statistics(
        self,
        *,
        current_user: User,
    ) -> dict[str, int]:
        """
        Retrieve note statistics.
        """
        return {
            "total_notes": self.note_repository.count_by_owner(
                current_user.id,
            ),
            "converted_notes": self.note_repository.count_converted(
                current_user.id,
            ),
            "pending_conversion": (
                self.note_repository.count_pending_conversion(
                    current_user.id,
                )
            ),
        }
        
        def convert_note_to_task(
            self,
            *,
            current_user: User,
            note_id: int,
        ) -> NoteToTaskResponse:
            """
            Mark a note as converted to a task.

            This method prepares the note for future
            NestJS task synchronization.

            Parameters
            ----------
            current_user:
                Authenticated user.

            note_id:
                Note identifier.

            Returns
            -------
            NoteToTaskResponse
            """
            note = self._get_owned_note(
                current_user=current_user,
                note_id=note_id,
            )

            if note.is_converted_to_task:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Note has already been converted to a task.",
                )

            updated_note = self.note_repository.mark_as_converted(
                note,
            )

            logger.info(
                "Note converted to task | note_id=%s owner_id=%s",
                updated_note.id,
                updated_note.owner_id,
            )

            return NoteToTaskResponse(
                note_id=updated_note.id,
                task_created=False,
                message=(
                    "Task conversion request prepared successfully. "
                    "NestJS integration pending."
                ),
            )

    # ======================================================
    # Authorization
    # ======================================================

    def ensure_admin(
        self,
        current_user: User,
    ) -> User:
        """
        Ensure the current user has administrator
        privileges.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        User
        """
        if not self._is_admin(current_user):
            logger.warning(
                "Unauthorized administrator access "
                "attempt by user=%s",
                current_user.id,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrator privileges are required.",
            )

        return current_user

    # ======================================================
    # Utility Methods
    # ======================================================

    def note_exists(
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
        Retrieve the underlying Note ORM model.

        This helper is intended for internal service
        usage where direct ORM access is required.

        Parameters
        ----------
        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        Note
        """
        return self._get_owned_note(
            current_user=current_user,
            note_id=note_id,
        )

    def get_convertible_notes(
        self,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve notes that have not yet been
        converted into NestJS tasks.
        """
        skip = (page - 1) * limit

        notes = (
            self.note_repository.list_convertible_to_task(
                current_user.id,
                skip=skip,
                limit=limit,
            )
        )

        total = (
            self.note_repository.count_pending_conversion(
                current_user.id,
            )
        )

        return (
            total,
            [
                self._build_note_response(note)
                for note in notes
            ],
        )

    def get_converted_notes(
        self,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve notes that have already been
        converted into NestJS tasks.
        """
        skip = (page - 1) * limit

        notes = (
            self.note_repository.list_converted_to_task(
                current_user.id,
                skip=skip,
                limit=limit,
            )
        )

        total = self.note_repository.count_converted(
            current_user.id,
        )

        return (
            total,
            [
                self._build_note_response(note)
                for note in notes
            ],
        )