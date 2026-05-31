"""
Product schemas for validation and serialization.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from app.utils.validators import validate_sku, validate_positive_number


class ProductBase(BaseModel):
    """Base schema with common product fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    sku: str = Field(..., min_length=1, max_length=100, description="Unique SKU")
    price: float = Field(..., gt=0, description="Product price (must be positive)")
    quantity_in_stock: int = Field(default=0, ge=0, description="Quantity in stock")

    @field_validator('sku')
    @classmethod
    def validate_sku_field(cls, v: str) -> str:
        """Validate SKU format."""
        return validate_sku(v.upper())

    @field_validator('price')
    @classmethod
    def validate_price_field(cls, v: float) -> float:
        """Validate price."""
        return validate_positive_number(v, "Price")

    @field_validator('quantity_in_stock')
    @classmethod
    def validate_quantity_field(cls, v: int) -> int:
        """Validate quantity is non-negative."""
        if v < 0:
            raise ValueError("Quantity cannot be negative")
        return v


class ProductCreate(ProductBase):
    """Schema for creating a new product."""

    id: Optional[int] = Field(None, gt=0, description="Optional custom product ID")


class ProductUpdate(BaseModel):
    """Schema for updating a product."""

    name: str | None = Field(None, min_length=1, max_length=255)
    price: float | None = Field(None, gt=0)
    quantity_in_stock: int | None = Field(None, ge=0)

    @field_validator('price')
    @classmethod
    def validate_price_field(cls, v):
        """Validate price."""
        if v is not None:
            return validate_positive_number(v, "Price")
        return v

    @field_validator('quantity_in_stock')
    @classmethod
    def validate_quantity_field(cls, v):
        """Validate quantity is non-negative."""
        if v is not None and v < 0:
            raise ValueError("Quantity cannot be negative")
        return v


class ProductResponse(ProductBase):
    """Schema for product response."""

    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class ProductListResponse(BaseModel):
    """Schema for listing products."""

    products: list[ProductResponse]
    total: int
