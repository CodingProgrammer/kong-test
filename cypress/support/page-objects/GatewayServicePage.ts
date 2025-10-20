import { BasePage } from './BasePage'

/**
 * Gateway Service Page Selectors
 * Centralized selector management for better maintainability
 */
const Selectors = {
    // Workspace navigation
    workspaceLink: (name: string) => `[data-testid="workspace-link-${name}"]`,

    // Sidebar navigation
    sidebarGatewayServices: '[data-testid="sidebar-item-gateway-services"]',

    // Create service buttons
    emptyStateButton: '[data-testid="empty-state-action"]',
    emptyStateIcon: '[data-testid="empty-state"]',
    toolbarAddButton: '[data-testid="toolbar-add-gateway-service"]',

    // Service form inputs
    urlInput: '[data-testid="gateway-service-url-input"]',
    nameInput: '[data-testid="gateway-service-name-input"]',
    hostInput: '[data-testid="gateway-service-host-input"]',
    portInput: '[data-testid="gateway-service-port-input"]',
    pathInput: '[data-testid="gateway-service-path-input"]',

    // Form buttons
    submitButton: '[data-testid="service-create-form-submit"]',
    cancelButton: '[data-testid="service-create-form-cancel"]',

    // Form validation
    formError: '[data-testid="form-error"]',
    formGroupFields: '.gateway-service-form-group-fields',
    helpText: '.help-text',
    inputError: '.k-input-error',

    // Service list and actions
    serviceItem: (name: string) => `[data-testid="${name}"]`,
    actionsButton: '[data-testid="actions"]',
    deleteAction: '[data-testid="action-entity-delete"]',
    editAction: '[data-testid="action-entity-edit"]',

    // Routes
    serviceRoutesTab: '[data-testid="service-routes"]',
    routeNameInput: '[data-testid="route-form-name"]',
    routeTagsInput: '[data-testid="route-form-tags"]',
    routePathInput: (index: number) => `[data-testid="route-form-paths-input-${index}"]`,
    routeSubmitButton: '[data-testid="route-create-form-submit"]',
    routeItem: (name: string) => `[data-testid="${name}"]`,

    // Modal and confirmation
    confirmationInput: '[data-testid="confirmation-input"]',
    confirmationInputByLabel: (name: string) => `[aria-label="Type '${name}' to confirm your action."]`,
    modalActionButton: '[data-testid="modal-action-button"]',

    // Toast and alerts
    toasterMessage: '.toaster-message',
    alertMessage: '.alert-message',
    closeIcon: '[data-testid="kui-icon-svg-close-icon"]',

    // Filter
    filterNameInput: '#filter-name',
    applyFilterButton: '[data-testid="apply-filter"]',
}

/**
 * Gateway Service Page Object
 * Handles all interactions with Gateway Services
 */
export class GatewayServicePage extends BasePage {
    /**
     * Navigate to workspaces page
     */
    navigateToWorkspaces() {
        cy.visit('/workspaces')
        cy.waitForPageLoad()
        return this
    }

    /**
     * Select workspace by name
     */
    selectWorkspace(name: string = 'default') {
        cy.get(Selectors.workspaceLink(name)).click()
        cy.waitForPageLoad()
        return this
    }

    /**
     * Navigate to Gateway Services via sidebar
     */
    navigateToGatewayServices() {
        cy.get(Selectors.sidebarGatewayServices).click()
        cy.waitForPageLoad()
        cy.waitForPageDataLoaded()
        cy.wait(1000) // Wait for UI to stabilize
        return this
    }

    /**
     * Verify license alert message
     */
    verifyLicenseAlert() {
        cy.get('body').then(($body) => {
            if ($body.find(Selectors.alertMessage).length > 0) {
                cy.log('License warning found')
                cy.get(Selectors.alertMessage)
                    .should('be.visible')
                    .should('contain', 'No valid Kong Enterprise license configured')
            } else {
                cy.log('No license warning (may be licensed or different environment)')
            }
        })
        return this
    }

