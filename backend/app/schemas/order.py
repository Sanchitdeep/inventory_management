"""
Order schemas for validation and serialization.
"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class OrderItemCreate(BaseModel):
    """Schema for creating an order item."""

    product_id: int = Field(..., gt=0, description="Product ID")
    quantity: int = Field(..., gt=0, description="Quantity (must be positive)")


class OrderItemResponse(BaseModel):
    """Schema for order item response."""

    id: int
    order_id: int
    product_id: int
    quantity: int
    unit_price: float
    created_at: datetime

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    """Schema for creating a new order."""

    customer_id: int = Field(..., gt=0, description="Customer ID")
    items: list[OrderItemCreate] = Field(..., min_items=1, description="Order items")

    @field_validator("items")
    @classmethod
    def validate_items(cls, v):
        """Validate at least one item exists."""
        if not v or len(v) == 0:
            raise ValueError("Order must contain at least one item")
        return v


class OrderResponse(BaseModel):
    """Schema for order response."""

    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    order_items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderDetailResponse(BaseModel):
    """Schema for detailed order response with customer info."""

    id: int
    customer_id: int
    customer_name: str
    customer_email: str
    total_amount: float
    created_at: datetime
    order_items: list[OrderItemResponse] = []


class OrderListResponse(BaseModel):
    """Schema for listing orders."""

    orders: list[OrderResponse]
    total: int
