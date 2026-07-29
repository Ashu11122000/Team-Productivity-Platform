"""
==========================================================
Database Initialization
==========================================================

Initializes the PostgreSQL database for the
Team Productivity Platform.

Responsibilities
----------------
✓ Verify database connectivity
✓ Initialize SQLAlchemy metadata (development only)
✓ Support Alembic migrations (production)
✓ Structured startup logging
✓ Fail-fast initialization

Compatible With
---------------
- SQLAlchemy 2.x
- PostgreSQL
- psycopg v3
- Alembic
==========================================================
"""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.logging import get_logger
from app.db.base import Base
from app.db.session import engine

logger = get_logger(__name__)


# ==========================================================
# Database Connectivity
# ==========================================================

def check_database_connection() -> bool:
    """
    Verify PostgreSQL connectivity.

    Returns
    -------
    bool
        True if the database connection succeeds.

    Raises
    ------
    SQLAlchemyError
        If the database cannot be reached.
    """

    try:
        with engine.begin() as connection:
            connection.execute(text("SELECT 1"))

        logger.info("Database connection verified successfully.")
        return True

    except SQLAlchemyError as exc:
        logger.exception(
            "Failed to connect to PostgreSQL: %s",
            exc,
        )
        raise


# ==========================================================
# Schema Initialization
# ==========================================================

def create_tables() -> None:
    """
    Create database tables.

    Intended only for local development.

    Production deployments should rely exclusively
    on Alembic migrations.
    """

    if not settings.is_development:
        logger.info(
            "Skipping Base.metadata.create_all(); "
            "schema management is handled by Alembic."
        )
        return

    try:
        Base.metadata.create_all(bind=engine)

        logger.info(
            "Development database schema initialized."
        )

    except SQLAlchemyError as exc:
        logger.exception(
            "Failed to create database schema: %s",
            exc,
        )
        raise


# ==========================================================
# Database Initialization
# ==========================================================

def initialize_database() -> None:
    """
    Initialize the database.

    Startup sequence

    1. Verify PostgreSQL connectivity.
    2. Create development schema when appropriate.
    """

    logger.info("=" * 80)
    logger.info("Starting database initialization.")

    check_database_connection()

    create_tables()

    logger.info("Database initialization completed successfully.")
    logger.info("=" * 80)


__all__ = [
    "check_database_connection",
    "create_tables",
    "initialize_database",
]