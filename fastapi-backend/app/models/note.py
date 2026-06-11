from datetime import datetime, timezone
from sqlalchemy import (Column, DateTime, ForeignKey, Integer, String, Text, Boolean, Index)
from sqlalchemy.orm import relationship
from app.db.base import Base

class Note(Base):
    """
    Notes owned by FastAPI.
    
    Responsibilities:
    - User notes management
    - Open Library references
    - Note → Task conversion source
    
    NestJS owns:
    - Tasks
    - Categories
    - Tags
    - Analytics
    - Activity Logs
    """
    
    __tablename__="notes"
    
    __table_args__ = (
        Index("idx_notes_owner_id", "owner_id"),
        Index("idx_notes_created_at", "created_at"),
        Index("idx_notes_title", "title"),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    
    #Open Library Integration
    # Stores attached book reference information
    book_reference_id = Column(String(100), nullable=True)
    
    # Track whether not has already been converted into task(s) in NestJS
    is_converted_to_task = Column(Boolean, default=False, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default = lambda: datetime.now(timezone.utc), nullable=False)
    
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False) 
    
    # Relationships
    owner = relationship("User", back_populates="notes")
    
    def __repr__(self) -> str:
        return (
            f"<Note(id={self.id},"
            f"title='{self.title}',"
            f"owner_id={self.owner_id})"
        )