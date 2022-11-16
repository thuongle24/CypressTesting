const config = require("config");

class PageObject {
  constructor(driver, pageConstructor, url = "", urlPrefix = true) {
    this.baseUrl = config.get("baseUrl");
    this.driver = driver;
    this.pageConstructor = pageConstructor;
    this.url = `${this.baseUrl}/${url}`;
  }

  async getPageData() {
    return {};
  }
}

module.exports = PageObject;
