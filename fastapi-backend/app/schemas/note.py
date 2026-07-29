"""
==========================================================
Note Schemas
==========================================================

Responsibilities
----------------
Provides reusable Pydantic schemas for note management
within the Team Productivity Platform.

Features
--------
✓ Note creation
✓ Note update
✓ Note response
✓ Public note representation
✓ Note summary
✓ Paginated notes
✓ Note-to-task conversion

Compatible With
---------------
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
"""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.core.constants import (
    NOTE_CONTENT_MAX_LENGTH,
    NOTE_TITLE_MAX_LENGTH,
)
from app.schemas.base import BaseSchema, EntitySchema
from app.schemas.common import (
    MessageResponse,
    PaginatedResponse,
)

# ==========================================================
# Base Note Schema
# ==========================================================


class NoteBase(BaseSchema):
    """
    Shared note fields.
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


# ==========================================================
# Create Note
# ==========================================================


class NoteCreate(NoteBase):
    """
    Schema used for creating a new note.
    """

    pass


# ==========================================================
# Update Note
# ==========================================================


class NoteUpdate(BaseSchema):
    """
    Schema used for updating an existing note.

    All fields are optional.
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


# ==========================================================
# Note Response
# ==========================================================


class NoteResponse(EntitySchema):
    """
    Complete note response.
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


# ==========================================================
# Public Note
# ==========================================================


class NotePublic(BaseSchema):
    """
    Public note representation.
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


# ==========================================================
# Note Summary
# ==========================================================


class NoteSummary(BaseSchema):
    """
    Lightweight note summary.
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


# ==========================================================
# Paginated Notes Response
# ==========================================================


class PaginatedNotesResponse(
    PaginatedResponse[NoteResponse],
):
    """
    Paginated response containing notes.
    """

    pass


# ==========================================================
# Note-to-Task Response
# ==========================================================


class NoteToTaskResponse(MessageResponse):
    """
    Response returned after converting
    a note into a task.
    """

    note_id: int = Field(
        ...,
        description="Source note identifier.",
    )

    task_created: bool = Field(
        ...,
        description="Whether the task was successfully created.",
    )


# ==========================================================
# Public Exports
# ==========================================================

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