# Kong UI Automation Testing Workflow Guide

This document explains how to use automation scripts to complete the full testing workflow: Setup → Run Tests → Teardown

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Instructions](#detailed-instructions)
4. [NPM Commands](#npm-commands)
5. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **Docker Desktop**: Ensure Docker is installed and running
- **Platform**: macOS, Windows 10/11, or Linux

### Cross-Platform Note
All scripts are **Node.js-based** and work identically on Mac, Windows, and Linux. No platform-specific tools required!

### Check Environment
```bash
# Check Node.js
node --version

# Check Docker
docker --version
docker info

# Check curl
curl --version
```

## 🚀 Quick Start

### Method 1: One-Click Complete Workflow (Recommended)

```bash
# Automatically execute Setup + Test + Teardown
npm run test:full
```

This will automatically:
1. 📥 Download docker-compose.yml from Google Drive
2. 🚀 Start Docker containers
3. ⏳ Wait for services to be ready
4. 🧪 Run all test cases
5. 🧹 Automatically clean up Docker containers

### Method 2: Step-by-Step Execution

```bash
# Step 1: Setup (prepare environment)
npm run setup

# Step 2: Run tests
npm run cy:run

# Step 3: Teardown (cleanup environment)
npm run teardown:auto
```

### Method 3: Using NPM Chained Commands

```bash
# Setup → Test → Teardown (sequential execution)
npm run test:e2e
```

## 📚 Detailed Instructions

### 1. Setup Workflow

#### Automatically Executed Operations

```bash
npm run setup
```

Execution content:
1. **Download docker-compose.yml**
   - Download from Google Drive: `1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi`
   - Save to: `./docker/docker-compose.yml`

2. **Check Docker Environment**
   - Verify if Docker is running
   - Clean up old containers (if they exist)

3. **Start Containers**
   - Run `docker compose up -d`
   - Wait for services to start (approximately 30 seconds)

4. **Health Check**
   - Detect Kong Admin UI (http://localhost:8002)
   - Maximum 30 retries, 2 seconds interval each

#### Manual Script Execution
```bash
bash scripts/setup.sh
```

### 2. Run Tests

#### Basic Test Commands

```bash
# Run in headless mode
npm run cy:run

# Run in headed mode (visible browser)
npm run cy:run:headed

# Specify browser
npm run cy:run:chrome
npm run cy:run:firefox

# Open Cypress Test Runner (GUI)
npm run cy:open
```

### 3. Teardown Workflow

#### Interactive Cleanup (Manual Confirmation)

```bash
npm run teardown
```

Will prompt whether to clean up Docker resources.

#### Automatic Cleanup (No Confirmation Required)

```bash
npm run teardown:auto
```

Automatically executes:
- Stop all containers
- Remove containers and volumes
- No user confirmation prompt

#### Manual Script Execution
```bash
# Interactive
bash scripts/teardown.sh

# Automated
bash scripts/teardown-auto.sh
```

## 📦 NPM Commands

### Test Related

| Command | Description | Purpose |
|------|------|------|
| `npm run test:full` | Complete workflow (recommended) | Setup + Test + Teardown |
| `npm run test:e2e` | E2E test workflow | Setup + Test + Auto cleanup |
| `npm run cy:run` | Run tests | Execute test cases only |
| `npm run cy:open` | Open test runner | GUI debugging |
| `npm run test:headed` | Headed mode | Run with visible browser |

### Environment Management

| Command | Description | Purpose |
|------|------|------|
| `npm run setup` | Environment preparation | Download files + Start containers |
| `npm run teardown` | Interactive cleanup | Prompt user confirmation |
| `npm run teardown:auto` | Auto cleanup | No confirmation, suitable for CI/CD |
| `npm run cleanup` | Force cleanup | Resolve container conflicts |

### Browser Selection

| Command | Description |
|------|------|
| `npm run cy:run:chrome` | Run using Chrome |
| `npm run cy:run:firefox` | Run using Firefox |

## 🗂️ Project Structure

```
kong-test-Cypress/
├── scripts/                       # Automation scripts directory
│   ├── download-docker-compose.sh # Download docker-compose file
│   ├── setup.sh                   # Setup workflow script
│   ├── teardown.sh                # Teardown workflow (interactive)
│   ├── teardown-auto.sh           # Teardown workflow (automated)
│   └── run-tests.sh               # Complete test workflow
├── docker/                        # Docker files directory (auto-generated)
│   └── docker-compose.yml         # Downloaded from Google Drive
├── cypress/
│   ├── e2e/                       # Test cases
│   ├── fixtures/                  # Test data
│   └── support/                   # Support files
├── package.json                   # Project configuration
└── README.md                      # Project documentation
```

## 🔍 Troubleshooting

### Issue 1: Docker Not Running

**Error Message:**
```
❌ Docker is not running or not installed
```

**Solution:**
1. Open Docker Desktop
2. Wait for Docker to fully start
3. Re-run `npm run setup`

### Issue 2: Container Name Conflict

**Error Message:**
```
Error response from daemon: Conflict. The container name "/kong-ee-database" 
is already in use by container "xxx". You have to remove (or rename) that 
container to be able to reuse that name.
```

**Solution (Recommended):**
```bash
# Use force cleanup command (one-click solution)
npm run cleanup

# Then re-run setup
npm run setup
```

**Manual Solution:**
```bash
# Stop all Kong containers
docker ps -a | grep kong | awk '{print $1}' | xargs docker stop

# Remove all Kong containers
docker ps -a | grep kong | awk '{print $1}' | xargs docker rm -f

# Clean up networks and volumes
docker network prune -f
docker volume prune -f
```

### Issue 3: Port Occupied

**Error Message:**
```
Error: Port 8002 is already in use
```

**Solution:**
```bash
# Find process occupying the port
lsof -i :8002

# Use force cleanup
npm run cleanup

# Or manually stop
docker compose -f docker/docker-compose.yml down
```

### Issue 4: Download Failed

**Error Message:**
```
❌ Download failed
```

**Solution:**
1. Check network connection
2. Confirm curl or wget is installed
3. Download file manually:
   - Visit: https://drive.google.com/file/d/1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi/view
   - Save after download to `./docker/docker-compose.yml`

### Issue 5: Kong Service Not Ready

**Error Message:**
```
⚠️ Warning: Kong service may not be fully ready
```

**Solution:**
```bash
# Check container status
docker ps

# View container logs
docker logs <container_id>

# Manually check service
curl http://localhost:8002

# If needed, restart containers
npm run teardown:auto
npm run setup
```

### Issue 6: Script Permission Error

**Error Message:**
```
Permission denied: scripts/setup.sh
```

**Solution:**
```bash
# Add execution permission
chmod +x scripts/*.sh

# Or run directly with bash
bash scripts/setup.sh
```

## 💡 Best Practices

### 1. Development Environment

```bash
# First run
npm run setup
npm run cy:open    # Use GUI for debugging

# During development
# Keep containers running, only run tests

# Cleanup after finishing
npm run teardown
```

### 2. CI/CD Environment

```bash
# Use complete workflow
npm run test:full

# Or use step-by-step commands
npm run setup
npm run cy:run
npm run teardown:auto
```

### 3. Quick Testing

```bash
# If environment is already prepared
npm run cy:run

# If complete workflow is needed
npm run test:full
```

## 🎯 Test Case Description

Current test cases:
1. ✅ Create new Gateway Service
2. ✅ Create Gateway Service (wrong URL)
3. ✅ Create Gateway Service (wrong form)
4. ✅ Create Gateway Service and add Routes

All test cases include automatic cleanup functionality, and will automatically delete created resources after tests finish.

## 📞 Technical Support

If you have issues, please check:
1. Is Docker Desktop running
2. Is network connection normal
3. Is port 8002 occupied
4. Are script permissions correct

## 🔗 Related Documentation

- [Project README](./README.md)
- [Platform Compatibility Guide](./PLATFORM_COMPATIBILITY.md) - Cross-platform support details
- [Cypress Official Documentation](https://docs.cypress.io/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
