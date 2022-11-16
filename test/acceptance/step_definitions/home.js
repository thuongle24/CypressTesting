const { Given, When, Then } = require("@cucumber/cucumber");
const pageConstants = require("../../../page-objects/constants");
const expect = require('expect').default;

Given("I am on the Home page", async function() {
    const home = this.pageConstructor.constructPage(pageConstants.HOME);
    await this.driver.navigateToPage(home);
    this.currentPage = home;
})

When("I search the weather in {string}", async function(city) {
   this.currentPage.searchWeatherInCity(city);
})

Then("the search {string} shows correspondingly", async function(result) {
    const actual = await this.currentPage.getCurrentContentTitle();
    expect(actual).toContain(result);
 })

