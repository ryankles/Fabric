// Custom Cypress commands shared across specs.

// Stub the "who am I" check the app fires on mount so a fresh visit lands on
// the login screen deterministically without needing the backend running.
Cypress.Commands.add("stubLoggedOut", () => {
  cy.intercept("GET", "**/api/auth/me", { statusCode: 401 }).as("authMe");
});
