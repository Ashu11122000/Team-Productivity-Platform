"""
==========================================================
Notes API Routes
==========================================================

REST API endpoints for managing notes.

Responsibilities
----------------
- Validate incoming requests
- Authenticate users
- Delegate business logic to NoteService
- Return response schemas

Business logic is intentionally excluded from this layer.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- Python 3.12+
"""

from __future__ import annotations

from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    Path,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteToTaskResponse,
    NoteUpdate,
)
from app.services.note_service import NoteService

router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


# ==========================================================
# Create Note
# ==========================================================

@router.post(
    "",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Note",
    response_description="Created note.",
)
def create_note_api(
    note: NoteCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteResponse:
    """
    Create a new note for the authenticated user.
    """
    return NoteService.create_note(
        db=db,
        current_user=current_user,
        note_data=note,
    )


# ==========================================================
# List Notes
# ==========================================================

@router.get(
    "",
    response_model=list[NoteResponse],
    summary="List Notes",
    response_description="List of notes.",
)
def get_notes_api(
    db: DatabaseSession,
    current_user: CurrentUser,
    page: Annotated[
        int,
        Query(
            ge=1,
            description="Page number.",
        ),
    ] = 1,
    limit: Annotated[
        int,
        Query(
            ge=1,
            le=100,
            description="Number of records per page.",
        ),
    ] = 10,
    search: Annotated[
        str | None,
        Query(
            description="Search by title or content.",
        ),
    ] = None,
    sort_by: Annotated[
        str,
        Query(
            description="Sorting strategy (newest, oldest, title).",
        ),
    ] = "newest",
) -> list[NoteResponse]:
    """
    Retrieve paginated notes belonging to the authenticated user.
    """
    _, notes = NoteService.get_notes(
        db=db,
        current_user=current_user,
        page=page,
        limit=limit,
        search=search,
        sort_by=sort_by,
    )

    return notes

# ==========================================================
# Administrator
# ==========================================================

@router.get(
    "/admin/all",
    response_model=list[NoteResponse],
    summary="List All Notes (Admin)",
    response_description="List of all notes.",
)
def get_all_notes_admin_api(
    db: DatabaseSession,
    current_user: CurrentUser,
    page: Annotated[
        int,
        Query(
            ge=1,
            description="Page number.",
        ),
    ] = 1,
    limit: Annotated[
        int,
        Query(
            ge=1,
            le=100,
            description="Number of records per page.",
        ),
    ] = 20,
    sort_by: Annotated[
        str,
        Query(
            description="Sorting strategy (newest, oldest, title).",
        ),
    ] = "newest",
) -> list[NoteResponse]:
    """
    Retrieve all notes.

    Accessible only by administrators.
    """
    _, notes = NoteService.get_all_notes_admin(
        db=db,
        current_user=current_user,
        page=page,
        limit=limit,
        sort_by=sort_by,
    )

    return notes


# ==========================================================
# Get Note
# ==========================================================

@router.get(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Get Note",
    response_description="Requested note.",
)
def get_note_api(
    note_id: Annotated[
        int,
        Path(
            ge=1,
            description="Note identifier.",
        ),
    ],
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteResponse:
    """
    Retrieve a single note by its identifier.
    """
    return NoteService.get_note_by_id(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )


# ==========================================================
# Update Note
# ==========================================================

@router.put(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Update Note",
    response_description="Updated note.",
)
def update_note_api(
    note_id: Annotated[
        int,
        Path(
            ge=1,
            description="Note identifier.",
        ),
    ],
    note_data: NoteUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteResponse:
    """
    Update an existing note.
    """
    return NoteService.update_note(
        db=db,
        current_user=current_user,
        note_id=note_id,
        note_data=note_data,
    )
    
    # ==========================================================
# Delete Note
# ==========================================================

@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Note",
)
def delete_note_api(
    note_id: Annotated[
        int,
        Path(
            ge=1,
            description="Note identifier.",
        ),
    ],
    db: DatabaseSession,
    current_user: CurrentUser,
) -> None:
    """
    Delete a note.
    """
    NoteService.delete_note(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )


# ==========================================================
# Convert Note to Task
# ==========================================================

@router.post(
    "/{note_id}/convert-to-task",
    response_model=NoteToTaskResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Convert Note to Task",
    response_description="Task conversion prepared.",
)
def convert_note_to_task_api(
    note_id: Annotated[
        int,
        Path(
            ge=1,
            description="Note identifier.",
        ),
    ],
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteToTaskResponse:
    """
    Convert a note into a task payload.
    """
    return NoteService.convert_note_to_task(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )