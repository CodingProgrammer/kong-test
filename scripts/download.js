#!/usr/bin/env node

/**
 * Cross-platform script to download docker-compose file from Google Drive
 * Works on Mac, Windows, and Linux
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

const GOOGLE_DRIVE_FILE_ID = '1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi';
const DOWNLOAD_DIR = path.join(__dirname, '..', 'docker');
const OUTPUT_FILE = path.join(DOWNLOAD_DIR, 'docker-compose.yml');

console.log('📥 Starting to download docker-compose file...');
console.log(`🖥️  Platform: ${process.platform}`);

// Create docker directory if it doesn't exist
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

console.log(`📍 Download URL: ${DOWNLOAD_URL}`);
console.log(`📁 Save location: ${OUTPUT_FILE}`);

// Remove old file if exists
if (fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE);
}

/**
 * Download using Node.js https module (works on all platforms)
 */
function downloadWithNodeJS(url, outputPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputPath);

        https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 302 || response.statusCode === 301) {
                console.log('📍 Following redirect...');
                https.get(response.headers.location, (redirectResponse) => {
                    redirectResponse.pipe(file);

                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                }).on('error', (err) => {
                    fs.unlink(outputPath, () => { });
                    reject(err);
                });
            } else {
                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }
        }).on('error', (err) => {
            fs.unlink(outputPath, () => { });
            reject(err);
        });

        file.on('error', (err) => {
            fs.unlink(outputPath, () => { });
            reject(err);
        });
    });
}

/**
 * Download using curl (faster when available)
 */
function downloadWithCurl(url, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            // Use cross-platform curl command
            const quotedUrl = process.platform === 'win32' ? `"${url}"` : `'${url}'`;
            const quotedOutput = process.platform === 'win32' ? `"${outputPath}"` : `"${outputPath}"`;

            execSync(`curl -L ${quotedUrl} -o ${quotedOutput}`, {
                stdio: 'inherit',
                windowsHide: true
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Try curl first, fallback to Node.js https
 */
async function downloadFile() {
    let downloadSuccess = false;

    // Method 1: Try curl (faster)
    try {
        console.log('🔄 Method 1: Trying curl...');
        await downloadWithCurl(DOWNLOAD_URL, OUTPUT_FILE);
        downloadSuccess = true;
        console.log('✅ Downloaded using curl');
    } catch (curlError) {
        console.log('⚠️  curl not available or failed, trying alternative method...');

        // Method 2: Use Node.js https module
        try {
            console.log('🔄 Method 2: Using Node.js https module...');
            await downloadWithNodeJS(DOWNLOAD_URL, OUTPUT_FILE);
            downloadSuccess = true;
            console.log('✅ Downloaded using Node.js https');
        } catch (httpsError) {
            throw new Error(`All download methods failed. curl: ${curlError.message}, https: ${httpsError.message}`);
        }
    }

    // Verify download
    if (!fs.existsSync(OUTPUT_FILE)) {
        throw new Error('File not created after download');
    }

    const stats = fs.statSync(OUTPUT_FILE);
    if (stats.size === 0) {
        throw new Error('Downloaded file is empty');
    }

    console.log('✅ docker-compose file downloaded successfully');
    console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);
}

// Execute download
downloadFile().catch(error => {
    console.error('');
    console.error('❌ Download failed:', error.message);
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('💡 Manual Download Instructions:');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    console.error('Option 1: Direct Download');
    console.error('  1. Visit: https://drive.google.com/file/d/1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi/view');
    console.error('  2. Click "Download" button');
    console.error('  3. Save file as "docker-compose.yml"');
    console.error(`  4. Move it to: ${DOWNLOAD_DIR}`);
    console.error('');
    console.error('Option 2: Use Direct Link (PowerShell on Windows)');
    console.error('  PowerShell:');
    console.error(`    Invoke-WebRequest -Uri "${DOWNLOAD_URL}" -OutFile "${OUTPUT_FILE}"`);
    console.error('');
    console.error('Option 3: Use Direct Link (Command Prompt on Windows)');
    console.error('  CMD:');
    console.error(`    curl -L "${DOWNLOAD_URL}" -o "${OUTPUT_FILE}"`);
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    process.exit(1);
});

