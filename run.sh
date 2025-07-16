#!/bin/bash

# Shell script to run the Smart Complaint Portal application

echo -e "\033[0;32mStarting Smart Complaint Portal...\033[0m"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "\033[0;31mError: Docker is not running. Please start Docker and try again.\033[0m"
  exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose > /dev/null 2>&1; then
  echo -e "\033[0;31mError: docker-compose is not installed. Please install it and try again.\033[0m"
  exit 1
fi

# Check if .env file exists, create if not
if [ ! -f ".env" ]; then
  echo -e "\033[0;33mCreating default .env file...\033[0m"
  cat > .env << EOL
# Database Configuration
DB_PASSWORD=password123

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL Configuration
API_URL=http://localhost:3001/api

# Node Environment
NODE_ENV=production
EOL
fi

# Build and start the containers
echo -e "\033[0;36mBuilding and starting containers...\033[0m"
docker-compose up -d --build

if [ $? -eq 0 ]; then
  echo -e "\n\033[0;32mSmart Complaint Portal is now running!\033[0m"
  echo -e "\033[0;36mFrontend: http://localhost\033[0m"
  echo -e "\033[0;36mBackend API: http://localhost:3001/api\033[0m"
  echo -e "\n\033[0;33mTest Users:\033[0m"
  echo -e "\033[0;33mConsumer: consumer@example.com / password123\033[0m"
  echo -e "\033[0;33mReviewer: reviewer@example.com / password123\033[0m"
  echo -e "\n\033[0;35mTo stop the application, run: docker-compose down\033[0m"
else
  echo -e "\033[0;31mError starting the application. Check the logs above for details.\033[0m"
fi