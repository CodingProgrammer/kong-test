# Kong UI Automation Testing Project

This is a UI automation testing project based on Cypress and TypeScript, designed for testing the Kong Admin interface.

## Project Features

- ✅ Using Cypress 13.x latest version
- ✅ TypeScript support with full type checking
- ✅ Modern project structure
- ✅ Custom commands support
- ✅ Complete test examples
- ✅ **Cross-platform compatible** (Mac, Windows, Linux)

## Tech Stack

- **Testing Framework**: Cypress 13.17.0
- **Programming Language**: TypeScript 5.3.0
- **Node.js**: Recommended v18.x or higher
- **Platform Support**: macOS, Windows, Linux

## Project Structure

```
kong-test-Cypress/
├── cypress/
│   ├── e2e/                    # E2E test cases
│   │   └── gateway-service.cy.ts  # Gateway Service tests
│   ├── fixtures/               # Test data
│   │   └── example.json        # Example test data
│   ├── support/                # Support files
│   │   ├── commands.ts         # Custom commands
│   │   └── e2e.ts             # Global configuration
│   ├── videos/                 # Test videos (auto-generated)
│   └── screenshots/            # Failure screenshots (auto-generated)
├── cypress.config.ts           # Cypress configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Quick Start

### 0. Automated Complete Workflow (Recommended)

```bash
# One-click run: Setup → Test → Teardown
npm run test:full
```

This will automatically:
1. Download docker-compose.yml from Google Drive
2. Start Docker containers
3. Run all test cases
4. Automatically clean up the environment

> 💡 **Detailed Instructions**: See [Automation Testing Workflow Guide](./AUTOMATION_GUIDE.md)

---

### 1. Install Dependencies

```bash
npm install
```

### 2. Prepare Test Environment (First Run)

```bash
# Download and start Docker environment
npm run setup
```

### 3. Run Tests

#### Open Cypress Test Runner (Recommended for Development)

```bash
npm run cy:open
```

#### Run All Tests in Command Line

```bash
npm run test
# or
npm run cy:run
```

#### Run Tests in Headed Mode (Visible Browser)

```bash
npm run test:headed
# or
npm run cy:run:headed
```

#### Run Tests in Specific Browser

```bash
# Chrome browser
npm run cy:run:chrome

# Firefox browser
npm run cy:run:firefox
```

## Test Target

- **Base URL**: `http://localhost:8002`
- **Test Pages**: Gateway Service management related pages

> ⚠️ **Note**: Please ensure the target application is running on `http://localhost:8002` before running tests.

## Configuration

### Cypress Configuration (cypress.config.ts)

Main configuration items:
- `baseUrl`: Base URL of the test target
- `viewportWidth`: Viewport width (1920px)
- `viewportHeight`: Viewport height (1080px)
- `video`: Whether to record test videos
- `screenshotOnRunFailure`: Auto-screenshot on test failure
- `defaultCommandTimeout`: Default command timeout (10 seconds)

### TypeScript Configuration (tsconfig.json)

- Supports ES2020 syntax
- Strict mode enabled
- Includes Cypress and Node.js type definitions
- Supports path alias `@/*` pointing to `cypress/*`

## Writing Test Cases

### Basic Test Structure

```typescript
/// <reference types="cypress" />

describe('Test Suite Name', () => {
  beforeEach(() => {
    // Setup before each test
    cy.visit('/some-page')
  })

  it('test case description', () => {
    // Test steps
    cy.get('[data-testid="some-element"]').should('be.visible')
    cy.get('input').type('test data')
    cy.get('button').click()
  })
})
```

### Using Custom Commands

The project has defined some custom commands, you can view and add them in `cypress/support/commands.ts`:

```typescript
// Wait for page load to complete
cy.waitForPageLoad()

// Login (example)
cy.login('username', 'password')
```

### Using Test Data

Test data can be placed in the `cypress/fixtures/` directory:

```typescript
cy.fixture('example.json').then((data) => {
  cy.log(data.name)
  cy.log(data.email)
})
```

