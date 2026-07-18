"""
==========================================================
Logging Configuration
==========================================================

Centralized logging configuration.

Features

✓ Console logging
✓ Configurable log level
✓ Production ready
✓ Consistent formatting
✓ Reusable logger

==========================================================
"""

import logging
import sys

from app.core.config import settings
from app.core.constants import DATE_FORMAT, LOG_FORMAT


def setup_logging() -> None:
    """
    Configure application logging.
    """

    logging.basicConfig(
        level=getattr(
            logging,
            settings.LOG_LEVEL.upper(),
            logging.INFO,
        ),
        format=LOG_FORMAT,
        datefmt=DATE_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
        force=True,
    )


def get_logger(name: str) -> logging.Logger:
    """
    Return a configured logger.

    Example
    -------
    logger = get_logger(__name__)
    """

    return logging.getLogger(name)