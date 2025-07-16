# PowerShell script to backup the PostgreSQL database

param (
    [Parameter()]
    [string]$OutputDir = "./backups",

    [Parameter()]
    [switch]$WithTimestamp = $true
)

Write-Host "Smart Complaint Portal - Database Backup" -ForegroundColor Cyan
Write-Host "---------------------------------------" -ForegroundColor Cyan

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

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
    Write-Host "Created backup directory: $OutputDir" -ForegroundColor Yellow
}

# Generate filename
$timestamp = ""
if ($WithTimestamp) {
    $timestamp = "_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
}
$filename = "complaint_portal$timestamp.sql"
$fullPath = Join-Path $OutputDir $filename

# Run the backup command
Write-Host "Backing up database to $fullPath..." -ForegroundColor Yellow

$backupCommand = "docker-compose exec -T postgres pg_dump -U postgres -d complaint_portal > `"$fullPath`""

try {
    Invoke-Expression $backupCommand
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup completed successfully!" -ForegroundColor Green
        Write-Host "Backup file: $fullPath" -ForegroundColor Cyan
    } else {
        Write-Host "Error: Backup failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}