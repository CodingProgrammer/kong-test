#!/bin/bash

# Teardown Script
# Purpose: Clean up test environment (stop and remove Docker containers)

set -e  # Exit immediately if a command fails

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCKER_DIR="${PROJECT_DIR}/docker"

echo "Starting Teardown Process..."
echo "================================================"

# Check if docker directory exists
if [ ! -d "${DOCKER_DIR}" ]; then
    echo "Warning: docker directory does not exist, skipping cleanup"
    exit 0
fi

cd "${DOCKER_DIR}"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "Warning: docker-compose.yml does not exist, skipping cleanup"
    exit 0
fi

# Stop and remove containers
echo "🛑 Stopping containers..."
docker compose down -v

# Clean up any remaining Kong containers
echo "Checking and cleaning up remaining containers..."
CONTAINER_IDS=$(docker ps -a --filter "name=kong" --format "{{.ID}}" 2>/dev/null || true)

if [ ! -z "$CONTAINER_IDS" ]; then
    echo "Found remaining containers, cleaning up..."
    for CONTAINER_ID in $CONTAINER_IDS; do
        docker rm -f "$CONTAINER_ID" 2>/dev/null || true
    done
fi

# Optional: Clean up unused Docker resources
echo ""
read -p "Clean up unused Docker resources? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleaning up Docker resources..."
    docker system prune -f
fi

echo ""
echo "================================================"
echo "Teardown Complete!"
echo "================================================"
