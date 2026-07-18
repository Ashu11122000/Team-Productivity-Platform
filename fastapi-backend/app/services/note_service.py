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

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.constants import UserRole
from app.core.logging import get_logger

from app.models.note import Note
from app.models.user import User

from app.repositories.note_repository import NoteRepository

from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteUpdate,
    NoteToTaskResponse,
)

logger = get_logger(__name__)


class NoteService:
    """
    Enterprise Note Service.

    Contains business logic only.

    Database operations are delegated to
    NoteRepository.
    """

    # =====================================================
    # Repository Helper
    # =====================================================

    @staticmethod
    def _repository(
        db: Session,
    ) -> NoteRepository:
        """
        Create a repository instance.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.
        """
        return NoteRepository(db)

    # =====================================================
    # Authorization Helpers
    # =====================================================

    @staticmethod
    def _is_admin(
        user: User,
    ) -> bool:
        """
        Determine whether the supplied user
        has administrator privileges.
        """
        return user.role == UserRole.ADMIN.value

    @staticmethod
    def _require_note(
        *,
        repository: NoteRepository,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note or raise HTTP 404.
        """
        note = repository.get_by_id(
            note_id,
        )

        if note is None:
            logger.warning(
                "Requested note does not exist | id=%s",
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
        Validate ownership.

        Administrators may access every note.
        """
        if NoteService._is_admin(
            current_user,
        ):
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

    @staticmethod
    def _owned_note(
        *,
        repository: NoteRepository,
        current_user: User,
        note_id: int,
    ) -> Note:
        """
        Retrieve a note and verify ownership.
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

    # =====================================================
    # Response Helpers
    # =====================================================

    @staticmethod
    def _response(
        note: Note,
    ) -> NoteResponse:
        """
        Convert ORM model into response schema.
        """
        return NoteResponse.model_validate(
            note,
        )
        
            # =====================================================
    # Create Note
    # =====================================================

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
            "Creating note | owner=%s",
            current_user.email,
        )

        repository = NoteService._repository(db)

        note = Note(
            title=note_data.title.strip(),
            content=note_data.content.strip(),
            owner_id=current_user.id,
        )

        #
        # Optional fields
        # (only assigned if they exist on the schema/model)
        #
        if hasattr(note_data, "book_reference_id"):
            note.book_reference_id = getattr(
                note_data,
                "book_reference_id",
                None,
            )

        if hasattr(note_data, "book_title"):
            note.book_title = getattr(
                note_data,
                "book_title",
                None,
            )

        if hasattr(note_data, "book_author"):
            note.book_author = getattr(
                note_data,
                "book_author",
                None,
            )

        created_note = repository.create(
            note,
        )

        logger.info(
            "Note created successfully | id=%s owner=%s",
            created_note.id,
            created_note.owner_id,
        )

        return NoteService._response(
            created_note,
        )
    
        # =====================================================
    # Get Note By ID
    # =====================================================

    @staticmethod
    def get_note_by_id(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> NoteResponse:
        """
        Retrieve a single note.

        Ownership Rules
        ---------------
        • Administrators can access any note.
        • Regular users can access only their own notes.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Identifier of the requested note.

        Returns
        -------
        NoteResponse
            Requested note.

        Raises
        ------
        HTTPException
            404 if the note does not exist.

        HTTPException
            403 if the authenticated user does not own
            the note and is not an administrator.
        """
        logger.info(
            "Retrieving note | id=%s user=%s",
            note_id,
            current_user.email,
        )

        repository = NoteService._repository(
            db,
        )

        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        logger.info(
            "Note retrieved successfully | id=%s",
            note.id,
        )

        return NoteService._response(
            note,
        )

    # =====================================================
    # End of Part 1
    # =====================================================
    
    
        # =====================================================
    # Update Note
    # =====================================================

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

        Ownership Rules
        ---------------
        • Administrators may update any note.
        • Regular users may update only their own notes.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

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

        Raises
        ------
        HTTPException
            404 if the note does not exist.

        HTTPException
            403 if the authenticated user is not
            permitted to update the requested note.
        """
        logger.info(
            "Updating note | id=%s user=%s",
            note_id,
            current_user.email,
        )

        repository = NoteService._repository(
            db,
        )

        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        #
        # Only update explicitly supplied fields.
        #
        update_data = note_data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        #
        # Prevent ownership changes.
        #
        update_data.pop(
            "owner_id",
            None,
        )

        update_data.pop(
            "id",
            None,
        )

        #
        # Normalize string values.
        #
        if "title" in update_data:
            update_data["title"] = (
                update_data["title"].strip()
            )

        if (
            "content" in update_data
            and update_data["content"] is not None
        ):
            update_data["content"] = (
                update_data["content"].strip()
            )

        #
        # Apply updates dynamically.
        #
        for field, value in update_data.items():
            if hasattr(note, field):
                setattr(
                    note,
                    field,
                    value,
                )

        updated_note = repository.update(
            note,
        )

        logger.info(
            "Note updated successfully | "
            "id=%s owner=%s",
            updated_note.id,
            updated_note.owner_id,
        )

        return NoteService._response(
            updated_note,
        )
        
            # =====================================================
    # Delete Note
    # =====================================================

    @staticmethod
    def delete_note(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> None:
        """
        Delete a note.

        Ownership Rules
        ---------------
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

        Raises
        ------
        HTTPException
            404 if the note does not exist.

        HTTPException
            403 if the authenticated user is not
            authorized to delete the requested note.
        """
        logger.info(
            "Deleting note | id=%s user=%s",
            note_id,
            current_user.email,
        )

        repository = NoteService._repository(
            db,
        )

        #
        # Retrieve the note and validate access.
        #
        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        repository.delete(
            note,
        )

        logger.info(
            "Note deleted successfully | "
            "id=%s owner=%s",
            note.id,
            note.owner_id,
        )

        return None

    # =====================================================
    # Exists
    # =====================================================

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
            True if the note exists,
            otherwise False.
        """
        repository = NoteService._repository(
            db,
        )

        return repository.exists(
            note_id,
        )
        
        # =====================================================
    # Get Notes
    # =====================================================

    @staticmethod
    def get_notes(
        *,
        db: Session,
        current_user: User,
        page: int = 1,
        limit: int = 10,
        search: str | None = None,
        sort_by: str = "newest",
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve notes for the authenticated user.

        Supports
        --------
        ✓ Pagination
        ✓ Search
        ✓ Sorting
        ✓ Administrator access

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        page:
            Page number (1-based).

        limit:
            Records per page.

        search:
            Optional search keyword.

        sort_by:
            newest | oldest | title

        Returns
        -------
        tuple[int, list[NoteResponse]]

        (total_records, notes)
        """
        logger.info(
            "Retrieving notes | "
            "user=%s page=%s limit=%s search=%s sort=%s",
            current_user.email,
            page,
            limit,
            search,
            sort_by,
        )

        repository = NoteService._repository(
            db,
        )

        skip = (page - 1) * limit

        #
        # Administrator
        #
        if NoteService._is_admin(
            current_user,
        ):
            if search:
                notes = repository.search(
                    owner_id=None,
                    query=search,
                    skip=skip,
                    limit=limit,
                    sort_by=sort_by,
                )

                total = repository.search_count(
                    owner_id=None,
                    query=search,
                )

            else:
                notes = repository.list_all(
                    skip=skip,
                    limit=limit,
                    sort_by=sort_by,
                )

                total = repository.count_all()

        #
        # Regular User
        #
        else:
            if search:
                notes = repository.search(
                    owner_id=current_user.id,
                    query=search,
                    skip=skip,
                    limit=limit,
                    sort_by=sort_by,
                )

                total = repository.search_count(
                    owner_id=current_user.id,
                    query=search,
                )

            else:
                notes = repository.list_by_owner(
                    current_user.id,
                    skip=skip,
                    limit=limit,
                    sort_by=sort_by,
                )

                total = repository.count_by_owner(
                    current_user.id,
                )

        logger.info(
            "Retrieved %s notes for user=%s",
            len(notes),
            current_user.email,
        )

        return (
            total,
            [
                NoteService._response(
                    note,
                )
                for note in notes
            ],
        )
        
        # =====================================================
    # Recent Notes
    # =====================================================

    @staticmethod
    def get_recent_notes(
        *,
        db: Session,
        current_user: User,
        limit: int = 10,
    ) -> list[NoteResponse]:
        """
        Retrieve the most recently created notes.

        Authorization
        -------------
        • Administrators receive the most recent notes
          across all users.

        • Regular users receive only their own recent
          notes.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        limit:
            Maximum number of notes.

        Returns
        -------
        list[NoteResponse]
        """
        logger.info(
            "Retrieving recent notes | user=%s limit=%s",
            current_user.email,
            limit,
        )

        repository = NoteService._repository(
            db,
        )

        #
        # Administrator
        #
        if NoteService._is_admin(
            current_user,
        ):
            notes = repository.list_all(
                skip=0,
                limit=limit,
                sort_by="newest",
            )

        #
        # Regular User
        #
        else:
            notes = repository.list_recent_by_owner(
                current_user.id,
                limit=limit,
            )

        logger.info(
            "Retrieved %s recent notes",
            len(notes),
        )

        return [
            NoteService._response(
                note,
            )
            for note in notes
        ]
        
    
        # =====================================================
    # Administrator Operations
    # =====================================================

    @staticmethod
    def get_all_notes_admin(
        *,
        db: Session,
        current_user: User,
        page: int = 1,
        limit: int = 20,
        sort_by: str = "newest",
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve all notes.

        Administrator only.

        Supports
        --------
        ✓ Pagination
        ✓ Sorting

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated administrator.

        page:
            Page number (1-based).

        limit:
            Number of records per page.

        sort_by:
            newest | oldest | title

        Returns
        -------
        tuple[int, list[NoteResponse]]
        """
        logger.info(
            "Administrator retrieving all notes | admin=%s",
            current_user.email,
        )

        if not NoteService._is_admin(
            current_user,
        ):
            logger.warning(
                "Administrator access denied | user=%s",
                current_user.email,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrator privileges are required.",
            )

        repository = NoteService._repository(
            db,
        )

        skip = (page - 1) * limit

        notes = repository.list_all(
            skip=skip,
            limit=limit,
            sort_by=sort_by,
        )

        total = repository.count_all()

        logger.info(
            "Administrator retrieved %s notes",
            len(notes),
        )

        return (
            total,
            [
                NoteService._response(
                    note,
                )
                for note in notes
            ],
        )
        
        # =====================================================
    # Statistics
    # =====================================================

    @staticmethod
    def get_statistics(
        *,
        db: Session,
        current_user: User,
    ) -> dict[str, int]:
        """
        Retrieve note statistics.

        Administrators receive global statistics.

        Regular users receive statistics for
        their own notes.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        Returns
        -------
        dict[str, int]
        """
        logger.info(
            "Retrieving note statistics | user=%s",
            current_user.email,
        )

        repository = NoteService._repository(
            db,
        )

        #
        # Administrator statistics
        #
        if NoteService._is_admin(
            current_user,
        ):
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

        #
        # User statistics
        #
        else:
            statistics = {
                "total_notes": repository.count_by_owner(
                    current_user.id,
                ),
                "converted_notes": repository.count_converted(
                    owner_id=current_user.id,
                ),
                "pending_conversion": (
                    repository.count_convertible_to_task(
                        owner_id=current_user.id,
                    )
                ),
                "book_reference_notes": (
                    repository.count_with_book_reference(
                        owner_id=current_user.id,
                    )
                ),
            }

        logger.info(
            "Statistics retrieved successfully | user=%s",
            current_user.email,
        )

        return statistics
    
        # =====================================================
    # Convert Note To Task
    # =====================================================

    @staticmethod
    def convert_note_to_task(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> NoteToTaskResponse:
        """
        Mark a note as converted to a NestJS task.

        This prepares the note for synchronization with the
        NestJS Task Service.

        Authorization
        -------------
        • Administrators may convert any note.
        • Regular users may convert only their own notes.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        NoteToTaskResponse
        """
        logger.info(
            "Converting note to task | note=%s user=%s",
            note_id,
            current_user.email,
        )

        repository = NoteService._repository(
            db,
        )

        #
        # Retrieve note and validate access.
        #
        note = NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

        #
        # Prevent duplicate conversions.
        #
        if note.is_converted_to_task:
            logger.warning(
                "Note already converted | id=%s",
                note.id,
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Note has already been converted to a task.",
            )

        #
        # Mark as converted.
        #
        note = repository.mark_as_converted(
            note,
        )

        logger.info(
            "Note converted successfully | id=%s owner=%s",
            note.id,
            note.owner_id,
        )

        return NoteToTaskResponse(
            note_id=note.id,
            task_created=False,
            message=(
                "Task conversion request prepared successfully. "
                "NestJS synchronization is pending."
            ),
        )
        
        # =====================================================
    # Administrator Helpers
    # =====================================================

    @staticmethod
    def ensure_admin(
        current_user: User,
    ) -> User:
        """
        Ensure the authenticated user has
        administrator privileges.

        Parameters
        ----------
        current_user:
            Authenticated user.

        Returns
        -------
        User

        Raises
        ------
        HTTPException
            If the user is not an administrator.
        """
        if not NoteService._is_admin(
            current_user,
        ):
            logger.warning(
                "Administrator access denied | user=%s",
                current_user.email,
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrator privileges are required.",
            )

        return current_user

    # =====================================================
    # Internal Model Helpers
    # =====================================================

    @staticmethod
    def get_note_model(
        *,
        db: Session,
        current_user: User,
        note_id: int,
    ) -> Note:
        """
        Retrieve the underlying ORM model.

        This helper is intended for internal
        service usage where direct ORM access
        is required.

        Parameters
        ----------
        db:
            Active SQLAlchemy session.

        current_user:
            Authenticated user.

        note_id:
            Note identifier.

        Returns
        -------
        Note
        """
        repository = NoteService._repository(
            db,
        )

        return NoteService._owned_note(
            repository=repository,
            current_user=current_user,
            note_id=note_id,
        )

    # =====================================================
    # Convertible Notes
    # =====================================================

    @staticmethod
    def get_convertible_notes(
        *,
        db: Session,
        current_user: User,
        page: int = 1,
        limit: int = 10,
        sort_by: str = "newest",
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve notes that have not yet been
        converted into NestJS tasks.
        """
        repository = NoteService._repository(db)

        skip = (page - 1) * limit

        owner_id = (
            None
            if NoteService._is_admin(current_user)
            else current_user.id
        )

        notes = repository.list_convertible_to_task(
            owner_id=owner_id,
            skip=skip,
            limit=limit,
            sort_by=sort_by,
        )

        total = repository.count_convertible_to_task(
            owner_id=owner_id,
        )

        return (
            total,
            [
                NoteService._response(note)
                for note in notes
            ],
        )

    # =====================================================
    # Converted Notes
    # =====================================================

    @staticmethod
    def get_converted_notes(
        *,
        db: Session,
        current_user: User,
        page: int = 1,
        limit: int = 10,
        sort_by: str = "newest",
    ) -> tuple[int, list[NoteResponse]]:
        """
        Retrieve notes that have already been
        converted into NestJS tasks.
        """
        repository = NoteService._repository(db)

        skip = (page - 1) * limit

        owner_id = (
            None
            if NoteService._is_admin(current_user)
            else current_user.id
        )

        notes = repository.list_converted_to_task(
            owner_id=owner_id,
            skip=skip,
            limit=limit,
            sort_by=sort_by,
        )

        total = repository.count_converted(
            owner_id=owner_id,
        )

        return (
            total,
            [
                NoteService._response(note)
                for note in notes
            ],
        )
        
    