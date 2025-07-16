#!/bin/bash

# Shell script to manage Docker volumes for the Smart Complaint Portal

# Default values
ACTION="list"
VOLUME_NAME=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -a|--action)
      ACTION="$2"
      shift 2
      ;;
    -v|--volume)
      VOLUME_NAME="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: ./manage-volumes.sh [-a|--action ACTION] [-v|--volume VOLUME_NAME]"
      echo "  -a, --action ACTION      Volume action: list, create, delete, prune (default: list)"
      echo "  -v, --volume VOLUME_NAME Volume name (required for create and delete actions)"
      echo "  -h, --help               Show this help message"
      exit 0
      ;;
    *)
      echo -e "\033[0;31mError: Unknown option '$1'\033[0m"
      echo "Use -h or --help for usage information"
      exit 1
      ;;
  esac
done

# Validate action
if [[ "$ACTION" != "list" && "$ACTION" != "create" && "$ACTION" != "delete" && "$ACTION" != "prune" ]]; then
  echo -e "\033[0;31mError: Invalid action '$ACTION'. Must be one of: list, create, delete, prune\033[0m"
  exit 1
fi

echo -e "\033[0;36mSmart Complaint Portal - Docker Volume Manager\033[0m"
echo -e "\033[0;36m-------------------------------------------\033[0m"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "\033[0;31mError: Docker is not running. Please start Docker and try again.\033[0m"
  exit 1
fi

# Handle different volume actions
case "$ACTION" in
  "list")
    echo -e "\033[0;33mListing Docker volumes...\033[0m"
    
    # Get all volumes
    VOLUMES=$(docker volume ls --format "{{.Name}}" | grep -i "complaint")
    
    if [ -n "$VOLUMES" ]; then
      echo -e "\n\033[0;32mVolumes related to Smart Complaint Portal:\033[0m"
      echo "$VOLUMES" | while read -r volume; do
        echo -e "  - $volume"
        
        # Get volume details
        DETAILS=$(docker volume inspect "$volume")
        DRIVER=$(echo "$DETAILS" | grep -o '"Driver": "[^"]*"' | cut -d '"' -f 4)
        MOUNTPOINT=$(echo "$DETAILS" | grep -o '"Mountpoint": "[^"]*"' | cut -d '"' -f 4)
        CREATED=$(echo "$DETAILS" | grep -o '"CreatedAt": "[^"]*"' | cut -d '"' -f 4)
        
        echo -e "    Driver: $DRIVER" 
        echo -e "    Mount point: $MOUNTPOINT" 
        echo -e "    Created: $CREATED" 
        echo ""
      done
    else
      echo -e "\033[0;33mNo volumes found for Smart Complaint Portal.\033[0m"
    fi
    ;;
  "create")
    if [ -z "$VOLUME_NAME" ]; then
      echo -e "\033[0;31mError: Volume name is required for 'create' action.\033[0m"
      echo -e "\033[0;33mUsage: ./manage-volumes.sh -a create -v <volume-name>\033[0m"
      exit 1
    fi
    
    echo -e "\033[0;33mCreating Docker volume '$VOLUME_NAME'...\033[0m"
    docker volume create "$VOLUME_NAME"
    
    if [ $? -eq 0 ]; then
      echo -e "\033[0;32mVolume '$VOLUME_NAME' created successfully!\033[0m"
    else
      echo -e "\033[0;31mError: Failed to create volume '$VOLUME_NAME'.\033[0m"
      exit 1
    fi
    ;;
  "delete")
    if [ -z "$VOLUME_NAME" ]; then
      echo -e "\033[0;31mError: Volume name is required for 'delete' action.\033[0m"
      echo -e "\033[0;33mUsage: ./manage-volumes.sh -a delete -v <volume-name>\033[0m"
      exit 1
    fi
    
    # Confirm deletion
    echo -e "\n\033[0;33mWARNING: This will permanently delete the volume '$VOLUME_NAME' and all its data!\033[0m"
    read -p "Are you sure you want to proceed? (y/n): " confirmation
    
    if [ "$confirmation" != "y" ]; then
      echo -e "\033[0;33mVolume deletion cancelled.\033[0m"
      exit 0
    fi
    
    echo -e "\033[0;33mDeleting Docker volume '$VOLUME_NAME'...\033[0m"
    docker volume rm "$VOLUME_NAME"
    
    if [ $? -eq 0 ]; then
      echo -e "\033[0;32mVolume '$VOLUME_NAME' deleted successfully!\033[0m"
    else
      echo -e "\033[0;31mError: Failed to delete volume '$VOLUME_NAME'. It may be in use by a container.\033[0m"
      exit 1
    fi
    ;;
  "prune")
    # Confirm pruning
    echo -e "\n\033[0;33mWARNING: This will remove all unused Docker volumes!\033[0m"
    read -p "Are you sure you want to proceed? (y/n): " confirmation
    
    if [ "$confirmation" != "y" ]; then
      echo -e "\033[0;33mVolume pruning cancelled.\033[0m"
      exit 0
    fi
    
    echo -e "\033[0;33mPruning unused Docker volumes...\033[0m"
    docker volume prune -f
    
    if [ $? -eq 0 ]; then
      echo -e "\033[0;32mUnused volumes pruned successfully!\033[0m"
    else
      echo -e "\033[0;31mError: Failed to prune unused volumes.\033[0m"
      exit 1
    fi
    ;;
  *)
    echo -e "\033[0;31mError: Invalid action '$ACTION'\033[0m"
    exit 1
    ;;
esac