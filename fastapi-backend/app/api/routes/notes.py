"""
===============================================================================
Notes Router
===============================================================================

Enterprise FastAPI router responsible for exposing all Note REST endpoints.

Responsibilities
----------------
• Receive HTTP requests
• Validate request payloads
• Validate query/path parameters
• Authenticate users
• Delegate business logic to NoteService
• Return response DTOs
• Generate OpenAPI documentation

Architecture
------------
Presentation Layer
        │
        ▼
Notes Router
        │
        ▼
NoteService
        │
        ▼
NoteRepository
        │
        ▼
PostgreSQL

Design Principles
-----------------
• Thin Controller Pattern
• Dependency Injection
• Service Layer Architecture
• Repository Pattern
• Single Responsibility Principle
• OpenAPI First Design
• Enterprise Logging Ready

Business Rules
--------------
This module NEVER contains business logic.

All business decisions are delegated to:

    • NoteService

The router only coordinates HTTP communication.

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• Pydantic v2
• Python 3.12+
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

__all__ = [
    "router",
]

# =============================================================================
# Module Constants
# =============================================================================

DEFAULT_PAGE: int = 1

DEFAULT_PAGE_SIZE: int = 10

DEFAULT_ADMIN_PAGE_SIZE: int = 20

MIN_PAGE_SIZE: int = 1

MAX_PAGE_SIZE: int = 100

MIN_PAGE_NUMBER: int = 1

DEFAULT_SORT_OPTION: str = "newest"

NOTE_TAG: str = "Notes"

ROUTER_PREFIX: str = "/notes"

# =============================================================================
# Router Configuration
# =============================================================================

router = APIRouter(
    prefix=ROUTER_PREFIX,
    tags=[NOTE_TAG],
)

# =============================================================================
# Dependency Aliases
# =============================================================================

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]

# =============================================================================
# Type Aliases
# =============================================================================

NoteResponseList = list[NoteResponse]

# =============================================================================
# Shared Path Parameter Aliases
# =============================================================================

NoteId = Annotated[
    int,
    Path(
        ge=1,
        description="Unique note identifier.",
    ),
]

# =============================================================================
# Shared Pagination Query Aliases
# =============================================================================

PageNumber = Annotated[
    int,
    Query(
        ge=MIN_PAGE_NUMBER,
        description="Page number starting from 1.",
    ),
]

PageSize = Annotated[
    int,
    Query(
        ge=MIN_PAGE_SIZE,
        le=MAX_PAGE_SIZE,
        description="Maximum number of records returned.",
    ),
]

AdminPageSize = Annotated[
    int,
    Query(
        ge=MIN_PAGE_SIZE,
        le=MAX_PAGE_SIZE,
        description="Maximum number of records returned for administrator endpoints.",
    ),
]

# =============================================================================
# Search & Sorting Query Aliases
# =============================================================================

SearchQuery = Annotated[
    str | None,
    Query(
        description=(
            "Optional search term used to filter notes "
            "by title or content."
        ),
    ),
]

SortOption = Annotated[
    str,
    Query(
        description=(
            "Sorting strategy. "
            "Supported values: newest, oldest, title."
        ),
    ),
]

# =============================================================================
# Default Query Values
# =============================================================================

DEFAULT_PAGE_QUERY = DEFAULT_PAGE

DEFAULT_PAGE_SIZE_QUERY = DEFAULT_PAGE_SIZE

DEFAULT_ADMIN_PAGE_SIZE_QUERY = DEFAULT_ADMIN_PAGE_SIZE

DEFAULT_SORT_QUERY = DEFAULT_SORT_OPTION

DEFAULT_SEARCH_QUERY: str | None = None

# =============================================================================
# Route Metadata
# =============================================================================

CREATE_NOTE_SUMMARY = "Create Note"

LIST_NOTES_SUMMARY = "List Notes"

GET_NOTE_SUMMARY = "Get Note"

UPDATE_NOTE_SUMMARY = "Update Note"

DELETE_NOTE_SUMMARY = "Delete Note"

ADMIN_LIST_NOTES_SUMMARY = "List All Notes"

CONVERT_NOTE_SUMMARY = "Convert Note to Task"

# =============================================================================
# Response Descriptions
# =============================================================================

NOTE_CREATED_RESPONSE = "Created note."

NOTE_LIST_RESPONSE = "List of notes."

NOTE_RESPONSE = "Requested note."

NOTE_UPDATED_RESPONSE = "Updated note."

NOTE_DELETED_RESPONSE = "Note deleted successfully."

NOTE_CONVERTED_RESPONSE = "Task conversion prepared."

# =============================================================================
# End Router Configuration
# =============================================================================

# =============================================================================
# Create Note
# =============================================================================

@router.post(
    "",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary=CREATE_NOTE_SUMMARY,
    response_description=NOTE_CREATED_RESPONSE,
)
def create_note_api(
    note: NoteCreate,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteResponse:
    """
    Create a new note for the authenticated user.

    Responsibilities
    ----------------
    • Validate the request payload.
    • Authenticate the current user.
    • Delegate business logic to the service layer.
    • Return the created note.

    Parameters
    ----------
    note:
        Note creation request payload.

    db:
        Active SQLAlchemy database session.

    current_user:
        Authenticated user.

    Returns
    -------
    NoteResponse
        Newly created note.
    """
    return NoteService.create_note(
        db=db,
        current_user=current_user,
        note_data=note,
    )
    
    # =============================================================================
# List Notes
# =============================================================================

@router.get(
    "",
    response_model=NoteResponseList,
    summary=LIST_NOTES_SUMMARY,
    response_description=NOTE_LIST_RESPONSE,
)
def get_notes_api(
    db: DatabaseSession,
    current_user: CurrentUser,
    page: PageNumber = DEFAULT_PAGE_QUERY,
    limit: PageSize = DEFAULT_PAGE_SIZE_QUERY,
    search: SearchQuery = DEFAULT_SEARCH_QUERY,
    sort_by: SortOption = DEFAULT_SORT_QUERY,
) -> NoteResponseList:
    """
    Retrieve paginated notes belonging to the authenticated user.

    Responsibilities
    ----------------
    • Validate pagination parameters.
    • Validate search criteria.
    • Authenticate the current user.
    • Delegate retrieval to the service layer.
    • Return the requested page of notes.

    Parameters
    ----------
    db:
        Active SQLAlchemy database session.

    current_user:
        Authenticated user.

    page:
        Requested page number.

    limit:
        Maximum number of records.

    search:
        Optional title/content search.

    sort_by:
        Sorting strategy.

    Returns
    -------
    NoteResponseList
        List of notes belonging to the authenticated user.
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


