"""
Order service with business logic for order management.
Handles complex order creation with transactions, inventory management, and validation.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Order, OrderItem, Product, Customer
from app.schemas.order import OrderCreate
from app.core.exceptions import (
    ResourceNotFoundError,
    OrderCreationError,
    ValidationError,
)
from app.services.product_service import ProductService
from app.services.customer_service import CustomerService


class OrderService:
    """Service for order operations with transaction handling."""

    @staticmethod
    def create_order(db: Session, order: OrderCreate) -> Order:
        """
        Create a new order with transaction support.
        
        - Validates customer exists
        - Validates inventory availability
        - Reduces inventory atomically
        - Calculates order total
        - Rolls back on any error
        """
        try:
            # Verify customer exists
            customer = CustomerService.get_customer(db, order.customer_id)

            # Verify inventory for all items before creating order
            total_amount = 0.0
            order_items_data = []

            for item in order.items:
                product = ProductService.get_product(db, item.product_id)

                if product.quantity_in_stock < item.quantity:
                    raise ValidationError(
                        f"Insufficient inventory for {product.name}. "
                        f"Requested: {item.quantity}, Available: {product.quantity_in_stock}"
                    )

                item_total = product.price * item.quantity
                total_amount += item_total
                order_items_data.append(
                    {
                        "product": product,
                        "quantity": item.quantity,
                        "unit_price": product.price,
                        "item_total": item_total,
                    }
                )

            # Create order
            db_order = Order(customer_id=order.customer_id, total_amount=total_amount)
            db.add(db_order)
            db.flush()  # Flush to get order ID without committing

            # Create order items and reduce inventory
            for item_data in order_items_data:
                order_item = OrderItem(
                    order_id=db_order.id,
                    product_id=item_data["product"].id,
                    quantity=item_data["quantity"],
                    unit_price=item_data["unit_price"],
                )
                db.add(order_item)

                # Reduce inventory
                item_data["product"].quantity_in_stock -= item_data["quantity"]
                db.add(item_data["product"])

            # Commit all changes atomically
            db.commit()
            db.refresh(db_order)
            return db_order

        except (ValidationError, ResourceNotFoundError):
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise OrderCreationError(f"Failed to create order: {str(e)}")

    @staticmethod
    def get_order(db: Session, order_id: int) -> Order:
        """Get order by ID."""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise ResourceNotFoundError("Order", order_id)
        return order

    @staticmethod
    def get_all_orders(
        db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[list[Order], int]:
        """Get all orders with pagination."""
        total = db.query(Order).count()
        orders = db.query(Order).offset(skip).limit(limit).all()
        return orders, total

    @staticmethod
    def delete_order(db: Session, order_id: int) -> dict:
        """
        Delete order and restore inventory.
        Handles inventory restoration atomically.
        """
        try:
            db_order = OrderService.get_order(db, order_id)

            # Restore inventory for all order items
            for order_item in db_order.order_items:
                product = order_item.product
                product.quantity_in_stock += order_item.quantity
                db.add(product)

            # Delete order (cascades to order items)
            db.delete(db_order)
            db.commit()
            return {"message": f"Order {order_id} deleted and inventory restored"}

        except Exception as e:
            db.rollback()
            raise OrderCreationError(f"Failed to delete order: {str(e)}")

    @staticmethod
    def get_order_with_details(db: Session, order_id: int) -> dict:
        """Get order with customer details."""
        order = OrderService.get_order(db, order_id)
        return {
            "id": order.id,
            "customer_id": order.customer_id,
            "customer_name": order.customer.full_name,
            "customer_email": order.customer.email,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "order_items": order.order_items,
        }
