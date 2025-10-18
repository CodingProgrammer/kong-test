/// <reference types="cypress" />

/**
 * Helper function to delete a Route
 * @param routeName - Route name
 */
const deleteRoute = (routeName: string) => {
    cy.log(`🗑️ Starting to delete Route: ${routeName}`)

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

    cy.log(`✅ Route ${routeName} deleted successfully`)
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

        // Verify license warning message
        cy.get('.alert-message')
            .should('be.visible')
            .should('contain', 'No valid Kong Enterprise license configured')

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Choose create button based on service list state
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="empty-state-action"]').length > 0) {
                // List is empty, click empty state button
                cy.log('Service list is empty, using empty-state-action button')
                cy.get('[data-testid="empty-state-action"]')
                    .should('be.visible')
                    .click()
            } else {
                // List is not empty, click toolbar button
                cy.log('Service list is not empty, using toolbar-add-gateway-service button')
                cy.get('[data-testid="toolbar-add-gateway-service"]')
                    .should('be.visible')
                    .click()
            }
        })
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

        // Verify license warning message
        cy.get('.alert-message')
            .should('be.visible')
            .should('contain', 'No valid Kong Enterprise license configured')

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Choose create button based on service list state
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="empty-state-action"]').length > 0) {
                // List is empty, click empty state button
                cy.log('Service list is empty, using empty-state-action button')
                cy.get('[data-testid="empty-state-action"]')
                    .should('be.visible')
                    .click()
            } else {
                // List is not empty, click toolbar button
                cy.log('Service list is not empty, using toolbar-add-gateway-service button')
                cy.get('[data-testid="toolbar-add-gateway-service"]')
                    .should('be.visible')
                    .click()
            }
        })
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

        // Verify license warning message
        cy.get('.alert-message')
            .should('be.visible')
            .should('contain', 'No valid Kong Enterprise license configured')

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Choose create button based on service list state
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="empty-state-action"]').length > 0) {
                // List is empty, click empty state button
                cy.log('Service list is empty, using empty-state-action button')
                cy.get('[data-testid="empty-state-action"]')
                    .should('be.visible')
                    .click()
            } else {
                // List is not empty, click toolbar button
                cy.log('Service list is not empty, using toolbar-add-gateway-service button')
                cy.get('[data-testid="toolbar-add-gateway-service"]')
                    .should('be.visible')
                    .click()
            }
        })
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

        // Verify license warning message
        cy.get('.alert-message')
            .should('be.visible')
            .should('contain', 'No valid Kong Enterprise license configured')

        // Click default workspace
        cy.get('[data-testid="workspace-link-default"]').click()
        cy.waitForPageLoad()

        // Click Gateway Services sidebar menu item
        cy.get('[data-testid="sidebar-item-gateway-services"]').click()
        cy.waitForPageLoad()

        // Wait for page data to load
        cy.waitForPageDataLoaded()

        // Choose create button based on service list state
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="empty-state-action"]').length > 0) {
                // List is empty, click empty state button
                cy.log('Service list is empty, using empty-state-action button')
                cy.get('[data-testid="empty-state-action"]')
                    .should('be.visible')
                    .click()
            } else {
                // List is not empty, click toolbar button
                cy.log('Service list is not empty, using toolbar-add-gateway-service button')
                cy.get('[data-testid="toolbar-add-gateway-service"]')
                    .should('be.visible')
                    .click()
            }
        })
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
})
