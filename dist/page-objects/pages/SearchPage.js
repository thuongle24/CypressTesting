"use strict";
const PageObject = require("../PageObject");
class SearchPage extends PageObject {
    constructor(driver, pageConstructor) {
        super(driver, pageConstructor);
        this.searchInput = "#searchform input";
        this.searchButton = "#searchform button";
        this.searchTableRowSelector = "#forecast_list_ul .table tr";
        this.alertWarningSelector = ".alert-warning";
    }
    async getSearchResultData() {
        const searchRows = await this.driver.findElements(this.searchTableRowSelector);
        let resultArr = [];
        for (const row of searchRows) {
            let resultObj = {};
            const tdSelectors = await row.findElements("td");
            const imgSelector = await tdSelectors[0].findElement("img");
            const weatherImg = await imgSelector.getAttribute("src");
            resultObj.weatherImage = weatherImg;
            const weatherHeadersSelectors = await tdSelectors[1].findElements("b");
            const cityText = await weatherHeadersSelectors[0].getText();
            const weatherConditionText = await weatherHeadersSelectors[1].getText();
            resultObj.weatherSummary = `${cityText} ${weatherConditionText}`;
            const cityFlagSelector = await tdSelectors[1].findElement("img");
            const cityFlag = await cityFlagSelector.getAttribute("src");
            resultObj.cityFlagImage = cityFlag;
            const weatherDetailsSelectors = await tdSelectors[1].findElements("p");
            const weatherDetails = await weatherDetailsSelectors[0].getText();
            resultObj.weatherDetails = weatherDetails;
            const geoCoords = await weatherDetailsSelectors[1].getText();
            resultObj.geoCoordinate = geoCoords;
            resultArr.push(resultObj);
        }
        return resultArr;
    }
    async isAlertWarningDisplay() {
        return await this.driver.isElementVisible(this.alertWarningSelector);
    }
}
module.exports = SearchPage;
//# sourceMappingURL=SearchPage.js.map