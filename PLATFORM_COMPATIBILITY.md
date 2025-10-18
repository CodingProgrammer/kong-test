# Platform Compatibility Guide

This project is designed to work seamlessly on **Mac**, **Windows**, and **Linux**.

## ✅ Cross-Platform Support

### Supported Operating Systems

| Platform | Support Status | Notes |
|----------|---------------|-------|
| **macOS** | ✅ Fully Supported | Native support |
| **Windows** | ✅ Fully Supported | Windows 10/11, PowerShell/CMD |
| **Linux** | ✅ Fully Supported | Ubuntu, Debian, Fedora, etc. |

## 📦 Prerequisites by Platform

### All Platforms
- **Node.js**: v18.x or higher
- **Docker Desktop**: Latest version
- **npm**: Comes with Node.js

### macOS
```bash
# Install Node.js (using Homebrew)
brew install node

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop
```

### Windows
```powershell
# Install Node.js
# Download from: https://nodejs.org/

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Note: Windows users should use PowerShell or Command Prompt
```

### Linux
```bash
# Install Node.js (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm

# Install Docker
sudo apt install docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

## 🚀 Running Tests

### Common Commands (Work on All Platforms)

All npm commands work identically across all platforms:

```bash
# Install dependencies
npm install

# Complete test workflow
npm run test:full

# Setup environment
npm run setup

# Run tests
npm run cy:run

# Cleanup
npm run teardown:auto
```

## 🔧 Implementation Details

### Cross-Platform Scripts

The project includes **two sets of scripts**:

#### 1. Node.js Scripts (Recommended - Cross-Platform)
- **Location**: `scripts/*.js`
- **Used by**: Default npm commands
- **Platform**: Works on Mac, Windows, Linux
- **Examples**:
  - `scripts/setup.js`
  - `scripts/teardown.js`
  - `scripts/cleanup.js`

#### 2. Bash Scripts (Unix/macOS/Linux)
- **Location**: `scripts/*.sh`
- **Used by**: `npm run *:bash` commands
- **Platform**: Mac, Linux, WSL/Git Bash on Windows
- **Examples**:
  - `scripts/setup.sh`
  - `scripts/teardown.sh`
  - `scripts/force-cleanup.sh`

### Default Behavior

By default, all npm commands use **Node.js scripts** for maximum compatibility:

```json
{
  "scripts": {
    "setup": "node scripts/setup.js",          // Cross-platform
    "teardown": "node scripts/teardown.js",    // Cross-platform
    "cleanup": "node scripts/cleanup.js"       // Cross-platform
  }
}
```

### Using Bash Scripts (Optional)

If you prefer bash scripts (on Unix-like systems):

```bash
# Use bash versions
npm run setup:bash
npm run teardown:bash
npm run cleanup:bash
```

## 🐳 Docker Compatibility

### Docker Desktop

**All Platforms** require Docker Desktop:
- Download: https://www.docker.com/products/docker-desktop

### Docker Commands

The project uses `docker compose` (Docker Compose V2), which works on all platforms:

```bash
docker compose up -d      # Start containers
docker compose down -v    # Stop and remove containers
docker compose ps         # Check status
```

## 🔍 Platform-Specific Considerations

### Windows

#### PowerShell vs Command Prompt
Both work fine! npm commands are identical:

```powershell
# PowerShell
npm run test:full

# Command Prompt
npm run test:full
```

#### WSL (Windows Subsystem for Linux)
You can also use WSL with bash scripts:

```bash
# In WSL
npm run setup:bash
```

#### Path Separators
The Node.js scripts automatically handle path differences:
- Windows: `C:\Users\...`
- Unix: `/home/...`

### macOS

#### Native Support
All features work natively:
- Node.js scripts ✅
- Bash scripts ✅
- Docker Desktop ✅

#### Homebrew
Recommended for installing dependencies:
```bash
brew install node
```

### Linux

#### Docker Permissions
You may need to add your user to the docker group:

```bash
sudo usermod -aG docker $USER
# Log out and log back in
```

#### Node.js Installation
Different distributions have different package managers:

```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Arch
sudo pacman -S nodejs npm
```

## 🧪 Testing Cross-Platform Compatibility

### Verify Node.js
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
```

### Verify Docker
```bash
docker --version          # Should show Docker version
docker compose version    # Should show Compose version
docker info              # Should show Docker is running
```

### Test Project
```bash
# Install dependencies
npm install

# Run quick test
npm run cy:run

# Full workflow test
npm run test:full
```

## 🐛 Troubleshooting by Platform

### Windows Issues

#### Issue: "node is not recognized"
**Solution**: Add Node.js to PATH
- Reinstall Node.js with "Add to PATH" option checked

#### Issue: Docker not starting
**Solution**: 
1. Check if Hyper-V is enabled (Windows 10 Pro/Enterprise)
2. For Windows 10 Home, use WSL 2 backend

#### Issue: Permission errors
**Solution**: Run PowerShell/CMD as Administrator (one time)

### macOS Issues

#### Issue: "permission denied" for scripts
**Solution**:
```bash
chmod +x scripts/*.sh
chmod +x scripts/*.js
```

#### Issue: Docker Desktop not starting
**Solution**:
- Check System Preferences → Security & Privacy
- Allow Docker Desktop

### Linux Issues

#### Issue: "docker: permission denied"
**Solution**:
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

#### Issue: "docker compose: command not found"
**Solution**:
```bash
# Install Docker Compose V2
sudo apt install docker-compose-plugin
```

## 📝 Best Practices

### For Development (All Platforms)
```bash
# 1. Setup once
npm run setup

# 2. Develop with GUI
npm run cy:open

# 3. Cleanup when done
npm run teardown
```

### For CI/CD (All Platforms)
```bash
# One command for everything
npm run test:full
```

### Script Selection
- **Use Node.js scripts** (default) for maximum compatibility
- **Use Bash scripts** only if you specifically need them on Unix systems

## 🔗 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Docker Desktop Documentation](https://docs.docker.com/desktop/)
- [Cypress Documentation](https://docs.cypress.io/)
- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/) (Windows)

## ✅ Platform Verification Checklist

Before running tests, verify:

- [ ] Node.js v18+ installed
- [ ] Docker Desktop installed and running
- [ ] `npm install` completed successfully
- [ ] Docker accessible (run `docker ps`)
- [ ] Can access http://localhost:8002 after setup

## 🎯 Summary

**The project works identically on all platforms thanks to:**
1. ✅ Node.js cross-platform scripts
2. ✅ Docker containerization
3. ✅ Cross-platform npm commands
4. ✅ Automatic path handling
5. ✅ No platform-specific dependencies

**Just run**: `npm run test:full` on any platform! 🚀

