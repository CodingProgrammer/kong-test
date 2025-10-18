# Kong UI Automation Testing - Docker Image
# Multi-stage build for optimized image size

FROM cypress/included:13.17.0

# Set working directory
WORKDIR /app

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    curl \
    docker.io \
    docker-compose \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --quiet

# Copy project files
COPY cypress ./cypress
COPY cypress.config.ts ./
COPY scripts ./scripts

# Create directories for test results
RUN mkdir -p /app/cypress/videos /app/cypress/screenshots

# Set environment variables
ENV CYPRESS_baseUrl=http://host.docker.internal:8002
ENV CI=true

# Default command
CMD ["npm", "run", "cy:run"]

