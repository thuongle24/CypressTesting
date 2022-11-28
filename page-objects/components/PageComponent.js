class PageComponent {
  constructor(driver, pageConstructor) {
    this.driver = driver;
    this.pageConstructor = pageConstructor;
  }

  async getPageData() {
    return {};
  }
}

module.exports = PageComponent;
