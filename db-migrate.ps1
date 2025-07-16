# PowerShell script to manage database migrations

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("up", "down", "create", "status")]
    [string]$Action = "up",
    
    [Parameter(Mandatory=$false)]
    [string]$Name = "",
    
    [Parameter(Mandatory=$false)]
    [int]$Steps = 1
)

Write-Host "Smart Complaint Portal - Database Migration Tool" -ForegroundColor Cyan
Write-Host "--------------------------------------------" -ForegroundColor Cyan

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

# Handle different migration actions
switch ($Action) {
    "up" {
        Write-Host "Running migrations UP ($Steps step(s))..." -ForegroundColor Yellow
        docker-compose exec backend npm run migrate:up -- --steps $Steps
    }
    "down" {
        Write-Host "Running migrations DOWN ($Steps step(s))..." -ForegroundColor Yellow
        
        # Confirm before running down migrations
        Write-Host "\nWARNING: This will revert database changes and potentially delete data!" -ForegroundColor Yellow
        $confirmation = Read-Host -Prompt "Are you sure you want to proceed? (y/n)"
        
        if ($confirmation -ne "y") {
            Write-Host "Migration cancelled." -ForegroundColor Yellow
            exit 0
        }
        
        docker-compose exec backend npm run migrate:down -- --steps $Steps
    }
    "create" {
        if ([string]::IsNullOrEmpty($Name)) {
            Write-Host "Error: Migration name is required for 'create' action." -ForegroundColor Red
            Write-Host "Usage: .\db-migrate.ps1 -Action create -Name <migration-name>" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Creating new migration '$Name'..." -ForegroundColor Yellow
        docker-compose exec backend npm run migrate:create -- --name $Name
    }
    "status" {
        Write-Host "Checking migration status..." -ForegroundColor Yellow
        docker-compose exec backend npm run migrate:status
    }
}

Write-Host "Migration operation completed." -ForegroundColor Cyan