import { BasePage } from './BasePage'

/**
 * Gateway Service Page Object
 * Handles all interactions with Gateway Services
 */
export class GatewayServicePage extends BasePage {
    /**
     * Click the appropriate "Create Service" button
     * Handles both empty state and toolbar scenarios
     */
    clickCreateServiceButton() {
        cy.get('body').then(($body) => {
            const hasEmptyState = $body.find('[data-testid="empty-state-action"]').length > 0
            const hasEmptyStateText = $body.text().includes('Create your first service')
            const hasEmptyStateIcon = $body.find('[data-testid="empty-state"]').length > 0

            if (hasEmptyState || hasEmptyStateText || hasEmptyStateIcon) {
                cy.log('Service list is empty, using empty-state-action button')
                this.clickByTestId('empty-state-action')
            } else {
                cy.log('Service list is not empty, using toolbar-add-gateway-service button')
                cy.get('body').then(($body) => {
                    const toolbarButton = $body.find('[data-testid="toolbar-add-gateway-service"]')
                    const addButton = $body.find('[data-testid="add-gateway-service"]')
                    const createButton = $body.find('button:contains("New gateway service")')

                    if (toolbarButton.length > 0) {
                        cy.get('[data-testid="toolbar-add-gateway-service"]').click()
                    } else if (addButton.length > 0) {
                        cy.get('[data-testid="add-gateway-service"]').click()
                    } else if (createButton.length > 0) {
                        cy.get('button:contains("New gateway service")').click()
                    } else {
                        cy.get('button').contains(/New|Add|Create/i).first().click()
                    }
                })
            }
        })
        return this
    }

    /**
     * Fill service URL
     */
    fillServiceUrl(url: string) {
        this.typeByTestId('gateway-service-url-input', url)
        return this
    }

    /**
     * Fill service name
     */
    fillServiceName(name: string) {
        this.typeByTestId('gateway-service-name-input', name)
        return this
    }

    /**
     * Fill service host
     */
    fillServiceHost(host: string) {
        this.typeByTestId('gateway-service-host-input', host)
        return this
    }

    /**
     * Fill service port
     */
    fillServicePort(port: string) {
        this.typeByTestId('gateway-service-port-input', port)
        return this
    }

    /**
     * Fill service path
     */
    fillServicePath(path: string) {
        this.typeByTestId('gateway-service-path-input', path)
        return this
    }

    /**
     * Click Add Route button
     */
    clickAddRoute() {
        this.clickByTestId('add-route-button')
        return this
    }

    /**
     * Fill route name
     */
    fillRouteName(name: string) {
        this.typeByTestId('route-name-input', name)
        return this
    }

    /**
     * Fill route path
     */
    fillRoutePath(path: string) {
        this.typeByTestId('route-path-input', path)
        return this
    }

    /**
     * Submit service creation form
     */
    submitForm() {
        this.clickByTestId('service-create-form-submit')
        return this
    }

    /**
     * Cancel form
     */
    cancelForm() {
        this.clickByTestId('service-create-form-cancel')
        return this
    }

    /**
     * Verify form error message
     */
    verifyFormError(errorMessage: string) {
        cy.get('.k-input-error')
            .should('be.visible')
            .should('contain', errorMessage)
        return this
    }

    /**
     * Delete a service by name
     */
    deleteService(serviceName: string) {
        cy.log(`Starting to delete Service: ${serviceName}`)

        this.getByTestId(serviceName)
            .should('be.visible')
            .find('[data-testid="actions"]')
            .click()

        this.getByTestId(serviceName)
            .find('[data-testid="action-entity-delete"]')
            .click()

        cy.get(`[aria-label="Type '${serviceName}' to confirm your action."]`)
            .type(serviceName)

        this.clickByTestId('modal-action-button')

        this.verifyToasterMessage([serviceName, 'successfully deleted!'])
        this.closeToaster()

        cy.log(`Service ${serviceName} deleted successfully`)
        return this
    }

    /**
     * Delete a route by name
     */
    deleteRoute(routeName: string) {
        cy.log(`Starting to delete Route: ${routeName}`)

        this.getByTestId(routeName)
            .should('be.visible')
            .find('[data-testid="actions"]')
            .click()

        this.getByTestId(routeName)
            .find('[data-testid="action-entity-delete"]')
            .click()

        this.typeByTestId('confirmation-input', routeName, { clear: true })
        this.clickByTestId('modal-action-button')

        this.verifyToasterMessage([routeName, 'successfully deleted!'])

        cy.log(`Route ${routeName} deleted successfully`)
        return this
    }

    /**
     * Search/filter services by name
     */
    filterServicesByName(serviceName: string) {
        cy.get('#filter-name')
            .should('be.visible')
            .clear()
            .type(serviceName)

        this.clickByTestId('apply-filter')
        cy.wait(1500) // Wait for filter to apply
        return this
    }

    /**
     * Verify service exists in list
     */
    verifyServiceExists(serviceName: string): Cypress.Chainable<boolean> {
        return this.elementExists(`[data-testid="${serviceName}"]`)
    }

    /**
     * Click on a service to view details
     */
    viewServiceDetails(serviceName: string) {
        this.getByTestId(serviceName).click()
        return this
    }

    /**
     * Edit a service
     */
    editService(serviceName: string) {
        this.getByTestId(serviceName)
            .find('[data-testid="actions"]')
            .click()

        this.getByTestId(serviceName)
            .find('[data-testid="action-entity-edit"]')
            .click()

        return this
    }
}

