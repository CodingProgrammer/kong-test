# 📊 Test Report Guide

This guide explains how to generate and view beautiful HTML test reports using Mochawesome.

## 🎯 Quick Start

### Generate and View Report Automatically

```bash
npm run test:report
```

This single command will:
1. Clean old reports
2. Run all tests
3. Generate HTML report
4. Open report in browser

## 📋 Available Commands

### Full Workflow

```bash
# Run tests + Generate report + Open in browser
npm run test:report
```

### Individual Steps

```bash
# 1. Clean old reports
npm run report:clean

# 2. Run tests (generates JSON reports)
npm run cy:run

# 3. Generate HTML report from JSON
npm run report:generate

# 4. Open report in browser
npm run report:open
```

### With Environment Setup

```bash
# Complete workflow with Docker setup/teardown
npm run test:full        # Setup + Tests + Teardown (no report)

# Or manual workflow with reports:
npm run setup            # Start Kong Gateway
npm run test:report      # Run tests + Generate report
npm run teardown:auto    # Stop Kong Gateway
```

## 📁 Report Structure

```
cypress/
└── reports/
    ├── mochawesome/              # JSON reports (raw data)
    │   ├── mochawesome_*.json   # Individual test results
    │   └── merged-report.json   # Combined results
    └── html/                     # HTML reports (viewable)
        └── merged-report.html   # Final HTML report (open this)
```

## 🎨 Report Features

The Mochawesome HTML report includes:

- ✅ **Test Results Summary**
  - Total tests count
  - Pass/Fail statistics
  - Test duration
  - Success rate

- 📊 **Visual Charts**
  - Pie chart of test results
  - Pass rate visualization
  - Duration breakdown

- 🔍 **Detailed Test Information**
  - Test hierarchy (suites and tests)
  - Individual test duration
  - Error messages and stack traces
  - Code snippets

- 📸 **Media Attachments**
  - Screenshots (on failure)
  - Test videos
  - Console logs

- 🎯 **Interactive Navigation**
  - Collapsible test suites
  - Search functionality
  - Filter by status (pass/fail)

## 📸 Screenshots & Videos

### Screenshots

- Automatically captured on test failure
- Saved to: `cypress/screenshots/`
- Embedded in HTML report

### Videos

- Recorded for all test runs
- Saved to: `cypress/videos/`
- Linked in HTML report

## 🔧 Configuration

### Mochawesome Settings

Located in `cypress.config.ts`:

```typescript
reporter: 'mochawesome',
reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,           // Keep all reports
    html: false,                // Generate JSON only (HTML generated later)
    json: true,                 // Generate JSON reports
    timestamp: 'mmddyyyy_HHMMss' // Timestamp format
}
```

### Customizing Report Generation

Edit `scripts/generate-report.js` to customize:

- Report title
- Chart types
- Inline assets
- Custom metadata

Example customization:

```bash
npx mochawesome-report-generator \
  merged-report.json \
  --reportDir cypress/reports/html \
  --reportTitle "Kong UI Tests" \
  --reportPageTitle "Test Report" \
  --inline \
  --charts
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with report
        run: npm run test:full
      
      - name: Generate HTML report
        if: always()
        run: npm run report:generate
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: cypress/reports/html/
      
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: cypress/screenshots/
      
      - name: Upload videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: videos
          path: cypress/videos/
```

### Jenkins Example

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test:full'
            }
        }
        
        stage('Generate Report') {
            steps {
                sh 'npm run report:generate'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'cypress/reports/html',
                reportFiles: 'merged-report.html',
                reportName: 'Test Report'
            ])
            
            archiveArtifacts artifacts: 'cypress/videos/**/*.mp4', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
        }
    }
}
```

## 🔍 Troubleshooting

### No Reports Generated

**Problem:** No JSON files in `cypress/reports/mochawesome/`

**Solution:**
```bash
# Ensure Mochawesome is configured
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator

# Run tests to generate reports
npm run cy:run
```

### Report Generation Fails

**Problem:** Error during `npm run report:generate`

**Solutions:**

1. Check JSON files exist:
   ```bash
   ls cypress/reports/mochawesome/*.json
   ```

2. Clean and regenerate:
   ```bash
   npm run report:clean
   npm run cy:run
   npm run report:generate
   ```

3. Verify Node.js version:
   ```bash
   node -v  # Should be v18+
   ```

### Report Won't Open

**Problem:** Report doesn't open in browser

**Solutions:**

1. Open manually:
   ```bash
   # macOS
   open cypress/reports/html/merged-report.html
   
   # Windows
   start cypress/reports/html/merged-report.html
   
   # Linux
   xdg-open cypress/reports/html/merged-report.html
   ```

2. Check file exists:
   ```bash
   ls cypress/reports/html/merged-report.html
   ```

## 📊 Report Examples

### Successful Test Run

```
✓ Test 1 - Create Gateway Service    (5729ms)
✓ Test 2 - Validate Error Handling   (3456ms)
✓ Test 3 - Delete Service            (2341ms)

Tests:        3
Passing:      3
Failing:      0
Duration:     11.5s
```

### Failed Test Run

```
✓ Test 1 - Create Gateway Service    (5729ms)
✗ Test 2 - Validate Error Handling   (3456ms)
  AssertionError: Expected element to exist
  
  at Context.eval (gateway-service.cy.ts:123)

Tests:        2
Passing:      1
Failing:      1
Duration:     9.2s
```

## 💡 Best Practices

### 1. Clean Reports Regularly

```bash
# Before each test run
npm run report:clean
```

### 2. Keep Reports for History

Archive reports after each run:
```bash
# Example: Save with date
mv cypress/reports/html reports-backup/report-$(date +%Y%m%d)
```

### 3. Include in CI/CD

Always generate reports in CI/CD pipelines for visibility.

### 4. Share Reports

- Host on static site (GitHub Pages, Netlify)
- Attach to JIRA tickets
- Email to stakeholders
- Store in shared drive

## 🔗 Related Documentation

- [Mochawesome Documentation](https://github.com/adamgruber/mochawesome)
- [Cypress Reporters](https://docs.cypress.io/guides/tooling/reporters)
- [Project README](./README.md)

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [Mochawesome Issues](https://github.com/adamgruber/mochawesome/issues)
3. Create issue in project repository