# =============================================================================
# Get Note
# =============================================================================

@router.get(
    "/{note_id}",
    response_model=NoteResponse,
    summary=GET_NOTE_SUMMARY,
    response_description=NOTE_RESPONSE,
)
def get_note_api(
    note_id: NoteId,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteResponse:
    """
    Retrieve a single note.

    Responsibilities
    ----------------
    • Validate the note identifier.
    • Authenticate the current user.
    • Delegate retrieval to the service layer.
    • Return the requested note.

    Parameters
    ----------
    note_id:
        Unique note identifier.

    db:
        Active SQLAlchemy database session.

    current_user:
        Authenticated user.

    Returns
    -------
    NoteResponse
        Requested note.
    """
    return NoteService.get_note_by_id(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )

# =============================================================================
# End User Retrieval Endpoints
# =============================================================================
# =============================================================================
# Update Note
# =============================================================================

@router.put(
    "/{note_id}",
    response_model=NoteResponse,
    summary=UPDATE_NOTE_SUMMARY,
    response_description=NOTE_UPDATED_RESPONSE,
)
def update_note_api(
    note_id: NoteId,
    note_data: NoteUpdate,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteResponse:
    """
    Update an existing note.

    Responsibilities
    ----------------
    • Validate the note identifier.
    • Validate the request payload.
    • Authenticate the current user.
    • Delegate update logic to the service layer.
    • Return the updated note.

    Parameters
    ----------
    note_id:
        Unique note identifier.

    note_data:
        Updated note information.

    db:
        Active SQLAlchemy database session.

    current_user:
        Authenticated user.

    Returns
    -------
    NoteResponse
        Updated note.
    """
    return NoteService.update_note(
        db=db,
        current_user=current_user,
        note_id=note_id,
        note_data=note_data,
    )


# =============================================================================
# Delete Note
# =============================================================================

@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary=DELETE_NOTE_SUMMARY,
    response_description=NOTE_DELETED_RESPONSE,
)
def delete_note_api(
    note_id: NoteId,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> None:
    """
    Delete a note.

    Responsibilities
    ----------------
    • Validate the note identifier.
    • Authenticate the current user.
    • Delegate deletion to the service layer.
    • Return HTTP 204 when deletion succeeds.

    Parameters
    ----------
    note_id:
        Unique note identifier.

    db:
        Active SQLAlchemy database session.

    current_user:
        Authenticated user.
    """
    NoteService.delete_note(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )

# =============================================================================
# End Update & Delete Endpoints
# =============================================================================
# =============================================================================
# Administrator Endpoints
# =============================================================================

@router.get(
    "/admin/all",
    response_model=NoteResponseList,
    summary=ADMIN_LIST_NOTES_SUMMARY,
    response_description=NOTE_LIST_RESPONSE,
)
def get_all_notes_admin_api(
    db: DatabaseSession,
    current_user: CurrentUser,
    page: PageNumber = DEFAULT_PAGE_QUERY,
    limit: AdminPageSize = DEFAULT_ADMIN_PAGE_SIZE_QUERY,
    sort_by: SortOption = DEFAULT_SORT_QUERY,
) -> NoteResponseList:
    """
    Retrieve notes across all users.

    This endpoint is restricted to administrators and is primarily
    intended for moderation, auditing, and management purposes.

    Responsibilities
    ----------------
    • Authenticate the current user.
    • Verify administrator privileges.
    • Validate pagination parameters.
    • Delegate retrieval to the service layer.
    • Return the requested page of notes.

    Parameters
    ----------
    db:
        Active SQLAlchemy database session.

    current_user:
        Authenticated administrator.

    page:
        Requested page number.

    limit:
        Maximum number of records returned.

    sort_by:
        Sorting strategy.

    Returns
    -------
    NoteResponseList
        Paginated collection of notes from all users.
    """
    _, notes = NoteService.get_all_notes_admin(
        db=db,
        current_user=current_user,
        page=page,
        limit=limit,
        sort_by=sort_by,
    )

    return notes


# =============================================================================
# End Administrator Endpoints
# =============================================================================
# =============================================================================
# Convert Note to Task
# =============================================================================

@router.post(
    "/{note_id}/convert-to-task",
    response_model=NoteToTaskResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary=CONVERT_NOTE_SUMMARY,
    response_description=NOTE_CONVERTED_RESPONSE,
)
def convert_note_to_task_api(
    note_id: NoteId,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> NoteToTaskResponse:
    """
    Convert a note into a task payload.

    This endpoint prepares a note for task creation. The returned payload
    can be consumed by the Task microservice or another downstream workflow.

    Responsibilities
    ----------------
    • Validate the note identifier.
    • Authenticate the current user.
    • Delegate conversion logic to the service layer.
    • Return the generated task payload.

    Parameters
    ----------
    note_id:
        Unique note identifier.

    db:
        Active SQLAlchemy database session.

    current_user:
        Authenticated user.

    Returns
    -------
    NoteToTaskResponse
        Task payload generated from the specified note.
    """
    return NoteService.convert_note_to_task(
        db=db,
        current_user=current_user,
        note_id=note_id,
    )


# =============================================================================
# End Note Routes
# =============================================================================
