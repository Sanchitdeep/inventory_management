"""
Application configuration management.
Loads environment variables and provides configuration settings.
"""

import os
from functools import lru_cache


class Settings:
    """Application settings loaded from environment variables."""

    # Database configuration
    # Local development: SQLite
    # Production: PostgreSQL (via environment variable)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./inventory.db"
    )

    # API configuration
    API_TITLE: str = "Inventory & Order Management System"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "A production-ready inventory and order management system"

    # CORS configuration
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost",
    ]

    # Application environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
