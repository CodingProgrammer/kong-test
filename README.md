# Kong UI Automation Testing

> A cross-platform UI automation testing framework for Kong Admin interface using Cypress and TypeScript.

[![Cypress](https://img.shields.io/badge/Cypress-13.x-brightgreen.svg)](https://www.cypress.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Mac%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Commands](#commands)
- [Configuration](#configuration)
- [Test Cases](#test-cases)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✅ **Cross-Platform** - Works seamlessly on macOS, Windows, and Linux
- ✅ **TypeScript** - Full type checking and IntelliSense support
- ✅ **One-Command Setup** - Automated environment setup, test execution, and teardown
- ✅ **Docker Integration** - Automatic Docker container management
- ✅ **Complete Test Suite** - Gateway Service CRUD operations with Routes
- ✅ **Auto Cleanup** - Automatic resource cleanup after tests
- ✅ **CI/CD Ready** - Perfect for continuous integration pipelines

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v18.x or higher
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (running)
- npm (comes with Node.js)

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd kong-test-cypress

# Install dependencies
npm install

# Run complete test workflow (Setup + Test + Teardown)
npm run test:full
```

**That's it!** The script will automatically:
- 📥 Download docker-compose.yml
- 🚀 Start Docker containers
- ⏳ Wait for services to be ready
- 🧪 Run all test cases
- 🧹 Clean up containers

## Installation

### macOS

```bash
# Install Node.js via Homebrew
brew install node

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Install project dependencies
npm install
```

### Windows

```powershell
# Install Node.js
# Download from: https://nodejs.org/

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Install project dependencies (PowerShell, CMD, or Git Bash)
npm install
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js
sudo apt update
sudo apt install nodejs npm

# Install Docker
sudo apt install docker.io docker-compose-plugin

# Add user to docker group (required)
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect

# Install project dependencies
npm install
```

## Usage

### Running Tests

#### Complete Workflow (Recommended)

```bash
npm run test:full
```

Executes the full workflow: Setup → Test → Teardown

#### Step-by-Step

```bash
# 1. Setup environment
npm run setup

# 2. Run tests
npm run cy:open         # GUI mode (interactive)
npm run cy:run          # Headless mode
npm run test:headed     # Headed mode (visible browser)

# 3. Cleanup
npm run teardown:auto
```

#### Browser Selection

```bash
npm run cy:run:chrome    # Run in Chrome
npm run cy:run:firefox   # Run in Firefox
```

### Environment Management

```bash
npm run setup           # Prepare test environment
npm run teardown        # Interactive cleanup (with confirmation)
npm run teardown:auto   # Automatic cleanup (no confirmation)
npm run cleanup         # Force cleanup (resolve conflicts)
```

## Project Structure

```
kong-test-cypress/
├── cypress/
│   ├── e2e/
│   │   └── gateway-service.cy.ts    # Test specifications
│   ├── fixtures/
│   │   └── example.json             # Test data
│   ├── support/
│   │   ├── commands.ts              # Custom commands
│   │   └── e2e.ts                   # Global configuration
│   ├── videos/                      # Test videos (auto-generated)
│   └── screenshots/                 # Test screenshots (auto-generated)
├── scripts/
│   ├── setup.js                     # Setup script
│   ├── teardown.js                  # Teardown script
│   ├── teardown-auto.js             # Auto teardown
│   ├── cleanup.js                   # Force cleanup
│   ├── download.js                  # Download docker-compose
│   └── run-tests.js                 # Complete workflow
├── cypress.config.ts                # Cypress configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Project dependencies
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## Commands

### Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:full` | Complete workflow (Setup + Test + Teardown) |
| `npm run test:e2e` | E2E workflow (Setup + Test + Auto cleanup) |
| `npm run cy:open` | Open Cypress GUI |
| `npm run cy:run` | Run tests in headless mode |
| `npm run test:headed` | Run tests in headed mode |
| `npm run cy:run:chrome` | Run tests in Chrome |
| `npm run cy:run:firefox` | Run tests in Firefox |

### Environment Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Prepare test environment |
| `npm run teardown` | Interactive cleanup |
| `npm run teardown:auto` | Automatic cleanup |
| `npm run cleanup` | Force cleanup (resolve conflicts) |

### Bash Alternatives (Optional)

| Command | Description |
|---------|-------------|
| `npm run setup:bash` | Use Bash version of setup |
| `npm run teardown:bash` | Use Bash version of teardown |
| `npm run cleanup:bash` | Use Bash version of cleanup |

## Configuration

### Test Target

- **Base URL**: `http://localhost:8002`
- **Kong Admin UI**: `http://localhost:8002`
- **Kong Admin API**: `http://localhost:8001`

### Cypress Configuration

Edit `cypress.config.ts` to customize:

```typescript
export default defineConfig({
  projectId: 'nt2i5c',
  e2e: {
    baseUrl: 'http://localhost:8002',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
})
```

### Custom Commands

The project includes custom Cypress commands:

```typescript
cy.waitForPageLoad()        // Wait for page to load
cy.waitForPageDataLoaded()  // Wait for data to load
cy.waitForNetworkIdle()     // Wait for network requests
```

## Test Cases

Current test suite includes:

| Test Case | Description |
|-----------|-------------|
| Create Gateway Service | Basic service creation workflow |
| Create Service with Wrong URL | URL validation testing |
| Create Service with Invalid Form | Form error handling |
| Create Service with Routes | Complete workflow with Routes |

All tests include automatic cleanup to prevent resource leakage.

### Example Test

```typescript
describe('Gateway Service Management', () => {
  it('create new Gateway Service', () => {
    cy.visit('/workspaces')
    cy.get('[data-testid="workspace-link-default"]').click()
    cy.get('[data-testid="sidebar-item-gateway-services"]').click()
    
    // Test steps...
    
    cy.get('.toaster-message')
      .should('contain', 'successfully created!')
  })
})
```

## Development

### Local Development Setup

```bash
# 1. Setup environment (one time)
npm run setup

# 2. Develop with GUI (keeps containers running)
npm run cy:open

# 3. Make changes and test
# (use Cypress GUI to run specific tests)

# 4. Cleanup when done
npm run teardown
```

### Writing Tests

**Best Practices:**

1. ✅ Use `data-testid` attributes for selectors
2. ✅ Keep tests independent and isolated
3. ✅ Use `beforeEach` for setup, `afterEach` for cleanup
4. ✅ Wait for page data before interactions
5. ✅ Add meaningful assertions and error messages
6. ✅ Clean up created resources

**Basic Test Structure:**

```typescript
describe('Test Suite', () => {
  beforeEach(() => {
    cy.waitForPageLoad()
  })

  afterEach(() => {
    // Cleanup logic
  })

  it('test case description', () => {
    // Arrange
    cy.visit('/some-page')
    
    // Act
    cy.get('[data-testid="element"]').click()
    
    // Assert
    cy.get('[data-testid="result"]').should('be.visible')
  })
})
```

## Troubleshooting

### Common Issues

<details>
<summary><strong>Docker Not Running</strong></summary>

```bash
# Error: Docker is not running or not installed
# Solution: Start Docker Desktop, then:
npm run setup
```
</details>

<details>
<summary><strong>Container Name Conflict</strong></summary>

```bash
# Error: Container name already in use
# Solution: Force cleanup and retry
npm run cleanup
npm run setup
```
</details>

<details>
<summary><strong>Port Already in Use</strong></summary>

```bash
# Error: Port 8002 is already in use
# Solution: Stop Kong containers
npm run cleanup
npm run setup
```
</details>

<details>
<summary><strong>Permission Denied (Linux/Mac)</strong></summary>

```bash
# Error: Permission denied for scripts
# Solution: Add execute permissions
chmod +x scripts/*.sh scripts/*.js
```
</details>

<details>
<summary><strong>Docker Permission Denied (Linux)</strong></summary>

```bash
# Error: docker: permission denied
# Solution: Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```
</details>

### Debug Tips

```bash
# View Cypress logs
ls -la cypress/videos/
ls -la cypress/screenshots/

# Check Docker status
docker ps
docker logs <container-id>

# Verify Node.js version
node --version  # Should be v18+

# Test Docker connectivity
docker info
```

## CI/CD Integration

### GitHub Actions Example

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

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful test descriptions
- Ensure all tests pass before submitting
- Update documentation as needed
- Add tests for new features

## Tech Stack

- **Framework**: [Cypress](https://www.cypress.io/) 13.17.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.3.0
- **Runtime**: [Node.js](https://nodejs.org/) v18+
- **Container**: [Docker](https://www.docker.com/)
- **Platforms**: macOS, Windows 10/11, Linux

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Kong Documentation](https://docs.konghq.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review test logs in `cypress/videos/` and `cypress/screenshots/`
3. Ensure Docker Desktop is running
4. Verify prerequisites are installed
5. Open an issue in the repository

---

**Made with ❤️ using Cypress and TypeScript**
