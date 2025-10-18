import { BasePage } from './BasePage'

/**
 * Workspace Page Object
 * Handles interactions with the workspace selection page
 */
export class WorkspacePage extends BasePage {
    private readonly path = '/workspaces'

    /**
     * Navigate to workspaces page
     */
    navigate() {
        return this.visit(this.path)
    }

    /**
     * Select a workspace by name
     */
    selectWorkspace(workspaceName: string = 'default') {
        this.clickByTestId(`workspace-link-${workspaceName}`)
        return this
    }

    /**
     * Verify workspace exists
     */
    verifyWorkspaceExists(workspaceName: string) {
        this.getByTestId(`workspace-link-${workspaceName}`).should('exist')
        return this
    }

    /**
     * Get all workspace names
     */
    getAllWorkspaces(): Cypress.Chainable<string[]> {
        return cy.get('[data-testid^="workspace-link-"]')
            .then(($elements) => {
                return $elements.toArray().map(el => el.getAttribute('data-testid')?.replace('workspace-link-', '') || '')
            })
    }
}

