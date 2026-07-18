"""
==========================================================
Database Initialization
==========================================================

Initializes the PostgreSQL database for the
Team Productivity Platform.

Responsibilities
----------------
✓ Verify database connectivity
✓ Initialize SQLAlchemy metadata (development)
✓ Support Alembic migrations (production)
✓ Log initialization lifecycle
✓ Raise startup errors immediately

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


def check_database_connection() -> None:
    """
    Verify database connectivity.

    Raises
    ------
    SQLAlchemyError
        If PostgreSQL cannot be reached.
    """

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        logger.info("Database connection verified.")

    except SQLAlchemyError as exc:
        logger.exception(
            "Unable to connect to PostgreSQL."
        )
        raise


# ==========================================================
# Schema Initialization
# ==========================================================


def create_tables() -> None:
    """
    Create database tables.

    This method is intended only for development.

    Production environments should use Alembic
    migrations instead.
    """

    if settings.is_production:
        logger.info(
            "Production environment detected. "
            "Skipping SQLAlchemy create_all(). "
            "Use Alembic migrations instead."
        )
        return

    try:
        Base.metadata.create_all(bind=engine)

        logger.info(
            "Database tables created successfully."
        )

    except SQLAlchemyError:
        logger.exception(
            "Failed to create database tables."
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
    2. Create tables (development only).
    """

    logger.info("=" * 80)
    logger.info("Initializing database...")

    check_database_connection()

    create_tables()

    logger.info("Database initialization completed.")
    logger.info("=" * 80)