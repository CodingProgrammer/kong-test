# Kong UI Automation Testing

> Cross-platform UI automation testing framework for Kong Admin interface using Cypress and TypeScript.

[![Cypress](https://img.shields.io/badge/Cypress-13.x-brightgreen.svg)](https://www.cypress.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- ✅ **Cross-Platform** - Works on macOS, Windows, and Linux
- ✅ **One-Command Setup** - Automated environment setup and teardown
- ✅ **Beautiful Reports** - Mochawesome HTML reports with screenshots
- ✅ **Docker Support** - Run tests in containerized environment
- ✅ **CI/CD Ready** - Perfect for continuous integration

## Quick Start

```bash
# Clone and install
git clone https://github.com/CodingProgrammer/kong-test.git
cd kong-test
npm install

# Run complete test workflow
npm run test:full
```

**That's it!** The script automatically:
- 📥 Downloads Kong configuration
- 🚀 Starts Kong Gateway
- 🧪 Runs all tests (4 test cases)
- 🧹 Cleans up containers

## Usage

### Basic Commands

```bash
# Complete workflow (recommended) - includes Kong setup
npm run test:full

# Run tests with HTML report (requires Kong to be running)
npm run setup              # Start Kong first
npm run test:report        # Run tests + generate report

# Interactive GUI mode (requires Kong to be running)
npm run setup              # Start Kong first
npm run cy:open            # Open Cypress GUI
```

### Docker Usage

```bash
# Run everything in Docker containers
npm run docker:test:full
```

## Test Reports

Generate beautiful HTML reports with screenshots and videos:

```bash
# Generate and open report
npm run test:report

# Or generate from existing results
npm run report:generate
npm run report:open
```

Reports are saved to `cypress/reports/html/merged-report.html`

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Test Cases

| Test Case | Description |
|-----------|-------------|
| Create Gateway Service | Basic service creation workflow |
| Create Service with Wrong URL | URL validation testing |
| Create Service with Invalid Form | Form error handling |
| Create Service with Routes | Complete workflow with Routes |

## Commands

| Command | Description |
|---------|-------------|
| `npm run test:full` | Complete workflow (Setup + Test + Teardown) |
| `npm run test:report` | Run tests + Generate HTML report |
| `npm run cy:open` | Open Cypress GUI |
| `npm run setup` | Start Kong Gateway |
| `npm run teardown:auto` | Stop Kong Gateway |

## Troubleshooting

```bash
# Docker not running
npm run cleanup && npm run setup

# Port conflicts
npm run cleanup

# Permission issues (Linux)
sudo usermod -aG docker $USER
# Log out and back in
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:full
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ using Cypress and TypeScript**