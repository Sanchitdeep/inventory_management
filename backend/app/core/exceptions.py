"""
Custom exception classes for the application.
Provides structured error handling throughout the application.
"""

from fastapi import HTTPException, status


class AppException(Exception):
    """Base exception for application errors."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str = "APP_ERROR",
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class ValidationError(AppException):
    """Raised when input validation fails."""

    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
        )


class ResourceNotFoundError(AppException):
    """Raised when a resource is not found."""

    def __init__(self, resource_type: str, resource_id: int):
        message = f"{resource_type} with id {resource_id} not found"
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="RESOURCE_NOT_FOUND",
        )


class DuplicateResourceError(AppException):
    """Raised when attempting to create a duplicate resource."""

    def __init__(self, field: str, value: str):
        message = f"{field} '{value}' already exists"
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            error_code="DUPLICATE_RESOURCE",
        )


class InsufficientInventoryError(AppException):
    """Raised when inventory is insufficient for an order."""

    def __init__(self, product_name: str, requested: int, available: int):
        message = (
            f"Insufficient inventory for {product_name}. "
            f"Requested: {requested}, Available: {available}"
        )
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INSUFFICIENT_INVENTORY",
        )


class OrderCreationError(AppException):
    """Raised when order creation fails."""

    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="ORDER_CREATION_ERROR",
        )


class DatabaseError(AppException):
    """Raised when a database operation fails."""

    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="DATABASE_ERROR",
        )
