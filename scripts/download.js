#!/usr/bin/env node

/**
 * Cross-platform script to download docker-compose file from Google Drive
 * Works on Mac, Windows, and Linux
 */

const https = require('https');
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

const file = fs.createWriteStream(OUTPUT_FILE);

https.get(DOWNLOAD_URL, (response) => {
    // Handle redirects
    if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
            redirectResponse.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log('✅ docker-compose file downloaded successfully');
                const stats = fs.statSync(OUTPUT_FILE);
                console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);
            });
        }).on('error', (err) => {
            fs.unlinkSync(OUTPUT_FILE);
            console.error('❌ Download failed:', err.message);
            process.exit(1);
        });
    } else {
        response.pipe(file);

        file.on('finish', () => {
            file.close();
            console.log('✅ docker-compose file downloaded successfully');
            const stats = fs.statSync(OUTPUT_FILE);
            console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);
        });
    }
}).on('error', (err) => {
    fs.unlinkSync(OUTPUT_FILE);
    console.error('❌ Download failed:', err.message);
    process.exit(1);
});

