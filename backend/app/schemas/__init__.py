"""
Initialize schemas package and export all schemas.
"""

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
)
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
    CustomerListResponse,
)
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderDetailResponse,
    OrderListResponse,
    OrderItemCreate,
    OrderItemResponse,
)
from app.schemas.dashboard import DashboardResponse

__all__ = [
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "ProductListResponse",
    "CustomerCreate",
    "CustomerUpdate",
    "CustomerResponse",
    "CustomerListResponse",
    "OrderCreate",
    "OrderResponse",
    "OrderDetailResponse",
    "OrderListResponse",
    "OrderItemCreate",
    "OrderItemResponse",
    "DashboardResponse",
]
