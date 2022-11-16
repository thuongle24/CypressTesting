const PageObject = require("../PageObject");

class HomePage extends PageObject {
  constructor(driver, pageConstructor) {
    super(driver, pageConstructor);
    this.searchWeatherInput = "#weather-widget .search-container input";
    this.searchButton = "#weather-widget .search button";
    this.differentWeatherSelector = "#weather-widget .owm-switch";
    this.weatherSwitchContainer = "#weather-widget .switch-container";
    this.searchDropdownMenu = "#weather-widget .search-dropdown-menu li";
    this.titleContentSelector = "#weather-widget .section-content h2";
    this.loadingBarSelector = ".owm-loader-container .owm-loader";
  }

  async searchWeatherInCity(city) {
    await this.driver.waitUntilElementVisible(this.searchWeatherInput, 5000);
    await this.driver.waitForElementToBeRemoved(this.loadingBarSelector, 8000);
    await this.driver.setText(this.searchWeatherInput, city);

    await this.driver.waitForElementToBeRemoved(this.loadingBarSelector, 8000);

    const searchButton = await this.driver.findElements(this.searchButton);
    console.log(searchButton.length)
    /*await searchButton.click();

    await this.driver.waitUntilElementVisible(this.searchDropdownMenu, 5000);
    const firstCity = await this.driver.findElements(this.searchDropdownMenu);
    firstCity[0].click();*/
  }

  async getCurrentContentTitle() {
    return await this.driver.getElementText(this.titleContentSelector);
  }
}

module.exports = HomePage;
