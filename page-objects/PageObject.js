const config = require("config");

class PageObject {
    constructor(driver) {
        this.driver = driver;
        this.baseUrl= config.get("baseUrl");
    }

    async navigateToPage(url) {
        const currentUrl = await this.driver.getCurrentUrl();
        if (currentUrl !== url) {
          logger.logDebug(`Navigating to page ${url}`);
          await retry(async () => {
            try {
              await this.driver.get(url);
            } catch (error) {
              logger.logError(error);
            }
          });
        }
      }
}   
module.exports = PageObject;