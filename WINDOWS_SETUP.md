# Windows Setup Guide

## Quick Fix for "empty compose file" Error

If you encounter `empty compose file` error on Windows, the docker-compose.yml file failed to download from Google Drive.

### Solution 1: Manual Download (Easiest)

1. **Open the download link in your browser:**
   ```
   https://drive.google.com/file/d/1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi/view
   ```

2. **Click "Download" button**

3. **Save the file:**
   - Save as: `docker-compose.yml`
   - Save to: `<project-folder>\docker\docker-compose.yml`
   
   Example: `C:\Users\YourName\kong-test-Cypress\docker\docker-compose.yml`

4. **Run tests again:**
   ```bash
   npm run test:full
   ```

### Solution 2: PowerShell Download

Open PowerShell in the project directory and run:

```powershell
# Create docker directory
New-Item -ItemType Directory -Force -Path docker

# Download file
Invoke-WebRequest -Uri "https://drive.google.com/uc?export=download&id=1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi" -OutFile "docker\docker-compose.yml"

# Verify download
Get-Item docker\docker-compose.yml
```

### Solution 3: Use curl (Windows 10/11)

Windows 10/11 comes with curl. Open Command Prompt or PowerShell:

```bash
# Create directory
mkdir docker

# Download
curl -L "https://drive.google.com/uc?export=download&id=1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi" -o "docker\docker-compose.yml"

# Verify
dir docker\docker-compose.yml
```

---

## Complete Windows Setup Steps

### Prerequisites

1. **Install Node.js**
   - Download: https://nodejs.org/
   - Version: 18.x or higher
   - Verify: `node --version`

2. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Verify: `docker --version`

3. **Install Git** (if not already installed)
   - Download: https://git-scm.com/download/win
   - Use Git Bash or Windows Terminal

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/CodingProgrammer/kong-test.git
cd kong-test

# 2. Install dependencies
npm install

# 3. Run tests (will auto-download docker-compose.yml)
npm run test:full
```

If download fails, use one of the manual download solutions above.

---

## Common Windows Issues

### Issue 1: curl not found

**Error:**
```
'curl' is not recognized as an internal or external command
```

**Solution:**
- Use **PowerShell method** (Solution 2 above)
- Or manually download the file (Solution 1)

### Issue 2: Docker not running

**Error:**
```
Docker is not running or not installed
```

**Solution:**
1. Start Docker Desktop
2. Wait for Docker to fully start (check system tray)
3. Run `docker --version` to verify
4. Run tests again

### Issue 3: Port already in use

**Error:**
```
Port 8002 is already in use
```

**Solution:**

```bash
# Find what's using the port
netstat -ano | findstr :8002

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use cleanup
npm run cleanup
```

### Issue 4: Permission denied

**Error:**
```
EACCES: permission denied
```

**Solution:**
- Run Command Prompt or PowerShell **as Administrator**
- Or change directory permissions

### Issue 5: Long path issues

**Error:**
```
ENAMETOOLONG: name too long
```

**Solution:**
- Clone to a shorter path, e.g., `C:\kong-test`
- Or enable long paths in Windows:
  ```powershell
  # Run as Administrator
  New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
  ```

---

## Windows-Specific Commands

### PowerShell

```powershell
# Install dependencies
npm install

# Run tests
npm run test:full

# Open Cypress GUI
npm run cy:open

# Cleanup
npm run cleanup

# Check Docker
docker --version
docker ps
```

### Command Prompt

```cmd
REM Install dependencies
npm install

REM Run tests
npm run test:full

REM Cleanup
npm run cleanup
```

### Git Bash (Recommended for Windows)

```bash
# Works like Linux/Mac
npm install
npm run test:full
npm run cy:open
```

---

## Best Practices for Windows

### 1. Use Windows Terminal

Download from Microsoft Store - better than CMD/PowerShell.

### 2. Use Git Bash

Provides Unix-like commands on Windows.

### 3. Keep Paths Short

Clone to: `C:\projects\kong-test` instead of `C:\Users\LongUserName\Documents\Projects\...`

### 4. Run as Administrator

If you encounter permission issues.

### 5. Disable Antivirus Temporarily

Some antivirus software may block Docker or Node.js operations.

---

## Verification

After setup, verify everything works:

```bash
# 1. Check Node.js
node --version
# Should show: v18.x or higher

# 2. Check npm
npm --version
# Should show: 9.x or higher

# 3. Check Docker
docker --version
# Should show: 20.x or higher

# 4. Check Docker is running
docker ps
# Should show running containers or empty list (not error)

# 5. Run tests
npm run test:full
# Should complete successfully with 4/4 tests passing
```

---

## Troubleshooting Checklist

- [ ] Node.js installed (v18+)
- [ ] Docker Desktop installed and running
- [ ] docker-compose.yml downloaded to `docker\` folder
- [ ] File size is ~1.6 KB (not 0 bytes)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] No antivirus blocking
- [ ] Running from correct directory
- [ ] Ports 8000-8002 are free

---

## Quick Command Reference

```bash
# Setup and test (one command)
npm run test:full

# Step by step
npm run setup          # Start Kong
npm run cy:open        # Open Cypress GUI
npm run cy:run         # Run tests
npm run teardown       # Cleanup

# Troubleshooting
npm run cleanup        # Force cleanup
npm install            # Reinstall dependencies
docker ps -a           # Check containers
docker system prune    # Clean Docker
```

---

## Getting Help

If you still have issues:

1. Check `cypress/videos/` for test recordings
2. Check `cypress/screenshots/` for failure screenshots
3. Check Docker Desktop logs
4. Review `README.md` for general documentation
5. Open an issue on GitHub with:
   - Windows version
   - Error message
   - Steps to reproduce

---

## Success Indicators

When everything works correctly, you should see:

```
✅ docker-compose file downloaded successfully
✅ Docker is running properly
✅ Kong service is ready
✔ 4 passing tests
✅ Teardown Complete
```

**Total execution time: ~50-60 seconds**

---

## Additional Resources

- [Node.js Windows Installation](https://nodejs.org/en/download/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Windows Terminal](https://aka.ms/terminal)
- [Git for Windows](https://git-scm.com/download/win)

---

**Happy Testing on Windows! 🚀**

