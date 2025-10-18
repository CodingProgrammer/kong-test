#!/usr/bin/env node

/**
 * Cross-platform Complete Test Workflow Script
 * Purpose: Automate execution of Setup -> Run Tests -> Teardown
 * Works on Mac, Windows, and Linux
 */

const { execSync, spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

let exitCode = 0;

// Cleanup function
function cleanup() {
    console.log('');
    console.log('================================================');

    if (exitCode === 0) {
        console.log(`${colors.green}✅ Test workflow completed${colors.reset}`);
    } else {
        console.log(`${colors.red}❌ Test workflow failed (exit code: ${exitCode})${colors.reset}`);
    }

    console.log('');
    console.log('🧹 Executing Teardown...');

    try {
        execSync('node ' + path.join(__dirname, 'teardown-auto.js'), { stdio: 'inherit' });
    } catch (error) {
        // Ignore teardown errors
    }

    console.log('================================================');
    process.exit(exitCode);
}

// Register cleanup on exit
process.on('exit', cleanup);
process.on('SIGINT', () => {
    exitCode = 130;
    process.exit();
});
process.on('SIGTERM', () => {
    exitCode = 143;
    process.exit();
});

console.log('================================================');
console.log('🎯 Kong UI Automation Test Complete Workflow');
console.log('================================================');

// Step 1: Setup
console.log('');
console.log(`${colors.yellow}📋 Phase 1/3: Setup${colors.reset}`);
try {
    execSync('node ' + path.join(__dirname, 'setup.js'), { stdio: 'inherit' });
} catch (error) {
    exitCode = 1;
    process.exit(1);
}

// Wait for setup to complete
setTimeout(() => {
    // Step 2: Run tests
    console.log('');
    console.log(`${colors.yellow}📋 Phase 2/3: Run Tests${colors.reset}`);
    console.log('================================================');

    const projectDir = path.join(__dirname, '..');

    try {
        execSync('npm run cy:run', { stdio: 'inherit', cwd: projectDir });
    } catch (error) {
        exitCode = error.status || 1;
        process.exit(exitCode);
    }

    // Step 3: Teardown (handled by cleanup function)
    console.log('');
    console.log(`${colors.yellow}📋 Phase 3/3: Teardown${colors.reset}`);
    console.log('Will be executed automatically on exit...');
}, 1000);

