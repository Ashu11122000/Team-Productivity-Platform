"""
===============================================================================
Database Initialization
===============================================================================

Database initialization and connectivity utilities for the
Team Productivity Platform.

Responsibilities
----------------
• Verify PostgreSQL database connectivity.
• Initialize the SQLAlchemy schema during local development only.
• Keep production schema management under Alembic.
• Provide fail-fast database initialization.
• Provide structured application logging.
• Expose reusable database initialization functions.

Architecture
------------

Application Startup
        │
        ▼
initialize_database()
        │
        ├── check_database_connection()
        │
        └── create_tables()
                │
                ├── Development
                │       └── SQLAlchemy metadata initialization
                │
                └── Production
                        └── Alembic migrations

Production Rule
---------------

Production database schema changes must be performed through Alembic.

This module deliberately does NOT use:

    Base.metadata.create_all()

for production schema management.

Compatible With
---------------

• SQLAlchemy 2.x
• PostgreSQL
• psycopg v3
• Alembic
• Python 3.12+
===============================================================================
"""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.logging import get_logger
from app.db.base import Base
from app.db.session import engine


# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# Module Constants
# =============================================================================

DATABASE_INITIALIZATION_SEPARATOR = "=" * 80

DATABASE_CONNECTION_CHECK_QUERY = text("SELECT 1")


# =============================================================================
# Database Connectivity
# =============================================================================


def check_database_connection() -> bool:
    """
    Verify connectivity to the configured PostgreSQL database.

    A lightweight ``SELECT 1`` query is executed using the application's
    configured SQLAlchemy engine.

    Returns
    -------
    bool
        ``True`` when the database connection succeeds.

    Raises
    ------
    SQLAlchemyError
        If the database cannot be reached or the connection/query fails.

    Notes
    -----
    The exception is re-raised intentionally so application startup can fail
    fast instead of continuing with an unavailable database.
    """
    logger.debug(
        "Checking PostgreSQL database connectivity.",
    )

    try:
        with engine.connect() as connection:
            connection.execute(
                DATABASE_CONNECTION_CHECK_QUERY,
            )

        logger.info(
            "PostgreSQL database connection verified successfully.",
        )

        return True

    except SQLAlchemyError:
        logger.exception(
            "Failed to verify PostgreSQL database connectivity.",
        )
        raise


# =============================================================================
# Development Schema Initialization
# =============================================================================


def create_tables() -> None:
    """
    Create database tables for local development.

    ``Base.metadata.create_all()`` is intentionally restricted to the
    development environment.

    Production deployments must use Alembic migrations instead.

    Raises
    ------
    SQLAlchemyError
        If SQLAlchemy cannot create the development schema.
    """
    # -------------------------------------------------------------------------
    # Production / non-development environment
    # -------------------------------------------------------------------------

    if not settings.is_development:
        logger.info(
            "Skipping SQLAlchemy metadata initialization. "
            "Production schema management is handled by Alembic.",
        )

        return

    # -------------------------------------------------------------------------
    # Development schema initialization
    # -------------------------------------------------------------------------

    logger.debug(
        "Development environment detected. "
        "Initializing SQLAlchemy database metadata.",
    )

    try:
        Base.metadata.create_all(
            bind=engine,
        )

        logger.info(
            "Development database schema initialized successfully.",
        )

    except SQLAlchemyError:
        logger.exception(
            "Failed to initialize the development database schema.",
        )
        raise


# =============================================================================
# Database Initialization
# =============================================================================


def initialize_database() -> None:
    """
    Initialize the application's database.

    Startup sequence
    ----------------
    1. Verify PostgreSQL connectivity.
    2. Initialize the development schema when applicable.
    3. Leave production schema management to Alembic.

    Raises
    ------
    SQLAlchemyError
        If database connectivity or development schema initialization fails.

    Notes
    -----
    This function intentionally fails fast. The application should not start
    normally when its required database is unavailable.
    """
    logger.info(
        DATABASE_INITIALIZATION_SEPARATOR,
    )

    logger.info(
        "Starting database initialization.",
    )

    # -------------------------------------------------------------------------
    # Step 1 — Verify database connectivity
    # -------------------------------------------------------------------------

    check_database_connection()

    # -------------------------------------------------------------------------
    # Step 2 — Development-only schema initialization
    # -------------------------------------------------------------------------

    create_tables()

    # -------------------------------------------------------------------------
    # Initialization completed
    # -------------------------------------------------------------------------

    logger.info(
        "Database initialization completed successfully.",
    )

    logger.info(
        DATABASE_INITIALIZATION_SEPARATOR,
    )


# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    "check_database_connection",
    "create_tables",
    "initialize_database",
]