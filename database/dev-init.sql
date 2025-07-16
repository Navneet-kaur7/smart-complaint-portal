-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up development-specific configurations
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;

-- Create test users if they don't exist
-- Note: This is just a placeholder. In a real application, you would use Prisma migrations and seeds.
-- The actual user creation will be handled by the Prisma seed script.