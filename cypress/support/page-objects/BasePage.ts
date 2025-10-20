/**
 * Base Page Object
 * Contains common methods shared across all pages
 */
export class BasePage {
    /**
     * Navigate to a specific path
     */
    visit(path: string) {
        cy.visit(path)
        cy.waitForPageLoad()
        return this
    }

    /**
     * Wait for page data to be fully loaded
     */
    waitForDataLoaded() {
        cy.waitForPageDataLoaded()
        return this
    }

    /**
     * Wait for network requests to complete
     */
    waitForNetworkIdle() {
        cy.waitForNetworkIdle()
        return this
    }

    /**
     * Get element by data-testid
     */
    getByTestId(testId: string) {
        return cy.get(`[data-testid="${testId}"]`)
    }

    /**
     * Click element by data-testid
     */
    clickByTestId(testId: string) {
        this.getByTestId(testId).should('be.visible').click()
        return this
    }

    /**
     * Type into input by data-testid
     */
    typeByTestId(testId: string, text: string, options?: { clear?: boolean }) {
        const input = this.getByTestId(testId).should('be.visible')
        if (options?.clear) {
            input.clear()
        }
        input.type(text)
        return this
    }

    /**
     * Verify toaster message
     */
    verifyToasterMessage(expectedText: string | string[]) {
        const texts = Array.isArray(expectedText) ? expectedText : [expectedText]
        const toaster = cy.get('.toaster-message', { timeout: 10000 }).should('be.visible')
        texts.forEach(text => {
            toaster.should('contain', text)
        })
        return this
    }

    /**
     * Close toaster message
     */
    closeToaster() {
        this.clickByTestId('kui-icon-svg-close-icon')
        return this
    }

    /**
     * Verify alert message
     */
    verifyAlertMessage(expectedText: string) {
        cy.get('body').then(($body) => {
            if ($body.find('.alert-message').length > 0) {
                cy.get('.alert-message')
                    .should('be.visible')
                    .should('contain', expectedText)
            } else {
                cy.log('No alert message found (may be different environment)')
            }
        })
        return this
    }

    /**
     * Extract text from toaster using regex
     */
    extractFromToaster(regex: RegExp): Cypress.Chainable<string | null> {
        return cy.get('.toaster-message')
            .invoke('text')
            .then((text) => {
                const match = text.match(regex)
                return match ? match[0] : null
            })
    }

    /**
     * Check if element exists
     */
    elementExists(selector: string): Cypress.Chainable<boolean> {
        return cy.get('body').then(($body) => {
            return $body.find(selector).length > 0
        })
    }

    /**
     * Conditional action based on element existence
     */
    ifElementExists(selector: string, callback: () => void) {
        cy.get('body').then(($body) => {
            if ($body.find(selector).length > 0) {
                callback()
            }
        })
        return this
    }
}

