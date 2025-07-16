#!/bin/bash

# Shell script to restore the PostgreSQL database from a backup

# Check if backup file is provided
if [ $# -ne 1 ]; then
  echo -e "\033[0;31mError: Backup file not specified\033[0m"
  echo "Usage: ./restore-db.sh <backup-file>"
  exit 1
fi

BACKUP_FILE=$1

echo -e "\033[0;36mSmart Complaint Portal - Database Restore\033[0m"
echo -e "\033[0;36m----------------------------------------\033[0m"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo -e "\033[0;31mError: Backup file '$BACKUP_FILE' not found.\033[0m"
  exit 1
fi

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

# Confirm restore
echo -e "\n\033[0;33mWARNING: This will overwrite the current database with the backup.\033[0m"
echo -e "\033[0;33mAll existing data will be lost!\033[0m"
read -p "Are you sure you want to proceed? (y/n): " confirmation

if [ "$confirmation" != "y" ]; then
  echo -e "\033[0;33mRestore cancelled.\033[0m"
  exit 0
fi

# Get absolute path of backup file
ABSOLUTE_PATH=$(realpath "$BACKUP_FILE")

# Run the restore command
echo -e "\n\033[0;33mRestoring database from $ABSOLUTE_PATH...\033[0m"

# Drop and recreate the database
echo -e "\033[0;33mDropping existing database...\033[0m"
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS complaint_portal;"

echo -e "\033[0;33mCreating new database...\033[0m"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE complaint_portal;"

# Restore from backup
echo -e "\033[0;33mRestoring from backup...\033[0m"
cat "$ABSOLUTE_PATH" | docker-compose exec -T postgres psql -U postgres -d complaint_portal

if [ $? -eq 0 ]; then
  echo -e "\033[0;32mRestore completed successfully!\033[0m"
else
  echo -e "\033[0;31mError: Restore failed with exit code $?\033[0m"
  exit 1
fi

# Restart the backend to reconnect to the database
echo -e "\033[0;33mRestarting backend service...\033[0m"
docker-compose restart backend

echo -e "\033[0;36mDatabase restore process completed.\033[0m"