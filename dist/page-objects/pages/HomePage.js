"use strict";
const PageObject = require("../PageObject");
const Header = require("../components/Header");
const { retry } = require("../../utils/retry");
class HomePage extends PageObject {
    constructor(driver, pageConstructor) {
        super(driver, pageConstructor);
        this.searchWeatherInput = "#weather-widget .search-container input";
        this.searchButton = "#weather-widget .search button";
        this.differentWeatherSelector = "#weather-widget .owm-switch";
        this.weatherSwitchContainer = "#weather-widget .switch-container .option";
        this.searchDropdownMenu = "#weather-widget .search-dropdown-menu li";
        this.titleContentSelector = "#weather-widget .section-content h2";
        this.notFoundContentSelector = "#weather-widget .not-found.notFoundOpen";
        this.notificationWidget = ".widget-notification";
        this.currentLocationIcon = "#weather-widget .icon-current-location";
        this.header = new Header(this.driver, this.pageConstructor);
        this.currentTemperatureSelector = "#weather-widget .section-content .current-temp";
        this.weatherAlertSelector = "#weather-widget .section-content .weather-alert";
        this.weatherItemSelectors = "#weather-widget .section-content .weather-items li ";
        this.weatherDescriptionSelector = "#weather-widget .current-temp~.bold";
    }
    async clickSearchButton() {
        await retry(async () => {
            try {
                let success = false;
                await this.driver.click(this.searchButton);
                await this.driver.sleep(500);
                const searchDropdown = await this.driver.findElements(this.searchDropdownMenu);
                if (searchDropdown.length > 0) {
                    success = true;
                }
                expect(success).toBe(true);
            }
            catch (err) {
                // No need to do anything here
            }
        });
    }
    async searchWeatherInCity(city, isCityValid = true) {
        await this.driver.setText(this.searchWeatherInput, city);
        await this.spinner.waitForSpinnerToDisappear();
        await this.clickSearchButton();
        if (isCityValid) {
            await this.driver.click(this.searchDropdownMenu);
            await this.spinner.waitForSpinnerToDisappear();
        }
    }
    async getCurrentContentTitle() {
        return await this.driver.getElementText(this.titleContentSelector);
    }
    async isNotFoundContentDisplay() {
        return await this.driver.isElementVisible(this.notFoundContentSelector);
    }
    async isNotificationWidgetDisplay() {
        return await this.driver.isElementVisible(this.notificationWidget);
    }
    async getNotificationWidgetText() {
        return await this.driver.getText(this.notificationWidget);
    }
    async locateCurrentLocation() {
        await this.driver.click(this.currentLocationIcon);
        await this.driver.acceptAlert();
        await this.spinner.waitForSpinnerToDisappear();
    }
    async searchWeatherFromHeader(city) {
        await this.header.searchWeather(city);
        await this.spinner.waitForSpinnerToDisappear();
    }
    async selectFahrenheit() {
        const metricSelectors = await this.driver.findElements(this.weatherSwitchContainer);
        await metricSelectors[1].click();
        await this.spinner.waitForSpinnerToDisappear();
    }
    async selectCelsius() {
        const metricSelectors = await this.driver.findElements(this.weatherSwitchContainer);
        await metricSelectors[0].click();
        await this.spinner.waitForSpinnerToDisappear();
    }
    async getWeatherWidgetData() {
        let data = {};
        const citySelector = await this.driver.findElement(this.titleContentSelector);
        data.city = await citySelector.getText();
        const temperatureSelector = await this.driver.findElement(this.currentTemperatureSelector);
        data.currentTemperature = await temperatureSelector.getText();
        const weatherAlertSelector = await this.driver.findElements(this.weatherAlertSelector);
        if (weatherAlertSelector.length > 0)
            data.weatherAlertText = await weatherAlertSelector.getText();
        const weatherItemSelectors = await this.driver.findElements(this.weatherItemSelectors);
        let weatherItem = {};
        weatherItem.windLine = await weatherItemSelectors[0].getText();
        weatherItem.pressure = await weatherItemSelectors[1].getText();
        weatherItem.humidity = await weatherItemSelectors[2].getText();
        weatherItem.dewPoint = await weatherItemSelectors[3].getText();
        weatherItem.visibility = await weatherItemSelectors[4].getText();
        data.weatherList = weatherItem;
        const weatherDescriptionSelector = await this.driver.findElement(this.weatherDescriptionSelector);
        data.weatherDescription = await weatherDescriptionSelector.getText();
        return data;
    }
}
module.exports = HomePage;
//# sourceMappingURL=HomePage.js.map