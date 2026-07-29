"""
==========================================================
SQLAlchemy Declarative Base
==========================================================

Defines the shared SQLAlchemy Declarative Base used by all
ORM models in the Team Productivity Platform.

Responsibilities
----------------
✓ Shared SQLAlchemy metadata
✓ Declarative base for all ORM models
✓ Alembic autogeneration support
✓ SQLAlchemy 2.x compatible
✓ Constraint naming conventions
✓ Developer-friendly object representation

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

from typing import Final

from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

# ==========================================================
# SQLAlchemy Naming Convention
# ==========================================================

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
        Return a developer-friendly representation using only
        mapped column values.

        Relationships are intentionally excluded to avoid
        triggering lazy-loading.
        """

        table = getattr(self, "__table__", None)
        if table is None:
            return f"{self.__class__.__name__}()"

        values = ", ".join(
            f"{column.key}={getattr(self, column.key, None)!r}"
            for column in table.columns
        )

        return f"{self.__class__.__name__}({values})"


__all__ = [
    "Base",
    "metadata",
    "NAMING_CONVENTION",
]