    /**
     * Click the appropriate "Create Service" button
     * Handles both empty state and toolbar scenarios
     */
    clickCreateServiceButton() {
        cy.log('Detecting service list state...')

        cy.get('body').then(($body) => {
            const hasEmptyStateButton = $body.find(Selectors.emptyStateButton).length > 0
            const hasEmptyStateText = $body.text().includes('Create your first service') ||
                $body.text().includes('No Gateway Services exist')
            const hasEmptyStateIcon = $body.find(Selectors.emptyStateIcon).length > 0
            const hasToolbarButton = $body.find(Selectors.toolbarAddButton).length > 0

            cy.log(`Detection results:
                - Empty state button: ${hasEmptyStateButton}
                - Empty state text: ${hasEmptyStateText}
                - Empty state icon: ${hasEmptyStateIcon}
                - Toolbar button: ${hasToolbarButton}`)

            const isEmptyState = hasEmptyStateButton || hasEmptyStateText || hasEmptyStateIcon

            if (isEmptyState && !hasToolbarButton) {
                cy.log('Service list is EMPTY - using empty-state-action button')
                cy.get(Selectors.emptyStateButton, { timeout: 10000 })
                    .should('be.visible')
                    .should('not.be.disabled')
                    .click({ force: false })
                cy.log('Clicked empty-state-action button')
            } else if (hasToolbarButton) {
                cy.log('Service list is NOT EMPTY - using toolbar-add-gateway-service button')
                cy.get(Selectors.toolbarAddButton, { timeout: 10000 })
                    .should('be.visible')
                    .should('not.be.disabled')
                    .click({ force: false })
                cy.log('Clicked toolbar-add-gateway-service button')
            } else {
                cy.log('Using fallback strategy...')
                const selectors = [
                    Selectors.emptyStateButton,
                    Selectors.toolbarAddButton,
                    'button:contains("New gateway service")',
                    'button:contains("New Gateway Service")',
                    'a[href*="/services/create"]'
                ]

                let clicked = false
                for (const selector of selectors) {
                    if ($body.find(selector).length > 0) {
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
            }
        })

        cy.wait(500)
        cy.log('Create service button clicked successfully')
        return this
    }

    /**
     * Fill service URL
     */
    fillServiceUrl(url: string) {
        cy.get(Selectors.urlInput)
            .should('be.visible')
            .clear()
            .type(url)
        return this
    }

    /**
     * Verify service URL value
     */
    verifyServiceUrl(url: string) {
        cy.get(Selectors.urlInput).should('have.value', url)
        return this
    }

    /**
     * Fill service name
     */
    fillServiceName(name: string) {
        cy.get(Selectors.nameInput)
            .should('be.visible')
            .clear()
            .type(name)
        return this
    }

    /**
     * Verify service name value
     */
    verifyServiceName(name: string) {
        cy.get(Selectors.nameInput).should('have.value', name)
        return this
    }

    /**
     * Submit service creation form
     */
    submitForm() {
        cy.get(Selectors.submitButton)
            .should('be.visible')
            .should('contain', 'Save')
            .click()
        return this
    }

    /**
     * Verify form help text
     */
    verifyFormHelpText(text: string) {
        cy.get(Selectors.formGroupFields)
            .find(Selectors.helpText)
            .contains(text)
        return this
    }

    /**
     * Verify form error
     */
    verifyFormError(errorText: string) {
        cy.get(Selectors.formError).contains(errorText)
        return this
    }

    /**
     * Verify input error
     */
    verifyInputError(errorText: string) {
        cy.get(Selectors.inputError)
            .should('be.visible')
            .should('contain', errorText)
        return this
    }

    /**
     * Verify toaster message and mark service as created
     */
    verifyServiceCreated(serviceName: string) {
        cy.get(Selectors.toasterMessage, { timeout: 10000 })
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                if (text.includes('successfully created')) {
                    cy.wrap(true).as('serviceCreated')
                    cy.log(`Service ${serviceName} created successfully, will be automatically cleaned up after test`)
                } else {
                    cy.log(`Service creation was not successful, skipping cleanup marking`)
                }
            })

        cy.get(Selectors.toasterMessage)
            .should('contain', serviceName)
            .should('contain', 'successfully created!')

        return this
    }

