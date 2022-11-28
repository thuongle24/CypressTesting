"use strict";
const { Given, When, Then } = require("@cucumber/cucumber");
const pageConstants = require("../../../page-objects/constants");
const expect = require("expect").default;
Then("the {string} card should be displayed on the page", async function (expectedResult) {
    const search = await this.pageConstructor.constructPage(pageConstants.SEARCH);
    this.currentPage = search;
    const searchResultData = await this.currentPage.getSearchResultData();
    for (const result of searchResultData) {
        expect(result.weatherSummary).toContain(expectedResult);
    }
});
Then("not found warning should be displayed on the page", async function () {
    const search = await this.pageConstructor.constructPage(pageConstants.SEARCH);
    this.currentPage = search;
    const isWarningDisplay = await this.currentPage.isAlertWarningDisplay();
    expect(isWarningDisplay).toBe(true);
});
//# sourceMappingURL=search.js.map