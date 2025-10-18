# Quick Reference Card

## 🚀 Most Common Commands

```bash
# Run everything (recommended for first time)
npm run test:full

# Run tests with HTML report
npm run test:report

# Open Cypress GUI (for debugging)
npm run cy:open
```

## 📊 Test Report Commands

```bash
npm run test:report        # ⭐ All-in-one (run + generate + open)
npm run report:generate    # Generate from existing results
npm run report:open        # Open existing report
npm run report:clean       # Clean old reports
```

## 🧪 Test Commands

```bash
npm run test:full          # Setup + Test + Teardown
npm run test:e2e           # E2E workflow
npm run cy:open            # GUI mode (interactive)
npm run cy:run             # Headless mode
npm run test:headed        # Headed mode (visible)
```

## 🔧 Environment Commands

```bash
npm run setup              # Start Kong Gateway
npm run teardown:auto      # Stop Kong (auto)
npm run cleanup            # Force cleanup
```

## 🐳 Docker Commands

```bash
npm run docker:test:full   # Complete Docker workflow
npm run docker:build       # Build test image
npm run docker:test        # Run in Docker
```

## 📁 Important Locations

```
Test Reports:     cypress/reports/html/merged-report.html
Screenshots:      cypress/screenshots/
Videos:           cypress/videos/
Test Specs:       cypress/e2e/
```

## 🆘 Troubleshooting

```bash
# Kong not responding?
npm run cleanup && npm run setup

# Port conflict?
npm run cleanup

# Old reports not clearing?
npm run report:clean

# Need to reset everything?
npm run cleanup
rm -rf node_modules cypress/reports
npm install
```

## 📖 Documentation

- **Full Guide**: [README.md](./README.md)
- **Report Guide**: [REPORT_GUIDE.md](./REPORT_GUIDE.md)
- **Test Specs**: [cypress/e2e/](./cypress/e2e/)

## 💡 Pro Tips

1. **First Time Setup**: Run `npm run test:full` to verify everything works
2. **Daily Testing**: Use `npm run test:report` for quick feedback
3. **Debugging**: Use `npm run cy:open` for interactive testing
4. **CI/CD**: Use `npm run test:full` then `npm run report:generate`
5. **Clean State**: Run `npm run cleanup` before important test runs

## 🎯 Typical Workflow

### Development

```bash
npm run setup              # Once at start
npm run cy:open            # Interactive testing
npm run teardown:auto      # When done
```

### Testing

```bash
npm run test:report        # One command does it all!
```

### CI/CD

```bash
npm run test:full          # Automated tests
npm run report:generate    # Generate report
# Upload artifacts: cypress/reports/html/
```

## ⚡ Quick Examples

### Run specific test file

```bash
npx cypress run --spec "cypress/e2e/gateway-service.cy.ts"
```

### Run with specific browser

```bash
npm run cy:run:chrome
npm run cy:run:firefox
```

### Generate report without running tests

```bash
npm run report:generate    # Uses existing JSON
```

### View last report

```bash
npm run report:open
```

## 🔗 Links

- **GitHub**: https://github.com/CodingProgrammer/kong-test
- **Cypress Docs**: https://docs.cypress.io
- **Mochawesome**: https://github.com/adamgruber/mochawesome

