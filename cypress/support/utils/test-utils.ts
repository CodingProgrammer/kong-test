/**
 * Test Utility Functions
 * Common utility functions for test execution
 */

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, length + 2)
}

/**
 * Generate timestamp-based name
 */
export function generateTimestampName(prefix: string = 'test'): string {
    return `${prefix}-${Date.now()}`
}

/**
 * Generate random number in range
 */
export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Wait for a specific time
 */
export function wait(ms: number): Cypress.Chainable {
    return cy.wait(ms)
}

/**
 * Retry a function until it succeeds or max retries reached
 */
export function retryUntilSuccess(
    fn: () => void,
    maxRetries: number = 3,
    delayMs: number = 1000
): void {
    let attempts = 0
    const attempt = () => {
        try {
            fn()
        } catch (error) {
            attempts++
            if (attempts < maxRetries) {
                cy.wait(delayMs)
                attempt()
            } else {
                throw error
            }
        }
    }
    attempt()
}

/**
 * Format date for display
 */
export function formatDate(date: Date = new Date()): string {
    return date.toISOString().split('T')[0]
}

/**
 * Format timestamp
 */
export function formatTimestamp(date: Date = new Date()): string {
    return date.toISOString()
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0
}

/**
 * Merge objects
 */
export function merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
    return Object.assign({}, target, ...sources)
}

/**
 * Sleep for a duration
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

/**
 * Sanitize string for use in selectors
 */
export function sanitizeSelector(str: string): string {
    return str.replace(/[^a-zA-Z0-9-_]/g, '-')
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
    try {
        return JSON.parse(json)
    } catch {
        return defaultValue
    }
}

/**
 * Get environment variable with default
 */
export function getEnv(key: string, defaultValue: string = ''): string {
    return Cypress.env(key) || defaultValue
}

/**
 * Check if running in CI
 */
export function isCI(): boolean {
    return Boolean(Cypress.env('CI'))
}

/**
 * Get current browser name
 */
export function getBrowserName(): string {
    return Cypress.browser.name
}

/**
 * Check if running in headless mode
 */
export function isHeadless(): boolean {
    return Cypress.browser.isHeadless
}

