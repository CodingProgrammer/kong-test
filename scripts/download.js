#!/usr/bin/env node

/**
 * Cross-platform script to download docker-compose file from Google Drive
 * Works on Mac, Windows, and Linux
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GOOGLE_DRIVE_FILE_ID = '1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi';
const DOWNLOAD_DIR = path.join(__dirname, '..', 'docker');
const OUTPUT_FILE = path.join(DOWNLOAD_DIR, 'docker-compose.yml');

console.log('📥 Starting to download docker-compose file...');

// Create docker directory if it doesn't exist
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

console.log(`📍 Download URL: ${DOWNLOAD_URL}`);
console.log(`📁 Save location: ${OUTPUT_FILE}`);

try {
    // Remove old file if exists
    if (fs.existsSync(OUTPUT_FILE)) {
        fs.unlinkSync(OUTPUT_FILE);
    }

    // Use curl to download (more reliable for Google Drive)
    execSync(`curl -L "${DOWNLOAD_URL}" -o "${OUTPUT_FILE}"`, { stdio: 'inherit' });

    // Verify download
    if (fs.existsSync(OUTPUT_FILE)) {
        const stats = fs.statSync(OUTPUT_FILE);
        if (stats.size === 0) {
            throw new Error('Downloaded file is empty');
        }
        console.log('✅ docker-compose file downloaded successfully');
        console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
        throw new Error('File not created after download');
    }
} catch (error) {
    console.error('❌ Download failed:', error.message);
    console.error('');
    console.error('💡 Manual download:');
    console.error('   1. Visit: https://drive.google.com/file/d/1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi/view');
    console.error('   2. Download the file');
    console.error(`   3. Save it to: ${OUTPUT_FILE}`);
    process.exit(1);
}

