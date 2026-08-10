"""
Application logging configuration.

Centralized logging configuration for the
Team Productivity Platform.

Responsibilities
----------------
- Configure application logging.
- Configure console logging.
- Configure optional rotating file logging.
- Configure SQLAlchemy logging.
- Configure Uvicorn logging.
- Configure Alembic logging.
- Support text and JSON log formats.
- Provide reusable loggers.
- Keep initialization idempotent and thread-safe.

Logging is intentionally implemented using Python's standard library.
No external logging infrastructure is required for local development.
"""

from __future__ import annotations

import json
import logging
import logging.config
import sys
import threading
from pathlib import Path
from typing import Any, Final

from app.core.config import settings


# ============================================================================
# Logging Constants
# ============================================================================

DEFAULT_LOG_FORMAT: Final[str] = (
    "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

DEFAULT_DATE_FORMAT: Final[str] = "%Y-%m-%d %H:%M:%S"

LOG_MAX_BYTES: Final[int] = 10 * 1024 * 1024

LOG_BACKUP_COUNT: Final[int] = 3


# ============================================================================
# Logging Initialization State
# ============================================================================

_LOGGING_INITIALIZED: bool = False

_LOGGING_LOCK = threading.Lock()


# ============================================================================
# JSON Formatter
# ============================================================================


class JsonFormatter(logging.Formatter):
    """
    Standard-library JSON logging formatter.

    The formatter keeps the implementation dependency-free while producing
    structured logs suitable for local development, Docker and future
    centralized log aggregation.

    Additional values supplied through ``logger.extra`` are included when
    they are safe to serialize.
    """

    _RESERVED_LOG_RECORD_FIELDS: Final[frozenset[str]] = frozenset(
        {
            "args",
            "asctime",
            "created",
            "exc_info",
            "exc_text",
            "filename",
            "funcName",
            "levelname",
            "levelno",
            "lineno",
            "module",
            "msecs",
            "message",
            "msg",
            "name",
            "pathname",
            "process",
            "processName",
            "relativeCreated",
            "stack_info",
            "taskName",
            "thread",
            "threadName",
        }
    )

    def format(self, record: logging.LogRecord) -> str:
        """
        Convert a logging record into a JSON object.
        """

        log_entry: dict[str, Any] = {
            "timestamp": self.formatTime(
                record,
                self.datefmt,
            ),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        if record.exc_info:
            log_entry["exception"] = self.formatException(
                record.exc_info,
            )

        if record.stack_info:
            log_entry["stack"] = self.formatStack(
                record.stack_info,
            )

        for key, value in record.__dict__.items():
            if key in self._RESERVED_LOG_RECORD_FIELDS:
                continue

            if key.startswith("_"):
                continue

            try:
                json.dumps(value)
            except (TypeError, ValueError):
                continue

            log_entry[key] = value

        return json.dumps(
            log_entry,
            ensure_ascii=False,
            default=str,
        )


# ============================================================================
# Formatter Factory
# ============================================================================


def _get_formatter() -> logging.Formatter:
    """
    Return the formatter configured by application settings.
    """

    if settings.LOG_FORMAT == "json":
        return JsonFormatter(
            datefmt=DEFAULT_DATE_FORMAT,
        )

    return logging.Formatter(
        fmt=DEFAULT_LOG_FORMAT,
        datefmt=DEFAULT_DATE_FORMAT,
    )


# ============================================================================
# Handler Factory
# ============================================================================


def _get_console_handler(
    formatter: logging.Formatter,
) -> logging.Handler:
    """
    Create the application console handler.
    """

    handler = logging.StreamHandler(
        stream=sys.stdout,
    )

    handler.setFormatter(formatter)

    return handler


def _get_file_handler(
    formatter: logging.Formatter,
) -> logging.Handler | None:
    """
    Create the configured rotating file handler.

    Returns ``None`` when file logging is disabled by an empty LOG_FILE
    setting.

    File logging is intentionally bounded to prevent uncontrolled log
    file growth during long-running development sessions.
    """

    log_file = settings.LOG_FILE.strip()

    if not log_file:
        return None

    log_path = Path(log_file)

    if log_path.parent != Path("."):
        log_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

    handler = logging.handlers.RotatingFileHandler(
        filename=log_path,
        maxBytes=LOG_MAX_BYTES,
        backupCount=LOG_BACKUP_COUNT,
        encoding="utf-8",
    )

    handler.setFormatter(formatter)

    return handler


# ============================================================================
# Logging Configuration
# ============================================================================


def setup_logging() -> None:
    """
    Configure application logging.

    The function is idempotent and thread-safe.

    Calling it multiple times does not repeatedly attach handlers or create
    duplicate log output.
    """

    global _LOGGING_INITIALIZED

    if _LOGGING_INITIALIZED:
        return

    with _LOGGING_LOCK:
        if _LOGGING_INITIALIZED:
            return

        formatter = _get_formatter()

        console_handler = _get_console_handler(
            formatter,
        )

        file_handler = _get_file_handler(
            formatter,
        )

        handlers: dict[str, logging.Handler] = {
            "console": console_handler,
        }

        handler_names: list[str] = [
            "console",
        ]

        if file_handler is not None:
            handlers["file"] = file_handler
            handler_names.append("file")

        # --------------------------------------------------------------------
        # Root Logger
        # --------------------------------------------------------------------

        root_logger = logging.getLogger()

        root_logger.setLevel(
            settings.LOG_LEVEL,
        )

        # Remove existing root handlers to avoid duplicate output when
        # another framework or development reload process configured logging
        # before our application initialization.
        for existing_handler in root_logger.handlers[:]:
            root_logger.removeHandler(existing_handler)
            existing_handler.close()

        for handler in handlers.values():
            root_logger.addHandler(handler)

        # --------------------------------------------------------------------
        # Uvicorn
        # --------------------------------------------------------------------

        for logger_name in (
            "uvicorn",
            "uvicorn.error",
            "uvicorn.access",
        ):
            logger = logging.getLogger(logger_name)

            logger.setLevel(
                settings.LOG_LEVEL,
            )

            logger.propagate = False

            for existing_handler in logger.handlers[:]:
                logger.removeHandler(existing_handler)

            for handler in handlers.values():
                logger.addHandler(handler)

        # --------------------------------------------------------------------
        # SQLAlchemy
        # --------------------------------------------------------------------

        sqlalchemy_logger = logging.getLogger(
            "sqlalchemy.engine",
        )

        sqlalchemy_logger.setLevel(
            logging.INFO
            if settings.sqlalchemy_echo
            else logging.WARNING,
        )

        sqlalchemy_logger.propagate = False

        for existing_handler in sqlalchemy_logger.handlers[:]:
            sqlalchemy_logger.removeHandler(existing_handler)

        for handler in handlers.values():
            sqlalchemy_logger.addHandler(handler)

        # --------------------------------------------------------------------
        # Alembic
        # --------------------------------------------------------------------

        alembic_logger = logging.getLogger(
            "alembic",
        )

        alembic_logger.setLevel(
            logging.INFO,
        )

        alembic_logger.propagate = False

        for existing_handler in alembic_logger.handlers[:]:
            alembic_logger.removeHandler(existing_handler)

        for handler in handlers.values():
            alembic_logger.addHandler(handler)

        _LOGGING_INITIALIZED = True


# ============================================================================
# Logger Factory
# ============================================================================


def get_logger(name: str) -> logging.Logger:
    """
    Return a configured logger.

    Parameters
    ----------
    name:
        Logger name. Normally ``__name__`` from the calling module.

    Returns
    -------
    logging.Logger
        Configured Python logger.
    """

    normalized_name = name.strip()

    if not normalized_name:
        raise ValueError(
            "Logger name must not be empty."
        )

    if not _LOGGING_INITIALIZED:
        setup_logging()

    return logging.getLogger(
        normalized_name,
    )


# ============================================================================
# Public Exports
# ============================================================================

__all__ = [
    "get_logger",
    "setup_logging",
]