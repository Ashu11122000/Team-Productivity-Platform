"""
==========================================================
Database Initialization
==========================================================

Initializes the PostgreSQL database for the
Team Productivity Platform.

Responsibilities
----------------
✓ Verify database connectivity
✓ Create all SQLAlchemy tables
✓ Log initialization status
✓ Raise errors on startup failures

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

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.logging import get_logger
from app.db.base import Base
from app.db.session import engine

logger = get_logger(__name__)


# ==========================================================
# Database Connection Check
# ==========================================================

def check_database_connection() -> bool:
    """
    Verify that PostgreSQL is reachable.

    Returns
    -------
    bool
        True if the connection succeeds.

    Raises
    ------
    SQLAlchemyError
        If the database cannot be reached.
    """

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        logger.info("Successfully connected to PostgreSQL.")

        return True

    except SQLAlchemyError as exc:
        logger.exception(
            "Failed to connect to PostgreSQL."
        )
        raise exc


# ==========================================================
# Create Database Tables
# ==========================================================

def create_database() -> None:
    """
    Create all SQLAlchemy tables.

    Tables are created only if they do not already exist.
    """

    try:
        Base.metadata.create_all(bind=engine)

        logger.info(
            "Database tables created successfully."
        )

    except SQLAlchemyError as exc:
        logger.exception(
            "Failed to create database tables."
        )
        raise exc


# ==========================================================
# Initialize Database
# ==========================================================

def init_db() -> None:
    """
    Initialize the database.

    Steps
    -----
    1. Verify database connection.
    2. Create all database tables.
    """

    logger.info("Initializing database...")

    check_database_connection()

    create_database()

    logger.info("Database initialization completed successfully.")