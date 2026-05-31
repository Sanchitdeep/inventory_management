"""
Dashboard service for aggregated metrics and analytics.
Provides dashboard data for monitoring inventory and orders.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Product, Customer, Order
from app.services.product_service import ProductService


class DashboardService:
    """Service for dashboard metrics."""

    @staticmethod
    def get_dashboard_metrics(db: Session) -> dict:
        """Get all dashboard metrics."""
        total_products = db.query(func.count(Product.id)).scalar() or 0
        total_customers = db.query(func.count(Customer.id)).scalar() or 0
        total_orders = db.query(func.count(Order.id)).scalar() or 0
        total_revenue = (
            db.query(func.sum(Order.total_amount)).scalar() or 0.0
        )

        low_stock_products = ProductService.get_low_stock_products(db, threshold=10)

        return {
            "total_products": total_products,
            "total_customers": total_customers,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "low_stock_products": [
                {
                    "id": product.id,
                    "name": product.name,
                    "sku": product.sku,
                    "quantity_in_stock": product.quantity_in_stock,
                    "threshold": 10,
                }
                for product in low_stock_products
            ],
        }
