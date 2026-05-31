"""
Shared API dependencies.
Common dependencies used across routes.
"""

from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db


def get_db_session(db: Session = Depends(get_db)) -> Session:
    """Get database session dependency."""
    return db
