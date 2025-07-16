# PowerShell script to seed the database with test data

param (
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

Write-Host "Smart Complaint Portal - Database Seeding Tool" -ForegroundColor Cyan
Write-Host "-------------------------------------------" -ForegroundColor Cyan

# Check if Docker is running
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Check if database container is running
$dbRunning = docker-compose ps -q postgres
if (-not $dbRunning) {
    Write-Host "Error: Database container is not running. Start the application first with 'docker-compose up -d'." -ForegroundColor Red
    exit 1
}

# Check if backend container is running
$backendRunning = docker-compose ps -q backend
if (-not $backendRunning) {
    Write-Host "Error: Backend container is not running. Start the application first with 'docker-compose up -d'." -ForegroundColor Red
    exit 1
}

# Confirm seeding unless Force is specified
if (-not $Force) {
    Write-Host "\nWARNING: This will add test data to your database." -ForegroundColor Yellow
    Write-Host "If test data already exists, this may create duplicates." -ForegroundColor Yellow
    $confirmation = Read-Host -Prompt "Are you sure you want to proceed? (y/n)"
    
    if ($confirmation -ne "y") {
        Write-Host "Seeding cancelled." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "\nSeeding database with test data..." -ForegroundColor Yellow

# Run the seeding command
try {
    docker-compose exec backend npm run seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "\nDatabase seeding completed successfully!" -ForegroundColor Green
        
        # Display test user credentials
        Write-Host "\nTest Users:" -ForegroundColor Cyan
        Write-Host "  Admin User:" -ForegroundColor Yellow
        Write-Host "    Email: admin@example.com" -ForegroundColor White
        Write-Host "    Password: admin123" -ForegroundColor White
        Write-Host "\n  Regular User:" -ForegroundColor Yellow
        Write-Host "    Email: user@example.com" -ForegroundColor White
        Write-Host "    Password: user123" -ForegroundColor White
        Write-Host "\n  Support Staff:" -ForegroundColor Yellow
        Write-Host "    Email: support@example.com" -ForegroundColor White
        Write-Host "    Password: support123" -ForegroundColor White
    } else {
        Write-Host "Error: Seeding failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}