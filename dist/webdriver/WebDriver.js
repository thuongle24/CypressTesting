"use strict";
const { Builder, By, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const ie = require("selenium-webdriver/ie");
const expect = require("expect").default;
const fs = require("fs");
const path = require("path");
const config = require("config");
const _ = require("lodash");
const logger = require("../services/logging-service");
const WebElement = require("./WebElement");
const { retry } = require("../utils/retry");
const DEFAULT_WAIT_TIMEOUT = 1000;
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
    async navigateToPage(pageObject) {
        const currentUrl = await this.driver.getCurrentUrl();
        if (currentUrl !== pageObject.url) {
            logger.logDebug(`Navigating to page ${pageObject.url}`);
            await retry(async () => {
                try {
                    await this.driver.get(pageObject.url);
                }
                catch (error) {
                    logger.logError(error);
                }
            });
        }
    }
    async getText(cssSelector) {
        const element = await this.findElement(cssSelector);
        return await element.getText();
    }
    async getTexts(cssSelector) {
        const elements = await this.findElements(cssSelector);
        const texts = [];
        for (let i = 0; i < elements.length; i++) {
            try {
                const text = await elements[i].getText();
                texts.push(text);
            }
            catch (error) {
                // Do nothing
            }
        }
        return texts;
    }
    async setText(cssSelector, value) {
        let success = false;
        await retry(async () => {
            try {
                const element = await this.findElement(cssSelector);
                await element.sendKeys(value);
                success = true;
            }
            catch (err) {
                // No need to do anything here
            }
            expect(success).toBe(true);
        });
    }
    async click(cssSelector) {
        logger.logDebug(`Clicking ${cssSelector}`);
        let success = false;
        await retry(async () => {
            try {
                const element = await this.findElement(cssSelector);
                await element.click();
                success = true;
            }
            catch (err) {
                // No need to do anything here
            }
            expect(success).toBe(true);
        });
    }
    async clickElementWithText(cssSelector, text) {
        let success = false;
        await retry(async () => {
            try {
                const element = await this.findElementByText(cssSelector, text);
                await element.click();
                success = true;
            }
            catch (err) {
                // No need to do anything here
            }
            expect(success).toBe(true);
        });
    }
    async sendKeys(cssSelector, keys) {
        await this.setText(cssSelector, keys);
    }
    async findElement(cssSelector) {
        let element;
        let error;
        await retry(async () => {
            try {
                const elements = await this.driver.findElements(By.css(cssSelector));
                expect(elements.length).toBeGreaterThan(0);
                element = elements[0];
            }
            catch (err) {
                if (!error || !_.isEqual(err, error)) {
                    error = err;
                    logger.logError(error);
                }
            }
        });
        logger.logDebug(element);
        return new WebElement(this.driver, element);
    }
    async findElements(cssSelector) {
        const childElements = await this.driver.findElements(By.css(cssSelector));
        const wrappedChildren = childElements.map((element) => new WebElement(this.driver, element));
        return wrappedChildren;
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
    async assertOnPage(pageObject) {
        try {
            await this.driver.wait(until.urlContains(pageObject.url), parseInt(config.get("driverTimeout"), 10));
        }
        catch (e) {
            const url = await this.driver.getCurrentUrl();
            expect(url).toBe(pageObject.url);
        }
    }
    async isOnPage(pageObject) {
        try {
            await this.driver.wait(until.urlIs(pageObject.url), 5000);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async refresh() {
        await this.driver.navigate().refresh();
    }
    async sleep(time) {
        await this.driver.sleep(time);
    }
    async wait(waitFunction, timeout = DEFAULT_WAIT_TIMEOUT) {
        await this.driver.wait(waitFunction(this), timeout);
    }
    async currentUrl() {
        return await this.driver.getCurrentUrl();
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
    async addToLocalState(key, value) {
        await this.driver.executeScript(`localStorage.setItem("${key}", "${value}")`);
    }
    async addCookie(name, value) {
        await this.driver.manage().addCookie({ name, value });
    }
    async moveToElement(cssSelector) {
        const element = await this.findElement(cssSelector);
        const actions = this.driver.actions({ async: true });
        await actions.move({ origin: element.innerWebElement }).perform();
    }
    async moveToElementWithText(cssSelector, text) {
        const element = await this.findElementByText(cssSelector, text);
        const actions = this.driver.actions({ async: true });
        await actions.move({ origin: element.innerWebElement }).perform();
    }
    async waitUntilElementVisible(cssSelector, timeout = 3000) {
        await this.driver.wait(until.elementLocated(By.css(cssSelector)), timeout);
    }
    async ctrlClick(element) {
        const actions = this.driver.actions({ async: true });
        if (process.platform === "win32") {
            await actions.keyDown(Key.CONTROL).click(element.innerWebElement).perform();
        }
        else {
            await actions.keyDown(Key.COMMAND).click(element.innerWebElement).perform();
        }
    }
    async waitUntilUrlMatches(regex, millisecond) {
        try {
            return await this.driver.wait(until.urlMatches(new RegExp(regex)), millisecond);
        }
        catch (e) {
            logger.logInfo("Actual URL: " + (await this.driver.getCurrentUrl()));
            return false;
        }
    }
    async waitUntil(untilCondition, timeOutInMili = 10000) {
        return await this.driver.wait(untilCondition, timeOutInMili);
    }
    async getTitle() {
        return await this.driver.getTitle();
    }
    async waitForElementToBeRemoved(cssSelector, timeOutInMili) {
        await this.waitUntil(async function () {
            const element = await this.findElements(cssSelector);
            return element.length === 0;
        }.bind(this), timeOutInMili);
    }
    async waitForText(text, timeOutInMili) {
        await this.waitUntil(async function () {
            const element = await this.driver.findElement(By.xpath(`//*[contains(text(),'${text}')]`));
            return await element.isDisplayed();
        }.bind(this), timeOutInMili);
    }
    async switchToTab(targetTab) {
        if (Number.isInteger(targetTab)) {
            const allTabs = await this.getAllWindowHandles();
            await this.driver.switchTo().window(allTabs[targetTab]);
        }
        else {
            await this.driver.switchTo().window(targetTab);
        }
    }
    async getAllWindowHandles() {
        return await this.driver.getAllWindowHandles();
    }
    async isFileDownloaded(fileName) {
        const filePath = `${process.cwd()}/${config.get("browserDownloadDirectory")}/${fileName}`;
        try {
            await fs.accessSync(filePath, fs.constants.F_OK);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async waitUntilProcessed(timeoutMs = 10000) {
        await this.waitUntil(async function () {
            await this.refresh();
            await this.sleep(2000);
            const errorText = await this.driver.findElements(By.xpath(`//*[contains(text(),'Service Unavailable')]`));
            return errorText.length === 0;
        }.bind(this), timeoutMs);
        await this.sleep(5000);
    }
    async pasteClipboard(element) {
        const actions = this.driver.actions({ async: true });
        await actions.click(element.innerWebElement).keyDown(Key.CONTROL).sendKeys("v").perform();
        await actions.click(element.innerWebElement).keyUp(Key.CONTROL).perform();
    }
    async executeScript(script, element) {
        if (element) {
            await this.driver.executeScript(script, element.innerWebElement);
        }
        else {
            await this.driver.executeScript(script);
        }
    }
    async closeCurrentTab() {
        await this.driver.close();
    }
    async rgbaTohex(rgba) {
        // eslint-disable-next-line no-param-reassign
        rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return rgba && rgba.length === 4
            ? "#" +
                ("0" + parseInt(rgba[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgba[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgba[3], 10).toString(16)).slice(-2)
            : "";
    }
    async isElementVisible(cssSelector) {
        const element = await this.findElements(cssSelector);
        return element.length > 0;
    }
    async isElementNotVisible(cssSelector) {
        const element = await this.findElements(cssSelector);
        return element.length === 0;
    }
    async acceptAlert() {
        try {
            await this.driver.wait(until.alertIsPresent());
            const alert = await this.driver.switchTo().alert();
            await alert.accept();
        }
        catch (err) {
            //do nothing here
        }
    }
    async dismissAlert() {
        try {
            await this.driver.wait(until.alertIsPresent());
            const alert = await this.driver.switchTo().alert();
            await alert.dismiss();
        }
        catch (err) {
            //do nothing here
        }
    }
}
module.exports = SeleniumWebdriver;
//# sourceMappingURL=WebDriver.js.map