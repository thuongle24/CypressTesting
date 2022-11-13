import { By } from "selenium-webdriver";
import { retry } from "../utils/retry";
import expect from "expect";

class WebElement {
    constructor(driver, innerWebElement) {
      this.driver = driver;
      this.innerWebElement = innerWebElement;
    }

    async getText() {
        let text;
        await retry(async () => {
          text = await this.innerWebElement.getAttribute("innerText");
        });
        return text;
      }
    
      async sendKeys(input) {
        await this.innerWebElement.sendKeys(input);
      }
    
      async click() {
        let success = false;
        await retry(async () => {
          try {
            await this.innerWebElement.click();
            success = true;
          } catch (err) {
            // No need to do anything here
          }
          expect(success).toBe(true);
        });
      }

      async getText() {
        let text;
        await retry(async () => {
          text = await this.innerWebElement.getAttribute("innerText");
        });
        return text;
      }
    
      async sendKeys(input) {
        await this.innerWebElement.sendKeys(input);
      }
    
      async click() {
        let success = false;
        await retry(async () => {
          try {
            await this.innerWebElement.click();
            success = true;
          } catch (err) {
            // No need to do anything here
          }
          expect(success).toBe(true);
        });
      }

      async isSelected() {
        return await this.innerWebElement.isSelected();
      }
    
      async isDisplayed() {
        return await this.innerWebElement.isDisplayed();
      }
    
      async moveMouseToElement() {
        const actions = this.driver.actions({ async: true });
        await actions.move({ origin: this.innerWebElement }).perform();
      }
}
export default WebElement;