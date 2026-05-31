"""
Dashboard API routes.
Provides aggregated metrics and analytics.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService
from app.core.exceptions import AppException

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """
    Get dashboard metrics.
    
    Returns:
    - Total products count
    - Total customers count
    - Total orders count
    - Total revenue
    - Low stock products (quantity <= 10)
    """
    try:
        metrics = DashboardService.get_dashboard_metrics(db)
        return metrics
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
