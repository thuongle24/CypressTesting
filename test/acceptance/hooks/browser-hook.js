/* eslint-disable new-cap */
const { Before, After, Status } = require("@cucumber/cucumber");
const fs = require("fs");
const config = require("config");
const rimraf = require("rimraf");
const PageObject = require("../../../page-objects/PageObject");
const WebDriver = require("../../../webdriver/WebDriver")
const logger = require("../../../services/logging-service");
const TIMEOUT = 60 * 1000;

Before({ timeout: TIMEOUT, tags: "@browser" }, async function () {
  try {
    this.driver = new WebDriver();
    this.driver.init();
  } catch (err) {
    logger.logError(err);
  }
});

After({ timeout: TIMEOUT, tags: "@browser" }, async function (scenario) {
  try {
    rimraf.sync(config.get("browserDownloadDirectory"));

    if (scenario.result.status === Status.FAILED) {
      const directory = `${process.cwd()}/test/acceptance/screenshots`;
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }

      const filename = `${scenario.pickle.name.replace(/ /g, "_")}.png`;
      await this.driver.saveScreenshot(directory, filename);
    }
  } catch (err) {
    logger.logError(err);
  } finally {
    logger.logDebug("After browser disposal");
    if (this.driver) {
      await this.driver.dispose();
    }
  }
});
