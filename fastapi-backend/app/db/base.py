"""
==========================================================
SQLAlchemy Declarative Base
==========================================================

Defines the root declarative base class used by all ORM
models in the Team Productivity Platform.

Responsibilities
----------------
✓ Shared SQLAlchemy metadata
✓ Base class for all database models
✓ Used by Alembic migrations
✓ Enables SQLAlchemy 2.0 Declarative Mapping

Database
--------
PostgreSQL

Modules
-------
- Authentication
- Users
- Notes
- Future FastAPI modules

Architecture
------------
FastAPI
    │
    ▼
SQLAlchemy ORM
    │
    ▼
PostgreSQL

==========================================================
"""

from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase


# ==========================================================
# Shared Metadata
# ==========================================================

metadata = MetaData()


# ==========================================================
# Base Declarative Model
# ==========================================================

class Base(DeclarativeBase):
    """
    Base class inherited by every SQLAlchemy ORM model.
    """

    metadata = metadata

    def __repr__(self) -> str:
        """
        Developer-friendly object representation.
        """

        values = ", ".join(
            f"{key}={value!r}"
            for key, value in vars(self).items()
            if not key.startswith("_")
        )

        return f"{self.__class__.__name__}({values})"