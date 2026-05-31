-- Initialize PostgreSQL Database
-- This script runs automatically when the PostgreSQL container starts

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create inventory database tables
-- They will be created by SQLAlchemy on first run, but we can add any initialization here

-- Set default values for new connections
ALTER DATABASE inventory_db SET timezone = 'UTC';

-- Create a role for the application (optional, already handled by POSTGRES_USER/PASSWORD)
-- Ensure the postgres user has proper permissions
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO postgres;
