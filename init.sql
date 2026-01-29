-- Studio Management Database Initialization
-- This script runs when PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Set timezone
SET timezone = 'Asia/Kolkata';

-- Log initialization
INSERT INTO pg_stat_activity (datname) VALUES ('studio_db') WHERE NOT EXISTS (
    SELECT 1 FROM pg_database WHERE datname = 'studio_db'
);

COMMENT ON DATABASE studio_db IS 'Studio Management Application Database';
