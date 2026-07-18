"""
==========================================================
SQLAlchemy Declarative Base
==========================================================

Defines the root declarative base class used by all ORM
models in the Team Productivity Platform.

Responsibilities
----------------
✓ Shared SQLAlchemy metadata
✓ Declarative base for all ORM models
✓ Alembic migration support
✓ SQLAlchemy 2.x compatible
✓ Constraint naming conventions

Database
--------
PostgreSQL

Compatible With
---------------
- SQLAlchemy 2.x
- Alembic
- PostgreSQL
==========================================================
"""

from __future__ import annotations

from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

# ==========================================================
# SQLAlchemy Naming Convention
# ==========================================================
#
# Recommended by SQLAlchemy/Alembic to generate predictable
# constraint names across all database objects.
#

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": (
        "fk_%(table_name)s_"
        "%(column_0_name)s_"
        "%(referred_table_name)s"
    ),
    "pk": "pk_%(table_name)s",
}

# ==========================================================
# Shared Metadata
# ==========================================================

metadata = MetaData(
    naming_convention=NAMING_CONVENTION,
)

# ==========================================================
# Declarative Base
# ==========================================================


class Base(DeclarativeBase):
    """
    Base class inherited by every SQLAlchemy ORM model.
    """

    metadata = metadata

    def __repr__(self) -> str:
        """
        Return a developer-friendly representation.

        Uses mapped columns only to avoid exposing SQLAlchemy
        internals or triggering lazy-loaded relationships.
        """

        values = ", ".join(
            f"{column.key}={getattr(self, column.key)!r}"
            for column in self.__table__.columns
        )

        return (
            f"{self.__class__.__name__}"
            f"({values})"
        )