# Docker Usage Guide

This guide explains how to use the Docker-based testing approach for maximum portability.

## 🐳 Why Use Docker?

### Benefits

- ✅ **No Node.js Required** - Only Docker needed
- ✅ **No Dependencies** - Everything bundled in the image
- ✅ **100% Portable** - Same behavior on Mac/Windows/Linux
- ✅ **Isolated** - No conflicts with local environment
- ✅ **CI/CD Ready** - Perfect for automation pipelines

## Quick Start

### Method 1: Complete Environment (Easiest)

This method starts Kong + Database + Tests all in Docker:

```bash
# Clone and enter project
git clone https://github.com/CodingProgrammer/kong-test.git
cd kong-test

# Run everything (no npm required!)
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Cleanup
docker-compose -f docker-compose.test.yml down -v
```

**What happens:**
1. Builds Cypress test image (~2-3 minutes first time)
2. Starts PostgreSQL database
3. Starts Kong Gateway
4. Waits for services to be ready
5. Runs all Cypress tests
6. Exits when tests complete

**Test results saved to:**
- `./cypress/videos/` - Video recordings
- `./cypress/screenshots/` - Failure screenshots

### Method 2: With npm (Recommended)

If you have Node.js installed, use npm commands for easier workflow:

```bash
# Install dependencies (one-time)
npm install

# Build Docker image (one-time)
npm run docker:build

# Run complete test workflow
npm run docker:test:full
```

### Method 3: Test Against Existing Kong

If you already have Kong running locally on port 8002:

```bash
# Build test image
docker build -t kong-cypress-tests:latest .

# Run tests
docker run --rm \
  --add-host host.docker.internal:host-gateway \
  -v $(pwd)/cypress/videos:/app/cypress/videos \
  -v $(pwd)/cypress/screenshots:/app/cypress/screenshots \
  -e CYPRESS_baseUrl=http://host.docker.internal:8002 \
  kong-cypress-tests:latest
```

## Architecture

### Docker Images Used

```
cypress/included:13.17.0
  └─> kong-cypress-tests:latest (your test image)
      - Contains Cypress + TypeScript + Your tests

kong/kong-gateway:3.4 (Kong Gateway)
  └─> Runs on port 8002

postgres:13 (Database)
  └─> Backend for Kong
```

### Docker Compose Services

```yaml
services:
  cypress:           # Test runner
  kong-admin:        # Kong Gateway
  kong-database:     # PostgreSQL
  
networks:
  kong-network:      # Bridge network
```

## Docker Commands Reference

### Build Commands

```bash
# Build test image
docker build -t kong-cypress-tests:latest .

# Build with docker-compose
docker-compose -f docker-compose.test.yml build

# Build without cache (force rebuild)
docker build --no-cache -t kong-cypress-tests:latest .
```

### Run Commands

```bash
# Run complete workflow
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Run in background (detached)
docker-compose -f docker-compose.test.yml up -d

# Run specific service
docker-compose -f docker-compose.test.yml run --rm cypress

# Run with custom base URL
docker-compose -f docker-compose.test.yml run --rm \
  -e CYPRESS_baseUrl=http://kong-admin:8002 \
  cypress
```

### Cleanup Commands

```bash
# Stop and remove containers
docker-compose -f docker-compose.test.yml down

# Stop and remove with volumes (complete cleanup)
docker-compose -f docker-compose.test.yml down -v

# Remove test image
docker rmi kong-cypress-tests:latest

# Remove all Kong-related containers
docker ps -a | grep kong | awk '{print $1}' | xargs docker rm -f
```

### Inspection Commands

```bash
# View running containers
docker-compose -f docker-compose.test.yml ps

# View logs
docker-compose -f docker-compose.test.yml logs

# View logs for specific service
docker-compose -f docker-compose.test.yml logs cypress
docker-compose -f docker-compose.test.yml logs kong-admin

# Follow logs in real-time
docker-compose -f docker-compose.test.yml logs -f

# Check image size
docker images kong-cypress-tests

# Inspect container
docker inspect kong-gateway
```

## Customization

### Change Cypress Version

Edit `Dockerfile`:

```dockerfile
FROM cypress/included:13.17.0  # Change this version
```

### Change Kong Version

Edit `docker-compose.test.yml`:

```yaml
services:
  kong-admin:
    image: kong/kong-gateway:3.4  # Change this version
```

### Add Environment Variables

Edit `docker-compose.test.yml`:

