#!/usr/bin/env node

/**
 * Cross-platform Force Cleanup Script
 * Purpose: Force cleanup of all Kong-related containers when encountering conflicts
 * Works on Mac, Windows, and Linux
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Force cleanup of Kong-related containers');
console.log('================================================');

// Stop all Kong-related containers
console.log('🛑 Stopping all Kong containers...');
try {
    const containers = execSync('docker ps -a --filter "name=kong" --format "{{.ID}}"', { encoding: 'utf-8' });
    if (containers.trim()) {
        const containerIds = containers.trim().split('\n');
        containerIds.forEach(id => {
            if (id) {
                console.log(`   Stopping container: ${id}`);
                try {
                    execSync(`docker stop ${id}`, { stdio: 'ignore' });
                } catch (e) {
                    // Ignore errors
                }
            }
        });
    }
} catch (error) {
    // Ignore error
}

// Remove all Kong-related containers
console.log(' Removing all Kong containers...');
try {
    const containers = execSync('docker ps -a --filter "name=kong" --format "{{.ID}}"', { encoding: 'utf-8' });
    if (containers.trim()) {
        const containerIds = containers.trim().split('\n');
        containerIds.forEach(id => {
            if (id) {
                console.log(`   Removing container: ${id}`);
                try {
                    execSync(`docker rm -f ${id}`, { stdio: 'ignore' });
                } catch (e) {
                    // Ignore errors
                }
            }
        });
    }
} catch (error) {
    // Ignore error
}

// Clean up docker-compose if it exists
const DOCKER_DIR = path.join(__dirname, '..', 'docker');
const DOCKER_COMPOSE_FILE = path.join(DOCKER_DIR, 'docker-compose.yml');

if (fs.existsSync(DOCKER_DIR) && fs.existsSync(DOCKER_COMPOSE_FILE)) {
    console.log('Cleaning up using docker-compose...');
    process.chdir(DOCKER_DIR);
    try {
        execSync('docker compose down -v', { stdio: 'ignore' });
    } catch (error) {
        // Ignore error
    }
}

// Clean up unused networks
console.log('Cleaning up Docker networks...');
try {
    execSync('docker network prune -f', { stdio: 'ignore' });
} catch (error) {
    // Ignore error
}

// Clean up unused volumes
console.log('💾 Cleaning up Docker volumes...');
try {
    const volumes = execSync('docker volume ls -qf "name=kong"', { encoding: 'utf-8' });
    if (volumes.trim()) {
        const volumeNames = volumes.trim().split('\n');
        volumeNames.forEach(name => {
            if (name) {
                console.log(`   Removing volume: ${name}`);
                try {
                    execSync(`docker volume rm ${name}`, { stdio: 'ignore' });
                } catch (e) {
                    // Ignore errors
                }
            }
        });
    }
} catch (error) {
    // Ignore error
}

console.log('');
console.log('================================================');
console.log('Force cleanup complete!');
console.log('');
console.log('You can now run: npm run setup');
console.log('================================================');

