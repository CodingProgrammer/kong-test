/// <reference types="cypress" />

/**
 * Gateway Service Example using Page Object Model
 * This file demonstrates how to use the Page Object Model pattern
 * to write clean, maintainable tests
 */

import { WorkspacePage, SidebarPage, GatewayServicePage } from '../../support/page-objects'
import { navigateToGatewayServices, deleteServiceIfExists } from '../../support/helpers/service-helper'

describe('Gateway Service - POM Example', () => {
    let workspacePage: WorkspacePage
    let sidebarPage: SidebarPage
    let servicePage: GatewayServicePage
    let serviceName: string | undefined

    before(() => {
        cy.fixture('test-data').as('testData')
    })

    beforeEach(() => {
        // Initialize page objects
        workspacePage = new WorkspacePage()
        sidebarPage = new SidebarPage()
        servicePage = new GatewayServicePage()

        serviceName = undefined
        cy.wrap(false).as('serviceCreated')
    })

    afterEach(function () {
        // Cleanup
        cy.get('@serviceCreated').then((created) => {
            if (!created || !serviceName) {
                cy.log('Service creation was not successful, skipping cleanup')
                return
            }
            deleteServiceIfExists(serviceName)
        })
    })

    it('should create service with valid URL - using Page Objects', function () {
        cy.wrap(false).as('serviceCreated')

        // Step 1: Navigate to workspaces
        workspacePage.navigate()

        // Step 2: Verify license warning (optional)
        workspacePage.verifyAlertMessage('No valid Kong Enterprise license configured')

        // Step 3: Select default workspace
        workspacePage.selectWorkspace('default')

        // Step 4: Navigate to Gateway Services
        sidebarPage.navigateToGatewayServices()

        // Wait for UI to stabilize
        cy.wait(1000)

        // Step 5: Click create service button
        servicePage.clickCreateServiceButton()

        // Step 6: Fill service URL
        const testUrl = this.testData.services.valid.url
        servicePage.fillServiceUrl(testUrl)

        // Step 7: Submit form
        servicePage.submitForm()

        // Mark service as created
        cy.wrap(true).as('serviceCreated')

        // Step 8: Verify success message and extract service name
        servicePage.verifyToasterMessage(['successfully created!'])
        servicePage.extractFromToaster(/new-service-\d+/).then((name) => {
            if (name) {
                serviceName = name
                cy.wrap(serviceName).as('serviceName')
                cy.log(`✅ Service created: ${serviceName}`)
            }
        })

        // Step 9: Close toaster
        servicePage.closeToaster()

        cy.log('✅ Test completed successfully')
    })

    it('should show error for invalid URL - using Page Objects', function () {
        cy.wrap(false).as('serviceCreated')

        // Navigate to service creation page
        navigateToGatewayServices()
        cy.wait(1000)

        servicePage.clickCreateServiceButton()

        // Fill invalid URL
        const invalidUrl = this.testData.services.invalid.malformedUrl
        servicePage.fillServiceUrl(invalidUrl)

        // Submit form
        servicePage.submitForm()

        // Verify error message
        servicePage.verifyFormError(this.testData.messages.errors.urlInvalid)

        cy.log('✅ Validation working as expected')
    })

    it('should show error for empty URL - using Page Objects', function () {
        cy.wrap(false).as('serviceCreated')

        // Navigate to service creation page
        navigateToGatewayServices()
        cy.wait(1000)

        servicePage.clickCreateServiceButton()

        // Submit form without filling URL
        servicePage.submitForm()

        // Verify error message
        servicePage.verifyFormError(this.testData.messages.errors.urlRequired)

        cy.log('✅ Required field validation working')
    })

    it('should create service with route - using Page Objects', function () {
        cy.wrap(false).as('serviceCreated')

        // Navigate to service creation page
        navigateToGatewayServices()
        cy.wait(1000)

        servicePage.clickCreateServiceButton()

        // Fill service URL
        const testUrl = 'https://api.kong-air.com/routeservice'
        servicePage.fillServiceUrl(testUrl)

        // Add route
        servicePage.clickAddRoute()

        const routeName = `test-route-${Cypress._.random(0, 1e6)}`
        servicePage.fillRouteName(routeName)
        servicePage.fillRoutePath('/testpath')

        // Submit form
        servicePage.submitForm()

        cy.wrap(true).as('serviceCreated')

        // Verify success
        servicePage.verifyToasterMessage(['successfully created!'])
        servicePage.extractFromToaster(/new-service-\d+/).then((name) => {
            if (name) {
                serviceName = name
                cy.wrap(serviceName).as('serviceName')
                cy.log(`✅ Service with route created: ${serviceName}`)
            }
        })

        servicePage.closeToaster()

        cy.log('✅ Service with route created successfully')
    })

    // Example: Chaining page object methods
    it('should demonstrate method chaining', function () {
        cy.wrap(false).as('serviceCreated')

        // All operations in a fluent chain
        workspacePage
            .navigate()
            .selectWorkspace('default')

        sidebarPage
            .navigateToGatewayServices()
            .waitForDataLoaded()

        cy.wait(1000)

        servicePage
            .clickCreateServiceButton()
            .fillServiceUrl('https://api.example.com')
            .submitForm()

        cy.wrap(true).as('serviceCreated')

        servicePage
            .verifyToasterMessage(['successfully created!'])
            .extractFromToaster(/new-service-\d+/).then((name) => {
                if (name) {
                    serviceName = name
                    cy.wrap(serviceName).as('serviceName')
                }
            })

        servicePage.closeToaster()

        cy.log('✅ Method chaining works perfectly')
    })
})

