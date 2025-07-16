# PowerShell script to restore the PostgreSQL database from a backup

param (
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

Write-Host "Smart Complaint Portal - Database Restore" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Check if backup file exists
if (-not (Test-Path $BackupFile)) {
    Write-Host "Error: Backup file '$BackupFile' not found." -ForegroundColor Red
    exit 1
}

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

# Confirm restore
Write-Host "\nWARNING: This will overwrite the current database with the backup." -ForegroundColor Yellow
Write-Host "All existing data will be lost!" -ForegroundColor Yellow
$confirmation = Read-Host -Prompt "Are you sure you want to proceed? (y/n)"

if ($confirmation -ne "y") {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
    exit 0
}

# Get absolute path of backup file
$absolutePath = (Resolve-Path $BackupFile).Path

# Run the restore command
Write-Host "\nRestoring database from $absolutePath..." -ForegroundColor Yellow

# Drop and recreate the database
Write-Host "Dropping existing database..." -ForegroundColor Yellow
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS complaint_portal;"

Write-Host "Creating new database..." -ForegroundColor Yellow
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE complaint_portal;"

# Restore from backup
Write-Host "Restoring from backup..." -ForegroundColor Yellow
$restoreCommand = "Get-Content `"$absolutePath`" | docker-compose exec -T postgres psql -U postgres -d complaint_portal"

try {
    Invoke-Expression $restoreCommand
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Restore completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error: Restore failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Restart the backend to reconnect to the database
Write-Host "Restarting backend service..." -ForegroundColor Yellow
docker-compose restart backend

Write-Host "Database restore process completed." -ForegroundColor Cyan