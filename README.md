# Kong UI Automation Testing Project

A cross-platform UI automation testing framework for Kong Admin interface using Cypress and TypeScript.

[![Cypress](https://img.shields.io/badge/Cypress-13.x-brightgreen.svg)](https://www.cypress.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Mac%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)]()

## Features

- ✅ **Cross-Platform**: Works on macOS, Windows, and Linux
- ✅ **TypeScript**: Full type checking and IntelliSense support
- ✅ **Automated Workflow**: One-command setup, test, and teardown
- ✅ **Docker Integration**: Automatic environment management
- ✅ **Test Cases**: Complete Gateway Service CRUD operations
- ✅ **Auto Cleanup**: Automatic resource cleanup after tests

## Prerequisites

- **Node.js** v18.x or higher
- **Docker Desktop** (running)
- **npm** (comes with Node.js)

## Quick Start

### All Platforms (Mac, Windows, Linux)

```bash
# 1. Install dependencies
npm install

# 2. Run complete test workflow (Setup + Test + Teardown)
npm run test:full
```

That's it! The script will automatically:
- Download docker-compose.yml from Google Drive
- Start Docker containers
- Wait for services to be ready
- Run all test cases
- Clean up containers

### Step-by-Step Workflow

```bash
# Setup environment
npm run setup

# Run tests (choose one)
npm run cy:open         # GUI mode (recommended for development)
npm run cy:run          # Headless mode
npm run test:headed     # Headed mode (visible browser)

# Cleanup environment
npm run teardown:auto
```

## Platform-Specific Setup

### macOS

```bash
# Install Node.js (using Homebrew)
brew install node

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Run tests
npm install
npm run test:full
```

### Windows

```powershell
# Install Node.js
# Download from: https://nodejs.org/

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Run tests (PowerShell, CMD, or Git Bash)
npm install
npm run test:full
```

### Linux

```bash
# Install Node.js (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm

# Install Docker
sudo apt install docker.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in

# Run tests
npm install
npm run test:full
```

## Project Structure

```
kong-test-Cypress/
├── cypress/
│   ├── e2e/
│   │   └── gateway-service.cy.ts    # Gateway Service test cases
│   ├── fixtures/
│   │   └── example.json             # Test data
│   ├── support/
│   │   ├── commands.ts              # Custom commands
│   │   └── e2e.ts                   # Global configuration
│   ├── videos/                      # Test videos (auto-generated)
│   └── screenshots/                 # Screenshots (auto-generated)
├── scripts/
│   ├── setup.js                     # Setup script (Node.js)
│   ├── teardown.js                  # Teardown script
│   ├── teardown-auto.js             # Auto teardown
│   ├── cleanup.js                   # Force cleanup
│   ├── download.js                  # Download docker-compose
│   ├── run-tests.js                 # Complete workflow
│   ├── *.sh                         # Bash versions (optional)
├── cypress.config.ts                # Cypress configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Available Commands

### Test Execution

```bash
npm run test:full      # Complete workflow (Setup + Test + Teardown)
npm run test:e2e       # E2E workflow (Setup + Test + Auto cleanup)
npm run cy:open        # Open Cypress GUI
npm run cy:run         # Run tests (headless)
npm run test:headed    # Run tests (headed mode)
```

### Environment Management

```bash
npm run setup          # Prepare environment
npm run teardown       # Interactive cleanup (with confirmation)
npm run teardown:auto  # Automatic cleanup (no confirmation)
npm run cleanup        # Force cleanup (resolve conflicts)
```

### Browser Selection

```bash
npm run cy:run:chrome   # Run in Chrome
npm run cy:run:firefox  # Run in Firefox
```

## Configuration

### Test Target

- **Base URL**: `http://localhost:8002`
- **Kong Admin UI**: `http://localhost:8002`
- **Kong Admin API**: `http://localhost:8001`

### Cypress Configuration (`cypress.config.ts`)

```typescript
{
  baseUrl: 'http://localhost:8002',
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000
}
```

## Test Cases

Current test suite includes:

1. **Create Gateway Service** - Basic service creation
2. **Create Service with Wrong URL** - Validation testing
3. **Create Service with Invalid Form** - Error handling
4. **Create Service with Routes** - Complete workflow with Routes

All tests include automatic cleanup to ensure no resource leakage.

## Troubleshooting

### Docker Not Running

```bash
# Error: Docker is not running or not installed
# Solution: Start Docker Desktop, then run:
npm run setup
```

### Container Name Conflict

```bash
# Error: Container name already in use
# Solution: Force cleanup and retry:
npm run cleanup
npm run setup
```

### Port Already in Use

```bash
# Error: Port 8002 is already in use
# Solution:
npm run cleanup  # Stop all Kong containers
npm run setup    # Restart
```

### Permission Denied (Linux/Mac)

```bash
# Error: Permission denied for scripts
# Solution:
chmod +x scripts/*.sh scripts/*.js
```

### Docker Permission Denied (Linux)

```bash
# Error: docker: permission denied
# Solution:
sudo usermod -aG docker $USER
# Log out and back in
```

## Development Tips

### For Local Development

```bash
# 1. Setup once
npm run setup

# 2. Develop with GUI (keeps containers running)
npm run cy:open

# 3. Run specific tests
# (use Cypress GUI to select tests)

# 4. Cleanup when done
npm run teardown
```

### For CI/CD

```bash
# Single command for everything
npm run test:full
```

### Custom Commands

The project includes custom Cypress commands in `cypress/support/commands.ts`:

```typescript
cy.waitForPageLoad()        // Wait for page load
cy.waitForPageDataLoaded()  // Wait for data to load
cy.waitForNetworkIdle()     // Wait for network requests
```

## Writing Tests

### Basic Test Structure

```typescript
describe('Test Suite', () => {
  beforeEach(() => {
    cy.waitForPageLoad()
  })

  it('test case', () => {
    cy.visit('/workspaces')
    cy.get('[data-testid="some-element"]')
      .should('be.visible')
      .click()
  })
})
```

### Best Practices

1. Use `data-testid` attributes for selectors
2. Each test should be independent
3. Use `beforeEach` for setup, `afterEach` for cleanup
4. Wait for page data to load before interactions
5. Add meaningful assertions

## Cross-Platform Notes

### Script Implementation

The project includes **two sets of scripts**:

- **Node.js scripts** (`.js`) - Default, works on all platforms
- **Bash scripts** (`.sh`) - Optional, for Unix-like systems

### Using Bash Scripts (Optional)

```bash
npm run setup:bash      # Use bash version
npm run teardown:bash
npm run cleanup:bash
```

### Path Handling

All scripts use Node.js `path` module for automatic path handling across platforms:
- Windows: `C:\Users\...`
- Unix: `/home/...`

## Tech Stack

- **Framework**: Cypress 13.17.0
- **Language**: TypeScript 5.3.0
- **Runtime**: Node.js v18+
- **Containerization**: Docker Compose
- **Platforms**: macOS, Windows 10/11, Linux

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests
4. Ensure all tests pass
5. Submit a pull request

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review Cypress logs in `cypress/videos/` and `cypress/screenshots/`
- Ensure Docker Desktop is running
- Verify Node.js version: `node --version` (should be v18+)

## Links

- [Cypress Documentation](https://docs.cypress.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Kong Documentation](https://docs.konghq.com/)
