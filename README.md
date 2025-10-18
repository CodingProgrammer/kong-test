<div align="center">

# Kong UI Automation Testing

**E2E testing framework for Kong Gateway Admin UI**

[![Cypress](https://img.shields.io/badge/Cypress-13.x-17202C?style=flat&logo=cypress)](https://www.cypress.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

</div>

## Features

- 🎯 Page Object Model architecture
- 🔄 One-command execution (Setup → Test → Report → Teardown)
- 📊 HTML reports with screenshots & videos
- 🐳 Docker support
- 🌍 Cross-platform (macOS, Windows, Linux)
- ✅ 100+ test scenarios (4 implemented, 96 TODO)
- 🛠️ Reusable components (Page Objects, helpers, utilities)

## Quick Start

```bash
git clone https://github.com/CodingProgrammer/kong-test.git
cd kong-test
npm install
npm run test:full
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run test:full` | Complete workflow (Setup + Test + Report + Teardown) |
| `npm run test:report` | Run tests + generate HTML report |
| `npm run cy:open` | Open Cypress GUI |
| `npm run setup` | Start Kong Gateway |
| `npm run teardown:auto` | Stop Kong Gateway |
| `npm run cleanup` | Force cleanup |

## Test Coverage

**Implemented (4 tests)**:
- ✅ Create Gateway Service
- ✅ Create Service with Wrong URL
- ✅ Create Service with Invalid Form
- ✅ Create Service with Routes

**TODO (96 tests)**: See `cypress/e2e/gateway-service.cy.ts` for complete list covering:
- CRUD Operations (8)
- Form Validation (8)
- Service Configuration (8)
- Routes Management (10)
- Plugins Integration (7)
- Advanced Scenarios (7)
- Error Handling (5)
- Performance & Load (4)
- UI/UX Validation (8)
- Edge Cases (9)
- Accessibility (7)
- Security (4)
- Integration Tests (4)

## Prerequisites

- Node.js v18+
- Docker Desktop (running)

## Troubleshooting

```bash
# Docker not running
npm run cleanup && npm run setup

# Port conflicts
npm run cleanup

# Permission issues (Linux)
sudo usermod -aG docker $USER
```

## License

MIT License - see [LICENSE](LICENSE) file