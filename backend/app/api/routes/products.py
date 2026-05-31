"""
Product API routes.
Handles all product-related HTTP endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
)
from app.services.product_service import ProductService
from app.core.exceptions import AppException

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product."""
    try:
        db_product = ProductService.create_product(db, product)
        return db_product
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("", response_model=ProductListResponse)
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all products with pagination."""
    try:
        products, total = ProductService.get_all_products(db, skip, limit)
        return {"products": products, "total": total}
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product by ID."""
    try:
        product = ProductService.get_product(db, product_id)
        return product
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)
):
    """Update product."""
    try:
        product = ProductService.update_product(db, product_id, product_update)
        return product
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete product."""
    try:
        result = ProductService.delete_product(db, product_id)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
