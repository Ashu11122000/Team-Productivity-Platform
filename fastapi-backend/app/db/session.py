"""
==========================================================
Database Session Configuration
==========================================================

Creates and manages the SQLAlchemy engine and database
sessions for the Team Productivity Platform.

Responsibilities
----------------
✓ Create SQLAlchemy engine
✓ Configure connection pooling
✓ Provide FastAPI database dependency
✓ Manage SQLAlchemy session lifecycle

Compatible With
---------------
- SQLAlchemy 2.x
- PostgreSQL
- psycopg v3
- FastAPI
==========================================================
"""

from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# ==========================================================
# SQLAlchemy Engine
# ==========================================================

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=1800,
)

logger.info("SQLAlchemy engine initialized.")

# ==========================================================
# Session Factory
# ==========================================================

SessionFactory: sessionmaker[Session] = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

# ==========================================================
# Database Dependency
# ==========================================================


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional
    SQLAlchemy session.

    The session lifecycle is:

    1. Create session
    2. Yield to request
    3. Roll back if an exception occurs
    4. Close the session
    """

    session = SessionFactory()

    try:
        yield session

    except Exception:
        session.rollback()
        logger.exception(
            "Database transaction rolled back."
        )
        raise

    finally:
        session.close()