"""
Dashboard schemas for dashboard metrics.
"""

from pydantic import BaseModel
from typing import List


class LowStockProduct(BaseModel):
    """Schema for low stock product item."""

    id: int
    name: str
    sku: str
    quantity_in_stock: int
    threshold: int = 10


class DashboardResponse(BaseModel):
    """Schema for dashboard metrics response."""

    total_products: int
    total_customers: int
    total_orders: int
    total_revenue: float
    low_stock_products: List[LowStockProduct]
