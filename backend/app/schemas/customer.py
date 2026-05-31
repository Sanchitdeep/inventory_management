"""
Customer schemas for validation and serialization.
"""

from pydantic import BaseModel, Field, field_validator, EmailStr
from datetime import datetime
from app.utils.validators import validate_phone


class CustomerBase(BaseModel):
    """Base schema with common customer fields."""

    full_name: str = Field(..., min_length=1, max_length=255, description="Full name")
    email: EmailStr = Field(..., description="Email address (must be unique)")
    phone_number: str = Field(..., description="Phone number")

    @field_validator("phone_number")
    @classmethod
    def validate_phone_field(cls, v: str) -> str:
        """Validate phone number."""
        return validate_phone(v)


class CustomerCreate(CustomerBase):
    """Schema for creating a new customer."""

    pass


class CustomerUpdate(BaseModel):
    """Schema for updating a customer."""

    full_name: str | None = Field(None, min_length=1, max_length=255)
    phone_number: str | None = Field(None)

    @field_validator("phone_number")
    @classmethod
    def validate_phone_field(cls, v):
        """Validate phone number."""
        if v is not None:
            return validate_phone(v)
        return v


class CustomerResponse(CustomerBase):
    """Schema for customer response."""

    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    """Schema for listing customers."""

    customers: list[CustomerResponse]
    total: int
