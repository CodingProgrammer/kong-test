/// <reference types="cypress" />

/**
 * Helper function to click the appropriate "Create Service" button
 * Handles both empty state and toolbar button scenarios
 * Robust implementation with multiple fallback strategies
 */
const clickCreateServiceButton = () => {
    cy.log('Detecting service list state...')

    cy.get('body').then(($body) => {
        // Strategy 1: Check for empty state indicators
        const hasEmptyStateButton = $body.find('[data-testid="empty-state-action"]').length > 0
        const hasEmptyStateText = $body.text().includes('Create your first service') ||
            $body.text().includes('No Gateway Services exist')
        const hasEmptyStateIcon = $body.find('[data-testid="empty-state"]').length > 0
        const hasEmptyStateTitle = $body.find('.empty-state-title').length > 0

        // Check if toolbar button exists
        const hasToolbarButton = $body.find('[data-testid="toolbar-add-gateway-service"]').length > 0

        cy.log(`Detection results:
            - Empty state button: ${hasEmptyStateButton}
            - Empty state text: ${hasEmptyStateText}
            - Empty state icon: ${hasEmptyStateIcon}
            - Empty state title: ${hasEmptyStateTitle}
            - Toolbar button: ${hasToolbarButton}`)

        // Determine which button to use
        const isEmptyState = hasEmptyStateButton || hasEmptyStateText || hasEmptyStateIcon || hasEmptyStateTitle

        if (isEmptyState && !hasToolbarButton) {
            // Empty state: use empty-state-action button
            cy.log('Service list is EMPTY - using empty-state-action button')
            cy.get('[data-testid="empty-state-action"]', { timeout: 10000 })
                .should('be.visible')
                .should('not.be.disabled')
                .click({ force: false })
            cy.log('Clicked empty-state-action button')
        } else if (hasToolbarButton) {
            // Non-empty state: use toolbar button
            cy.log('Service list is NOT EMPTY - using toolbar-add-gateway-service button')
            cy.get('[data-testid="toolbar-add-gateway-service"]', { timeout: 10000 })
                .should('be.visible')
                .should('not.be.disabled')
                .click({ force: false })
            cy.log('Clicked toolbar-add-gateway-service button')
        } else {
            // Fallback: try all possible selectors
            cy.log('Using fallback strategy...')

            cy.get('body').then(($fallbackBody) => {
                const selectors = [
                    '[data-testid="empty-state-action"]',
                    '[data-testid="toolbar-add-gateway-service"]',
                    '[data-testid="add-gateway-service"]',
                    'button:contains("New gateway service")',
                    'button:contains("New Gateway Service")',
                    'a[href*="/services/create"]'
                ]

                let clicked = false
                for (const selector of selectors) {
                    if ($fallbackBody.find(selector).length > 0) {
                        cy.log(`Found fallback selector: ${selector}`)
                        cy.get(selector).first().click({ force: false })
                        clicked = true
                        break
                    }
                }

                if (!clicked) {
                    cy.log('No create button found, trying generic button search')
                    cy.get('button').contains(/New|Add|Create/i).first().click({ force: false })
                }
            })
        }
    })

    // Wait for navigation to complete
    cy.wait(500)
    cy.log('Create service button clicked successfully')
}

/**
 * Helper function to delete a Route
 * @param routeName - Route name
 */
const deleteRoute = (routeName: string) => {
    cy.log(`Starting to delete Route: ${routeName}`)

    cy.get(`[data-testid="${routeName}"]`)
        .should('be.visible')
        .find('[data-testid="actions"]')
        .click()

    cy.get(`[data-testid="${routeName}"]`)
        .find('[data-testid="action-entity-delete"]')
        .click()

    cy.get('[data-testid="confirmation-input"]')
        .should('be.visible')
        .clear()
        .type(routeName)

    cy.get('[data-testid="modal-action-button"]')
        .should('be.visible')
        .click()

    cy.get('.toaster-message', { timeout: 10000 })
        .should('be.visible')
        .should('contain', routeName)
        .should('contain', 'successfully deleted!')

    cy.log(`Route ${routeName} deleted successfully`)
}

