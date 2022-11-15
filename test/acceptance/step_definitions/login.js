const { Given, When, Then } = require("@cucumber/cucumber");
const config = require("config");
const pageConstants = require("../../../page-objects/constants");
const LoginPage = require("../../../page-objects/LoginPage");
const loginPage = new LoginPage(this.driver);

Given("I navigate to Login page", async function() {
    this.driver.navigateToPage(loginPage.getUrl())
})

Given("I input invalid username and password", async function() {
   //loginPage.inputInvalidCredentials();
   this.driver.setText('#LogOnModel_UserName','abc')
   
})