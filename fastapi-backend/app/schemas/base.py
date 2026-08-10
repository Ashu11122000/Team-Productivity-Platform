"""
===============================================================================
Base Pydantic Schemas
===============================================================================

Reusable Pydantic base schemas for the Team Productivity Platform.

Responsibilities
----------------
• Provide shared Pydantic configuration.
• Support SQLAlchemy ORM object serialization.
• Provide reusable ID fields.
• Provide reusable audit timestamp fields.
• Provide a common persisted-entity schema.
• Validate assignment operations.
• Support population by field name when aliases are defined.

Compatible With
---------------
• FastAPI
• Pydantic v2
• SQLAlchemy 2.x
• Python 3.12+
"""

from __future__ import annotations

from datetime import datetime
from typing import Final

from pydantic import BaseModel, ConfigDict


# =============================================================================
# Shared Model Configuration
# =============================================================================

MODEL_CONFIG: Final[ConfigDict] = ConfigDict(
    # -------------------------------------------------------------------------
    # SQLAlchemy ORM Compatibility
    # -------------------------------------------------------------------------
    #
    # Allows Pydantic models to read values from object attributes instead of
    # requiring dictionary-only input.
    #
    # This is important for:
    #
    # SQLAlchemy ORM object
    #          ↓
    # Pydantic response schema
    #
    from_attributes=True,

    # -------------------------------------------------------------------------
    # Unexpected Fields
    # -------------------------------------------------------------------------
    #
    # Preserve the existing project contract by ignoring fields that are not
    # declared by a schema.
    #
    # This is particularly useful when schemas receive payloads containing
    # fields that belong to another layer.
    #
    extra="ignore",

    # -------------------------------------------------------------------------
    # Assignment Validation
    # -------------------------------------------------------------------------
    #
    # Validate values when an already-created Pydantic model is modified.
    #
    # Example:
    #
    # user.email = "invalid-email"
    #
    # The schema's field validation remains active.
    #
    validate_assignment=True,

    # -------------------------------------------------------------------------
    # Alias Population
    # -------------------------------------------------------------------------
    #
    # Allows fields to be populated using their Python field names even when
    # aliases are defined.
    #
    populate_by_name=True,
)


# =============================================================================
# Base Schema
# =============================================================================


class BaseSchema(BaseModel):
    """
    Base class for application Pydantic schemas.

    All normal application schemas should inherit from this class unless a
    specialized configuration is explicitly required.

    Features
    --------
    • SQLAlchemy ORM compatibility.
    • Shared validation behavior.
    • Assignment validation.
    • Alias-aware population.
    • Consistent handling of unexpected fields.
    """

    model_config = MODEL_CONFIG


# =============================================================================
# ID Schema
# =============================================================================


class IDSchema(BaseSchema):
    """
    Reusable schema containing a database entity identifier.

    Attributes
    ----------
    id:
        Integer database primary key.
    """

    id: int


# =============================================================================
# Timestamp Schema
# =============================================================================


class TimestampSchema(BaseSchema):
    """
    Reusable schema containing entity audit timestamps.

    Attributes
    ----------
    created_at:
        UTC timestamp indicating when the entity was created.

    updated_at:
        UTC timestamp indicating when the entity was last modified.
    """

    created_at: datetime
    updated_at: datetime


# =============================================================================
# Entity Schema
# =============================================================================


class EntitySchema(
    IDSchema,
    TimestampSchema,
):
    """
    Base schema for persisted database entities.

    Provides the common fields shared by database-backed API responses.

    Inherits
    --------
    IDSchema
        Provides ``id``.

    TimestampSchema
        Provides ``created_at`` and ``updated_at``.

    Resulting fields
    ----------------
    • id
    • created_at
    • updated_at

    This schema is intended primarily for response representations of
    persisted database entities.
    """

    pass


# =============================================================================
# Public Exports
# =============================================================================

__all__ = [
    "MODEL_CONFIG",
    "BaseSchema",
    "IDSchema",
    "TimestampSchema",
    "EntitySchema",
]