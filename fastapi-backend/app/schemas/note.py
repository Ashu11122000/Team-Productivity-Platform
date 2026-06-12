from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

class NoteBase(BaseModel):
    """
    Shared note fields used across create, update, and response schemas
    """
    title: str = Field(..., min_length=1, max_length=255, description="Note title", examples=["Learning React"])
    
    content: Optional[str] = Field(default = None, description = "Detailed note content", examples=["React hooks, state management, and component lifecycle notes"])
    
class NoteCreate(NoteBase):
    """
    Schema used when creating a new note.
    """
    pass

class NoteUpdate(BaseModel):
    """
    Schema used for partial note updates.
    """
    
    title: Optional[str] = Field(default=None, min_length=1, max_length=255, description="Updated note title")
    content: Optional[str] = Field(default=None, description="Updated note content")
    
class NoteResponse(NoteBase):
    """
    Standard note response returned to frontend clients.
    """
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int = Field(..., description="Unique note identifier", examples=[1])
    owner_id: int = Field(..., description = "User ID of the note owner", examples=[1])
    book_reference_id: Optional[str] = Field(default = None, description = "Optional Open Library book reference ID", example=["OL45883W"])
    is_converted_to_task: bool = Field(..., description="Indicates whether the note has been converted into one or more tasks", examples=[False])
    created_at: datetime = Field(..., description = "Timestamp when the note was created")
    updated_At: datetime = Field(..., description="Timestamp when the note was last updated")
    
class PaginatedNotesResponse(BaseModel):
    """
    Standard paginated notes response.
    Used by:
    GET /notes
    GET /notes/admin/all
    """
    
    total: int = Field(..., description = "Total number of notes matching the query", examples=[125])
    page: int = Field(..., description = "Current page number", examples=[1])
    limit: int = Field(..., description = "Number of records per page", examples = [10])
    items: list[NoteResponse]
    
class NoteToTaskResponse(BaseModel):
    """
    Response returned after a note is converted to task(s).
    
    Current implementation:
    Placeholder until NestJS task service integration.
    """
    
    note_id: int = Field(..., description="Source note ID")
    task_created: bool = Field(..., description = "Whether task creation was successful")
    
    message: str = Field(..., description = "Conversion result message")
    
    