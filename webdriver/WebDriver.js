const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const ie = require("selenium-webdriver/ie");
const config = require("config");
const logger = require("../services/logging-service");
const { retry } = require("../utils/retry");
const fs = require("fs");
const path = require("path");

class Webdriver {
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

  async findElement(cssSelector) {
    let element;
    let error;
    await retry(async () => {
      try {
        const elements = await this.driver.findElements(By.css(cssSelector));
        expect(elements.length).toBeGreaterThan(0);
        element = elements[0];
      } catch (err) {
        if (!err || !_.isEqual(err, error)) {
          error = err;
          logger.logError(error);
        }
      }
    });
    logger.logDebug(element);
    return element;
  }

  async findElements(cssSelector) {
    const childElements = await this.driver.findElements(By.css(cssSelector));
    return childElements;
  }

  async findElementByText(cssSelector, text) {
    const elements = await this.findElements(cssSelector);
    const allText = await Promise.all(elements.map(async (element) => await element.getText()));
    const index = allText.findIndex((result) => result.toUpperCase().startsWith(text.toUpperCase()));
    return elements[index];
  }

  async findElementsByText(cssSelector, text) {
    const elements = await this.findElements(cssSelector);
    const elementsToReturn = [];

    for (const element of elements) {
      const elementText = await element.getText();
      if (elementText === text) {
        elementsToReturn.push(element);
      }
    }
    return elementsToReturn;
  }

  async getElementText(cssSelector) {
    const element = await this.findElement(cssSelector);
    return await element.getText();
  }

  async setText(cssSelector, value) {
    let success = false;
    await retry(async () => {
      try {
        const element = await this.findElement(cssSelector);
        await element.sendKeys(value);
        success = true;
      } catch (err) {
        // No need to do anything here
      }
      expect(success).toBe(true);
    });
  }

  async sleep(time) {
    await this.driver.sleep(time);
  }

  async refresh() {
    this.driver.navigate().refresh();
  }

  async saveScreenshot(directory, filename) {
    const actualLocation = `${directory}/${filename.replace(/ /g, "_")}`;
    const folder = path.dirname(actualLocation);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    const image = await this.driver.takeScreenshot();
    fs.writeFileSync(actualLocation, image, "base64");
    return image;
  }

  async dispose () {
    return await this.driver.quit();
}
}
module.exports = Webdriver;
