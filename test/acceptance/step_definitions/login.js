const { Given, When, Then } = require("@cucumber/cucumber");
const config = require("config");
const pageConstants = require("../../../page-objects/constants");


Given("I navigate to Login page", async function() {
    console.log(pageConstants.LOGIN)
    this.navigateToPage(pageConstants.LOGIN);
   
})