    /**
     * Close toaster message
     */
    closeToaster() {
        cy.get(Selectors.closeIcon).click()
        return this
    }

    /**
     * Navigate to service routes tab
     */
    navigateToRoutesTab() {
        cy.get(Selectors.serviceRoutesTab).click()
        return this
    }

    /**
     * Click empty state action (for adding first route)
     */
    clickEmptyStateAction() {
        cy.get(Selectors.emptyStateButton).click()
        return this
    }

    /**
     * Fill route name
     */
    fillRouteName(name: string) {
        cy.get(Selectors.routeNameInput)
            .should('be.visible')
            .clear()
            .type(name)
        return this
    }

    /**
     * Verify route name value
     */
    verifyRouteName(name: string) {
        cy.get(Selectors.routeNameInput).should('have.value', name)
        return this
    }

    /**
     * Fill route tags
     */
    fillRouteTags(tags: string) {
        cy.get(Selectors.routeTagsInput)
            .should('be.visible')
            .clear()
            .type(tags)
        return this
    }

    /**
     * Verify route tags value
     */
    verifyRouteTags(tags: string) {
        cy.get(Selectors.routeTagsInput).should('have.value', tags)
        return this
    }

    /**
     * Fill route path
     */
    fillRoutePath(path: string, index: number = 1) {
        cy.get(Selectors.routePathInput(index))
            .should('be.visible')
            .clear()
            .type(path)
        return this
    }

    /**
     * Verify route path value
     */
    verifyRoutePath(path: string, index: number = 1) {
        cy.get(Selectors.routePathInput(index)).should('have.value', path)
        return this
    }

    /**
     * Submit route creation form
     */
    submitRouteForm() {
        cy.get(Selectors.routeSubmitButton)
            .should('be.visible')
            .should('contain', 'Save')
            .click()
        return this
    }

    /**
     * Verify route created
     */
    verifyRouteCreated(routeName: string) {
        cy.get(Selectors.toasterMessage)
            .should('contain', routeName)
            .should('contain', 'successfully created!')
        return this
    }

    /**
     * Delete a route by name
     */
    deleteRoute(routeName: string) {
        cy.log(`Starting to delete Route: ${routeName}`)

        cy.get(Selectors.routeItem(routeName))
            .should('be.visible')
            .find(Selectors.actionsButton)
            .click()

        cy.get(Selectors.routeItem(routeName))
            .find(Selectors.deleteAction)
            .click()

        cy.get(Selectors.confirmationInput)
            .should('be.visible')
            .clear()
            .type(routeName)

        cy.get(Selectors.modalActionButton)
            .should('be.visible')
            .click()

        cy.get(Selectors.toasterMessage, { timeout: 10000 })
            .should('be.visible')
            .should('contain', routeName)
            .should('contain', 'successfully deleted!')

        cy.log(`Route ${routeName} deleted successfully`)
        return this
    }

    /**
     * Delete a service by name
     */
    deleteService(serviceName: string) {
        cy.log(`Service ${serviceName} found, proceeding with deletion`)

        cy.get(Selectors.serviceItem(serviceName))
            .find(Selectors.actionsButton)
            .click()

        cy.get(Selectors.serviceItem(serviceName))
            .find(Selectors.deleteAction)
            .click()

        cy.get(Selectors.confirmationInputByLabel(serviceName))
            .type(serviceName)

        cy.get(Selectors.modalActionButton)
            .click()

        cy.get(Selectors.toasterMessage, { timeout: 10000 })
            .should('be.visible')
            .should('contain', serviceName)
            .should('contain', 'successfully deleted!')

        cy.get(Selectors.closeIcon)
            .click()

        cy.log(`Service ${serviceName} deleted successfully`)
        return this
    }

    /**
     * Check if service exists
     */
    serviceExists(serviceName: string): Cypress.Chainable<boolean> {
        return cy.get('body').then(($body) => {
            return $body.find(Selectors.serviceItem(serviceName)).length > 0
        })
    }
}
