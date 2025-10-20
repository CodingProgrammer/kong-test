#!/usr/bin/env node

/**
 * Run complete test workflow with automatic report generation
 * This script runs the full test suite and generates HTML reports
 * even if tests fail, making it easier to debug issues
 */

const { execSync } = require('child_process');

let exitCode = 0;

function run(cmd) {
    try {
        execSync(cmd, { stdio: 'inherit', shell: true });
    } catch (error) {
        console.error(`Command failed: ${cmd}`);
        console.error(`Error: ${error.message}`);
        throw error;
    }
}

console.log('Running Complete Test Workflow with Report Generation');
console.log('================================================');

try {
    console.log('Phase 1: Running full test suite...');
    run('node scripts/run-tests.js'); // Setup -> Tests -> Teardown
    console.log('Test suite completed successfully');
} catch (e) {
    console.log('Test suite failed, but continuing to generate report...');
    exitCode = 1; // Tests failed, but we still want to generate report
}

try {
    console.log('');
    console.log('Phase 2: Generating HTML report...');
    run('node scripts/generate-report.js');

    console.log('');
    console.log('Phase 3: Opening report in browser...');
    run('node scripts/open-report.js');

    console.log('');
    console.log('Report generation and opening completed');
} catch (e) {
    console.error('Report generation/open failed:', e.message);
    console.error('');
    console.error('You can manually generate the report with:');
    console.error('  npm run report:generate');
    console.error('  npm run report:open');
}

console.log('');
console.log('================================================');
if (exitCode === 0) {
    console.log('Complete workflow finished successfully!');
    console.log('Test report has been generated and opened');
} else {
    console.log('Tests failed, but report has been generated for debugging');
}
console.log('================================================');

process.exit(exitCode);
