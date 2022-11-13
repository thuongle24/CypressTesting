const config = require("config");

class PageObject {
    constructor(driver, pageConstructor) {
        this.driver = driver;
        this.pageConstructor = pageConstructor;
        this.baseUrl= config.get("baseUrl");
    }
}   
module.exports = PageObject;