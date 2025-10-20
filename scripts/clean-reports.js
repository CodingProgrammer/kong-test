#!/usr/bin/env node

/**
 * Clean old test reports
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '..', 'cypress', 'reports');

console.log('Cleaning old test reports...');

if (fs.existsSync(REPORTS_DIR)) {
    try {
        fs.rmSync(REPORTS_DIR, { recursive: true, force: true });
        console.log('Old reports cleaned successfully');
    } catch (error) {
        console.error('Failed to clean reports:', error.message);
        process.exit(1);
    }
} else {
    console.log('No old reports to clean');
}

