# Recommended Usage Guide

## TL;DR - Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm run test:full

# That's it! ✅
```

---

## Why Use Native Method?

The **native installation method** is the **recommended and fully supported** way to run tests.

### ✅ Advantages

| Feature | Status | Notes |
|---------|--------|-------|
| **Reliability** | ✅ Perfect | 4/4 tests pass consistently |
| **Speed** | ✅ Fast | ~50 seconds total |
| **Features** | ✅ Complete | Full Kong Enterprise UI |
| **Debugging** | ✅ Easy | GUI mode available |
| **Maintenance** | ✅ Simple | Well-documented |
| **CI/CD Ready** | ✅ Yes | GitHub Actions compatible |

### 🎯 Test Results

```
✔ 4 passing tests
⏱ ~50 seconds execution time
📹 Video recordings saved
📸 Screenshots on failure
🧹 Auto cleanup
```

---

## Complete Workflow

### Daily Development

```bash
# Start Kong environment
npm run setup

# Open Cypress GUI for interactive testing
npm run cy:open

# Run specific tests, debug, iterate...

# Cleanup when done
npm run teardown
```

### Quick Test Run

```bash
# Everything in one command
npm run test:full
```

### CI/CD Pipeline

```yaml
# GitHub Actions example
- run: npm install
- run: npm run test:full
```

---

## Available Commands

### Test Execution

```bash
# Complete workflow (recommended)
npm run test:full

# Interactive GUI mode
npm run cy:open

# Headless run
npm run cy:run

# Headed mode (visible browser)
npm run test:headed

# Browser-specific
npm run cy:run:chrome
npm run cy:run:firefox
```

### Environment Management

```bash
# Setup Kong environment
npm run setup

# Teardown with confirmation
npm run teardown

# Auto teardown (no prompt)
npm run teardown:auto

# Force cleanup (if stuck)
npm run cleanup
```

---

## What About Docker?

### Current Status: Experimental ⚠️

The Docker containerization approach is **experimental** and not recommended for production use.

**Issues:**
- Kong runs in simplified mode (no `KONG_PASSWORD`)
- UI structure differs from native environment
- Missing enterprise features
- Tests fail due to incompatible selectors

**When to Use:**
- Exploring containerization
- Testing Docker builds
- Experimenting with isolated environments

**When NOT to Use:**
- Production testing
- CI/CD pipelines
- Reliable test results needed

### Docker Commands (For Reference)

```bash
# Build image
npm run docker:build

# Run tests (may fail)
npm run docker:test:full
```

See `ENVIRONMENT_DIFFERENCES.md` for detailed analysis.

---

## Troubleshooting

### Tests Failing?

```bash
# 1. Cleanup everything
npm run cleanup

# 2. Start fresh
npm run test:full
```

### Docker Not Running?

```bash
# Start Docker Desktop first
# Then run:
npm run setup
```

### Port Conflicts?

```bash
# Check what's using port 8002
lsof -i :8002

# Kill process if needed
kill -9 <PID>

# Or use cleanup
npm run cleanup
```

---

## Best Practices

### ✅ Do's

- ✅ Use `npm run test:full` for complete testing
- ✅ Use `npm run cy:open` for debugging
- ✅ Run `npm run cleanup` if containers are stuck
- ✅ Check videos in `cypress/videos/` after failures
- ✅ Keep Docker Desktop running

### ❌ Don'ts

- ❌ Don't use Docker method for critical testing
- ❌ Don't modify test files without running tests
- ❌ Don't forget to cleanup after manual testing
- ❌ Don't run multiple test instances simultaneously

---

## Test Coverage

Current test suite covers:

1. **Basic Service Creation**
   - Create new Gateway Service
   - Verify success message
   - Auto cleanup

2. **Validation Testing**
   - Wrong URL validation
   - Form error handling
   - Error message verification

3. **Complex Workflows**
   - Service + Routes creation
   - Multi-step operations
   - Comprehensive cleanup

4. **Error Handling**
   - Failed creation scenarios
   - Cleanup on failure
   - Robust teardown

---

## Performance

### Typical Execution Times

```
Setup:     ~30 seconds  (Kong startup)
Tests:     ~20 seconds  (4 test cases)
Teardown:  ~2 seconds   (cleanup)
────────────────────────────────────
Total:     ~52 seconds
```

### Optimization Tips

- Keep Docker Desktop running
- Don't cleanup between test runs during development
- Use `npm run cy:open` for faster iteration

---

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
      
      - name: Upload videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: cypress/videos/
```

---

## Support

### Having Issues?

1. Check `README.md` - Comprehensive documentation
2. Check `ENVIRONMENT_DIFFERENCES.md` - Docker issues
3. Run `npm run cleanup` - Resolve stuck containers
4. Check `cypress/videos/` - Visual debugging
5. Open GitHub issue - Get help from maintainers

### Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Kong Gateway Docs](https://docs.konghq.com/gateway/)
- [Project README](README.md)
- [GitHub Repository](https://github.com/CodingProgrammer/kong-test)

---

## Summary

**Use Native Method for:**
- ✅ Daily development
- ✅ Production testing
- ✅ CI/CD pipelines
- ✅ Reliable results

**Avoid Docker Method for:**
- ❌ Critical testing
- ❌ Production environments
- ❌ When reliability matters

**Questions?**
- Check documentation
- Review test videos
- Open GitHub issue

---

**Happy Testing! 🚀**

