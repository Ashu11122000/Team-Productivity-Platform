"""
==========================================================
Note Schemas
==========================================================

Pydantic schemas for Notes.

Responsibilities
----------------
✓ Note creation
✓ Note update
✓ Note response
✓ Note summary
✓ Paginated notes
✓ Note → Task conversion

Compatible With
---------------
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x
==========================================================
"""

from __future__ import annotations

from pydantic import Field

from app.core.constants import (
    NOTE_CONTENT_MAX_LENGTH,
    NOTE_TITLE_MAX_LENGTH,
)
from app.schemas.base import BaseSchema, EntitySchema
from app.schemas.common import PaginationMeta


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
            "Dependency Injection, SQLAlchemy 2.x and JWT Authentication."
        ],
    )


# ==========================================================
# Create Note
# ==========================================================


class NoteCreate(NoteBase):
    """
    Schema for creating a note.
    """

    pass


# ==========================================================
# Update Note
# ==========================================================


class NoteUpdate(BaseSchema):
    """
    Schema for updating a note.
    """

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=NOTE_TITLE_MAX_LENGTH,
    )

    content: str | None = Field(
        default=None,
        max_length=NOTE_CONTENT_MAX_LENGTH,
    )


# ==========================================================
# Note Response
# ==========================================================


class NoteResponse(EntitySchema):
    """
    Complete note response.
    """

    title: str

    content: str | None

    owner_id: int

    book_reference_id: str | None

    is_converted_to_task: bool


# ==========================================================
# Public Note
# ==========================================================


class NotePublic(BaseSchema):
    """
    Lightweight note representation.
    """

    id: int

    title: str

    created_at: str


# ==========================================================
# Note Summary
# ==========================================================


class NoteSummary(BaseSchema):
    """
    Lightweight note used in lists.
    """

    id: int

    title: str

    is_converted_to_task: bool


# ==========================================================
# Paginated Notes
# ==========================================================


class PaginatedNotesResponse(BaseSchema):
    """
    Paginated note response.
    """

    success: bool = True

    data: list[NoteResponse]

    pagination: PaginationMeta


# ==========================================================
# Note → Task Response
# ==========================================================


class NoteToTaskResponse(BaseSchema):
    """
    Response returned after converting
    a note into a NestJS task.
    """

    note_id: int

    task_created: bool

    message: str