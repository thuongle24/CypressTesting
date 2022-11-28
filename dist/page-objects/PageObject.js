"use strict";
const config = require("config");
const Spinner = require("./components/Spinner");
class PageObject {
    constructor(driver, pageConstructor, url = "") {
        this.baseUrl = config.get("baseUrl");
        this.driver = driver;
        this.pageConstructor = pageConstructor;
        this.url = `${this.baseUrl}/${url}`;
        this.spinner = new Spinner(this.driver, this.pageConstructor);
    }
    async getPageData() {
        return {};
    }
}
module.exports = PageObject;
//# sourceMappingURL=PageObject.js.map