import { Before, After, Status } from "@cucumber/cucumber";
import { existsSync, mkdirSync } from "fs";
import { logError, logDebug } from "../../../services/logging-service";
const config = require("config");
const rimraf = require("rimraf");
const pageConstants = require("../../../page-objects/constants");
const PageConstructor = require("../../../page-objects/PageConstructor");

import Webdriver from "../../../webdriver/WebDriver";
const TIMEOUT = 60 * 1000;

Before({ timeout: TIMEOUT, tags: "@browser" }, async function () {
  this.browser = true;
  try {
    this.driver = new Webdriver();
    this.pageConstructor = new PageConstructor(this.driver);
    this.pageConstants = pageConstants;
    await this.driver.init();
    this.navigateToPage = async (pageConstant, ...pageParameters) => {
      const page = this.pageConstructor.constructPage(pageConstant, ...pageParameters);
      await this.driver.navigateToPage(page);
      this.currentPage = page;
      return page;
    };
  } catch (err) {
    logError(err);
  }
});

After({ timeout: TIMEOUT, tags: "@browser" }, async function (scenario) {
  try {
    rimraf.sync(config.get("browserDownloadDirectory"));

    if (scenario.result.status === Status.FAILED) {
      const directory = `${process.cwd()}/test/acceptance/screenshots`;
      if (!existsSync(directory)) {
        mkdirSync(directory);
      }

      const filename = `${scenario.pickle.name.replace(/ /g, "_")}.png`;
      await this.driver.saveScreenshot(directory, filename);
    }
  } catch (err) {
    logError(err);
  } finally {
    logDebug("After browser disposal");
    if (this.driver) {
      await this.driver.dispose();
    }
  }
});
