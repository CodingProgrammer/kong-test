#!/usr/bin/env node

/**
 * Docker Build Script
 * Purpose: Build Docker image for the test project
 * Works on Mac, Windows, and Linux
 */

const { execSync } = require('child_process');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..');
const IMAGE_NAME = 'kong-cypress-tests';
const IMAGE_TAG = 'latest';
const FULL_IMAGE_NAME = `${IMAGE_NAME}:${IMAGE_TAG}`;

console.log('🐳 Building Docker Image...');
console.log('================================================');
console.log(`📦 Image Name: ${FULL_IMAGE_NAME}`);
console.log('');

// Change to project directory
process.chdir(PROJECT_DIR);

try {
    console.log('🔨 Building image (this may take a few minutes)...');
    execSync(`docker build -t ${FULL_IMAGE_NAME} .`, { stdio: 'inherit' });
    
    console.log('');
    console.log('================================================');
    console.log('✅ Docker image built successfully!');
    console.log('');
    console.log('📊 Image Information:');
    execSync(`docker images ${IMAGE_NAME}`, { stdio: 'inherit' });
    
    console.log('');
    console.log('📝 Next Steps:');
    console.log('');
    console.log('1️⃣  Run tests with existing Kong:');
    console.log('   npm run docker:test');
    console.log('');
    console.log('2️⃣  Run complete environment (Kong + Tests):');
    console.log('   npm run docker:test:full');
    console.log('');
    console.log('3️⃣  Push to Docker Hub (optional):');
    console.log(`   docker tag ${FULL_IMAGE_NAME} your-dockerhub-username/${IMAGE_NAME}`);
    console.log(`   docker push your-dockerhub-username/${IMAGE_NAME}`);
    console.log('');
    console.log('================================================');
    
} catch (error) {
    console.error('❌ Failed to build Docker image');
    console.error(error.message);
    process.exit(1);
}

