#!/bin/bash

# Automatic Teardown Script (no user interaction required)
# Purpose: For use in CI/CD or automated workflows

set -e  # Exit immediately if a command fails

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCKER_DIR="${PROJECT_DIR}/docker"

echo "Starting automatic Teardown..."

# Check if docker directory exists
if [ ! -d "${DOCKER_DIR}" ]; then
    echo "docker directory does not exist, skipping cleanup"
    exit 0
fi

cd "${DOCKER_DIR}"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "docker-compose.yml does not exist, skipping cleanup"
    exit 0
fi

# Stop and remove containers (without prompting user)
echo "🛑 Stopping and removing containers..."
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

echo "Teardown Complete"
