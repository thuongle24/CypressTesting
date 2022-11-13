const { Given, When, Then } = require("@cucumber/cucumber");
const config = require("config");
const LoginPage = require("../../../page-objects/LoginPage");
const PageObject = require("../../../page-objects/PageObject");

const loginPage = new LoginPage();

Given("I navigate to Login page", async function() {
    console.log(loginPage.getUrl())
    this.driver.get(loginPage.getUrl())
})