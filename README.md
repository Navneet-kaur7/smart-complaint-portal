# Smart Complaint Portal

A full-stack application for managing customer complaints with user authentication, role-based access control, and real-time updates.

## Features

- User authentication and authorization with JWT
- Role-based access control (Consumer and Reviewer roles)
- Create, read, update, and delete complaints
- Comment system for complaints
- Real-time updates with polling
- Responsive UI design

## Tech Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd smart-complaint-portal
```

### Configuration

The application uses environment variables for configuration. These can be set in a `.env` file at the root of the project:

1. Copy the example environment file to create your own:

```bash
cp .env.example .env
```

2. Edit the `.env` file to customize your configuration:

```
# Backend Environment Variables
BACKEND_PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Database Environment Variables
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=complaint_portal
DB_PORT=5432
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:${DB_PORT}/${DB_NAME}?schema=public
```

The `docker-compose.yml` file is configured to use these environment variables with fallback values if they're not set. This allows you to customize the configuration without modifying the docker-compose.yml file directly.

### Running the Application

#### Development Environment

For development with hot-reloading:

```bash
# Create a .env file for development
cp .env.example .env

# Start all services in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

#### Production Environment

For production deployment:

```bash
# Create a .env file with production settings
cp .env.example .env
# Edit .env with production values

# Start all services in production mode
docker-compose up -d
```

This will start the following services:
- PostgreSQL database on port 5432 (or the port specified in .env)
- Backend API on port 3001 (or the port specified in .env)
- Frontend application on port 3000

Access the application at: http://localhost:3000

### Checking Service Health

To verify all services are running correctly:

```bash
docker-compose ps
```

All services should show as "running".


### Viewing Logs

To view logs from the containers:

```bash
docker-compose logs           # View all logs
docker-compose logs frontend  # View frontend logs only
docker-compose logs backend   # View backend logs only
docker-compose logs postgres  # View database logs only
docker-compose logs -f        # Follow logs in real-time
```

### Stopping the Application

```bash
docker-compose down
```

To remove all data volumes as well:

```bash
docker-compose down -v
```

### Cleaning Up Resources

To clean up Docker resources (containers, volumes, images):

For Windows users:
```powershell
.\cleanup.ps1
```

For Linux/Mac users:
```bash
chmod +x ./cleanup.sh
./cleanup.sh
```

## Development

### Running in Development Mode

To run the application in development mode with hot-reloading:

```bash
# Set NODE_ENV to development in .env file
NODE_ENV=development

# Start the services
docker-compose up -d
```

### Accessing the Database

Connect to the PostgreSQL database using:

```
Host: localhost
Port: 5432
Database: complaint_portal
Username: postgres
Password: password123 (or the value set in DB_PASSWORD)
```

### Database Management

#### Backup Database

For Windows users:
```powershell
.\backup-db.ps1                        # Backup to ./backups with timestamp
.\backup-db.ps1 -OutputDir "C:\backups" # Specify output directory
.\backup-db.ps1 -WithTimestamp:$false  # Exclude timestamp from filename
```

For Linux/Mac users:
```bash
chmod +x ./backup-db.sh
./backup-db.sh                      # Backup to ./backups with timestamp
./backup-db.sh -o /path/to/backups  # Specify output directory
./backup-db.sh -n                   # Exclude timestamp from filename
```

#### Restore Database

For Windows users:
```powershell
.\restore-db.ps1 .\backups\complaint_portal_20230101_120000.sql
```

For Linux/Mac users:
```bash
chmod +x ./restore-db.sh
./restore-db.sh ./backups/complaint_portal_20230101_120000.sql
```

**Warning**: Restoring a database will overwrite all existing data!

#### Database Migrations

For Windows users:
```powershell
.\db-migrate.ps1                       # Run migrations up (default: 1 step)
.\db-migrate.ps1 -Action up -Steps 3   # Run 3 migrations up
.\db-migrate.ps1 -Action down          # Revert 1 migration
.\db-migrate.ps1 -Action create -Name add_user_roles  # Create new migration
.\db-migrate.ps1 -Action status        # Check migration status
```

For Linux/Mac users:
```bash
chmod +x ./db-migrate.sh
./db-migrate.sh                      # Run migrations up (default: 1 step)
./db-migrate.sh -a up -s 3           # Run 3 migrations up
./db-migrate.sh -a down              # Revert 1 migration
./db-migrate.sh -a create -n add_user_roles  # Create new migration
./db-migrate.sh -a status            # Check migration status
```

#### Seed Database with Test Data

```bash
docker-compose exec backend npm run prisma:seed
```

This will create the following test users:

| Role          | Email                | Password    |
|---------------|----------------------|------------|
| Admin         | admin@example.com    | admin123   |
| Regular User  | user@example.com     | user123    |
| Support Staff | support@example.com  | support123 |

### Docker Volume Management

```bash
docker volume ls                         # List volumes
docker volume create postgres-data        # Create volume
docker volume rm postgres-data           # Delete volume
docker volume prune                      # Remove all unused volumes
```

### Troubleshooting

#### NPM Dependency Issues

If you encounter npm dependency conflicts during the build process, the Dockerfiles are configured to use `--legacy-peer-deps` flag to resolve these issues. This is particularly helpful for TypeScript and ESLint related dependencies.

#### Backend Build Issues

If you encounter an error like `Error: Cannot find module '/app/dist/main'`, it means the NestJS build process didn't complete successfully. Try these solutions:

1. Rebuild the backend container:
   ```bash
   docker-compose build --no-cache backend
   ```

2. Check the build logs for errors:
   ```bash
   docker-compose logs backend
   ```

3. Verify the dist directory is created during the build process. The Dockerfile includes a verification step that will show the contents of the dist directory.

#### Database Connection Issues

If the backend can't connect to the database, check the following:

1. Ensure the PostgreSQL container is running and healthy:
   ```bash
   docker-compose ps
   ```

2. Verify the DATABASE_URL environment variable in docker-compose.yml matches your PostgreSQL configuration.

3. The backend service uses a wait-for-it script to ensure the database is ready before starting. If there are still connection issues, you may need to increase the retry count in the health check configuration.

#### Container Startup Order

The docker-compose.yml file is configured with health checks and dependencies to ensure services start in the correct order:

1. PostgreSQL database starts first
2. Backend service waits for the database to be healthy before starting
3. Frontend service waits for the backend to be healthy before starting

If you're experiencing issues with service startup order, check the health check configurations in docker-compose.yml.

## Test Users

The application is seeded with the following test users:

- **Consumer**: 
  - Email: consumer@example.com
  - Password: password123

- **Reviewer**: 
  - Email: reviewer@example.com
  - Password: password123

## Docker Best Practices

### Optimization Tips

1. **Reduce Image Size**:
   - The Dockerfiles use Alpine-based images to minimize size
   - Use multi-stage builds for the frontend to keep the production image small
   - Consider using Docker BuildKit for faster builds: `DOCKER_BUILDKIT=1 docker-compose build`

2. **Performance Tuning**:
   - Adjust PostgreSQL configuration for better performance in production
   - Consider using volume mounts for development to enable hot reloading
   - For production, use Docker Swarm or Kubernetes for better scaling and management

3. **Security Considerations**:
   - Never store sensitive information like JWT_SECRET in the docker-compose.yml file
   - Use Docker secrets or environment files for sensitive information
   - Run containers with non-root users when possible
   - Regularly update base images to get security patches

## License

[MIT](LICENSE)