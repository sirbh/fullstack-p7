Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3001/api/login", {
    username, password
  }).then(({ body }) => {
    localStorage.setItem("user", JSON.stringify(body));
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("addBlog", ({ title, author, url, likes }) => {
  cy.request({
    url: "http://localhost:3001/api/blogs",
    method: "POST",
    body: { title, author, url, likes:likes?likes:0 },
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user")).token
      }`,
    },
  });
  cy.visit("http://localhost:3000");
});