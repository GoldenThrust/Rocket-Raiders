describe("template spec", () => {
  it("Visit HomePage", () => {
    cy.visit("/");
    cy.url().should("include", "/auth/login");
  });

  it("Login", () => {
    cy.visit("/auth/login").then(() => {
      // cy.get('input')
      // cy.get('input[name="username"]').type("adenijiolajid01@gmail.com");
      // cy.get('input[name="password"]').type("12345678");
      // cy.get('button[type="submit"]').click();
    });
  });
});
