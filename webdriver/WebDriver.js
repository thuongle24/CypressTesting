import { Builder, By, until, Key } from "selenium-webdriver";
const chrome = require('selenium-webdriver/chrome');
const ie = require('selenium-webdriver/ie');
const config = require("config");
const logger = require("../services/logging-service");
const { retry } = require("../utils/retry");
//const WebElement = require("./WebElement").default;

class SeleniumWebdriver {
  async init() {
    const browser = config.get("browser");
    switch (browser.toLowerCase()) {
      case "internet explorer":
        this.driver = await this.initInternetExplorer();
        break;
      default:
        this.driver = await this.initChrome();
    }
    await this.driver.manage().setTimeouts({ implicit: 5000, pageLoad: 30000, script: 15000 });
  }

  async initChrome() {
    let builder = new Builder().forBrowser("chrome");
    if (config.has("gridHub")) {
      builder = builder.usingServer(config.get("gridHub"));
    }

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

    builder = builder.setChromeOptions(options);

    return await builder.build();
  }

  async initInternetExplorer() {
    let builder = new Builder().forBrowser("internet explorer");
    let options = new ie.Options();
    options = options.ensureCleanSession(true);
    builder = builder.setIeOptions(options);
    return await builder.build();
  }

  async dispose() {
    await this.driver.quit();
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
export default SeleniumWebdriver