import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'nt2i5c',
    e2e: {
        baseUrl: 'http://localhost:8002',
        viewportWidth: 1920,
        viewportHeight: 1080,
        video: true,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 10000,
        watchForFileChanges: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
})

