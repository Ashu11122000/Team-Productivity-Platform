"""
===============================================================================
API Routes Package
===============================================================================

Centralized package exports for all FastAPI route modules.

Responsibilities
----------------
• Expose API route modules
• Provide a clean package-level import interface
• Keep route organization centralized
• Support modular FastAPI architecture

Architecture
------------

        FastAPI Application
                │
                ▼
           API Routes
          /    |     \
         /     |      \
      Auth    Notes   Users
        │       │       │
        ▼       ▼       ▼
     Services / Business Layer

Implemented Route Modules
-------------------------
• auth
• notes
• users

Compatible With
---------------
• FastAPI
• Python 3.12+
• Clean Architecture
• Service Layer Architecture

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Route Module Imports
# =============================================================================

from . import auth
from . import notes
from . import users

# =============================================================================
# Public Package API
# =============================================================================

__all__ = [
    "auth",
    "notes",
    "users",
]