const { Given, When, Then } = require("@cucumber/cucumber");
const pageConstants = require("../../../page-objects/constants");
const expect = require("expect").default;

When("I search the weather in {string} from header", async function (city) {
  await this.currentPage.searchWeatherFromHeader(city);
});

Then("search page is displayed", async function () {
  const pageTitle = await this.driver.getTitle();
  expect(pageTitle).toContain("Find");
});
