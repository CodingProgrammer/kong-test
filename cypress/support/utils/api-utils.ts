/**
 * API Utility Functions
 * Helper functions for Kong Admin API interactions
 */

import TestConfig from '../config/test-config'

const ADMIN_API_URL = TestConfig.urls.adminAPI

/**
 * Create service via API
 */
export function createServiceViaAPI(serviceData: {
    name?: string
    url?: string
    host?: string
    port?: number
    path?: string
    protocol?: string
}): Cypress.Chainable<any> {
    return cy.request({
        method: 'POST',
        url: `${ADMIN_API_URL}/services`,
        body: serviceData,
        failOnStatusCode: false,
    })
}

/**
 * Get service by ID via API
 */
export function getServiceViaAPI(serviceId: string): Cypress.Chainable<any> {
    return cy.request({
        method: 'GET',
        url: `${ADMIN_API_URL}/services/${serviceId}`,
        failOnStatusCode: false,
    })
}

/**
 * Update service via API
 */
export function updateServiceViaAPI(serviceId: string, serviceData: any): Cypress.Chainable<any> {
    return cy.request({
        method: 'PATCH',
        url: `${ADMIN_API_URL}/services/${serviceId}`,
        body: serviceData,
        failOnStatusCode: false,
    })
}

/**
 * Delete service via API
 */
export function deleteServiceViaAPI(serviceId: string): Cypress.Chainable<any> {
    return cy.request({
        method: 'DELETE',
        url: `${ADMIN_API_URL}/services/${serviceId}`,
        failOnStatusCode: false,
    })
}

/**
 * List all services via API
 */
export function listServicesViaAPI(): Cypress.Chainable<any> {
    return cy.request({
        method: 'GET',
        url: `${ADMIN_API_URL}/services`,
        failOnStatusCode: false,
    })
}

/**
 * Create route via API
 */
export function createRouteViaAPI(serviceId: string, routeData: any): Cypress.Chainable<any> {
    return cy.request({
        method: 'POST',
        url: `${ADMIN_API_URL}/services/${serviceId}/routes`,
        body: routeData,
        failOnStatusCode: false,
    })
}

/**
 * Delete route via API
 */
export function deleteRouteViaAPI(routeId: string): Cypress.Chainable<any> {
    return cy.request({
        method: 'DELETE',
        url: `${ADMIN_API_URL}/routes/${routeId}`,
        failOnStatusCode: false,
    })
}

/**
 * Add plugin to service via API
 */
export function addPluginToServiceViaAPI(serviceId: string, pluginData: any): Cypress.Chainable<any> {
    return cy.request({
        method: 'POST',
        url: `${ADMIN_API_URL}/services/${serviceId}/plugins`,
        body: pluginData,
        failOnStatusCode: false,
    })
}

/**
 * Delete plugin via API
 */
export function deletePluginViaAPI(pluginId: string): Cypress.Chainable<any> {
    return cy.request({
        method: 'DELETE',
        url: `${ADMIN_API_URL}/plugins/${pluginId}`,
        failOnStatusCode: false,
    })
}

/**
 * Cleanup all test services via API
 */
export function cleanupTestServicesViaAPI(prefix: string = 'test-service'): Cypress.Chainable<void> {
    return listServicesViaAPI().then((response) => {
        if (response.status === 200 && response.body.data) {
            const testServices = response.body.data.filter((service: any) =>
                service.name && service.name.startsWith(prefix)
            )

            testServices.forEach((service: any) => {
                deleteServiceViaAPI(service.id)
            })
        }
    })
}

/**
 * Wait for service to be ready
 */
export function waitForServiceReady(serviceId: string, maxRetries: number = 10): Cypress.Chainable<boolean> {
    let retries = 0

    const checkService = (): Cypress.Chainable<boolean> => {
        return getServiceViaAPI(serviceId).then((response) => {
            if (response.status === 200) {
                return cy.wrap(true)
            } else if (retries < maxRetries) {
                retries++
                cy.wait(1000)
                return checkService()
            } else {
                return cy.wrap(false)
            }
        })
    }

    return checkService()
}

