/**
 * Service Helper Functions
 * Reusable functions for service-related operations
 */

import { GatewayServicePage, SidebarPage, WorkspacePage } from '../page-objects'

/**
 * Navigate to Gateway Services page
 */
export function navigateToGatewayServices() {
    const workspacePage = new WorkspacePage()
    const sidebarPage = new SidebarPage()

    workspacePage.navigate()
    workspacePage.selectWorkspace('default')
    sidebarPage.navigateToGatewayServices()

    cy.wait(1000) // Wait for UI to stabilize
}

/**
 * Create a basic service with URL
 */
export function createServiceWithUrl(url: string): Cypress.Chainable<string> {
    const servicePage = new GatewayServicePage()

    servicePage.clickCreateServiceButton()
    servicePage.fillServiceUrl(url)
    servicePage.submitForm()

    // Extract service name from toaster
    return servicePage.extractFromToaster(/new-service-\d+/).then((name) => {
        if (name) {
            cy.wrap(name).as('serviceName')
            cy.log(`Service created: ${name}`)
            return name
        }
        throw new Error('Failed to extract service name')
    })
}

/**
 * Create service with route
 */
export function createServiceWithRoute(serviceUrl: string, routeName: string, routePath: string): Cypress.Chainable<string> {
    const servicePage = new GatewayServicePage()

    servicePage.clickCreateServiceButton()
    servicePage.fillServiceUrl(serviceUrl)
    servicePage.clickAddRoute()
    servicePage.fillRouteName(routeName)
    servicePage.fillRoutePath(routePath)
    servicePage.submitForm()

    return servicePage.extractFromToaster(/new-service-\d+/).then((name) => {
        if (name) {
            cy.wrap(name).as('serviceName')
            cy.log(`Service with route created: ${name}`)
            return name
        }
        throw new Error('Failed to extract service name')
    })
}

/**
 * Delete service if exists
 */
export function deleteServiceIfExists(serviceName: string) {
    const workspacePage = new WorkspacePage()
    const sidebarPage = new SidebarPage()
    const servicePage = new GatewayServicePage()

    workspacePage.navigate()
    workspacePage.selectWorkspace('default')
    sidebarPage.navigateToGatewayServices()

    servicePage.verifyServiceExists(serviceName).then((exists) => {
        if (exists) {
            servicePage.deleteService(serviceName)
        } else {
            cy.log(`Service ${serviceName} does not exist, skipping deletion`)
        }
    })
}

/**
 * Generate random service name
 */
export function generateServiceName(prefix: string = 'test-service'): string {
    return `${prefix}-${Date.now()}`
}

/**
 * Generate random route name
 */
export function generateRouteName(prefix: string = 'test-route'): string {
    return `${prefix}-${Cypress._.random(0, 1e6)}`
}

