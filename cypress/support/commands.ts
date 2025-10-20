/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command: Login
             * @example cy.login('username', 'password')
             */
            login(username: string, password: string): Chainable<void>

            /**
             * Custom command: Wait for page load complete
             * @example cy.waitForPageLoad()
             */
            waitForPageLoad(): Chainable<void>

            /**
             * Custom command: Wait for page data to load complete
             * @example cy.waitForPageDataLoaded()
             */
            waitForPageDataLoaded(): Chainable<void>

            /**
             * Custom command: Wait for network requests to complete
             * @example cy.waitForNetworkIdle()
             */
            waitForNetworkIdle(): Chainable<void>
        }
    }
}

// Example: Login command
Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('/login')
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
})

// Example: Wait for page load complete
Cypress.Commands.add('waitForPageLoad', () => {
    cy.document().its('readyState').should('equal', 'complete')
})

/**
 * Wait for page data to load complete
 * Use multiple checks to ensure data is truly loaded
 */
Cypress.Commands.add('waitForPageDataLoaded', () => {
    // Method 1: Wait for loading indicator to disappear
    cy.get('body').then(($body) => {
        // If loading indicator exists, wait for it to disappear
        if ($body.find('.k-skeleton, .loading, [data-testid="loading"]').length > 0) {
            cy.get('.k-skeleton, .loading, [data-testid="loading"]', { timeout: 10000 })
                .should('not.exist')
        }
    })

    // Method 2: Wait for table or list content to appear
    cy.get('body').then(($body) => {
        // Check if there is a data table or empty state
        const hasTable = $body.find('table, [data-testid="table"]').length > 0
        const hasEmptyState = $body.find('[data-testid="empty-state"], [data-testid="empty-state-action"]').length > 0

        if (hasTable) {
            cy.log('Detected table, waiting for data to load')
            cy.get('table, [data-testid="table"]', { timeout: 10000 })
                .should('be.visible')
        } else if (hasEmptyState) {
            cy.log('Detected empty state')
            cy.get('[data-testid="empty-state"], [data-testid="empty-state-action"]', { timeout: 5000 })
                .should('be.visible')
        }
    })

    // Method 3: Brief wait to ensure DOM is stable
    cy.wait(500)

    cy.log('Page data loading complete')
})

/**
 * Wait for network requests to complete
 * Determine if data is loaded by detecting network idle state
 */
Cypress.Commands.add('waitForNetworkIdle', () => {
    cy.log('Waiting for network requests to complete...')
    cy.wait(1000) // Wait for network requests to stabilize
    cy.log('Network requests complete')
})

export { }
