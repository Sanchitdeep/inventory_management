"""
Product service with business logic for product management.
Handles CRUD operations and inventory-related business rules.
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.core.exceptions import (
    ResourceNotFoundError,
    DuplicateResourceError,
    ValidationError,
)


class ProductService:
    """Service for product operations."""

    @staticmethod
    def create_product(db: Session, product: ProductCreate) -> Product:
        """Create a new product."""
        try:
            db_product = Product(
                name=product.name,
                sku=product.sku.upper(),
                price=product.price,
                quantity_in_stock=product.quantity_in_stock,
            )
            # If custom ID is provided, set it
            if product.id is not None:
                # Check if ID already exists
                existing = db.query(Product).filter(Product.id == product.id).first()
                if existing:
                    raise DuplicateResourceError("Product ID", product.id)
                db_product.id = product.id
            
            db.add(db_product)
            db.commit()
            db.refresh(db_product)
            return db_product
        except IntegrityError as e:
            db.rollback()
            if "sku" in str(e):
                raise DuplicateResourceError("SKU", product.sku)
            raise ValidationError(f"Failed to create product: {str(e)}")

    @staticmethod
    def get_product(db: Session, product_id: int) -> Product:
        """Get product by ID."""
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise ResourceNotFoundError("Product", product_id)
        return product

    @staticmethod
    def get_all_products(db: Session, skip: int = 0, limit: int = 100) -> tuple[list[Product], int]:
        """Get all products with pagination."""
        total = db.query(Product).count()
        products = db.query(Product).offset(skip).limit(limit).all()
        return products, total

    @staticmethod
    def update_product(db: Session, product_id: int, product_update: ProductUpdate) -> Product:
        """Update product."""
        db_product = ProductService.get_product(db, product_id)

        update_data = product_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)

        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def delete_product(db: Session, product_id: int) -> dict:
        """Delete product."""
        db_product = ProductService.get_product(db, product_id)
        db.delete(db_product)
        db.commit()
        return {"message": f"Product {product_id} deleted successfully"}

    @staticmethod
    def reduce_inventory(db: Session, product_id: int, quantity: int) -> None:
        """Reduce product inventory."""
        product = ProductService.get_product(db, product_id)

        if product.quantity_in_stock < quantity:
            raise ValidationError(
                f"Insufficient inventory for {product.name}. "
                f"Requested: {quantity}, Available: {product.quantity_in_stock}"
            )

        product.quantity_in_stock -= quantity
        db.add(product)

    @staticmethod
    def get_low_stock_products(db: Session, threshold: int = 10) -> list[Product]:
        """Get products with low stock."""
        return db.query(Product).filter(Product.quantity_in_stock <= threshold).all()
