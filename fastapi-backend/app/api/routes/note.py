from typing import List, Optional
from fastapi import (APIRouter, Depends, HTTPException, status, Query)
from sqlalchemy.orm import Session
from app.db.session import get_db

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.note import (NoteCreate, NoteResponse, NoteUpdate)
from app.services import note_service

router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
)

@router.post(
    "",
    response_model = NoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Note",
    description="""
    Create a new note for the authenticated user.
    
    Notes are owned by FastAPI and serve as the 
    knowledge-management component of the Team Productivity Platform.
    
    Future Integrations:
    - Categories
    - Tags 
    - Book references
    - Note-to-Task Conversion
    """
)
def create_note_api(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.create_note(
        db=db,
        user_id=current_user.id,
        note=note,
    )
    
@router.get(
    "",
    response_model=List[NoteResponse],
    summary="Get Notes",
    description="""
    Retrieve notes belonging to the authenticated user.
    
    Supports:
    - Pagination
    - Search
    - Sorting
    
    Used by:
    - Notes Dashboard
    - Search Views
    - Analytics
    """
)
def get_notes_api(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(default=None, description="Search notes by title/content"),
    sort_by: str = Query(default="Newest", description="newest | oldest"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    offset = (page-1) * limit
    
    return note_service.get_notes(
        db=db,
        user_id=current_user.id,
        skip=offset,
        limit=limit,
        search=search,
        sort_by=sort_by,
    )
    
# Admin - Get All Notes
@router.get(
    "/admin/all",
    response_model=List[NoteResponse],
    summary="Get all notes (Admin)",
    description="""
    Retrieve all notes across the platform.

    Access Rules:

    - ADMIN:
      Can view all notes.

    - MEMBER:
      Access denied.

    Used by:
    - Admin Dashboard
    - Analytics Dashboard
    - System Monitoring
    - Content Review

    This endpoint is intended for administrative
    reporting and management purposes.
    """,
)
def get_all_notes_admin_api(
    page: int = Query(
        1,
        ge=1,
        description="Page number",
    ),
    limit: int = Query(
        20,
        ge=1,
        le=100,
        description="Items per page",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # RBAC Check
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    offset = (page - 1) * limit

    return note_service.get_all_notes(
        db=db,
        skip=offset,
        limit=limit,
    )

@router.get(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Get note by ID",
    description="""
    Retrieve a single note.

    Access Rules:

    - MEMBER: Can access only notes they own.

    - ADMIN: Can access any note in the system.

    Used by:
    - Notes Detail Page
    - Admin Review Tools
    - Analytics
    """,
)
def get_note_api(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.get_note_by_id(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )
    
@router.put(
    "/{note_id}",
    response_model=NoteResponse,
    summary="Update note",
    description="""
    Update an existing note.

    Access Rules:

    - MEMBER: Can update only their notes.

    - ADMIN: Can update any note.

    Future activity logging:

    NOTE_UPDATED
    """,
)
def update_note_api(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.update_note(
        db = db,
        current_user=current_user,
        note_id = note_id,
        note_data=note_data
    )

@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete note",
    description="""
    Delete an existing note.

    Access Rules:

    - MEMBER: Can delete only their notes.

    - ADMIN: Can delete any note.

    Future activity logging:

    NOTE_DELETED
    """,
)
def delete_note_api(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note_service.delete_note(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )
    
    return None

@router.post(
    "/{note_id}/convert-to-task",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Convert note into task(s)",
    description="""
    Converts a note into one or more tasks.
    
    Ownership:
    - FastAPI owns Notes
    - NestJS owns tasks
    
    Workflow:
    Note
    ↓
    Extract actionable items
    ↓
    Send task creation request
    ↓
    NestJS Tasks Service
    """
)
def convert_note_to_task_api(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "message": (
            "Note-to-task conversion endpoint reserved"
            "for NestJS integration."
        ),
        "data": {
            "note_id": note_id,
        },
    }