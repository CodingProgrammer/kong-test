#!/bin/bash

# Setup Script
# Purpose: Prepare test environment (download files + start Docker containers)

set -e  # Exit immediately if a command fails

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCKER_DIR="${PROJECT_DIR}/docker"

echo "🚀 Starting Setup Process..."
echo "================================================"

# Step 1: Download docker-compose file
echo ""
echo "📥 Step 1/3: Downloading docker-compose file"
bash "${SCRIPT_DIR}/download-docker-compose.sh"

# Step 2: Check if Docker is running
echo ""
echo "🐳 Step 2/3: Checking Docker environment"
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running or not installed"
    echo "Please start Docker Desktop first"
    exit 1
fi
echo "✅ Docker is running properly"

# Step 3: Start Docker containers
echo ""
echo "🔧 Step 3/3: Starting Docker containers"
cd "${DOCKER_DIR}"

# Force cleanup of existing old containers
echo "🧹 Cleaning up old containers..."

# First try to stop using docker-compose
docker compose down -v 2>/dev/null || true

# If containers are still running, force stop and remove
echo "🔍 Checking for remaining containers..."
CONTAINER_IDS=$(docker ps -a --filter "name=kong" --format "{{.ID}}" 2>/dev/null || true)

if [ ! -z "$CONTAINER_IDS" ]; then
    echo "⚠️  Found remaining Kong containers, cleaning up..."
    for CONTAINER_ID in $CONTAINER_IDS; do
        echo "   Removing container: $CONTAINER_ID"
        docker rm -f "$CONTAINER_ID" 2>/dev/null || true
    done
fi

# Wait a moment to ensure cleanup is complete
sleep 2

# Start new containers
echo "🚀 Starting containers..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

# Check container status
echo "📊 Checking container status:"
docker compose ps

# Wait for Kong service to be ready
echo ""
echo "⏳ Waiting for Kong service to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:8002 > /dev/null 2>&1; then
        echo "✅ Kong service is ready"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "⚠️  Warning: Kong service may not be fully ready"
    echo "Continuing with tests..."
fi

echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "🌐 Kong Admin UI: http://localhost:8002"
echo "================================================"

