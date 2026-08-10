"""
===============================================================================
SQLAlchemy Declarative Base
===============================================================================

Defines the shared SQLAlchemy Declarative Base used by all ORM models in the
Team Productivity Platform.

Responsibilities
----------------
• Provide shared SQLAlchemy metadata.
• Provide the declarative base for all ORM models.
• Support Alembic metadata discovery and autogeneration.
• Provide SQLAlchemy 2.x compatible ORM infrastructure.
• Define consistent database constraint naming conventions.
• Provide a developer-friendly ORM object representation.

Database
--------
PostgreSQL

Compatible With
---------------
• SQLAlchemy 2.x
• Alembic
• PostgreSQL
• psycopg v3
• Python 3.12+
===============================================================================
"""

from __future__ import annotations

from typing import Final

from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase


# =============================================================================
# SQLAlchemy Naming Convention
# =============================================================================

NAMING_CONVENTION: Final[dict[str, str]] = {
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


# =============================================================================
# Shared SQLAlchemy Metadata
# =============================================================================

metadata = MetaData(
    naming_convention=NAMING_CONVENTION,
)


# =============================================================================
# Declarative Base
# =============================================================================


class Base(DeclarativeBase):
    """
    Shared declarative base inherited by all SQLAlchemy ORM models.

    All application models should inherit from this class so that they share
    the same SQLAlchemy metadata object.

    Examples
    --------
    A model should follow this pattern::

        class User(Base):
            __tablename__ = "users"

            ...

    Alembic can then use ``Base.metadata`` to discover the application's
    database schema.
    """

    metadata = metadata

    def __repr__(self) -> str:
        """
        Return a developer-friendly representation of the ORM instance.

        Only mapped column values are included.

        Relationships are intentionally excluded because accessing
        relationship attributes may trigger lazy-loading and therefore
        unexpected database queries.

        Returns
        -------
        str
            Developer-friendly representation of the model instance.
        """
        table = getattr(
            self,
            "__table__",
            None,
        )

        if table is None:
            return f"{self.__class__.__name__}()"

        values = ", ".join(
            f"{column.key}={getattr(self, column.key, None)!r}"
            for column in table.columns
        )

        return f"{self.__class__.__name__}({values})"


# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    "NAMING_CONVENTION",
    "metadata",
    "Base",
]