import { BasePage } from './BasePage'

/**
 * Sidebar Navigation Page Object
 * Handles interactions with the sidebar menu
 */
export class SidebarPage extends BasePage {
    /**
     * Navigate to Gateway Services
     */
    navigateToGatewayServices() {
        this.clickByTestId('sidebar-item-gateway-services')
        this.waitForDataLoaded()
        return this
    }

    /**
     * Navigate to Routes
     */
    navigateToRoutes() {
        this.clickByTestId('sidebar-item-routes')
        this.waitForDataLoaded()
        return this
    }

    /**
     * Navigate to Consumers
     */
    navigateToConsumers() {
        this.clickByTestId('sidebar-item-consumers')
        this.waitForDataLoaded()
        return this
    }

    /**
     * Navigate to Plugins
     */
    navigateToPlugins() {
        this.clickByTestId('sidebar-item-plugins')
        this.waitForDataLoaded()
        return this
    }

    /**
     * Navigate to Upstreams
     */
    navigateToUpstreams() {
        this.clickByTestId('sidebar-item-upstreams')
        this.waitForDataLoaded()
        return this
    }

    /**
     * Navigate to Certificates
     */
    navigateToCertificates() {
        this.clickByTestId('sidebar-item-certificates')
        this.waitForDataLoaded()
        return this
    }

    /**
     * Verify sidebar item is visible
     */
    verifySidebarItemVisible(itemName: string) {
        this.getByTestId(`sidebar-item-${itemName}`).should('be.visible')
        return this
    }
}

