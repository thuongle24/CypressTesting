import { Before, After, Status } from "@cucumber/cucumber";
import { existsSync, mkdirSync } from "fs";
const config = require("config");
const rimraf = require("rimraf");
import { logError, logDebug } from "../../../services/logging-service";

import Webdriver from "../../../webdriver/WebDriver";
const TIMEOUT = 60 * 1000;

Before({ timeout: TIMEOUT, tags: "@browser" }, async function () {
  this.browser = true;
  try {
    this.driver = new Webdriver();
    //this.pageConstants = pageConstants;
    await this.driver.init();
    this.navigateToPage = async () => {
      //const page = this.pageConstructor.constructPage(pageConstant, ...pageParameters);
      await this.driver.navigateToPage(config.get("baseUrl"));
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