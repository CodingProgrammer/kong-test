/**
 * Test Configuration
 * Centralized configuration for test execution
 */

export const TestConfig = {
    // Timeouts
    timeouts: {
        short: 5000,
        medium: 10000,
        long: 30000,
        pageLoad: 10000,
        apiRequest: 10000,
    },

    // Retry configuration
    retries: {
        runMode: 2,
        openMode: 0,
    },

    // URLs
    urls: {
        adminUI: 'http://localhost:8002',
        adminAPI: 'http://localhost:8001',
        proxy: 'http://localhost:8000',
    },

    // Default workspace
    defaultWorkspace: 'default',

    // Test data prefixes
    prefixes: {
        service: 'test-service',
        route: 'test-route',
        consumer: 'test-consumer',
        plugin: 'test-plugin',
    },

    // Viewport sizes for responsive testing
    viewports: {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1920, height: 1080 },
        wide: { width: 2560, height: 1440 },
    },

    // Browser configurations
    browsers: ['chrome', 'firefox', 'edge'],

    // Feature flags
    features: {
        enableAPITests: true,
        enablePerformanceTests: false,
        enableAccessibilityTests: false,
        enableVisualTests: false,
    },

    // Test data generation
    randomSeed: Date.now(),
}

export default TestConfig

