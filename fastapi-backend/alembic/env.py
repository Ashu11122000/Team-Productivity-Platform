"""
===============================================================================
Alembic Migration Environment
===============================================================================

Alembic environment configuration for the Team Productivity Platform.

Responsibilities
----------------
• Configure Alembic for SQLAlchemy 2.x.
• Connect Alembic to the application's PostgreSQL configuration.
• Expose the application's SQLAlchemy metadata to Alembic.
• Import all ORM models required for metadata registration.
• Support offline migrations.
• Support online migrations.
• Enable reliable schema autogeneration.
• Keep production database schema management under Alembic.

Architecture
------------
Application Configuration
        │
        ▼
app.core.config.settings
        │
        ▼
Database URL
        │
        ▼
Alembic
        │
        ├── Offline Migration
        │
        └── Online Migration
                │
                ▼
        PostgreSQL

ORM Metadata
------------
app.db.base.Base
        │
        ▼
Base.metadata
        │
        ├── User
        └── Note
        │
        ▼
Alembic Autogeneration

Production Rule
---------------
Production schema changes must be managed through Alembic migrations.

Do NOT use:

    Base.metadata.create_all()

as the production migration strategy.

Compatible With
---------------
• Python 3.12+
• SQLAlchemy 2.x
• Alembic
• PostgreSQL
• psycopg v3
"""

from __future__ import annotations

from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine
from sqlalchemy import pool

from app.core.config import settings
from app.db.base import Base
from app.models.note import Note  # noqa: F401
from app.models.user import User  # noqa: F401


# =============================================================================
# Alembic Configuration
# =============================================================================

config = context.config


# =============================================================================
# Logging Configuration
# =============================================================================

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# =============================================================================
# SQLAlchemy Metadata
# =============================================================================
#
# Importing User and Note above is intentional.
#
# SQLAlchemy registers ORM models in Base.metadata when their model modules
# are imported.
#
# Without importing the model modules, Base.metadata may not contain the
# application's tables during Alembic autogeneration.
#
# The resulting metadata is therefore:
#
#     Base.metadata
#         ├── users
#         └── notes
#
# This allows:
#
#     alembic revision --autogenerate
#
# to compare the current database schema with the application's ORM models.
# =============================================================================

target_metadata = Base.metadata


# =============================================================================
# Alembic Context Configuration
# =============================================================================

def _configure_context(
    *,
    connection: object | None = None,
) -> None:
    """
    Configure the Alembic migration context.

    Parameters
    ----------
    connection:
        Active SQLAlchemy database connection for online migrations.

    Notes
    -----
    Alembic requires different configuration for offline and online
    migration execution.

    Offline mode uses the configured database URL without establishing
    a live database connection.

    Online mode receives an active SQLAlchemy connection.
    """

    if connection is None:
        context.configure(
            url=settings.DATABASE_URL,
            target_metadata=target_metadata,
            literal_binds=True,
            dialect_opts={"paramstyle": "named"},
            compare_type=True,
            compare_server_default=True,
            transaction_per_migration=True,
        )
        return

    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
        transaction_per_migration=True,
    )


# =============================================================================
# Offline Migration
# =============================================================================

def run_migrations_offline() -> None:
    """
    Run Alembic migrations in offline mode.

    Offline mode does not establish a live database connection.

    Instead, Alembic receives the application's configured database URL and
    generates SQL statements that can be reviewed or executed separately.

    This mode is useful for:
        • SQL generation
        • Migration inspection
        • Deployment workflows
        • Database administrators

    The application configuration remains the source of truth for the
    PostgreSQL connection URL.
    """

    _configure_context()

    with context.begin_transaction():
        context.run_migrations()


# =============================================================================
# Online Migration
# =============================================================================

def run_migrations_online() -> None:
    """
    Run Alembic migrations against the live PostgreSQL database.

    A dedicated SQLAlchemy engine is created for Alembic using the application's
    DATABASE_URL.

    NullPool is intentionally used because Alembic is a migration process,
    not a long-running application request process.

    This prevents Alembic from maintaining an unnecessary connection pool.
    """

    connectable = create_engine(
        settings.DATABASE_URL,
        poolclass=pool.NullPool,
    )

    try:
        with connectable.connect() as connection:
            _configure_context(connection=connection)

            with context.begin_transaction():
                context.run_migrations()
    finally:
        connectable.dispose()


# =============================================================================
# Migration Entry Point
# =============================================================================

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()