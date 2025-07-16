#!/bin/bash

# Shell script to seed the database with test data

# Default values
FORCE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -f|--force)
      FORCE=true
      shift
      ;;
    -h|--help)
      echo "Usage: ./seed-db.sh [-f|--force]"
      echo "  -f, --force    Force seeding without confirmation"
      echo "  -h, --help     Show this help message"
      exit 0
      ;;
    *)
      echo -e "\033[0;31mError: Unknown option '$1'\033[0m"
      echo "Use -h or --help for usage information"
      exit 1
      ;;
  esac
done

echo -e "\033[0;36mSmart Complaint Portal - Database Seeding Tool\033[0m"
echo -e "\033[0;36m-------------------------------------------\033[0m"

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

# Confirm seeding unless Force is specified
if [ "$FORCE" = false ]; then
  echo -e "\n\033[0;33mWARNING: This will add test data to your database.\033[0m"
  echo -e "\033[0;33mIf test data already exists, this may create duplicates.\033[0m"
  read -p "Are you sure you want to proceed? (y/n): " confirmation
  
  if [ "$confirmation" != "y" ]; then
    echo -e "\033[0;33mSeeding cancelled.\033[0m"
    exit 0
  fi
fi

echo -e "\n\033[0;33mSeeding database with test data...\033[0m"

# Run the seeding command
docker-compose exec backend npm run seed

if [ $? -eq 0 ]; then
  echo -e "\n\033[0;32mDatabase seeding completed successfully!\033[0m"
  
  # Display test user credentials
  echo -e "\n\033[0;36mTest Users:\033[0m"
  echo -e "  \033[0;33mAdmin User:\033[0m"
  echo -e "    Email: admin@example.com"
  echo -e "    Password: admin123"
  echo -e "\n  \033[0;33mRegular User:\033[0m"
  echo -e "    Email: user@example.com"
  echo -e "    Password: user123"
  echo -e "\n  \033[0;33mSupport Staff:\033[0m"
  echo -e "    Email: support@example.com"
  echo -e "    Password: support123"
else
  echo -e "\033[0;31mError: Seeding failed with exit code $?\033[0m"
  exit 1
fi