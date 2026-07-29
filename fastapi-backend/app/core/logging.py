"""
==========================================================
Logging Configuration
==========================================================

Centralized logging configuration for the
Team Productivity Platform.

Responsibilities
----------------
✓ Configure application logging
✓ Configure console logging
✓ Configure SQLAlchemy logging
✓ Configure Uvicorn logging
✓ Provide reusable loggers
✓ Idempotent initialization

Compatible With
---------------
- FastAPI
- SQLAlchemy
- Uvicorn
- Docker
- Gunicorn
==========================================================
"""

from __future__ import annotations

import logging
import logging.config
import sys
from typing import Final

from app.core.config import settings

_LOGGING_INITIALIZED: bool = False

DEFAULT_LOG_FORMAT: Final[
    str
] = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"

DEFAULT_DATE_FORMAT: Final[str] = "%Y-%m-%d %H:%M:%S"


def setup_logging() -> None:
    """
    Configure application logging.

    This function is idempotent.
    """

    global _LOGGING_INITIALIZED

    if _LOGGING_INITIALIZED:
        return

    logging.config.dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": DEFAULT_LOG_FORMAT,
                    "datefmt": DEFAULT_DATE_FORMAT,
                }
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "formatter": "default",
                    "stream": sys.stdout,
                }
            },
            "root": {
                "handlers": ["console"],
                "level": settings.LOG_LEVEL,
            },
            "loggers": {
                "uvicorn": {
                    "handlers": ["console"],
                    "level": settings.LOG_LEVEL,
                    "propagate": False,
                },
                "uvicorn.error": {
                    "handlers": ["console"],
                    "level": settings.LOG_LEVEL,
                    "propagate": False,
                },
                "uvicorn.access": {
                    "handlers": ["console"],
                    "level": settings.LOG_LEVEL,
                    "propagate": False,
                },
                "sqlalchemy.engine": {
                    "handlers": ["console"],
                    "level": (
                        "INFO"
                        if settings.sqlalchemy_echo
                        else "WARNING"
                    ),
                    "propagate": False,
                },
                "alembic": {
                    "handlers": ["console"],
                    "level": "INFO",
                    "propagate": False,
                },
            },
        }
    )

    _LOGGING_INITIALIZED = True


def get_logger(name: str) -> logging.Logger:
    """
    Return a configured logger.

    Parameters
    ----------
    name:
        Usually __name__.

    Returns
    -------
    logging.Logger
    """

    if not _LOGGING_INITIALIZED:
        setup_logging()

    return logging.getLogger(name)


__all__ = [
    "setup_logging",
    "get_logger",
]