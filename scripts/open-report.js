#!/usr/bin/env node

/**
 * Open the generated HTML report in the default browser
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HTML_REPORT_PATH = path.join(__dirname, '..', 'cypress', 'reports', 'html', 'merged-report.html');

console.log('Opening Test Report...');

// Check if report exists
if (!fs.existsSync(HTML_REPORT_PATH)) {
    console.error('Report not found!');
    console.error('');
    console.error('Please generate the report first:');
    console.error('  npm run report:generate');
    console.error('');
    console.error('Or run tests with report generation:');
    console.error('  npm run test:report');
    process.exit(1);
}

try {
    // Open report based on platform
    if (process.platform === 'darwin') {
        // macOS
        execSync(`open "${HTML_REPORT_PATH}"`);
    } else if (process.platform === 'win32') {
        // Windows
        execSync(`start "" "${HTML_REPORT_PATH}"`, { shell: true });
    } else {
        // Linux
        execSync(`xdg-open "${HTML_REPORT_PATH}"`);
    }
    
    console.log('Report opened in browser');
    console.log(`${HTML_REPORT_PATH}`);
} catch (error) {
    console.error('Failed to open report:', error.message);
    console.error('');
    console.error('Please open manually:');
    console.error(`   ${HTML_REPORT_PATH}`);
    process.exit(1);
}

