"use strict";
const expect = require("expect").default;
const keys = require("selenium-webdriver").Key;
const PageComponent = require("./PageComponent");
class Header extends PageComponent {
    constructor(driver, pageConstructor) {
        super(driver, pageConstructor);
        this.searchInput = "#desktop-menu input";
    }
    async searchWeather(city) {
        if (city !== "<blank>")
            await this.driver.setText(this.searchInput, city);
        await this.driver.sendKeys(this.searchInput, keys.chord(keys.RETURN));
    }
}
module.exports = Header;
//# sourceMappingURL=Header.js.map