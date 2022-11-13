const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ie = require('selenium-webdriver/ie');
const config = require("config");
const logger = require("../services/logging-service");
const { retry } = require("../utils/retry");
//const WebElement = require("./WebElement").default;

class SeleniumWebdriver {
  async init() {
    const browser = config.get("browser");
    this.driver = new webdriver.Builder()
        .forBrowser(browser)
        .setChromeOptions(this.chromeOptions)
        .setIeOptions(this.ieOptions)
        .build();
    await this.driver.manage().setTimeouts({ implicit: 5000, pageLoad: 30000, script: 15000 });
  }

  async chromeOptions() {
    let options = new chrome.Options();
    if (config.get("runBrowserHeadless")) {
      options = options.headless();
    }

    options.setUserPreferences({
      "download.default_directory": `${process.cwd()}/${config.get("browserDownloadDirectory")}`,
    });

    options.addArguments("--window-size=1920,1080");
    options.addArguments("--start-maximized");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--ignore-certificate-errors");

    return options;
  }

  async ieOptions() {
    let options = new ie.Options();
    options = options.ensureCleanSession(true);
    return options;
  }

  async dispose() {
    await this.driver.quit();
  }

  async navigateToPage(pageObject) {
    const currentUrl = await this.driver.getCurrentUrl();
    if (currentUrl !== pageObject.url) {
      logger.logDebug(`Navigating to page ${pageObject.url}`);
      await retry(async () => {
        try {
          await this.driver.get(pageObject.url);
        } catch (error) {
          logger.logError(error);
        }
      });
    }
  }
}
export default SeleniumWebdriver