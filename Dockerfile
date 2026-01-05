# Use Debian-based Node.js image (better compatibility with native modules)
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install PostgreSQL client and other native build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    python3 \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy root-level package files (for better layer caching)
COPY package.json package-lock.json ./

# Copy frontend package files
COPY frontend/package.json frontend/package-lock.json ./frontend/

# Install root dependencies cleanly
RUN npm ci

# Install frontend dependencies cleanly
RUN npm ci --prefix ./frontend

# Copy the rest of the app (after dependencies are installed)
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build frontend (assumes this triggers vite build)
RUN npm run build

# Start the app with migration deployment
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
