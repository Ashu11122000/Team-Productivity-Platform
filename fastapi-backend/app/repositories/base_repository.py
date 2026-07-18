"""
==========================================================
Base Repository
==========================================================

Generic repository implementation for SQLAlchemy 2.x models.

Responsibilities
----------------
- Provide reusable CRUD operations
- Encapsulate database access
- Eliminate duplicated repository code
- Support pagination and counting
- Handle transaction lifecycle
- Remain free of business logic

This class is intended to be inherited by concrete
repositories such as:

- UserRepository
- NoteRepository

Compatible With
---------------
- SQLAlchemy 2.x
- PostgreSQL
- psycopg v3
- FastAPI
- Alembic
- Python 3.12+
==========================================================
"""

from __future__ import annotations

from typing import Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Generic SQLAlchemy repository.

    Parameters
    ----------
    db:
        Active SQLAlchemy session.

    model:
        SQLAlchemy model class handled by this repository.
    """

    def __init__(
        self,
        db: Session,
        model: type[ModelType],
    ) -> None:
        self.db = db
        self.model = model

    # ==========================================================
    # Create
    # ==========================================================

    def create(self, obj: ModelType) -> ModelType:
        """
        Persist a model instance.

        Parameters
        ----------
        obj:
            SQLAlchemy model instance.

        Returns
        -------
        ModelType
            Persisted model.
        """
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # ==========================================================
    # Read
    # ==========================================================

    def get_by_id(self, obj_id: int) -> ModelType | None:
        """
        Retrieve a model by its primary key.
        """
        statement = select(self.model).where(self.model.id == obj_id)

        return self.db.scalar(statement)

    def get_all(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ModelType]:
        """
        Retrieve multiple records.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum rows returned.
        """
        statement = (
            select(self.model)
            .offset(skip)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def exists(self, obj_id: int) -> bool:
        """
        Check whether a record exists.
        """
        return self.get_by_id(obj_id) is not None

    def count(self) -> int:
        """
        Return total number of records.
        """
        statement = select(func.count()).select_from(self.model)

        return int(self.db.scalar(statement) or 0)

    # ==========================================================
    # Update
    # ==========================================================

    def update(self, obj: ModelType) -> ModelType:
        """
        Persist changes to an existing model.
        """
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # ==========================================================
    # Delete
    # ==========================================================

    def delete(self, obj: ModelType) -> None:
        """
        Delete a model instance.
        """
        self.db.delete(obj)
        self.db.commit()

    # ==========================================================
    # Session Helpers
    # ==========================================================

    def flush(self) -> None:
        """
        Flush pending SQL statements.
        """
        self.db.flush()

    def refresh(self, obj: ModelType) -> None:
        """
        Refresh an object from the database.
        """
        self.db.refresh(obj)

    def commit(self) -> None:
        """
        Commit current transaction.
        """
        self.db.commit()

    def rollback(self) -> None:
        """
        Roll back current transaction.
        """
        self.db.rollback()