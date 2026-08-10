"""
===============================================================================
Database Session Configuration
===============================================================================

Creates and manages the SQLAlchemy engine and database sessions for the
Team Productivity Platform.

Responsibilities
----------------
• Create the SQLAlchemy database engine.
• Configure PostgreSQL connection pooling.
• Configure connection health checks.
• Provide the application's database session factory.
• Provide the FastAPI database dependency.
• Manage SQLAlchemy session lifecycle.
• Roll back failed request transactions.
• Ensure database sessions are always closed.

Architecture
------------

FastAPI Request
       │
       ▼
   get_db()
       │
       ▼
 SessionLocal
       │
       ▼
 SQLAlchemy Session
       │
       ├── Service
       │
       └── Repository
               │
               ▼
          SQLAlchemy Engine
               │
               ▼
            PostgreSQL

Database Strategy
-----------------
This backend intentionally uses synchronous SQLAlchemy sessions.

The project does not mix synchronous and asynchronous SQLAlchemy session
patterns unnecessarily.

Connection pooling is configured through application settings so local
development and production can use different values without changing Python
code.

Compatible With
---------------

• SQLAlchemy 2.x
• PostgreSQL
• psycopg v3
• FastAPI
• Python 3.12+
===============================================================================
"""

from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.core.logging import get_logger


# =============================================================================
# Module Logger
# =============================================================================

logger = get_logger(__name__)


# =============================================================================
# SQLAlchemy Engine
# =============================================================================

engine = create_engine(
    settings.DATABASE_URL,
    echo=(
        settings.DEBUG
        and settings.LOG_LEVEL.upper() == "DEBUG"
    ),
    pool_pre_ping=settings.DATABASE_POOL_PRE_PING,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_recycle=settings.DATABASE_POOL_RECYCLE,
)


logger.info(
    "SQLAlchemy database engine initialized.",
)


# =============================================================================
# Session Factory
# =============================================================================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    class_=Session,
)


# =============================================================================
# FastAPI Database Dependency
# =============================================================================


def get_db() -> Generator[Session, None, None]:
    """
    Provide a SQLAlchemy database session for a request.

    Session lifecycle
    -----------------
    1. Create a database session.
    2. Yield the session to the dependent endpoint/service.
    3. Roll back an active transaction when an unhandled exception occurs.
    4. Always close the session.

    Yields
    ------
    Session
        Active SQLAlchemy database session.

    Raises
    ------
    Exception
        Re-raises the original application exception after rolling back the
        active transaction.

    Notes
    -----
    Transaction commits are intentionally not performed here.

    Services/repositories that own a write operation are responsible for
    defining the appropriate transaction boundary.

    The dependency owns the session lifecycle and guarantees cleanup.
    """
    session = SessionLocal()

    try:
        yield session

    except Exception:
        # ---------------------------------------------------------------------
        # Roll back only when a transaction is currently active.
        # ---------------------------------------------------------------------

        if session.in_transaction():
            session.rollback()

            logger.warning(
                "Database transaction rolled back after request failure.",
            )

        raise

    finally:
        # ---------------------------------------------------------------------
        # Always release the session and return the connection to the pool.
        # ---------------------------------------------------------------------

        session.close()


# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    "engine",
    "SessionLocal",
    "get_db",
]