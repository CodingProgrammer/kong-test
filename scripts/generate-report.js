#!/usr/bin/env node

/**
 * Generate HTML Report from Mochawesome JSON files
 * Merges multiple JSON reports and generates a single HTML report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '..', 'cypress', 'reports');
const MOCHAWESOME_DIR = path.join(REPORTS_DIR, 'mochawesome');
const HTML_REPORT_DIR = path.join(REPORTS_DIR, 'html');

console.log('📊 Generating Mochawesome HTML Report...');
console.log('================================================');

// Check if mochawesome directory exists
if (!fs.existsSync(MOCHAWESOME_DIR)) {
    console.error('❌ No test reports found!');
    console.error(`Expected directory: ${MOCHAWESOME_DIR}`);
    console.error('');
    console.error('Please run tests first:');
    console.error('  npm run cy:run');
    process.exit(1);
}

// Check for JSON files
const jsonFiles = fs.readdirSync(MOCHAWESOME_DIR)
    .filter(file => file.endsWith('.json'));

if (jsonFiles.length === 0) {
    console.error('❌ No JSON report files found!');
    console.error('');
    console.error('Please run tests first:');
    console.error('  npm run cy:run');
    process.exit(1);
}

console.log(`📁 Found ${jsonFiles.length} test report(s)`);
console.log('');

try {
    // Step 1: Merge JSON reports
    console.log('🔄 Step 1: Merging JSON reports...');
    const mergedReportPath = path.join(MOCHAWESOME_DIR, 'merged-report.json');
    
    // Remove old merged report if exists
    if (fs.existsSync(mergedReportPath)) {
        fs.unlinkSync(mergedReportPath);
        console.log('🗑️  Removed old merged report');
    }
    
    // Get all JSON files to merge (excluding merged-report.json)
    const jsonFilesToMerge = fs.readdirSync(MOCHAWESOME_DIR)
        .filter(file => file.endsWith('.json') && file !== 'merged-report.json')
        .map(file => path.join(MOCHAWESOME_DIR, file));
    
    if (jsonFilesToMerge.length === 0) {
        throw new Error('No JSON files to merge');
    }
    
    console.log(`📝 Merging ${jsonFilesToMerge.length} file(s)...`);
    
    // Use mochawesome-merge with specific files
    const filesPattern = jsonFilesToMerge.map(f => `"${f}"`).join(' ');
    const mergeCommand = `npx mochawesome-merge ${filesPattern} -o "${mergedReportPath}"`;
    
    execSync(mergeCommand, {
        stdio: 'inherit',
        shell: true
    });
    
    console.log('✅ Reports merged successfully');
    console.log('');

    // Step 2: Generate HTML report
    console.log('🔄 Step 2: Generating HTML report...');
    
    // Create HTML report directory if it doesn't exist
    if (!fs.existsSync(HTML_REPORT_DIR)) {
        fs.mkdirSync(HTML_REPORT_DIR, { recursive: true });
    }

    execSync(`npx mochawesome-report-generator "${mergedReportPath}" --reportDir "${HTML_REPORT_DIR}" --inline --charts`, {
        stdio: 'inherit'
    });

    console.log('✅ HTML report generated successfully');
    console.log('');

    // Get report file path
    const htmlReportPath = path.join(HTML_REPORT_DIR, 'merged-report.html');
    
    if (fs.existsSync(htmlReportPath)) {
        console.log('================================================');
        console.log('✅ Report Generation Complete!');
        console.log('');
        console.log('📄 Report location:');
        console.log(`   ${htmlReportPath}`);
        console.log('');
        console.log('🌐 Open report:');
        console.log('   npm run report:open');
        console.log('');
        console.log('   Or open manually:');
        if (process.platform === 'darwin') {
            console.log(`   open "${htmlReportPath}"`);
        } else if (process.platform === 'win32') {
            console.log(`   start "${htmlReportPath}"`);
        } else {
            console.log(`   xdg-open "${htmlReportPath}"`);
        }
        console.log('================================================');
    }

} catch (error) {
    console.error('');
    console.error('❌ Report generation failed:', error.message);
    process.exit(1);
}

