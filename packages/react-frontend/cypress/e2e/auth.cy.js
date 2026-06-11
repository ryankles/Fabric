// Integration tests for the auth flow.
//
// These run against the real Vite dev server (`npm run dev`). The backend is
// stubbed with cy.intercept so the spec is deterministic and needs no Mongo —
// for a full end-to-end run, start the Express server + Mongo and drop the
// signin/me intercepts in the "logs in" test.

describe("Auth pages", () => {
  beforeEach(() => {
    cy.stubLoggedOut();
  });

  it("shows the login screen by default", () => {
    cy.visit("/login");

    cy.contains("h1", "Welcome Back").should("be.visible");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    // Login form has no name/role fields.
    cy.get('input[name="name"]').should("not.exist");
  });

  it("navigates to the signup screen and back", () => {
    cy.visit("/login");

    cy.contains("a", "Sign Up").click();
    cy.contains("h1", "Create Account").should("be.visible");
    cy.get('input[name="name"]').should("exist");
    cy.get('select[name="role"]').should("exist");

    cy.contains("a", "Log In").click();
    cy.contains("h1", "Welcome Back").should("be.visible");
  });

  it("shows an error message when login fails", () => {
    cy.intercept("POST", "**/api/auth/signin", { statusCode: 401 }).as(
      "signin"
    );

    cy.visit("/login");
    cy.get('input[name="email"]').type("nobody@example.com");
    cy.get('input[name="password"]').type("wrongpass");
    cy.contains("button", "Log In").click();

    cy.wait("@signin");
    cy.contains("Login failed").should("be.visible");
  });

  it("logs in and lands on the dashboard", () => {
    cy.intercept("POST", "**/api/auth/signin", { statusCode: 200 }).as(
      "signin"
    );
    // The app checks /api/auth/me on mount (must be logged-out so the form
    // renders) and again after a successful signin (now the real user).
    // `times: 1` makes only the first call 401; later calls fall through to
    // the 200 below. Last-registered interceptor wins, so order matters.
    cy.intercept("GET", "**/api/auth/me", {
      statusCode: 200,
      body: { name: "Ada Lovelace", role: "teacher" }
    }).as("me");
    cy.intercept(
      { method: "GET", url: "**/api/auth/me", times: 1 },
      { statusCode: 401 }
    ).as("meInitial");

    cy.visit("/login");
    cy.get('input[name="email"]').type("ada@example.com");
    cy.get('input[name="password"]').type("correcthorse");
    cy.contains("button", "Log In").click();

    cy.wait("@signin");
    cy.contains("h1", "Fabric").should("be.visible");
    cy.contains("Ada Lovelace").should("be.visible");
    cy.contains("button", "Grades").should("be.visible");
  });
});
