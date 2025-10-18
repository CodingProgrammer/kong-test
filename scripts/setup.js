#!/usr/bin/env node

/**
 * Cross-platform Setup Script
 * Purpose: Prepare test environment (download files + start Docker containers)
 * Works on Mac, Windows, and Linux
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DOCKER_DIR = path.join(__dirname, '..', 'docker');
const DOCKER_COMPOSE_FILE = path.join(DOCKER_DIR, 'docker-compose.yml');

console.log('🚀 Starting Setup Process...');
console.log('================================================');

// Step 1: Download docker-compose file
console.log('');
console.log('📥 Step 1/3: Downloading docker-compose file');
try {
    execSync('node ' + path.join(__dirname, 'download.js'), { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Failed to download docker-compose file');
    process.exit(1);
}

// Step 2: Check if Docker is running
console.log('');
console.log('🐳 Step 2/3: Checking Docker environment');
try {
    execSync('docker info', { stdio: 'ignore' });
    console.log('✅ Docker is running properly');
} catch (error) {
    console.error('❌ Docker is not running or not installed');
    console.error('Please start Docker Desktop first');
    process.exit(1);
}

// Step 3: Start Docker containers
console.log('');
console.log('🔧 Step 3/3: Starting Docker containers');

// Change to docker directory
process.chdir(DOCKER_DIR);

// Force cleanup of existing old containers
console.log('🧹 Cleaning up old containers...');
try {
    execSync('docker compose down -v', { stdio: 'ignore' });
} catch (error) {
    // Ignore error if no containers exist
}

// Check for remaining containers
console.log('🔍 Checking for remaining containers...');
try {
    const containers = execSync('docker ps -a --filter "name=kong" --format "{{.ID}}"', { encoding: 'utf-8' });
    if (containers.trim()) {
        console.log('⚠️  Found remaining Kong containers, cleaning up...');
        const containerIds = containers.trim().split('\n');
        containerIds.forEach(id => {
            try {
                console.log(`   Removing container: ${id}`);
                execSync(`docker rm -f ${id}`, { stdio: 'ignore' });
            } catch (e) {
                // Ignore errors
            }
        });
    }
} catch (error) {
    // Ignore error
}

// Wait a moment to ensure cleanup is complete
console.log('⏳ Waiting for cleanup to complete...');
setTimeout(() => {
    // Start new containers
    console.log('🚀 Starting containers...');
    try {
        execSync('docker compose up -d', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Failed to start containers');
        process.exit(1);
    }

    // Wait for services to be ready
    console.log('⏳ Waiting for services to start (30 seconds)...');
    setTimeout(() => {
        // Check container status
        console.log('📊 Checking container status:');
        try {
            execSync('docker compose ps', { stdio: 'inherit' });
        } catch (error) {
            // Continue even if this fails
        }

        // Wait for Kong service to be ready
        console.log('');
        console.log('⏳ Waiting for Kong service to be ready...');

        const maxRetries = 30;
        let retryCount = 0;

        const checkService = () => {
            if (retryCount >= maxRetries) {
                console.log('⚠️  Warning: Kong service may not be fully ready');
                console.log('Continuing with tests...');
                console.log('');
                console.log('================================================');
                console.log('✅ Setup Complete!');
                console.log('🌐 Kong Admin UI: http://localhost:8002');
                console.log('================================================');
                return;
            }

            try {
                require('http').get('http://localhost:8002', (res) => {
                    console.log('✅ Kong service is ready');
                    console.log('');
                    console.log('================================================');
                    console.log('✅ Setup Complete!');
                    console.log('🌐 Kong Admin UI: http://localhost:8002');
                    console.log('================================================');
                }).on('error', () => {
                    retryCount++;
                    console.log(`Waiting... (${retryCount}/${maxRetries})`);
                    setTimeout(checkService, 2000);
                });
            } catch (error) {
                retryCount++;
                console.log(`Waiting... (${retryCount}/${maxRetries})`);
                setTimeout(checkService, 2000);
            }
        };

        checkService();
    }, 30000);
}, 2000);

