#!/usr/bin/env node

/**
 * Cross-platform Teardown Script
 * Purpose: Clean up test environment (stop and remove Docker containers)
 * Works on Mac, Windows, and Linux
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const DOCKER_DIR = path.join(__dirname, '..', 'docker');
const DOCKER_COMPOSE_FILE = path.join(DOCKER_DIR, 'docker-compose.yml');

console.log('Starting Teardown Process...');
console.log('================================================');

// Check if docker directory exists
if (!fs.existsSync(DOCKER_DIR)) {
    console.log('Warning: docker directory does not exist, skipping cleanup');
    process.exit(0);
}

// Check if docker-compose.yml exists
if (!fs.existsSync(DOCKER_COMPOSE_FILE)) {
    console.log('Warning: docker-compose.yml does not exist, skipping cleanup');
    process.exit(0);
}

// Change to docker directory
process.chdir(DOCKER_DIR);

// Stop and remove containers
console.log('🛑 Stopping containers...');
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

// Optional: Clean up unused Docker resources
console.log('');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Clean up unused Docker resources? (y/N) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('Cleaning up Docker resources...');
        try {
            execSync('docker system prune -f', { stdio: 'inherit' });
        } catch (error) {
            console.error('Warning: Failed to clean up Docker resources');
        }
    }

    console.log('');
    console.log('================================================');
    console.log('Teardown Complete!');
    console.log('================================================');

    rl.close();
});

