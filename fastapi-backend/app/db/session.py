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
✓ Handle PostgreSQL connections
✓ Ensure proper session lifecycle

Database
--------
PostgreSQL + SQLAlchemy 2.0 + psycopg

Architecture
------------
Next.js
    │
    ▼
FastAPI
    │
    ▼
SQLAlchemy ORM
    │
    ▼
PostgreSQL

==========================================================
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# ==========================================================
# Database Engine
# ==========================================================

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=1800,
    pool_timeout=30,
    future=True,
)

# ==========================================================
# Session Factory
# ==========================================================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

logger.info("Database engine initialized successfully.")

# ==========================================================
# Database Dependency
# ==========================================================

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    Usage
    -----
    db: Session = Depends(get_db)

    Lifecycle
    ---------
    - Create session
    - Yield session
    - Automatically close session
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()