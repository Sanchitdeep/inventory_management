"""
Validation utilities for input validation.
Provides reusable validation functions and patterns.
"""

import re
from app.core.exceptions import ValidationError


def validate_email(email: str) -> str:
    """Validate email format."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(pattern, email):
        raise ValidationError(f"Invalid email format: {email}")
    return email.lower()


def validate_phone(phone: str) -> str:
    """Validate phone number format (basic validation)."""
    # Remove common separators
    phone_digits = re.sub(r"[\s\-().]", "", phone)
    if not phone_digits.isdigit() or len(phone_digits) < 10:
        raise ValidationError(
            f"Invalid phone number format: {phone}. Must contain at least 10 digits."
        )
    return phone


def validate_positive_number(value: int | float, field_name: str) -> int | float:
    """Validate that a number is positive."""
    if value <= 0:
        raise ValidationError(f"{field_name} must be a positive number, got {value}")
    return value


def validate_non_negative_number(
    value: int | float, field_name: str
) -> int | float:
    """Validate that a number is non-negative."""
    if value < 0:
        raise ValidationError(f"{field_name} cannot be negative, got {value}")
    return value


def validate_sku(sku: str) -> str:
    """Validate SKU format (alphanumeric with dashes allowed)."""
    if not re.match(r"^[A-Z0-9-]+$", sku):
        raise ValidationError(
            f"Invalid SKU format: {sku}. Must contain only uppercase letters, "
            "numbers, and dashes."
        )
    return sku


def validate_string_length(
    value: str, field_name: str, min_length: int = 1, max_length: int = 255
) -> str:
    """Validate string length."""
    if len(value) < min_length or len(value) > max_length:
        raise ValidationError(
            f"{field_name} must be between {min_length} and {max_length} characters, "
            f"got {len(value)}"
        )
    return value.strip()
