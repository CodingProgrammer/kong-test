#!/usr/bin/env node

/**
 * Cross-platform Automatic Teardown Script
 * Purpose: Clean up test environment without user interaction
 * Works on Mac, Windows, and Linux (suitable for CI/CD)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DOCKER_DIR = path.join(__dirname, '..', 'docker');
const DOCKER_COMPOSE_FILE = path.join(DOCKER_DIR, 'docker-compose.yml');

console.log('Starting automatic Teardown...');

// Check if docker directory exists
if (!fs.existsSync(DOCKER_DIR)) {
    console.log('docker directory does not exist, skipping cleanup');
    process.exit(0);
}

// Check if docker-compose.yml exists
if (!fs.existsSync(DOCKER_COMPOSE_FILE)) {
    console.log('docker-compose.yml does not exist, skipping cleanup');
    process.exit(0);
}

// Change to docker directory
process.chdir(DOCKER_DIR);

// Stop and remove containers (without prompting user)
console.log('🛑 Stopping and removing containers...');
try {
    execSync('docker compose down -v', { stdio: 'inherit' });
} catch (error) {
    console.error('Warning: Failed to stop containers');
}

// Clean up any remaining Kong containers
console.log('Checking and cleaning up remaining containers...');
try {
    const containers = execSync('docker ps -a --filter "name=kong" --format "{{.ID}}"', { encoding: 'utf-8' });
    if (containers.trim()) {
        console.log('Found remaining containers, cleaning up...');
        const containerIds = containers.trim().split('\n');
        containerIds.forEach(id => {
            try {
                execSync(`docker rm -f ${id}`, { stdio: 'ignore' });
            } catch (e) {
                // Ignore errors
            }
        });
    }
} catch (error) {
    // Ignore error
}

console.log('Teardown Complete');

