"""
==========================================================
Base Pydantic Schemas
==========================================================

Responsibilities
----------------
Provides reusable base schemas for the Team Productivity
Platform.

Features
--------
✓ Shared Pydantic configuration
✓ SQLAlchemy ORM compatibility
✓ ID mixins
✓ Timestamp mixins
✓ Database entity base schema
✓ Assignment validation
✓ Alias population support

Compatible With
---------------
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x

Python Version
--------------
3.12+

----------------------------------------------------------
Imports
----------------------------------------------------------
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict

# ==========================================================
# Shared Model Configuration
# ==========================================================

#
# Centralized Pydantic configuration used across all schemas.
#
MODEL_CONFIG = ConfigDict(
    from_attributes=True,
    extra="ignore",
    validate_assignment=True,
    populate_by_name=True,
)

# ==========================================================
# Base Schema
# ==========================================================


class BaseSchema(BaseModel):
    """
    Base class for all Pydantic schemas.

    Responsibilities
    ----------------
    - Enable SQLAlchemy ORM serialization
    - Ignore unexpected input fields
    - Validate attribute assignments
    - Support alias population

    Notes
    -----
    All application schemas should inherit from this class
    unless a specialized configuration is required.
    """

    model_config = MODEL_CONFIG


# ==========================================================
# ID Schema
# ==========================================================


class IDSchema(BaseSchema):
    """
    Reusable schema providing an integer primary key.

    Attributes
    ----------
    id : int
        Database primary key.
    """

    id: int


# ==========================================================
# Timestamp Schema
# ==========================================================


class TimestampSchema(BaseSchema):
    """
    Reusable schema providing audit timestamps.

    Attributes
    ----------
    created_at : datetime
        UTC timestamp indicating when the entity was created.

    updated_at : datetime
        UTC timestamp indicating when the entity was last
        modified.
    """

    created_at: datetime
    updated_at: datetime


# ==========================================================
# Entity Schema
# ==========================================================


class EntitySchema(
    IDSchema,
    TimestampSchema,
):
    """
    Base schema for persisted database entities.

    Inherits
    --------
    - id
    - created_at
    - updated_at

    This schema should be used as the parent for response
    models representing persisted database records.
    """

    pass


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "MODEL_CONFIG",
    "BaseSchema",
    "IDSchema",
    "TimestampSchema",
    "EntitySchema",
]