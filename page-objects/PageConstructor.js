const Pages = require("./index");

class PageConstructor {
  constructor(driver) {
    this.driver = driver;
    this.pages = {};
    Object.values(Pages).map((k) => (this.pages[k.name] = k.page), this);
  }

  constructPage(pageName, ...pageArguments) {
    return new this.pages[pageName](this.driver, this, ...pageArguments);
  }
}

module.exports = PageConstructor;
