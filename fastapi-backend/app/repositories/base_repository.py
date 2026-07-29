"""
==========================================================
Base Repository
==========================================================

Generic SQLAlchemy repository providing reusable CRUD
operations for all persistence layers.

Responsibilities
----------------
✓ Provide reusable CRUD operations
✓ Encapsulate SQLAlchemy database access
✓ Eliminate duplicated repository code
✓ Handle transaction lifecycle
✓ Provide common query helpers
✓ Remain free of business logic
✓ Provide structured logging
✓ Translate database exceptions

Architecture
------------
This repository is intended to be inherited by concrete
repositories such as:

- UserRepository
- NoteRepository
- BookRepository

Business-specific queries should remain inside concrete
repositories.

Features
--------
✓ SQLAlchemy 2.x style queries
✓ Generic typing
✓ Transaction management
✓ Automatic rollback on failures
✓ Structured logging
✓ Centralized exception handling
✓ Extensible helper methods

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

from __future__ import annotations

from select import select
from typing import Any, Generic, TypeVar

from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.exc import NoResultFound
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseError
from app.core.logging import get_logger
from app.db.base import Base

# ==========================================================
# Logger
# ==========================================================

logger = get_logger(__name__)

# ==========================================================
# Generic Types
# ==========================================================

ModelType = TypeVar(
    "ModelType",
    bound=Base,
)

# ==========================================================
# Base Repository
# ==========================================================


class BaseRepository(Generic[ModelType]):
    """
    Generic SQLAlchemy repository.

    This class provides reusable persistence operations
    shared across all repositories while remaining free of
    business logic.

    Parameters
    ----------
    db:
        Active SQLAlchemy session.

    model:
        SQLAlchemy ORM model managed by the repository.
    """

    # ======================================================
    # Constructor
    # ======================================================

    def __init__(
        self,
        db: Session,
        model: type[ModelType],
    ) -> None:
        """
        Initialize the repository.

        Parameters
        ----------
        db:
            Active SQLAlchemy database session.

        model:
            SQLAlchemy ORM model handled by this repository.
        """

        self.db = db
        self.model = model

        logger.debug(
            "Initialized repository.",
            extra={
                "repository": self.__class__.__name__,
                "model": self.model.__name__,
            },
        )

    # ======================================================
    # Internal Helpers
    # ======================================================

    @property
    def model_name(self) -> str:
        """
        Return the managed model name.

        Returns
        -------
        str
            SQLAlchemy model name.
        """

        return self.model.__name__

    def _rollback(self) -> None:
        """
        Safely roll back the active transaction.

        This method never raises additional exceptions
        during rollback.
        """

        try:
            self.db.rollback()

            logger.debug(
                "Database transaction rolled back.",
                extra={
                    "model": self.model_name,
                },
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "Rollback failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                "Failed to roll back database transaction."
            ) from exc

    def _commit(self) -> None:
        """
        Commit the active transaction.

        Raises
        ------
        DatabaseError
            If the transaction cannot be committed.
        """

        try:
            self.db.commit()

            logger.debug(
                "Database transaction committed.",
                extra={
                    "model": self.model_name,
                },
            )

        except IntegrityError as exc:
            self._rollback()

            logger.exception(
                "Integrity constraint violation.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                "Database integrity constraint violated."
            ) from exc

        except SQLAlchemyError as exc:
            self._rollback()

            logger.exception(
                "Database commit failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                "Database transaction failed."
            ) from exc

    def _refresh(
        self,
        obj: ModelType,
    ) -> None:
        """
        Refresh an ORM object from the database.

        Parameters
        ----------
        obj:
            ORM model instance.
        """

        try:
            self.db.refresh(obj)

        except SQLAlchemyError as exc:
            logger.exception(
                "Failed to refresh ORM instance.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                "Failed to refresh database object."
            ) from exc

    def _commit_and_refresh(
        self,
        obj: ModelType,
    ) -> ModelType:
        """
        Commit the current transaction and refresh the object.

        Parameters
        ----------
        obj:
            ORM instance.

        Returns
        -------
        ModelType
            Refreshed ORM instance.
        """

        self._commit()
        self._refresh(obj)

        return obj

    def _execute_write(
        self,
        operation: str,
        callback: Any,
    ) -> Any:
        """
        Execute a write operation with automatic transaction
        management.

        Parameters
        ----------
        operation:
            Operation name used for structured logging.

        callback:
            Callable executing the write operation.

        Returns
        -------
        Any
            Callback result.

        Raises
        ------
        DatabaseError
            If the database operation fails.
        """

        logger.debug(
            "Executing database write operation.",
            extra={
                "operation": operation,
                "model": self.model_name,
            },
        )

        try:
            return callback()

        except DatabaseError:
            raise

        except SQLAlchemyError as exc:
            self._rollback()

            logger.exception(
                "Database write operation failed.",
                extra={
                    "operation": operation,
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to {operation} {self.model_name}."
            ) from exc

    def _raise_not_found(
        self,
        identifier: Any,
    ) -> None:
        """
        Raise a standardized not-found database exception.

        Parameters
        ----------
        identifier:
            Entity identifier.
        """

        raise DatabaseError(
            f"{self.model_name} with identifier "
            f"{identifier!r} was not found."
        ) from NoResultFound()
        
        # ======================================================
    # Create Operations
    # ======================================================

    def create(
        self,
        obj: ModelType,
    ) -> ModelType:
        """
        Persist a new ORM model.

        Parameters
        ----------
        obj:
            SQLAlchemy ORM instance.

        Returns
        -------
        ModelType
            Persisted ORM instance.
        """

        def operation() -> ModelType:
            self.db.add(obj)

            logger.debug(
                "Creating database object.",
                extra={
                    "model": self.model_name,
                },
            )

            return self._commit_and_refresh(obj)

        return self._execute_write(
            operation="create",
            callback=operation,
        )

    def create_many(
        self,
        objects: list[ModelType],
    ) -> list[ModelType]:
        """
        Persist multiple ORM objects.

        Parameters
        ----------
        objects:
            Collection of ORM instances.

        Returns
        -------
        list[ModelType]
            Persisted ORM objects.
        """

        if not objects:
            return []

        def operation() -> list[ModelType]:
            self.db.add_all(objects)

            logger.debug(
                "Creating multiple database objects.",
                extra={
                    "model": self.model_name,
                    "count": len(objects),
                },
            )

            self._commit()

            for obj in objects:
                self._refresh(obj)

            return objects

        return self._execute_write(
            operation="bulk_create",
            callback=operation,
        )

    # ======================================================
    # Update Operations
    # ======================================================

    def update(
        self,
        obj: ModelType,
    ) -> ModelType:
        """
        Persist modifications to an existing ORM object.

        Parameters
        ----------
        obj:
            Updated ORM instance.

        Returns
        -------
        ModelType
            Updated ORM instance.
        """

        def operation() -> ModelType:
            self.db.add(obj)

            logger.debug(
                "Updating database object.",
                extra={
                    "model": self.model_name,
                },
            )

            return self._commit_and_refresh(obj)

        return self._execute_write(
            operation="update",
            callback=operation,
        )

    def merge(
        self,
        obj: ModelType,
    ) -> ModelType:
        """
        Merge a detached ORM instance into the current session.

        Parameters
        ----------
        obj:
            Detached ORM instance.

        Returns
        -------
        ModelType
            Managed ORM instance.
        """

        def operation() -> ModelType:
            merged = self.db.merge(obj)

            logger.debug(
                "Merging detached ORM object.",
                extra={
                    "model": self.model_name,
                },
            )

            return self._commit_and_refresh(merged)

        return self._execute_write(
            operation="merge",
            callback=operation,
        )

    # ======================================================
    # Delete Operations
    # ======================================================

    def delete(
        self,
        obj: ModelType,
    ) -> None:
        """
        Permanently delete an ORM object.

        Parameters
        ----------
        obj:
            ORM instance to delete.
        """

        def operation() -> None:
            self.db.delete(obj)

            logger.debug(
                "Deleting database object.",
                extra={
                    "model": self.model_name,
                },
            )

            self._commit()

        self._execute_write(
            operation="delete",
            callback=operation,
        )

    def delete_many(
        self,
        objects: list[ModelType],
    ) -> int:
        """
        Permanently delete multiple ORM objects.

        Parameters
        ----------
        objects:
            Collection of ORM instances.

        Returns
        -------
        int
            Number of deleted objects.
        """

        if not objects:
            return 0

        def operation() -> int:
            for obj in objects:
                self.db.delete(obj)

            logger.debug(
                "Deleting multiple database objects.",
                extra={
                    "model": self.model_name,
                    "count": len(objects),
                },
            )

            self._commit()

            return len(objects)

        return self._execute_write(
            operation="bulk_delete",
            callback=operation,
        )

    # ======================================================
    # Session Helpers
    # ======================================================

    def flush(self) -> None:
        """
        Flush pending SQL statements without committing.
        """

        try:
            self.db.flush()

            logger.debug(
                "Database session flushed.",
                extra={
                    "model": self.model_name,
                },
            )

        except SQLAlchemyError as exc:
            self._rollback()

            logger.exception(
                "Database flush failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                "Failed to flush database session."
            ) from exc

    def refresh(
        self,
        obj: ModelType,
    ) -> None:
        """
        Refresh an ORM object from the database.

        Parameters
        ----------
        obj:
            ORM instance.
        """

        self._refresh(obj)

    def commit(self) -> None:
        """
        Commit the active database transaction.
        """

        self._commit()

    def rollback(self) -> None:
        """
        Roll back the active database transaction.
        """

        self._rollback()
        
        # ======================================================
    # Read Operations
    # ======================================================

    def get_by_id(
        self,
        obj_id: int,
    ) -> ModelType | None:
        """
        Retrieve an ORM object by its primary key.

        Parameters
        ----------
        obj_id:
            Primary key value.

        Returns
        -------
        ModelType | None
            Matching ORM instance if found, otherwise None.
        """

        logger.debug(
            "Retrieving object by primary key.",
            extra={
                "model": self.model_name,
                "id": obj_id,
            },
        )

        return self.db.get(
            self.model,
            obj_id,
        )

    def get_all(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ModelType]:
        """
        Retrieve multiple ORM objects.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows to return.

        Returns
        -------
        list[ModelType]
            Retrieved ORM objects.
        """

        logger.debug(
            "Retrieving multiple objects.",
            extra={
                "model": self.model_name,
                "skip": skip,
                "limit": limit,
            },
        )

        statement = (
            select(self.model)
            .offset(skip)
            .limit(limit)
        )

        return list(
            self.db.scalars(statement).all()
        )

    def get_one_by(
        self,
        **filters: Any,
    ) -> ModelType | None:
        """
        Retrieve a single ORM object matching the
        supplied filters.

        Parameters
        ----------
        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        ModelType | None
        """

        logger.debug(
            "Retrieving single object using filters.",
            extra={
                "model": self.model_name,
                "filters": filters,
            },
        )

        statement = (
            select(self.model)
            .filter_by(**filters)
            .limit(1)
        )

        return self.db.scalar(statement)

    def get_many_by(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        **filters: Any,
    ) -> list[ModelType]:
        """
        Retrieve multiple ORM objects using equality
        filters.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum rows to return.

        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        list[ModelType]
        """

        logger.debug(
            "Retrieving multiple filtered objects.",
            extra={
                "model": self.model_name,
                "filters": filters,
            },
        )

        statement = (
            select(self.model)
            .filter_by(**filters)
            .offset(skip)
            .limit(limit)
        )

        return list(
            self.db.scalars(statement).all()
        )

    # ======================================================
    # Existence
    # ======================================================

    def exists(
        self,
        obj_id: int,
    ) -> bool:
        """
        Determine whether a record exists.

        Parameters
        ----------
        obj_id:
            Primary key.

        Returns
        -------
        bool
        """

        return (
            self.get_by_id(obj_id)
            is not None
        )

    def exists_by(
        self,
        **filters: Any,
    ) -> bool:
        """
        Determine whether a matching record exists.

        Parameters
        ----------
        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        bool
        """

        statement = (
            select(func.count())
            .select_from(self.model)
            .filter_by(**filters)
        )

        total = self.db.scalar(statement)

        return bool(total)

    # ======================================================
    # Count Operations
    # ======================================================

    def count(self) -> int:
        """
        Return total number of records.

        Returns
        -------
        int
        """

        statement = (
            select(func.count())
            .select_from(self.model)
        )

        return int(
            self.db.scalar(statement)
            or 0
        )

    def count_by(
        self,
        **filters: Any,
    ) -> int:
        """
        Count matching records.

        Parameters
        ----------
        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        int
        """

        statement = (
            select(func.count())
            .select_from(self.model)
            .filter_by(**filters)
        )

        return int(
            self.db.scalar(statement)
            or 0
        )


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "BaseRepository",
]