"""
==========================================================
Base Pydantic Schemas
==========================================================

Provides reusable base schemas for the Team Productivity
Platform.

Responsibilities
----------------
✓ Shared Pydantic configuration
✓ Timestamp schemas
✓ ID schemas
✓ Base ORM schema
✓ Common reusable mixins

Compatible With
---------------
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x
==========================================================
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================================
# Base Schema
# ==========================================================


class BaseSchema(BaseModel):
    """
    Base schema for all Pydantic models.

    Features
    --------
    ✓ ORM compatibility
    ✓ Ignore extra fields
    ✓ Validate assignments
    """

    model_config = ConfigDict(
        from_attributes=True,
        extra="ignore",
        validate_assignment=True,
        populate_by_name=True,
    )


# ==========================================================
# ID Mixin
# ==========================================================


class IDSchema(BaseSchema):
    """
    Provides an integer primary key.
    """

    id: int


# ==========================================================
# Timestamp Mixin
# ==========================================================


class TimestampSchema(BaseSchema):
    """
    Provides audit timestamps.
    """

    created_at: datetime

    updated_at: datetime


# ==========================================================
# Database Entity Base
# ==========================================================


class EntitySchema(
    IDSchema,
    TimestampSchema,
):
    """
    Base schema for database entities.

    Includes:
    - id
    - created_at
    - updated_at
    """

    pass