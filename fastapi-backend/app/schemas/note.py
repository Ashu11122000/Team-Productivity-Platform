"""
===============================================================================
Note Schemas
===============================================================================

Pydantic schemas for note management within the
Team Productivity Platform.

Responsibilities
----------------
• Validate note creation requests.
• Validate note update requests.
• Represent complete note responses.
• Represent public note information.
• Represent lightweight note summaries.
• Represent paginated note responses.
• Represent note-to-task conversion responses.
• Support SQLAlchemy ORM object serialization.

Security
--------
The client does not control:

• Note ownership.
• Task-conversion state.
• Internal synchronization state.

Those values are controlled by the authenticated application/service layer.

Compatible With
---------------
• FastAPI
• Pydantic v2
• SQLAlchemy 2.x
• PostgreSQL
• Python 3.12+
"""

from __future__ import annotations

from datetime import datetime

from pydantic import ConfigDict, Field

from app.core.constants import (
    NOTE_CONTENT_MAX_LENGTH,
    NOTE_TITLE_MAX_LENGTH,
)
from app.schemas.base import BaseSchema, EntitySchema
from app.schemas.common import (
    MessageResponse,
    PaginatedResponse,
)


# =============================================================================
# Base Note Schema
# =============================================================================


class NoteBase(BaseSchema):
    """
    Base schema containing fields shared by note input schemas.

    Only user-editable note content is included here.

    Ownership and integration-specific fields are intentionally excluded.
    """

    title: str = Field(
        ...,
        min_length=1,
        max_length=NOTE_TITLE_MAX_LENGTH,
        description="Title of the note.",
        examples=["Learning FastAPI"],
    )

    content: str | None = Field(
        default=None,
        max_length=NOTE_CONTENT_MAX_LENGTH,
        description="Detailed note content.",
        examples=[
            (
                "Dependency Injection, SQLAlchemy 2.x "
                "and JWT Authentication."
            )
        ],
    )


# =============================================================================
# Create Note
# =============================================================================


class NoteCreate(NoteBase):
    """
    Schema used for creating a new note.

    The authenticated user is assigned as the note owner by the service
    layer. The client does not provide ``owner_id``.

    Integration state such as task conversion is also controlled by the
    service layer.
    """

    pass


# =============================================================================
# Update Note
# =============================================================================


class NoteUpdate(BaseSchema):
    """
    Schema used for updating an existing note.

    All user-editable fields are optional.

    Ownership and integration-specific state cannot be modified through
    this schema.
    """

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=NOTE_TITLE_MAX_LENGTH,
        description="Updated note title.",
    )

    content: str | None = Field(
        default=None,
        max_length=NOTE_CONTENT_MAX_LENGTH,
        description="Updated note content.",
    )


# =============================================================================
# Note Response
# =============================================================================


class NoteResponse(EntitySchema):
    """
    Complete note API response.

    Includes ownership and integration state required by trusted API
    consumers.

    The password or other authentication credentials are not part of
    a note response.
    """

    title: str = Field(
        ...,
        description="Note title.",
    )

    content: str | None = Field(
        default=None,
        description="Note content.",
    )

    owner_id: int = Field(
        ...,
        description="Owner user identifier.",
    )

    book_reference_id: str | None = Field(
        default=None,
        description="Open Library reference identifier.",
    )

    is_converted_to_task: bool = Field(
        ...,
        description="Whether the note has been converted into a task.",
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# =============================================================================
# Public Note
# =============================================================================


class NotePublic(BaseSchema):
    """
    Public representation of a note.

    Provides only the minimal information required for public-facing
    references.

    Note
    ----
    Personal notes should normally be protected by authentication and
    ownership authorization at the API/service layer.
    """

    id: int = Field(
        ...,
        description="Note identifier.",
    )

    title: str = Field(
        ...,
        description="Note title.",
    )

    created_at: datetime = Field(
        ...,
        description="UTC creation timestamp.",
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# =============================================================================
# Note Summary
# =============================================================================


class NoteSummary(BaseSchema):
    """
    Lightweight note representation.

    Intended for lists, compact UI views, dashboards, and nested
    representations where the complete note payload is unnecessary.
    """

    id: int = Field(
        ...,
        description="Note identifier.",
    )

    title: str = Field(
        ...,
        description="Note title.",
    )

    is_converted_to_task: bool = Field(
        ...,
        description="Task conversion status.",
    )

    model_config = ConfigDict(
        from_attributes=True,
    )


# =============================================================================
# Paginated Notes Response
# =============================================================================


class PaginatedNotesResponse(
    PaginatedResponse[NoteResponse],
):
    """
    Paginated response containing complete note representations.

    Pagination metadata is provided by the shared ``PaginatedResponse``
    schema.
    """

    pass


# =============================================================================
# Note-to-Task Response
# =============================================================================


class NoteToTaskResponse(MessageResponse):
    """
    Response returned after attempting to convert a note into a task.

    The actual task creation is performed by the application/service
    integration layer, not by this schema.
    """

    note_id: int = Field(
        ...,
        description="Source note identifier.",
    )

    task_created: bool = Field(
        ...,
        description="Whether the task was successfully created.",
    )


# =============================================================================
# Public Exports
# =============================================================================

__all__ = [
    "NoteBase",
    "NoteCreate",
    "NoteUpdate",
    "NoteResponse",
    "NotePublic",
    "NoteSummary",
    "PaginatedNotesResponse",
    "NoteToTaskResponse",
]