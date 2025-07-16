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

The application uses environment variables for configuration. You can modify these in the `.env` file:

```
# Database Configuration
DB_PASSWORD=password123

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL Configuration
API_URL=http://localhost:3001/api

# Node Environment
NODE_ENV=production
```

### Running the Application

#### Using Convenience Scripts

For Windows users:
```powershell
.\run.ps1
```

For Linux/Mac users:
```bash
chmod +x ./run.sh
./run.sh
```

#### Manual Start

Start all services using Docker Compose:

```bash
docker-compose up -d
```

This will start the following services:
- PostgreSQL database on port 5432
- Backend API on port 3001
- Frontend application on port 80

Access the application at: http://localhost

### Checking Service Health

To verify all services are running correctly:

For Windows users:
```powershell
.\health-check.ps1
```

For Linux/Mac users:
```bash
chmod +x ./health-check.sh
./health-check.sh
```

### Viewing Logs

To view logs from the containers:

#### Using Log Viewing Scripts

For Windows users:
```powershell
.\logs.ps1                    # View all logs
.\logs.ps1 -Service frontend  # View frontend logs only
.\logs.ps1 -Service backend   # View backend logs only
.\logs.ps1 -Service database  # View database logs only
.\logs.ps1 -Follow            # Follow logs in real-time
```

For Linux/Mac users:
```bash
chmod +x ./logs.sh
./logs.sh                     # View all logs
./logs.sh -s frontend         # View frontend logs only
./logs.sh -s backend          # View backend logs only
./logs.sh -s database         # View database logs only
./logs.sh -f                  # Follow logs in real-time
```

#### Manual Log Viewing

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

For Windows users:
```powershell
.\seed-db.ps1                # Seed with confirmation prompt
.\seed-db.ps1 -Force         # Seed without confirmation
```

For Linux/Mac users:
```bash
chmod +x ./seed-db.sh
./seed-db.sh                # Seed with confirmation prompt
./seed-db.sh -f             # Seed without confirmation
```

This will create the following test users:

| Role          | Email                | Password    |
|---------------|----------------------|------------|
| Admin         | admin@example.com    | admin123   |
| Regular User  | user@example.com     | user123    |
| Support Staff | support@example.com  | support123 |

### Docker Volume Management

For Windows users:
```powershell
.\manage-volumes.ps1                           # List volumes
.\manage-volumes.ps1 -Action create -VolumeName complaint_db_data  # Create volume
.\manage-volumes.ps1 -Action delete -VolumeName complaint_db_data  # Delete volume
.\manage-volumes.ps1 -Action prune            # Remove all unused volumes
```

For Linux/Mac users:
```bash
chmod +x ./manage-volumes.sh
./manage-volumes.sh                         # List volumes
./manage-volumes.sh -a create -v complaint_db_data  # Create volume
./manage-volumes.sh -a delete -v complaint_db_data  # Delete volume
./manage-volumes.sh -a prune                # Remove all unused volumes
```

### Troubleshooting

#### NPM Dependency Issues

If you encounter npm dependency conflicts during the build process, the Dockerfiles are configured to use `--legacy-peer-deps` flag to resolve these issues. This is particularly helpful for TypeScript and ESLint related dependencies.

## Test Users

The application is seeded with the following test users:

- **Consumer**: 
  - Email: consumer@example.com
  - Password: password123

- **Reviewer**: 
  - Email: reviewer@example.com
  - Password: password123

## License

[MIT](LICENSE)