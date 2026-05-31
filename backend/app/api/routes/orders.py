"""
Order API routes.
Handles all order-related HTTP endpoints with transaction support.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderDetailResponse,
    OrderListResponse,
)
from app.services.order_service import OrderService
from app.core.exceptions import AppException

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new order.
    
    - Validates customer exists
    - Validates inventory availability
    - Reduces inventory atomically
    - Calculates order total automatically
    - Rolls back on error
    """
    try:
        db_order = OrderService.create_order(db, order)
        return db_order
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("", response_model=OrderListResponse)
def list_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all orders with pagination."""
    try:
        orders, total = OrderService.get_all_orders(db, skip, limit)
        return {"orders": orders, "total": total}
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get order by ID with customer details."""
    try:
        order_details = OrderService.get_order_with_details(db, order_id)
        return order_details
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    Delete order and restore inventory.
    Handles inventory restoration atomically.
    """
    try:
        result = OrderService.delete_order(db, order_id)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
