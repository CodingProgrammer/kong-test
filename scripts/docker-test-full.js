#!/usr/bin/env node

/**
 * Docker Full Test Script
 * Purpose: Run complete environment (Kong + Cypress tests) using docker-compose
 * Works on Mac, Windows, and Linux
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_DIR = path.join(__dirname, '..');
const COMPOSE_FILE = path.join(PROJECT_DIR, 'docker-compose.test.yml');

// Detect which docker-compose command to use
function getDockerComposeCommand() {
    try {
        execSync('docker compose version', { stdio: 'ignore' });
        return 'docker compose';
    } catch (error) {
        try {
            execSync('docker-compose --version', { stdio: 'ignore' });
            return 'docker-compose';
        } catch (error) {
            console.error('❌ Neither "docker compose" nor "docker-compose" is available');
            console.error('Please install Docker Desktop or Docker Compose');
            process.exit(1);
        }
    }
}

const DOCKER_COMPOSE = getDockerComposeCommand();
console.log(`📦 Using: ${DOCKER_COMPOSE}`);

console.log('🐳 Running Complete Test Environment...');
console.log('================================================');
console.log('This will:');
console.log('  1. Start Kong Gateway + Database');
console.log('  2. Wait for services to be ready');
console.log('  3. Run Cypress tests in container');
console.log('  4. Clean up containers');
console.log('');

// Change to project directory
process.chdir(PROJECT_DIR);

// Check if docker-compose.test.yml exists
if (!fs.existsSync(COMPOSE_FILE)) {
    console.error('❌ docker-compose.test.yml not found');
    process.exit(1);
}

let exitCode = 0;

// Cleanup function
const cleanup = () => {
    console.log('');
    console.log('🧹 Cleaning up containers...');
    try {
        execSync(`${DOCKER_COMPOSE} -f docker-compose.test.yml down -v`, { stdio: 'inherit' });
    } catch (error) {
        console.error('⚠️  Cleanup failed (may be already cleaned)');
    }
    
    console.log('');
    console.log('================================================');
    if (exitCode === 0) {
        console.log('✅ Test workflow completed successfully!');
    } else {
        console.log('❌ Test workflow failed');
    }
    console.log('================================================');
    process.exit(exitCode);
};

// Register cleanup on exit
process.on('exit', cleanup);
process.on('SIGINT', () => { exitCode = 1; process.exit(); });
process.on('SIGTERM', () => { exitCode = 1; process.exit(); });

try {
    // Build images
    console.log('🔨 Building images...');
    execSync(`${DOCKER_COMPOSE} -f docker-compose.test.yml build`, { stdio: 'inherit' });
    
    console.log('');
    console.log('🚀 Starting services...');
    execSync(`${DOCKER_COMPOSE} -f docker-compose.test.yml up -d kong-database kong-admin`, { stdio: 'inherit' });
    
    console.log('');
    console.log('⏳ Waiting for Kong to be ready (may take up to 60 seconds)...');
    
    // Wait for Kong to be ready
    const maxWait = 60;
    let waited = 0;
    const checkInterval = 5;
    
    const waitForKong = () => {
        if (waited >= maxWait) {
            console.error('❌ Kong did not start in time');
            exitCode = 1;
            process.exit(1);
        }
        
        try {
            execSync('docker exec kong-gateway kong health', { stdio: 'ignore' });
            console.log('✅ Kong is ready!');
            runTests();
        } catch (error) {
            waited += checkInterval;
            console.log(`   Waiting... (${waited}/${maxWait}s)`);
            setTimeout(waitForKong, checkInterval * 1000);
        }
    };
    
    waitForKong();
    
} catch (error) {
    console.error('❌ Failed to start environment');
    console.error(error.message);
    exitCode = 1;
    process.exit(1);
}

function runTests() {
    console.log('');
    console.log('🧪 Running Cypress tests...');
    console.log('');
    
    try {
        execSync(`${DOCKER_COMPOSE} -f docker-compose.test.yml run --rm cypress`, { stdio: 'inherit' });
        
        console.log('');
        console.log('✅ All tests passed!');
        console.log('');
        console.log('📹 Videos saved to: ./cypress/videos/');
        console.log('📸 Screenshots saved to: ./cypress/screenshots/');
        
        exitCode = 0;
        process.exit(0);
        
    } catch (error) {
        console.error('');
        console.error('❌ Tests failed');
        exitCode = 1;
        process.exit(1);
    }
}

