#!/bin/bash

# Force Cleanup Script
# Purpose: Force cleanup of all Kong-related containers when encountering container name conflicts

set -e

echo "🧹 Force cleanup of Kong-related containers"
echo "================================================"

# Stop all Kong-related containers
echo "🛑 Stopping all Kong containers..."
docker ps -a --filter "name=kong" --format "{{.ID}}" | while read CONTAINER_ID; do
    if [ ! -z "$CONTAINER_ID" ]; then
        echo "   Stopping container: $CONTAINER_ID"
        docker stop "$CONTAINER_ID" 2>/dev/null || true
    fi
done

# Remove all Kong-related containers
echo "🗑️  Removing all Kong containers..."
docker ps -a --filter "name=kong" --format "{{.ID}}" | while read CONTAINER_ID; do
    if [ ! -z "$CONTAINER_ID" ]; then
        echo "   Removing container: $CONTAINER_ID"
        docker rm -f "$CONTAINER_ID" 2>/dev/null || true
    fi
done

# Clean up docker-compose if it exists
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCKER_DIR="${PROJECT_DIR}/docker"

if [ -d "${DOCKER_DIR}" ] && [ -f "${DOCKER_DIR}/docker-compose.yml" ]; then
    echo "🧹 Cleaning up using docker-compose..."
    cd "${DOCKER_DIR}"
    docker compose down -v 2>/dev/null || true
fi

# Clean up unused networks
echo "🌐 Cleaning up Docker networks..."
docker network prune -f 2>/dev/null || true

# Clean up unused volumes
echo "💾 Cleaning up Docker volumes..."
docker volume ls -qf "name=kong" | while read VOLUME_NAME; do
    if [ ! -z "$VOLUME_NAME" ]; then
        echo "   Removing volume: $VOLUME_NAME"
        docker volume rm "$VOLUME_NAME" 2>/dev/null || true
    fi
done

echo ""
echo "================================================"
echo "✅ Force cleanup complete!"
echo ""
echo "You can now run: npm run setup"
echo "================================================"
