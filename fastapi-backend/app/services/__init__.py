"""
==========================================================
Service Package
==========================================================

Centralized exports for the service layer.

Responsibilities
----------------
- Expose business service classes
- Provide a clean import interface
- Hide the internal package structure
- Support dependency injection

Architecture
------------
API Routes
        │
        ▼
Services
        │
        ▼
Repositories
        │
        ▼
Database

Services
--------
- AuthService
- UserService
- NoteService

Compatible With
---------------
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- PostgreSQL
- Python 3.12+
==========================================================
"""

# Uncomment these imports as the services are implemented.
#
# from app.services.auth_service import AuthService
# from app.services.user_service import UserService
# from app.services.note_service import NoteService

__all__: list[str] = [
    "AuthService",
    "UserService",
    "NoteService",
]