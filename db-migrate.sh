#!/bin/bash

# Shell script to manage database migrations

# Default values
ACTION="up"
NAME=""
STEPS=1

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -a|--action)
      ACTION="$2"
      shift 2
      ;;
    -n|--name)
      NAME="$2"
      shift 2
      ;;
    -s|--steps)
      STEPS="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: ./db-migrate.sh [-a|--action ACTION] [-n|--name NAME] [-s|--steps STEPS]"
      echo "  -a, --action ACTION  Migration action: up, down, create, status (default: up)"
      echo "  -n, --name NAME      Migration name (required for 'create' action)"
      echo "  -s, --steps STEPS    Number of migration steps (default: 1)"
      echo "  -h, --help           Show this help message"
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
if [[ "$ACTION" != "up" && "$ACTION" != "down" && "$ACTION" != "create" && "$ACTION" != "status" ]]; then
  echo -e "\033[0;31mError: Invalid action '$ACTION'. Must be one of: up, down, create, status\033[0m"
  exit 1
fi

echo -e "\033[0;36mSmart Complaint Portal - Database Migration Tool\033[0m"
echo -e "\033[0;36m--------------------------------------------\033[0m"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "\033[0;31mError: Docker is not running. Please start Docker and try again.\033[0m"
  exit 1
fi

# Check if database container is running
if [ -z "$(docker-compose ps -q postgres)" ]; then
  echo -e "\033[0;31mError: Database container is not running. Start the application first with 'docker-compose up -d'.\033[0m"
  exit 1
fi

# Check if backend container is running
if [ -z "$(docker-compose ps -q backend)" ]; then
  echo -e "\033[0;31mError: Backend container is not running. Start the application first with 'docker-compose up -d'.\033[0m"
  exit 1
fi

# Handle different migration actions
case "$ACTION" in
  "up")
    echo -e "\033[0;33mRunning migrations UP ($STEPS step(s))...\033[0m"
    docker-compose exec backend npm run migrate:up -- --steps $STEPS
    ;;
  "down")
    echo -e "\033[0;33mRunning migrations DOWN ($STEPS step(s))...\033[0m"
    
    # Confirm before running down migrations
    echo -e "\n\033[0;33mWARNING: This will revert database changes and potentially delete data!\033[0m"
    read -p "Are you sure you want to proceed? (y/n): " confirmation
    
    if [ "$confirmation" != "y" ]; then
      echo -e "\033[0;33mMigration cancelled.\033[0m"
      exit 0
    fi
    
    docker-compose exec backend npm run migrate:down -- --steps $STEPS
    ;;
  "create")
    if [ -z "$NAME" ]; then
      echo -e "\033[0;31mError: Migration name is required for 'create' action.\033[0m"
      echo -e "\033[0;33mUsage: ./db-migrate.sh -a create -n <migration-name>\033[0m"
      exit 1
    fi
    
    echo -e "\033[0;33mCreating new migration '$NAME'...\033[0m"
    docker-compose exec backend npm run migrate:create -- --name "$NAME"
    ;;
  "status")
    echo -e "\033[0;33mChecking migration status...\033[0m"
    docker-compose exec backend npm run migrate:status
    ;;
  *)
    echo -e "\033[0;31mError: Invalid action '$ACTION'\033[0m"
    exit 1
    ;;
esac

echo -e "\033[0;36mMigration operation completed.\033[0m"