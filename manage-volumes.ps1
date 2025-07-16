# PowerShell script to manage Docker volumes for the Smart Complaint Portal

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("list", "create", "delete", "prune")]
    [string]$Action = "list",
    
    [Parameter(Mandatory=$false)]
    [string]$VolumeName = ""
)

Write-Host "Smart Complaint Portal - Docker Volume Manager" -ForegroundColor Cyan
Write-Host "-------------------------------------------" -ForegroundColor Cyan

# Check if Docker is running
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Handle different volume actions
switch ($Action) {
    "list" {
        Write-Host "Listing Docker volumes..." -ForegroundColor Yellow
        
        # Get all volumes
        $volumes = docker volume ls --format "{{.Name}}" | Where-Object { $_ -like "*complaint*" }
        
        if ($volumes) {
            Write-Host "\nVolumes related to Smart Complaint Portal:" -ForegroundColor Green
            foreach ($volume in $volumes) {
                Write-Host "  - $volume" -ForegroundColor White
                
                # Get volume details
                $details = docker volume inspect $volume | ConvertFrom-Json
                Write-Host "    Driver: $($details.Driver)" -ForegroundColor Gray
                Write-Host "    Mount point: $($details.Mountpoint)" -ForegroundColor Gray
                Write-Host "    Created: $($details.CreatedAt)" -ForegroundColor Gray
                Write-Host ""
            }
        } else {
            Write-Host "No volumes found for Smart Complaint Portal." -ForegroundColor Yellow
        }
    }
    "create" {
        if ([string]::IsNullOrEmpty($VolumeName)) {
            Write-Host "Error: Volume name is required for 'create' action." -ForegroundColor Red
            Write-Host "Usage: .\manage-volumes.ps1 -Action create -VolumeName <volume-name>" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Creating Docker volume '$VolumeName'..." -ForegroundColor Yellow
        docker volume create $VolumeName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Volume '$VolumeName' created successfully!" -ForegroundColor Green
        } else {
            Write-Host "Error: Failed to create volume '$VolumeName'." -ForegroundColor Red
        }
    }
    "delete" {
        if ([string]::IsNullOrEmpty($VolumeName)) {
            Write-Host "Error: Volume name is required for 'delete' action." -ForegroundColor Red
            Write-Host "Usage: .\manage-volumes.ps1 -Action delete -VolumeName <volume-name>" -ForegroundColor Yellow
            exit 1
        }
        
        # Confirm deletion
        Write-Host "\nWARNING: This will permanently delete the volume '$VolumeName' and all its data!" -ForegroundColor Yellow
        $confirmation = Read-Host -Prompt "Are you sure you want to proceed? (y/n)"
        
        if ($confirmation -ne "y") {
            Write-Host "Volume deletion cancelled." -ForegroundColor Yellow
            exit 0
        }
        
        Write-Host "Deleting Docker volume '$VolumeName'..." -ForegroundColor Yellow
        docker volume rm $VolumeName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Volume '$VolumeName' deleted successfully!" -ForegroundColor Green
        } else {
            Write-Host "Error: Failed to delete volume '$VolumeName'. It may be in use by a container." -ForegroundColor Red
        }
    }
    "prune" {
        # Confirm pruning
        Write-Host "\nWARNING: This will remove all unused Docker volumes!" -ForegroundColor Yellow
        $confirmation = Read-Host -Prompt "Are you sure you want to proceed? (y/n)"
        
        if ($confirmation -ne "y") {
            Write-Host "Volume pruning cancelled." -ForegroundColor Yellow
            exit 0
        }
        
        Write-Host "Pruning unused Docker volumes..." -ForegroundColor Yellow
        docker volume prune -f
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Unused volumes pruned successfully!" -ForegroundColor Green
        } else {
            Write-Host "Error: Failed to prune unused volumes." -ForegroundColor Red
        }
    }
}