describe('Gateway Service Management Tests', () => {
    beforeEach(() => {
        // Ensure page is fully loaded
        cy.waitForPageLoad()
    })

    afterEach(function () {
        // Teardown: Clean up services created during tests
        // Only execute deletion if service creation was successful
        cy.get('@serviceCreated').then((created) => {
            if (!created) {
                cy.log('Service creation was not successful, skipping cleanup')
                return
            }

            cy.get('@serviceName').then((serviceName: any) => {
                if (!serviceName) {
                    cy.log('Service information not found, skipping cleanup')
                    return
                }

                cy.log(`Starting cleanup of test service: ${serviceName}`)

                // Use Cypress error handling, deletion failure won't affect test results
                cy.visit('/workspaces', { failOnStatusCode: false })
                cy.get('[data-testid="workspace-link-default"]')
                    .should('exist')
                    .click()

                cy.get('[data-testid="sidebar-item-gateway-services"]')
                    .should('exist')
                    .click()

                // Wait for page data to load
                cy.waitForPageDataLoaded()

                // Check if service exists, skip deletion if not found
                cy.get('body').then(($body) => {
                    if ($body.find(`[data-testid="${serviceName}"]`).length > 0) {
                        cy.log(`Service ${serviceName} found, proceeding with deletion`)

                        cy.get(`[data-testid="${serviceName}"]`)
                            .find('[data-testid="actions"]')
                            .click()

                        cy.get(`[data-testid="${serviceName}"]`)
                            .find('[data-testid="action-entity-delete"]')
                            .click()

                        cy.get(`[aria-label="Type '${serviceName}' to confirm your action."]`)
                            .type(serviceName)

                        cy.get('[data-testid="modal-action-button"]')
                            .click()

                        // Verify deletion success
                        cy.get('.toaster-message', { timeout: 10000 })
                            .should('be.visible')
                            .should('contain', serviceName)
                            .should('contain', 'successfully deleted!')

                        cy.get('[data-testid="kui-icon-svg-close-icon"]')
                            .click()

                        cy.log(`Service ${serviceName} deleted successfully`)
                    } else {
                        cy.log(`Service ${serviceName} does not exist, skipping deletion`)
                    }
                })
            })
        })
    })

    it('create new Gateway Service', () => {
        // Initialize flag: service not created
        cy.wrap(false).as('serviceCreated')

        // Navigate to workspaces page
        cy.visit('/workspaces')
        cy.waitForPageLoad()

        // Verify license warning message (optional - may not appear in all environments)
        cy.get('body').then(($body) => {
            if ($body.find('.alert-message').length > 0) {
                cy.log('License warning found')
                cy.get('.alert-message')
                    .should('be.visible')
                    .should('contain', 'No valid Kong Enterprise license configured')
            } else {
                cy.log('No license warning (may be licensed or different environment)')
            }
        })

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Wait a bit more for UI to stabilize
        cy.wait(1000)

        // Click the appropriate create service button
        clickCreateServiceButton()
        cy.waitForPageLoad()

        // Enter test data in URL input field
        const testUrl = 'https://api.kong-air.com/flights'
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('be.visible')
            .clear()
            .type(testUrl)

        // Verify input value
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('have.value', testUrl)

        const serviceName = 'test-service-' + Date.now()
        // Save service name as alias for teardown use
        cy.wrap(serviceName).as('serviceName')

        cy.get('[data-testid="gateway-service-name-input"]')
            .should('be.visible')
            .clear()
            .type(serviceName)

        // Verify input value
        cy.get('[data-testid="gateway-service-name-input"]')
            .should('have.value', serviceName)

        // Click Save button to submit form
        cy.get('[data-testid="service-create-form-submit"]')
            .should('be.visible')
            .should('contain', 'Save')
            .click()

        // Wait and check creation result, only mark for cleanup if successful
        cy.get('.toaster-message', { timeout: 10000 })
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                if (text.includes('successfully created')) {
                    // Only mark when creation is successful, ensure afterEach will clean up
                    cy.wrap(true).as('serviceCreated')
                    cy.log(`Service ${serviceName} created successfully, will be automatically cleaned up after test`)
                } else {
                    cy.log(`Service creation was not successful, skipping cleanup marking`)
                }
            })

        // Verify creation success toast message
        cy.get('.toaster-message')
            .should('contain', serviceName)
            .should('contain', 'successfully created!')

        cy.get('[data-testid="kui-icon-svg-close-icon"]')
            .click()
    })

    it('create Gateway Service with wrong url', () => {
        // Initialize flag: service not created
        cy.wrap(false).as('serviceCreated')

        // Navigate to workspaces page
        cy.visit('/workspaces')
        cy.waitForPageLoad()

        // Verify license warning message (optional - may not appear in all environments)
        cy.get('body').then(($body) => {
            if ($body.find('.alert-message').length > 0) {
                cy.log('License warning found')
                cy.get('.alert-message')
                    .should('be.visible')
                    .should('contain', 'No valid Kong Enterprise license configured')
            } else {
                cy.log('No license warning (may be licensed or different environment)')
            }
        })

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Wait a bit more for UI to stabilize
        cy.wait(1000)

        // Click the appropriate create service button
        clickCreateServiceButton()
        cy.waitForPageLoad()

        // Enter test data in URL input field
        const testUrl = 'api.kong-air.com/flights'
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('be.visible')
            .clear()
            .type(testUrl)

        // Verify input value
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('have.value', testUrl)

        cy.get('.gateway-service-form-group-fields')
            .find('.help-text')
            .contains('The URL must follow a valid format')
    })

    it('create new Gateway Service with Wrong form (url)', () => {
        // Initialize flag: service not created
        cy.wrap(false).as('serviceCreated')

        // Navigate to workspaces page
        cy.visit('/workspaces')
        cy.waitForPageLoad()

        // Verify license warning message (optional - may not appear in all environments)
        cy.get('body').then(($body) => {
            if ($body.find('.alert-message').length > 0) {
                cy.log('License warning found')
                cy.get('.alert-message')
                    .should('be.visible')
                    .should('contain', 'No valid Kong Enterprise license configured')
            } else {
                cy.log('No license warning (may be licensed or different environment)')
            }
        })

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Wait a bit more for UI to stabilize
        cy.wait(1000)

        // Click the appropriate create service button
        clickCreateServiceButton()
        cy.waitForPageLoad()

        // Enter test data in URL input field
        const testUrl = 'https:api.kong-air.com/flights'
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('be.visible')
            .clear()
            .type(testUrl)

        // Verify input value
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('have.value', testUrl)

        const serviceName = 'test-service-' + Date.now()
        // Save service name as alias for teardown use
        cy.wrap(serviceName).as('serviceName')

        cy.get('[data-testid="gateway-service-name-input"]')
            .should('be.visible')
            .clear()
            .type(serviceName)

        // Verify input value
        cy.get('[data-testid="gateway-service-name-input"]')
            .should('have.value', serviceName)

        // Click Save button to submit form
        cy.get('[data-testid="service-create-form-submit"]')
            .should('be.visible')
            .should('contain', 'Save')
            .click()

        // check the error message
        cy.get('[data-testid="form-error"]').contains('2 schema violations (host: required field missing; path: should start with: /)')
    })

    it('create new Gateway Service with Routes', () => {
        // Initialize flag: service not created
        cy.wrap(false).as('serviceCreated')

        // Navigate to workspaces page
        cy.visit('/workspaces')
        cy.waitForPageLoad()

        // Verify license warning message (optional - may not appear in all environments)
        cy.get('body').then(($body) => {
            if ($body.find('.alert-message').length > 0) {
                cy.log('License warning found')
                cy.get('.alert-message')
                    .should('be.visible')
                    .should('contain', 'No valid Kong Enterprise license configured')
            } else {
                cy.log('No license warning (may be licensed or different environment)')
            }
        })

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Wait a bit more for UI to stabilize
        cy.wait(1000)

        // Click the appropriate create service button
        clickCreateServiceButton()
        cy.waitForPageLoad()

        // Enter test data in URL input field
        const testUrl = 'https://api.kong-air.com/flights'
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('be.visible')
            .clear()
            .type(testUrl)

        // Verify input value
        cy.get('[data-testid="gateway-service-url-input"]')
            .should('have.value', testUrl)

        const serviceName = 'test-service-' + Date.now()
        // Save service name as alias for teardown use
        cy.wrap(serviceName).as('serviceName')

        cy.get('[data-testid="gateway-service-name-input"]')
            .should('be.visible')
            .clear()
            .type(serviceName)

        // Verify input value
        cy.get('[data-testid="gateway-service-name-input"]')
            .should('have.value', serviceName)

        // Click Save button to submit form
        cy.get('[data-testid="service-create-form-submit"]')
            .should('be.visible')
            .should('contain', 'Save')
            .click()

        // Wait and check creation result, only mark for cleanup if successful
        cy.get('.toaster-message', { timeout: 10000 })
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                if (text.includes('successfully created')) {
                    // Only mark when creation is successful, ensure afterEach will clean up
                    cy.wrap(true).as('serviceCreated')
                    cy.log(`Service ${serviceName} created successfully, will be automatically cleaned up after test`)
                } else {
                    cy.log(`Service creation was not successful, skipping cleanup marking`)
                }
            })

        // Verify creation success toast message
        cy.get('.toaster-message')
            .should('contain', serviceName)
            .should('contain', 'successfully created!')

        cy.get('[data-testid="kui-icon-svg-close-icon"]')
            .click()

        cy.get('[data-testid="service-routes"]')
            .click()

        cy.get('[data-testid="empty-state-action"]')
            .click()

        const routeName = 'test-route-' + Date.now()
        cy.get('[data-testid="route-form-name"]')
            .should('be.visible')
            .clear()
            .type(routeName)
        cy.get('[data-testid="route-form-name"]')
            .should('have.value', routeName)

        const routeTags = 'test-route-tags-' + Date.now()
        cy.get('[data-testid="route-form-tags"]')
            .should('be.visible')
            .clear()
            .type(routeTags)
        cy.get('[data-testid="route-form-tags"]')
            .should('have.value', routeTags)


        const path = '/api/v1'
        cy.get('[data-testid="route-form-paths-input-1"]')
            .should('be.visible')
            .clear()
            .type(path)
        cy.get('[data-testid="route-form-paths-input-1"]')
            .should('have.value', path)

        cy.get('[data-testid="route-create-form-submit"]')
            .should('be.visible')
            .should('contain', 'Save')
            .click()

        cy.get('.toaster-message')
            .should('contain', routeName)
            .should('contain', 'successfully created!')

        cy.get('[data-testid="kui-icon-svg-close-icon"]')
            .click()

        // Delete route
        deleteRoute(routeName)
    })

    // ============================================================================
    // Additional Test Cases - TODO: Implement as needed
    // ============================================================================

    describe('Service CRUD Operations', () => {
        it.skip('should list all gateway services', () => {
            // TODO: Implement
        })

        it.skip('should view service details', () => {
            // TODO: Implement
        })

        it.skip('should edit existing service', () => {
            // TODO: Implement
        })

        it.skip('should delete service', () => {
            // TODO: Implement
        })

        it.skip('should search services by name', () => {
            // TODO: Implement
        })

        it.skip('should filter services by tags', () => {
            // TODO: Implement
        })

        it.skip('should sort services by different fields', () => {
            // TODO: Implement
        })

        it.skip('should paginate service list', () => {
            // TODO: Implement
        })
    })

    describe('Service Form Validation', () => {
        it.skip('should validate URL format', () => {
            // TODO: Implement
        })

        it.skip('should validate host format', () => {
            // TODO: Implement
        })

        it.skip('should validate port range (1-65535)', () => {
            // TODO: Implement
        })

        it.skip('should validate service name uniqueness', () => {
            // TODO: Implement
        })

        it.skip('should validate retries configuration', () => {
            // TODO: Implement
        })

        it.skip('should validate timeout values', () => {
            // TODO: Implement
        })

        it.skip('should show error for invalid protocol', () => {
            // TODO: Implement
        })

        it.skip('should validate tags format', () => {
            // TODO: Implement
        })
    })

    describe('Service Configuration', () => {
        it.skip('should create service with custom name', () => {
            // TODO: Implement
        })

        it.skip('should create service with tags', () => {
            // TODO: Implement
        })

        it.skip('should create service with retries', () => {
            // TODO: Implement
        })

        it.skip('should create service with connect timeout', () => {
            // TODO: Implement
        })

        it.skip('should create service with write timeout', () => {
            // TODO: Implement
        })

        it.skip('should create service with read timeout', () => {
            // TODO: Implement
        })

        it.skip('should create service with client certificate', () => {
            // TODO: Implement
        })

        it.skip('should enable/disable service', () => {
            // TODO: Implement
        })
    })

    describe('Routes Management', () => {
        it.skip('should add route to existing service', () => {
            // TODO: Implement
        })

        it.skip('should create route with multiple paths', () => {
            // TODO: Implement
        })

        it.skip('should create route with multiple methods', () => {
            // TODO: Implement
        })

        it.skip('should create route with headers', () => {
            // TODO: Implement
        })

        it.skip('should create route with hosts', () => {
            // TODO: Implement
        })

        it.skip('should create route with regex path', () => {
            // TODO: Implement
        })

        it.skip('should edit route', () => {
            // TODO: Implement
        })

        it.skip('should delete route', () => {
            // TODO: Implement
        })

        it.skip('should set route priority', () => {
            // TODO: Implement
        })

        it.skip('should enable/disable route', () => {
            // TODO: Implement
        })
    })

    describe('Plugins Integration', () => {
        it.skip('should add rate-limiting plugin to service', () => {
            // TODO: Implement
        })

        it.skip('should add key-auth plugin to service', () => {
            // TODO: Implement
        })

        it.skip('should add cors plugin to service', () => {
            // TODO: Implement
        })

        it.skip('should configure plugin settings', () => {
            // TODO: Implement
        })

        it.skip('should enable/disable plugin', () => {
            // TODO: Implement
        })

        it.skip('should delete plugin from service', () => {
            // TODO: Implement
        })

        it.skip('should view plugin details', () => {
            // TODO: Implement
        })
    })

    describe('Advanced Scenarios', () => {
        it.skip('should handle service with multiple routes', () => {
            // TODO: Implement
        })

        it.skip('should handle service with multiple plugins', () => {
            // TODO: Implement
        })

        it.skip('should clone existing service', () => {
            // TODO: Implement
        })

        it.skip('should export service configuration', () => {
            // TODO: Implement
        })

        it.skip('should import service configuration', () => {
            // TODO: Implement
        })

        it.skip('should handle service with upstream', () => {
            // TODO: Implement
        })

        it.skip('should handle load balancing configuration', () => {
            // TODO: Implement
        })
    })

    describe('Error Handling', () => {
        it.skip('should handle network timeout', () => {
            // TODO: Implement
        })

        it.skip('should handle server error (500)', () => {
            // TODO: Implement
        })

        it.skip('should handle duplicate service name', () => {
            // TODO: Implement
        })

        it.skip('should handle invalid JSON response', () => {
            // TODO: Implement
        })

        it.skip('should recover from failed creation', () => {
            // TODO: Implement
        })
    })

    describe('Performance & Load', () => {
        it.skip('should load service list quickly (< 3s)', () => {
            // TODO: Implement
        })

        it.skip('should create service quickly (< 5s)', () => {
            // TODO: Implement
        })

        it.skip('should handle large service list (100+ items)', () => {
            // TODO: Implement
        })

        it.skip('should handle rapid filtering operations', () => {
            // TODO: Implement
        })
    })

    describe('UI/UX Validation', () => {
        it.skip('should show loading indicator during creation', () => {
            // TODO: Implement
        })

        it.skip('should disable submit button during submission', () => {
            // TODO: Implement
        })

        it.skip('should show success notification', () => {
            // TODO: Implement
        })

        it.skip('should show error notification', () => {
            // TODO: Implement
        })

        it.skip('should preserve form data on validation error', () => {
            // TODO: Implement
        })

        it.skip('should clear form after successful creation', () => {
            // TODO: Implement
        })

        it.skip('should handle browser back button', () => {
            // TODO: Implement
        })

        it.skip('should handle page refresh', () => {
            // TODO: Implement
        })
    })

    describe('Edge Cases', () => {
        it.skip('should handle very long service name (255 chars)', () => {
            // TODO: Implement
        })

        it.skip('should handle special characters in name', () => {
            // TODO: Implement
        })

        it.skip('should handle Unicode characters', () => {
            // TODO: Implement
        })

        it.skip('should handle minimum port (1)', () => {
            // TODO: Implement
        })

        it.skip('should handle maximum port (65535)', () => {
            // TODO: Implement
        })

        it.skip('should handle zero timeout', () => {
            // TODO: Implement
        })

        it.skip('should handle maximum timeout', () => {
            // TODO: Implement
        })

        it.skip('should handle empty tags array', () => {
            // TODO: Implement
        })

        it.skip('should handle many tags (50+)', () => {
            // TODO: Implement
        })
    })

    describe('Accessibility', () => {
        it.skip('should support keyboard navigation', () => {
            // TODO: Implement
        })

        it.skip('should support Tab key navigation', () => {
            // TODO: Implement
        })

        it.skip('should support Enter key to submit', () => {
            // TODO: Implement
        })

        it.skip('should support Escape key to cancel', () => {
            // TODO: Implement
        })

        it.skip('should have proper ARIA labels', () => {
            // TODO: Implement
        })

        it.skip('should have visible focus indicators', () => {
            // TODO: Implement
        })

        it.skip('should announce errors to screen readers', () => {
            // TODO: Implement
        })
    })

    describe('Security', () => {
        it.skip('should sanitize input to prevent XSS', () => {
            // TODO: Implement
        })

        it.skip('should validate SSL/TLS configuration', () => {
            // TODO: Implement
        })

        it.skip('should handle authentication errors', () => {
            // TODO: Implement
        })

        it.skip('should handle authorization errors', () => {
            // TODO: Implement
        })
    })

    describe('Integration Tests', () => {
        it.skip('should sync with Kong Admin API', () => {
            // TODO: Implement
        })

        it.skip('should reflect API changes in UI', () => {
            // TODO: Implement
        })

        it.skip('should handle concurrent modifications', () => {
            // TODO: Implement
        })

        it.skip('should validate against Kong schema', () => {
            // TODO: Implement
        })
    })
})
