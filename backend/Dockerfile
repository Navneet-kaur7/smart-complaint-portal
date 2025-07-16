# Build stage
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Install OpenSSL and other required system dependencies
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Remove lock file to avoid version conflicts
RUN rm -f package-lock.json

# Install all dependencies (including dev dependencies for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Verify the build output
RUN ls -la dist/

# Production stage
FROM node:18-slim AS production

# Set working directory
WORKDIR /app

# Install OpenSSL and other required system dependencies
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Remove lock file to avoid version conflicts
RUN rm -f package-lock.json

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema for migrations
COPY --from=builder /app/prisma ./prisma

# Verify the copied files
RUN ls -la /app && ls -la /app/dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]