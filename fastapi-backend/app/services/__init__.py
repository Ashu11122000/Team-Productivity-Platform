"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.services.__init__
Architecture: Clean Architecture | Service Layer
Python: 3.12+
Framework: FastAPI
Database: PostgreSQL
ORM: SQLAlchemy 2.x
Validation: Pydantic v2
===============================================================================

Overview
--------
Centralized package exports for the application service layer.

The service layer contains the business logic of the FastAPI backend and
sits between the API routing layer and the repository layer.

Responsibilities
----------------
• Expose business service classes
• Provide a clean package-level import interface
• Hide internal service module structure
• Support dependency injection
• Maintain a centralized public service API

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
    SQLAlchemy
        │
        ▼
    PostgreSQL

Service Ownership
-----------------
FastAPI owns:

• Authentication
• Users
• Notes
• Open Library integration

NestJS owns:

• Tasks
• Categories
• Tags
• Notifications
• Analytics
• Dashboard
• Activity Logs

Implemented Services
--------------------
• AuthService
• UserService
• NoteService

Service Responsibilities
------------------------
AuthService
    • User registration
    • User authentication
    • Password management
    • JWT generation
    • Token validation
    • Authentication workflows

UserService
    • User management
    • Profile management
    • Account lifecycle
    • Administrator operations
    • User search
    • User statistics

NoteService
    • Note management
    • Note ownership
    • Note search
    • Note pagination
    • Note statistics
    • Task conversion coordination
    • Open Library-related note operations

Design Principles
-----------------
• Clean Architecture
• Service Layer Pattern
• Repository Pattern
• Separation of Concerns
• Dependency Inversion
• Single Responsibility Principle
• Explicit typing
• Stateless business services
• Centralized service exports

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• Pydantic v2
• PostgreSQL
• Python 3.12+

===============================================================================
"""

# =============================================================================
# Service Exports
# =============================================================================

from app.services.auth_service import AuthService
from app.services.note_service import NoteService
from app.services.user_service import UserService

# =============================================================================
# Public Package API
# =============================================================================

__all__ = [
    "AuthService",
    "UserService",
    "NoteService",
]