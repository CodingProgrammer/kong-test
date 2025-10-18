# Kong Gateway Environment Differences

## Why UI Structure Differs Between Native and Docker Environments

### Root Cause Analysis

The Kong Gateway UI structure differs between environments due to **configuration and version differences**, not platform issues.

## Configuration Comparison

| Configuration | Native Environment | Docker Test Environment |
|--------------|-------------------|------------------------|
| **Image** | `kong/kong-gateway` (latest) | `kong/kong-gateway:3.4` (fixed) |
| **KONG_PASSWORD** | ✅ `handyshake` | ❌ Not configured |
| **KONG_ADMIN_GUI_URL** | ✅ `http://localhost:8002` | ❌ Not configured |
| **Database Password** | `kong` | `kongpass` |
| **Migrations** | Manual bootstrap in command | Separate service |
| **Mode** | Enterprise (full features) | Simplified (limited features) |

## Key Differences Explained

### 1. KONG_PASSWORD (Most Critical)

**Native Environment:**
```yaml
KONG_PASSWORD: 'handyshake'
```
- This is the Kong Gateway **Enterprise Edition** super admin password
- Enables full enterprise features and UI
- More complex UI structure with license management
- Shows enterprise-specific elements like:
  - License warnings/alerts
  - Advanced workspace management
  - Role-based access control UI
  - Enterprise dashboard

**Docker Test Environment:**
```yaml
# Not configured
```
- Runs in **free/simplified mode**
- Simplified UI structure
- Missing enterprise-specific features
- No license warnings
- Basic workspace management

### 2. KONG_ADMIN_GUI_URL

**Native Environment:**
```yaml
KONG_ADMIN_GUI_URL: 'http://localhost:8002'
```
- Explicitly configures Admin GUI access URL
- Enables full GUI management interface
- All UI features activated

**Docker Test Environment:**
```yaml
# Not configured
```
- GUI may have limited functionality
- Some UI elements may not render
- Certain features disabled

### 3. Image Version

**Native Environment:**
```yaml
image: 'kong/kong-gateway'  # latest
```
- Pulls latest version (possibly 3.5.x or newer)
- Modern UI
- Latest features
- Latest bug fixes

**Docker Test Environment:**
```yaml
image: 'kong/kong-gateway:3.4'
```
- Fixed to version 3.4
- Older UI structure
- May have different element selectors
- Potentially missing newer features

## Impact on Tests

### Why Tests Fail in Docker Environment

1. **Missing License Alert**
   ```typescript
   // This element doesn't exist without KONG_PASSWORD
   cy.get('.alert-message')  // ❌ Fails in Docker
   ```

2. **Different Navigation Structure**
   ```typescript
   // Workspace links may have different selectors
   cy.get('[data-testid="workspace-link-default"]')  // ❌ May not exist
   ```

3. **Simplified UI**
   - Fewer navigation elements
   - Different page layouts
   - Missing enterprise features

## Solution Options

### Option 1: Match Native Configuration (Recommended)

Update `docker-compose.test.yml` to match native environment:

```yaml
kong-admin:
  image: kong/kong-gateway  # Use latest instead of 3.4
  environment:
    KONG_DATABASE: postgres
    KONG_PG_HOST: kong-database
    KONG_PG_USER: kong
    KONG_PG_PASSWORD: kong  # Match native
    KONG_PG_DATABASE: kong
    KONG_PASSWORD: handyshake  # ✅ Add this
    KONG_ADMIN_GUI_URL: http://localhost:8002  # ✅ Add this
    KONG_ADMIN_LISTEN: 0.0.0.0:8001
    KONG_ADMIN_GUI_LISTEN: 0.0.0.0:8002
    KONG_PROXY_LISTEN: 0.0.0.0:8000
```

### Option 2: Create Environment-Specific Tests

```typescript
// Detect environment
const isDockerEnv = Cypress.env('DOCKER_ENV') === 'true'

// Conditional assertions
if (!isDockerEnv) {
  cy.get('.alert-message')
    .should('contain', 'No valid Kong Enterprise license')
}
```

### Option 3: Use Native Environment Only

- Keep Docker for infrastructure
- Run tests against native Kong setup
- This is currently working perfectly

## Why This Matters

### Enterprise vs Free Mode

```
┌─────────────────────────────────────────────────┐
│           Kong Gateway Modes                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  With KONG_PASSWORD (Enterprise):               │
│    ├── Full Admin UI                            │
│    ├── License Management                        │
│    ├── Advanced Workspaces                       │
│    ├── RBAC UI                                   │
│    └── Enterprise Dashboard                      │
│                                                  │
│  Without KONG_PASSWORD (Simplified):            │
│    ├── Basic Admin UI                           │
│    ├── No License Alerts                        │
│    ├── Simple Workspaces                         │
│    └── Limited Features                          │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Verification

### Check Kong Mode

```bash
# Native environment
docker exec kong-cp kong version

# Docker test environment  
docker exec kong-gateway kong version

# Check if enterprise features enabled
docker exec kong-gateway kong health
```

### Check Configuration

```bash
# Native environment
docker exec kong-cp env | grep KONG_

# Docker test environment
docker exec kong-gateway env | grep KONG_
```

## Recommendations

### For Development & Testing

**Use Native Environment** ✅
```bash
npm run test:full
```
- Fully configured
- All features enabled
- Tests work perfectly

### For CI/CD (Future)

**Update Docker Configuration** to match native:
1. Add `KONG_PASSWORD`
2. Add `KONG_ADMIN_GUI_URL`
3. Use same image version
4. Match all environment variables

## Summary

The UI structure differs because:

1. **🔑 Password**: Native has enterprise password, Docker doesn't
2. **🎨 Features**: Native runs full enterprise mode, Docker runs simplified
3. **📦 Version**: Native uses latest, Docker uses fixed 3.4
4. **⚙️ Config**: Native has more complete configuration

**Bottom Line:** The test environment needs to match production/native environment configurations to have consistent UI structure and test results.

## References

- [Kong Gateway Documentation](https://docs.konghq.com/gateway/latest/)
- [Kong Enterprise vs Free](https://konghq.com/products/kong-gateway)
- [Docker Environment Variables](https://docs.konghq.com/gateway/latest/reference/configuration/)