```yaml
services:
  cypress:
    environment:
      - CYPRESS_baseUrl=http://kong-admin:8002
      - CYPRESS_viewportWidth=1920
      - CYPRESS_viewportHeight=1080
      - CYPRESS_video=true
      # Add more variables here
```

### Mount Additional Files

Edit `docker-compose.test.yml`:

```yaml
services:
  cypress:
    volumes:
      - ./cypress/videos:/app/cypress/videos
      - ./cypress/screenshots:/app/cypress/screenshots
      # Add more volumes here
      - ./custom-data:/app/data
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests (Docker)

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Run Tests
        run: |
          docker-compose -f docker-compose.test.yml build
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit
      
      - name: Cleanup
        if: always()
        run: docker-compose -f docker-compose.test.yml down -v
      
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            cypress/videos/
            cypress/screenshots/
```

### GitLab CI

```yaml
test:
  image: docker:latest
  services:
    - docker:dind
  
  before_script:
    - docker info
  
  script:
    - docker-compose -f docker-compose.test.yml build
    - docker-compose -f docker-compose.test.yml up --abort-on-container-exit
  
  after_script:
    - docker-compose -f docker-compose.test.yml down -v
  
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
```

### Jenkins

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'docker-compose -f docker-compose.test.yml build'
                sh 'docker-compose -f docker-compose.test.yml up --abort-on-container-exit'
            }
        }
    }
    
    post {
        always {
            sh 'docker-compose -f docker-compose.test.yml down -v'
            archiveArtifacts artifacts: 'cypress/videos/**,cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}
```

## Troubleshooting

### Issue: Port Already in Use

```bash
# Error: port 8002 is already allocated

# Solution: Stop conflicting containers
docker ps | grep 8002
docker stop <container-id>

# Or use cleanup
docker-compose -f docker-compose.test.yml down -v
```

### Issue: Image Build Fails

```bash
# Solution: Build without cache
docker build --no-cache -t kong-cypress-tests:latest .

# Check Docker version
docker --version  # Should be 20.10+
```

### Issue: Network Issues

```bash
# Solution: Remove and recreate network
docker network prune
docker-compose -f docker-compose.test.yml up --build
```

### Issue: Volume Permission Errors

```bash
# Solution: Fix permissions (Linux/Mac)
chmod -R 777 cypress/videos
chmod -R 777 cypress/screenshots

# Or run with sudo (Linux)
sudo docker-compose -f docker-compose.test.yml up
```

### Issue: Tests Can't Connect to Kong

```bash
# Check if Kong is healthy
docker exec kong-gateway kong health

# Check Kong logs
docker logs kong-gateway

# Verify network
docker network inspect kong-test_kong-network
```

## Performance Tips

### 1. Use Docker BuildKit

```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker build -t kong-cypress-tests:latest .
```

### 2. Multi-Stage Builds

Already implemented in `Dockerfile` for optimal image size.

### 3. Layer Caching

Organize `Dockerfile` to maximize cache hits:
1. Copy package files first
2. Install dependencies
3. Copy source code last

### 4. Parallel Execution

Run multiple test files in parallel:

```yaml
services:
  cypress-1:
    # ... config ...
    command: npm run cy:run -- --spec "cypress/e2e/test1.cy.ts"
  
  cypress-2:
    # ... config ...
    command: npm run cy:run -- --spec "cypress/e2e/test2.cy.ts"
```

## Best Practices

1. **Always use docker-compose.test.yml** for consistent environments
2. **Tag images with versions** for reproducibility
3. **Clean up after tests** to avoid disk space issues
4. **Use volume mounts** to preserve test results
5. **Check health status** before running tests
6. **Set resource limits** in production environments

## Resource Limits

Add to `docker-compose.test.yml`:

```yaml
services:
  cypress:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Publishing Image to Docker Hub

```bash
# Tag image
docker tag kong-cypress-tests:latest your-username/kong-cypress-tests:latest
docker tag kong-cypress-tests:latest your-username/kong-cypress-tests:1.0.0

# Login to Docker Hub
docker login

# Push image
docker push your-username/kong-cypress-tests:latest
docker push your-username/kong-cypress-tests:1.0.0

# Use in CI/CD
docker pull your-username/kong-cypress-tests:latest
```

## Summary

**For maximum portability, use the Docker approach:**

```bash
# One command to run everything
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# One command to cleanup
docker-compose -f docker-compose.test.yml down -v
```

No Node.js, no npm, no dependency management - just Docker! 🐳

---

**Need help?** Check the main [README.md](README.md) or open an issue on GitHub.

