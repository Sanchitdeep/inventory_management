"""
Customer service with business logic for customer management.
Handles CRUD operations and customer-related validations.
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.core.exceptions import (
    ResourceNotFoundError,
    DuplicateResourceError,
    ValidationError,
)


class CustomerService:
    """Service for customer operations."""

    @staticmethod
    def create_customer(db: Session, customer: CustomerCreate) -> Customer:
        """Create a new customer."""
        try:
            db_customer = Customer(
                full_name=customer.full_name.strip(),
                email=customer.email.lower(),
                phone_number=customer.phone_number,
            )
            db.add(db_customer)
            db.commit()
            db.refresh(db_customer)
            return db_customer
        except IntegrityError as e:
            db.rollback()
            if "email" in str(e):
                raise DuplicateResourceError("Email", customer.email)
            raise ValidationError(f"Failed to create customer: {str(e)}")

    @staticmethod
    def get_customer(db: Session, customer_id: int) -> Customer:
        """Get customer by ID."""
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            raise ResourceNotFoundError("Customer", customer_id)
        return customer

    @staticmethod
    def get_all_customers(
        db: Session, skip: int = 0, limit: int = 100
    ) -> tuple[list[Customer], int]:
        """Get all customers with pagination."""
        total = db.query(Customer).count()
        customers = db.query(Customer).offset(skip).limit(limit).all()
        return customers, total

    @staticmethod
    def update_customer(
        db: Session, customer_id: int, customer_update: CustomerUpdate
    ) -> Customer:
        """Update customer."""
        db_customer = CustomerService.get_customer(db, customer_id)

        update_data = customer_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                if field == "full_name":
                    value = value.strip()
                setattr(db_customer, field, value)

        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        return db_customer

    @staticmethod
    def delete_customer(db: Session, customer_id: int) -> dict:
        """Delete customer."""
        db_customer = CustomerService.get_customer(db, customer_id)
        db.delete(db_customer)
        db.commit()
        return {"message": f"Customer {customer_id} deleted successfully"}
