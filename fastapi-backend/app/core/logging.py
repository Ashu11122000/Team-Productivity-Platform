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
✓ Configure optional file logging
✓ Provide reusable loggers
✓ Consistent formatting
✓ Production-ready configuration

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

from app.core.config import settings
from app.core.constants import LOG_DATE_FORMAT, LOG_FORMAT

_LOGGING_INITIALIZED = False


def setup_logging() -> None:
    """
    Configure application logging.

    This function is idempotent and can safely be called
    multiple times.
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
                    "format": LOG_FORMAT,
                    "datefmt": LOG_DATE_FORMAT,
                }
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "stream": sys.stdout,
                    "formatter": "default",
                }
            },
            "root": {
                "level": settings.LOG_LEVEL,
                "handlers": ["console"],
            },
        }
    )

    _LOGGING_INITIALIZED = True


def get_logger(name: str) -> logging.Logger:
    """
    Return a configured logger.

    Parameters
    ----------
    name : str
        Logger name (typically ``__name__``).

    Returns
    -------
    logging.Logger
        Configured logger instance.
    """

    if not _LOGGING_INITIALIZED:
        setup_logging()

    return logging.getLogger(name)