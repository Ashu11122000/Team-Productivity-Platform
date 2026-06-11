"""
Database configuration for the Team Productivity Platform.

Responsibilities:
- Create and manage the SQLAlchemy engine.
- Provide database sessions to FastAPI routes and services.
- Support PostgreSQL connectivity.
- Enable connection pooling for production workloads.
- Serve FastAPI-owned modules:
    - Authentication
    - Users 
    - Notes
    - Open Library integrations
    
Architecture:
    Next.js Frontend
        ↓
    FastAPI
        ↓
    SQLAlchemy ORM
        ↓
    PostgreSQL
    
NestJS may connect to the same PostgreSQL instance using its own ORM (TypeORM/Prisma) but does not depend on this module.
"""
from collections.abc import Generator
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# Database URL
password = quote_plus(settings.DB_PASSWORD)

DATABASE_URL = (
    f"postgreSQL+psycopg2://{settings.DB_USER}:{password}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

# SQLAlchemy Engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    echo=settings.DEBUG,
)

# Session Factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

# Dependency
def get_db() -> Generator[Session, None, None]:
    """
    FastAPI database dependency.
    
    Usage:
        db: Session = Depends(get_db)
        
    Ensures:
        - Session creation per request
        - Automatic cleanup
        - Transaction safety
    """
    db = SessionLocal()
    
    try: 
        yield db
        
    finally:
        db.close()