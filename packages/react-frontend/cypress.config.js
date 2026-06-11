import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // The Vite dev server. Start it with `npm run dev` before running Cypress.
    baseUrl: "http://localhost:5173",
    // Integration tests only — no code coverage instrumentation.
    video: false,
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js"
  },
  env: {
    // Express API base, used when a spec talks to / stubs the backend.
    apiBaseUrl: "http://localhost:8000"
  }
});
