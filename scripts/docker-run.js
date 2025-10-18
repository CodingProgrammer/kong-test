#!/usr/bin/env node

/**
 * Docker Run Script
 * Purpose: Run tests in Docker container (requires Kong to be running)
 * Works on Mac, Windows, and Linux
 */

const { execSync } = require('child_process');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..');
const IMAGE_NAME = 'kong-cypress-tests:latest';

console.log('🐳 Running Tests in Docker Container...');
console.log('================================================');

// Change to project directory
process.chdir(PROJECT_DIR);

// Check if Kong is running on host
console.log('🔍 Checking if Kong is running...');
try {
    const http = require('http');
    http.get('http://localhost:8002', (res) => {
        if (res.statusCode === 200) {
            console.log('✅ Kong is running on http://localhost:8002');
            runTests();
        } else {
            console.error('⚠️  Kong is not responding correctly');
            console.log('Please start Kong first: npm run setup');
            process.exit(1);
        }
    }).on('error', (err) => {
        console.error('❌ Cannot connect to Kong on http://localhost:8002');
        console.log('');
        console.log('Please start Kong first:');
        console.log('  npm run setup');
        console.log('');
        console.log('Or run complete environment:');
        console.log('  npm run docker:test:full');
        process.exit(1);
    });
} catch (error) {
    console.error('❌ Failed to check Kong status');
    process.exit(1);
}

function runTests() {
    console.log('');
    console.log('🧪 Running tests...');
    console.log('');
    
    try {
        // Get host platform
        const platform = require('os').platform();
        const hostUrl = platform === 'linux' ? 'host.docker.internal' : 'host.docker.internal';
        
        const command = `docker run --rm \
            --name kong-cypress-test-runner \
            --add-host host.docker.internal:host-gateway \
            -v "${PROJECT_DIR}/cypress/videos:/app/cypress/videos" \
            -v "${PROJECT_DIR}/cypress/screenshots:/app/cypress/screenshots" \
            -e CYPRESS_baseUrl=http://host.docker.internal:8002 \
            ${IMAGE_NAME}`;
        
        execSync(command, { stdio: 'inherit' });
        
        console.log('');
        console.log('================================================');
        console.log('✅ Tests completed!');
        console.log('');
        console.log('📹 Videos saved to: ./cypress/videos/');
        console.log('📸 Screenshots saved to: ./cypress/screenshots/');
        console.log('================================================');
        
    } catch (error) {
        console.error('❌ Tests failed or were interrupted');
        process.exit(1);
    }
}

