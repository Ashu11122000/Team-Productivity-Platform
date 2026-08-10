"""
==========================================================
Base Repository
==========================================================

Generic SQLAlchemy repository providing reusable CRUD
operations for persistence layers.

Responsibilities
----------------
✓ Provide reusable CRUD operations.
✓ Encapsulate SQLAlchemy database access.
✓ Eliminate duplicated repository code.
✓ Handle repository-level transaction operations.
✓ Provide common query helpers.
✓ Remain free of business logic.
✓ Provide structured logging.
✓ Translate SQLAlchemy database exceptions.
✓ Provide strongly typed reusable repository helpers.

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
✓ SQLAlchemy 2.x style queries.
✓ Generic typing.
✓ Explicit transaction operations.
✓ Automatic rollback on failed write operations.
✓ Structured logging.
✓ Centralized database exception translation.
✓ Extensible query helpers.
✓ PostgreSQL compatibility.
✓ Alembic compatibility.

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

from collections.abc import Callable
from typing import Any, TypeVar

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError, NoResultFound, SQLAlchemyError
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

ResultType = TypeVar("ResultType")

# ==========================================================
# Base Repository
# ==========================================================


class BaseRepository[ModelType]:
    """
    Generic SQLAlchemy repository.

    This class provides reusable persistence operations
    shared across concrete repositories while remaining free
    of application-specific business logic.

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
            "Repository initialized.",
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
        Return the managed SQLAlchemy model name.

        Returns
        -------
        str
            Name of the managed ORM model.
        """

        return self.model.__name__

    def _rollback(self) -> None:
        """
        Roll back the active database transaction.

        Raises
        ------
        DatabaseError
            If SQLAlchemy cannot perform the rollback.
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
                "Database transaction rollback failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                "Failed to roll back database transaction."
            ) from exc

    def _commit(self) -> None:
        """
        Commit the active database transaction.

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
                "Database integrity constraint violation.",
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
                "Database transaction commit failed.",
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
            ORM model instance to refresh.

        Raises
        ------
        DatabaseError
            If the object cannot be refreshed.
        """

        try:
            self.db.refresh(obj)

            logger.debug(
                "Database object refreshed.",
                extra={
                    "model": self.model_name,
                },
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "Database object refresh failed.",
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
        Commit the current transaction and refresh an ORM object.

        Parameters
        ----------
        obj:
            ORM instance to persist and refresh.

        Returns
        -------
        ModelType
            Persisted and refreshed ORM instance.
        """

        self._commit()
        self._refresh(obj)

        return obj

    def _execute_write(
        self,
        operation: str,
        callback: Callable[[], ResultType],
    ) -> ResultType:
        """
        Execute a repository write operation.

        SQLAlchemy failures are translated into the application's
        established DatabaseError type. Failed transactions are
        rolled back before the error is propagated.

        Parameters
        ----------
        operation:
            Short operation name used for structured logging.

        callback:
            Callable containing the actual database write operation.

        Returns
        -------
        ResultType
            Result returned by the callback.

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

        This helper is intentionally explicit and is not used by
        ``get_by_id()`` because the established repository contract
        allows retrieval methods to return ``None`` when an entity
        does not exist.

        Parameters
        ----------
        identifier:
            Entity identifier.

        Raises
        ------
        DatabaseError
            Always raised to indicate the entity was not found.
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
            Persisted and refreshed ORM instance.
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
            Persisted and refreshed ORM objects.
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
            Updated and refreshed ORM instance.
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
            Managed, persisted, and refreshed ORM instance.
        """

        def operation() -> ModelType:
            merged = self.db.merge(obj)

            logger.debug(
                "Merging detached database object.",
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

        Raises
        ------
        DatabaseError
            If the session cannot be flushed.
        """

        try:
            self.db.flush()

            logger.debug(
                "Database session flushed.",
                extra={
                    "model": self.model_name,
                },
            )

        except IntegrityError as exc:
            self._rollback()

            logger.exception(
                "Database integrity constraint violation during flush.",
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
                "Database session flush failed.",
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
            ORM instance to refresh.
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
            Matching ORM instance if found, otherwise ``None``.

        Raises
        ------
        DatabaseError
            If the database lookup fails.
        """

        logger.debug(
            "Retrieving object by primary key.",
            extra={
                "model": self.model_name,
            },
        )

        try:
            return self.db.get(
                self.model,
                obj_id,
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "Database primary-key lookup failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to retrieve {self.model_name}."
            ) from exc

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

        Raises
        ------
        DatabaseError
            If the database query fails.

        ValueError
            If ``skip`` or ``limit`` is invalid.
        """

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

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

        try:
            return list(
                self.db.scalars(statement).all()
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "Database collection lookup failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to retrieve {self.model_name} records."
            ) from exc

    def get_one_by(
        self,
        **filters: Any,
    ) -> ModelType | None:
        """
        Retrieve a single ORM object matching equality filters.

        Parameters
        ----------
        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        ModelType | None
            Matching ORM instance if found, otherwise ``None``.

        Raises
        ------
        DatabaseError
            If the database query fails.
        """

        logger.debug(
            "Retrieving single object using filters.",
            extra={
                "model": self.model_name,
                "filter_fields": tuple(filters.keys()),
            },
        )

        statement = (
            select(self.model)
            .filter_by(**filters)
            .limit(1)
        )

        try:
            return self.db.scalar(statement)

        except SQLAlchemyError as exc:
            logger.exception(
                "Filtered single-object lookup failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to retrieve {self.model_name}."
            ) from exc

    def get_many_by(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        **filters: Any,
    ) -> list[ModelType]:
        """
        Retrieve multiple ORM objects using equality filters.

        Parameters
        ----------
        skip:
            Number of rows to skip.

        limit:
            Maximum number of rows to return.

        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        list[ModelType]
            Retrieved ORM objects.

        Raises
        ------
        DatabaseError
            If the database query fails.

        ValueError
            If ``skip`` or ``limit`` is invalid.
        """

        self._validate_pagination(
            skip=skip,
            limit=limit,
        )

        logger.debug(
            "Retrieving filtered objects.",
            extra={
                "model": self.model_name,
                "skip": skip,
                "limit": limit,
                "filter_fields": tuple(filters.keys()),
            },
        )

        statement = (
            select(self.model)
            .filter_by(**filters)
            .offset(skip)
            .limit(limit)
        )

        try:
            return list(
                self.db.scalars(statement).all()
            )

        except SQLAlchemyError as exc:
            logger.exception(
                "Filtered collection lookup failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to retrieve {self.model_name} records."
            ) from exc

    # ======================================================
    # Existence
    # ======================================================

    def exists(
        self,
        obj_id: int,
    ) -> bool:
        """
        Determine whether a record exists by primary key.

        Parameters
        ----------
        obj_id:
            Primary key.

        Returns
        -------
        bool
            ``True`` when the record exists.

        Raises
        ------
        DatabaseError
            If the database lookup fails.
        """

        return self.get_by_id(obj_id) is not None

    def exists_by(
        self,
        **filters: Any,
    ) -> bool:
        """
        Determine whether at least one record matches filters.

        Parameters
        ----------
        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        bool
            ``True`` when at least one matching record exists.

        Raises
        ------
        DatabaseError
            If the database query fails.
        """

        statement = (
            select(self.model)
            .filter_by(**filters)
            .limit(1)
        )

        try:
            return self.db.scalars(statement).first() is not None

        except SQLAlchemyError as exc:
            logger.exception(
                "Database existence check failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to check whether {self.model_name} exists."
            ) from exc

    # ======================================================
    # Count Operations
    # ======================================================

    def count(self) -> int:
        """
        Return the total number of records.

        Returns
        -------
        int
            Total record count.

        Raises
        ------
        DatabaseError
            If the database query fails.
        """

        statement = (
            select(func.count())
            .select_from(self.model)
        )

        try:
            total = self.db.scalar(statement)

            return int(total or 0)

        except SQLAlchemyError as exc:
            logger.exception(
                "Database count query failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to count {self.model_name} records."
            ) from exc

    def count_by(
        self,
        **filters: Any,
    ) -> int:
        """
        Count records matching equality filters.

        Parameters
        ----------
        **filters:
            SQLAlchemy equality filters.

        Returns
        -------
        int
            Number of matching records.

        Raises
        ------
        DatabaseError
            If the database query fails.
        """

        statement = (
            select(func.count())
            .select_from(self.model)
            .filter_by(**filters)
        )

        try:
            total = self.db.scalar(statement)

            return int(total or 0)

        except SQLAlchemyError as exc:
            logger.exception(
                "Filtered database count query failed.",
                extra={
                    "model": self.model_name,
                },
            )

            raise DatabaseError(
                f"Failed to count filtered {self.model_name} records."
            ) from exc

    # ======================================================
    # Validation Helpers
    # ======================================================

    @staticmethod
    def _validate_pagination(
        *,
        skip: int,
        limit: int,
    ) -> None:
        """
        Validate repository pagination parameters.

        Parameters
        ----------
        skip:
            Number of records to skip.

        limit:
            Maximum number of records to return.

        Raises
        ------
        ValueError
            If ``skip`` is negative or ``limit`` is not positive.
        """

        if isinstance(skip, bool) or skip < 0:
            raise ValueError(
                "skip must be a non-negative integer."
            )

        if isinstance(limit, bool) or limit <= 0:
            raise ValueError(
                "limit must be a positive integer."
            )

        if not isinstance(skip, int):
            raise ValueError(
                "skip must be a non-negative integer."
            )

        if not isinstance(limit, int):
            raise ValueError(
                "limit must be a positive integer."
            )


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "BaseRepository",
]