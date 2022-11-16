const { Given, When, Then } = require("@cucumber/cucumber");
const pageConstants = require("../../../page-objects/constants");

Given("I navigate to Login page", async function() {
    const login = this.pageConstructor.constructPage(pageConstants.LOGIN);
    await this.driver.navigateToPage(login);
    this.currentPage = login;
})

Given("I input invalid username and password", async function() {
   //loginPage.inputInvalidCredentials();
   this.currentPage.inputLoginCredentials();
   
})