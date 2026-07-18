"""
==========================================================
Repository Package
==========================================================

Centralized exports for the repository layer.

Responsibilities
----------------
- Expose all repository classes
- Provide a clean import interface
- Hide the internal package structure

Example
-------
from app.repositories import BaseRepository
from app.repositories import UserRepository
from app.repositories import NoteRepository

This package follows the Repository–Service architecture
used throughout the Team Productivity Platform.

Compatible With
---------------
- SQLAlchemy 2.x
- PostgreSQL
- FastAPI
- Python 3.12+
"""

from app.repositories.base_repository import BaseRepository

# These imports will be enabled after their implementation.
#
# from app.repositories.user_repository import UserRepository
# from app.repositories.note_repository import NoteRepository

__all__ = [
    "BaseRepository",
    # "UserRepository",
    # "NoteRepository",
]