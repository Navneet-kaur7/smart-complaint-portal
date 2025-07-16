# PowerShell script to check the health of all services

Write-Host "Checking health of Smart Complaint Portal services..." -ForegroundColor Cyan

# Check if Docker is running
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Check if containers are running
Write-Host "\nChecking container status:" -ForegroundColor Yellow
$containers = @("complaint-portal-db", "complaint-portal-backend", "complaint-portal-frontend")

foreach ($container in $containers) {
    $status = docker ps -f "name=$container" --format "{{.Status}}" 2>&1
    
    if ($status) {
        Write-Host "$container: " -NoNewline -ForegroundColor Cyan
        Write-Host "$status" -ForegroundColor Green
    } else {
        Write-Host "$container: " -NoNewline -ForegroundColor Cyan
        Write-Host "Not running" -ForegroundColor Red
    }
}

# Check service health
Write-Host "\nChecking service health:" -ForegroundColor Yellow

# Check database
Write-Host "Database: " -NoNewline -ForegroundColor Cyan
try {
    $dbHealth = docker exec complaint-portal-db pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Healthy" -ForegroundColor Green
    } else {
        Write-Host "Unhealthy" -ForegroundColor Red
    }
} catch {
    Write-Host "Unavailable" -ForegroundColor Red
}

# Check backend
Write-Host "Backend API: " -NoNewline -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "Healthy" -ForegroundColor Green
    } else {
        Write-Host "Unhealthy (Status: $($response.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "Unavailable" -ForegroundColor Red
}

# Check frontend
Write-Host "Frontend: " -NoNewline -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "Healthy" -ForegroundColor Green
    } else {
        Write-Host "Unhealthy (Status: $($response.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "Unavailable" -ForegroundColor Red
}

Write-Host "\nHealth check complete." -ForegroundColor Cyan