## Best Practices

1. **Use Meaningful Selectors**
   - Prioritize `data-testid` attributes
   - Avoid volatile class or id selectors
   
2. **Maintain Test Independence**
   - Each test should be able to run independently
   - Don't depend on other tests' state

3. **Use beforeEach for Initialization**
   - Set up required initial state in `beforeEach`

4. **Use Assertions Reasonably**
   - Each test should have clear assertions
   - Use meaningful assertion messages

5. **Handle Async Operations**
   - Cypress automatically waits for commands to complete
   - Use `.should()` instead of `.then()` for assertions

6. **Organize Test Cases**
   - Organize test files by page or feature module
   - Use `describe` for logical grouping

## Common Commands

### Automated Workflow Commands (Recommended)

```bash
# Complete test workflow (Setup + Test + Teardown)
npm run test:full

# E2E test workflow
npm run test:e2e

# Environment setup
npm run setup

# Environment cleanup
npm run teardown        # Interactive (with confirmation prompt)
npm run teardown:auto   # Automated (no prompt, for CI/CD)
npm run cleanup         # Force cleanup (resolve conflicts)
```

### Basic Test Commands

```bash
# Install dependencies
npm install

# Open Cypress Test Runner
npm run cy:open

# Run all tests (headless mode)
npm run cy:run

# Run all tests (headed mode, Chrome)
npm run test:headed

# Run in Chrome browser
npm run cy:run:chrome

# Run in Firefox browser
npm run cy:run:firefox
```

## Debugging Tips

1. **Use Cypress Test Runner**
   - Run `npm run cy:open` to open the GUI
   - You can see each step's execution process

2. **Use cy.debug()**
   - Add `cy.debug()` in tests to pause execution

3. **Use cy.pause()**
   - Add `cy.pause()` in tests for manual control of execution

4. **View Screenshots and Videos**
   - Screenshots are automatically generated on test failure (`cypress/screenshots/`)
   - Videos are generated for test runs (`cypress/videos/`)

## Common Issues

### 1. Port Conflict

If the target application is not on port 8002, please modify `baseUrl` in `cypress.config.ts`.

### 2. Timeout Issues

If pages load slowly, you can increase the timeout in `cypress.config.ts`:

```typescript
defaultCommandTimeout: 20000,  // Increase to 20 seconds
```

### 3. TypeScript Type Errors

Ensure all type definitions are installed:

```bash
npm install --save-dev @types/node
```

## Automation Testing Workflow

This project supports a complete automation testing workflow:

1. **Setup**: Download docker-compose.yml from Google Drive and start containers
2. **Test**: Run all Cypress test cases
3. **Teardown**: Automatically clean up Docker environment

For detailed instructions, see [Automation Testing Workflow Guide](./AUTOMATION_GUIDE.md)

## Cross-Platform Support

This project is **fully compatible** with:
- ✅ **macOS** (Intel & Apple Silicon)
- ✅ **Windows** (Windows 10/11)
- ✅ **Linux** (Ubuntu, Debian, Fedora, etc.)

All npm commands work identically across all platforms. See [Platform Compatibility Guide](./PLATFORM_COMPATIBILITY.md) for details.

### Platform-Specific Notes

**Windows Users:**
- All commands work in PowerShell, Command Prompt, or Git Bash
- Docker Desktop must be running
- No additional configuration needed

**Linux Users:**
- Ensure your user is in the `docker` group
- All scripts work natively

**macOS Users:**
- Native support for both Bash and Node.js scripts
- All features work out of the box

## References

### Project Documentation
- 📘 [Automation Testing Workflow Guide](./AUTOMATION_GUIDE.md) - Setup/Teardown detailed instructions
- 🖥️ [Platform Compatibility Guide](./PLATFORM_COMPATIBILITY.md) - Cross-platform support details

### Official Documentation
- [Cypress Official Documentation](https://docs.cypress.io/)
- [Cypress TypeScript Support](https://docs.cypress.io/guides/tooling/typescript-support)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## License

MIT
