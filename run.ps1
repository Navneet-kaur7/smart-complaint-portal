# PowerShell script to run the Smart Complaint Portal application

Write-Host "Starting Smart Complaint Portal..." -ForegroundColor Green

# Check if Docker is running
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Check if .env file exists, create if not
if (-not (Test-Path ".env")) {
    Write-Host "Creating default .env file..." -ForegroundColor Yellow
    @"
# Database Configuration
DB_PASSWORD=password123

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL Configuration
API_URL=http://localhost:3001/api

# Node Environment
NODE_ENV=production
"@ | Out-File -FilePath ".env" -Encoding utf8
}

# Build and start the containers
Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "
Smart Complaint Portal is now running!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost" -ForegroundColor Cyan
    Write-Host "Backend API: http://localhost:3001/api" -ForegroundColor Cyan
    Write-Host "
Test Users:" -ForegroundColor Yellow
    Write-Host "Consumer: consumer@example.com / password123" -ForegroundColor Yellow
    Write-Host "Reviewer: reviewer@example.com / password123" -ForegroundColor Yellow
    Write-Host "
To stop the application, run: docker-compose down" -ForegroundColor Magenta
} else {
    Write-Host "Error starting the application. Check the logs above for details." -ForegroundColor Red
}