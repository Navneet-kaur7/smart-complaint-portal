# Use Node.js LTS as the base image with Debian instead of Alpine
FROM node:18

# Install netcat for wait-for-it script, wget for health check, and postgresql-client for database connection
RUN apt-get update && apt-get install -y netcat-openbsd wget postgresql-client

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Make wait-for-it script executable
RUN chmod +x wait-for-it.sh

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Verify the build output exists
RUN ls -la dist/

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["./wait-for-it.sh", "postgres", "5432", "node", "dist/src/main"]