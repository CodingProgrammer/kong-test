#!/bin/bash

# Download Google Drive File Script
# Purpose: Download docker-compose file from Google Drive

set -e  # Exit immediately if a command fails

GOOGLE_DRIVE_FILE_ID="1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi"
OUTPUT_FILE="docker-compose.yml"
DOWNLOAD_DIR="./docker"

echo "Starting to download docker-compose file..."

# Create docker directory (if it doesn't exist)
mkdir -p "$DOWNLOAD_DIR"

# Download file using curl
# Google Drive direct download link format
DOWNLOAD_URL="https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}"

echo "📍 Download URL: ${DOWNLOAD_URL}"
echo "Save location: ${DOWNLOAD_DIR}/${OUTPUT_FILE}"

# Download file
if command -v curl &> /dev/null; then
    curl -L -o "${DOWNLOAD_DIR}/${OUTPUT_FILE}" "${DOWNLOAD_URL}"
elif command -v wget &> /dev/null; then
    wget -O "${DOWNLOAD_DIR}/${OUTPUT_FILE}" "${DOWNLOAD_URL}"
else
    echo "Error: curl or wget command not found"
    exit 1
fi

# Check if file was downloaded successfully
if [ -f "${DOWNLOAD_DIR}/${OUTPUT_FILE}" ]; then
    echo "docker-compose file downloaded successfully"
    echo "File size: $(du -h ${DOWNLOAD_DIR}/${OUTPUT_FILE} | cut -f1)"
else
    echo "Download failed"
    exit 1
fi

