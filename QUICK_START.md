# 🚀 Quick Start Guide

## One-Click Complete Workflow

```bash
npm run test:full
```

This will automatically execute: Setup → Run Tests → Teardown

---

## Command Quick Reference

### 🎯 Recommended Commands

| Command | Description |
|------|------|
| `npm run test:full` | 🌟 Complete workflow (recommended)|
| `npm run setup` | Prepare environment |
| `npm run cy:run` | Run tests |
| `npm run teardown:auto` | Clean up environment |
| `npm run cleanup` | 🔧 Force cleanup (resolve conflicts)|

### 📦 Complete Command List

#### Automation Workflow
```bash
npm run test:full       # Setup + Test + Teardown (complete workflow)
npm run test:e2e        # Setup + Test + Auto cleanup
npm run setup           # Execute Setup only
npm run teardown        # Interactive cleanup (with confirmation)
npm run teardown:auto   # Auto cleanup (no confirmation)
```

#### Test Execution
```bash
npm run cy:open         # Open Test Runner (GUI)
npm run cy:run          # Run tests (headless mode)
npm run test:headed     # Run tests (headed mode)
npm run cy:run:chrome   # Use Chrome
npm run cy:run:firefox  # Use Firefox
```

---

## Typical Workflows

### 🔧 Development & Debugging

```bash
# 1. First-time environment setup
npm run setup

# 2. Use GUI for debugging
npm run cy:open

# 3. Cleanup after finishing
npm run teardown
```

### 🤖 CI/CD Automation

```bash
# One-click complete workflow
npm run test:full
```

### ⚡ Quick Testing

```bash
# If environment is already prepared, run tests directly
npm run cy:run
```

---

## Prerequisites

✅ Node.js (v18+)  
✅ Docker Desktop  
✅ npm install  
✅ **Works on Mac, Windows, Linux**  

---

## Access Services

After test environment starts:

- 🌐 Kong Admin UI: http://localhost:8002
- 📊 Kong Admin API: http://localhost:8001

---

## Troubleshooting

### Docker Not Running
```bash
# Retry after starting Docker Desktop
npm run setup
```

### Container Name Conflict
```bash
# Force cleanup all Kong containers
npm run cleanup

# Then setup again
npm run setup
```

### Port Occupied
```bash
# Use force cleanup
npm run cleanup
npm run setup
```

### Permission Error
```bash
# Add execution permission
chmod +x scripts/*.sh
```

---

## 📚 Complete Documentation

- [Full README](./README.md)
- [Automation Workflow Guide](./AUTOMATION_GUIDE.md)
- [Platform Compatibility Guide](./PLATFORM_COMPATIBILITY.md)

---

## 🖥️ Platform Notes

This project works on **Mac, Windows, and Linux** with identical commands!

**Windows**: Use PowerShell, CMD, or Git Bash  
**Linux**: Native support  
**macOS**: Native support  

---

**Tip**: For first-time use, it's recommended to try `npm run test:full` for the complete workflow experience!
