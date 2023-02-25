describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      username: "testUser",
      password: "secretpass",
      name: "testname",
    };
    cy.request("POST", "http://localhost:3001/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.get("input[name=Username]");
    cy.get("input[name=Password]");
    cy.get("button[type=Submit]").contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("input[name=Username]").type("testUser");
      cy.get("input[name=Password]").type("secretpass");
      cy.get("button[type=Submit]").click();
      cy.contains("Blogs");
      cy.contains("testname is logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("input[name=Username]").type("wrongUser");
      cy.get("input[name=Password]").type("secretpass");
      cy.get("button[type=Submit]").click();
      cy.contains("Wrong credentials");
      cy.get("button[type=Submit]").contains("login");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({
        username: "testUser",
        password: "secretpass",
      });
    });

    it("A blog can be created", function () {
      cy.get("button[name=create]").click();
      cy.get("input[name=Title]").type("some title");
      cy.get("input[name=Author]").type("jackson");
      cy.get("input[name=Url]").type("url.com");
      cy.get("button[type=submit]").click();
      cy.contains("some title");
      cy.contains("jackson");
      cy.contains("new blog some title by jackson added");
    });

    describe("When logged in and a blog exist", function () {
      beforeEach(function () {
        cy.addBlog({
          title: "testTitle",
          author: "testAuthor",
          url: "testUrl",
        });
      });

      it("A blog can be liked", function () {
        cy.get("button[name=view]").click();
        cy.contains(0);
        cy.get("button[name=like]").click();
        cy.contains(1);
      });

      it("A blog can be deleted", function () {
        cy.get("button[name=view]").click();
        cy.get("button[name=delete]").click();
        cy.get("div[name=blogs]")
          .should("not.contain", "testAuthor")
          .and("not.contain", "testTitle");
      });

      describe("When logged in user cannot delete other users blog", function () {
        beforeEach(function () {
          const user = {
            username: "testUser2",
            password: "secretforuser2",
            name: "testUser2",
          };
          cy.request("POST", "http://localhost:3001/api/users", user);
          cy.login({
            username: "testUser2",
            password: "secretforuser2",
          });
        });

        it("A blog cannot be deleted by others", function () {
          cy.get("button[name=view]").click();
          cy.get("button[name=delete]").should("not.exist");
        });
      });
    });

    describe("When logged in and multiple blog exist", function () {
      beforeEach(function () {
        cy.addBlog({
          title: "testTitle",
          author: "testAuthor",
          url: "testUrl",
          likes:4
        });
        cy.addBlog({
          title: "testTitle2",
          author: "testAuthor2",
          url: "testUrl2",
          likes:1
        });
        cy.addBlog({
          title: "testTitle3",
          author: "testAuthor3",
          url: "testUrl3",
          likes:6
        });
      });

      it.only("blogs should be sorted",() => {
        cy.get(".blog").eq(0).should("contain", "testTitle3");
        cy.get(".blog").eq(1).should("contain", "testTitle");
        cy.get(".blog").eq(2).should("contain", "testTitle2");
      });
    });
  });
});
