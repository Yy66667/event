"""Compatibility entrypoint for existing deployments.

Run either ``uvicorn server:app`` (legacy command) or ``uvicorn app.main:app``.
"""

from app.main import app

__all__ = ["app"]
