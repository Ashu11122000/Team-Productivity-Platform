"""
==========================================================
Repository Package
==========================================================

Centralized exports for the repository layer.

Responsibilities
----------------
• Expose all repository classes.
• Provide a clean import interface.
• Hide the internal repository package structure.
• Support the Repository–Service architecture.

Example
-------
    from app.repositories import BaseRepository
    from app.repositories import UserRepository
    from app.repositories import NoteRepository

Architecture
------------
The repository layer is responsible for persistence.

    Service Layer
          │
          ▼
    Repository Layer
          │
          ▼
      SQLAlchemy
          │
          ▼
      PostgreSQL

Business logic belongs in services.
Database persistence belongs in repositories.

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- psycopg v3
- Alembic
- Python 3.12+

==========================================================
"""

from app.repositories.base_repository import BaseRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.user_repository import UserRepository

# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "BaseRepository",
    "UserRepository",
    "NoteRepository",
]