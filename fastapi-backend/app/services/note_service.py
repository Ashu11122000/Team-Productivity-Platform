from typing import Sequence

from fastapi import HTTPException, status
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate

ADMIN_ROLE = "ADMIN"

class NoteService:
    """
    Notes business logic layer.
    
    Responsibilities:
    - Ownership validation
    - RBAC enforcement
    - CRUD operations
    - Search
    - Pagination
    - Sorting
    """
    
    @staticmethod
    def create_note(db: Session, user_id: int, note_data: NoteCreate) -> Note:
        """
        Create a new note
        """
        
        note = Note(title = note_data.title, content = note_data.content, owner_id = user_id)
        
        db.add(note)
        db.commit()
        db.refresh(note)
        
        return note
    
    @staticmethod
    def get_notes(db: Session, current_user: User, page: int = 1, limit: int = 10, search: str | None = None, sort_by: str = "newest") -> tuple[int, Sequence[Note]]:
        """
        Get notes for current user.
        
        Supports: 
        - Pagination
        - Search
        - Sorting
        """
        query = db.query(Note)
        
        if current_user.role != ADMIN_ROLE:
            query = query.filter(Note.owner_id == current_user.id)
            
        if search: 
            query = query.filter(Note.title.ilike(f"%{search}%"))
            
        total = query.with_entities(func.count(Note.id)).scalar or 0
        
        if sort_by == "oldest":
            query = query.order_by(Note.created_at.asc())
        else:
            query = query.order_by(desc(Note.created_at))
            
        notes = (query.offset((page-1) * limit).limit(limit).all())
        
        return total, notes
    
    @staticmethod
    def get_note_by_id(db: Session, current_user: User, note_id: int) -> Note:
        """
        Get note by ID with RBAC validation
        """
        note = (db.query(Note).filter(Note.id == note.id).first())
        
        if not note:
            raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "Note not found")
        
        NoteService.validate_note_access(current_user = current_user, note = note)
        
        return note
    
    @staticmethod
    def update_note(db: Session, current_user: User, note_id: int, note_data: NoteUpdate) -> Note:
        """
        Update Note
        """
        note = NoteService.get_note_by_id(db=db, current_user = current_user, note_id = note_id)
        update_data = note_data.model_dump(exclude_unset = True)
        
        for field, value in update_data.items():
            setattr(note, field, value)
            
        db.commit()
        db.refresh(note)
        
        return note
    
    @staticmethod
    def delete_note(db: Session, current_user: User, note_id: int) -> bool:
        """
        Delete Note
        """
        
        note = NoteService.get_note_by_id(db = db, current_user = current_user, note_id = note_id)
        
        db.delete(note)
        db.commit()
        
        return True
    
    @staticmethod
    def get_all_notes_admin(db: Session, current_user = User, page: int = 1, limit: int = 10) -> tuple[int, Sequence[Note]]:
        """
        Admin-only endpoint support.
        """
        
        if current_user.role != ADMIN_ROLE:
            raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = "Admin access required")
        
        query = db.query(Note)
        
        total = query.with_entities(func.count(Note.id)).scalar() or 0
        
        notes = (query.order_by(desc(Note.created_at)).offset((page-1)* limit).limit(limit).all())
        
        return total, notes
    
    @staticmethod
    def convert_note_to_task(db: Session, current_user: User, note_id: int) -> dict:
        """
        NestJS integration point.
        
        Current Implementation: 
        - Placeholder
        """
        note = NoteService.get_note_by_id(db = db, current_user = current_user, note_id = note_id)
        
        note.is_converted_to_task = True
        
        db.commit()
        
        return {
            "note_id": note.id,
            "task_created": False, 
            "message": (
                "Task conversion gateway ready."
                "NestJS integration pending."
            ),
        }
    
    @staticmethod
    def validate_note_access(current_user: User, note: Note) -> None:
        """
        Centralized ownership validation
        """
        is_admin = (current_user.role == ADMIN_ROLE)
        
        is_owner = (note.owner_id == current_user.id)
        
        if not(is_admin or is_owner):
            raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = "Not authorized to access this note")