"""
Customer API routes.
Handles all customer-related HTTP endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
    CustomerListResponse,
)
from app.services.customer_service import CustomerService
from app.core.exceptions import AppException

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    """Create a new customer."""
    try:
        db_customer = CustomerService.create_customer(db, customer)
        return db_customer
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("", response_model=CustomerListResponse)
def list_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all customers with pagination."""
    try:
        customers, total = CustomerService.get_all_customers(db, skip, limit)
        return {"customers": customers, "total": total}
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get customer by ID."""
    try:
        customer = CustomerService.get_customer(db, customer_id)
        return customer
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int, customer_update: CustomerUpdate, db: Session = Depends(get_db)
):
    """Update customer."""
    try:
        customer = CustomerService.update_customer(db, customer_id, customer_update)
        return customer
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """Delete customer."""
    try:
        result = CustomerService.delete_customer(db, customer_id)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
