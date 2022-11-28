"use strict";
const expect = require("expect").default;
const PageComponent = require("./PageComponent");
const { retry } = require("../../utils/retry");
class Spinner extends PageComponent {
    constructor(driver, pageConstructor) {
        super(driver, pageConstructor);
        this.spinnerSelector = ".owm-loader-container .owm-loader";
    }
    async waitForSpinnerToDisappear() {
        await retry(async () => {
            let spinnerVisible = true;
            const spinners = await this.driver.findElements(this.spinnerSelector);
            const spinnerVisibleStatus = [];
            for (let i = 0; i < spinners.length; i++) {
                const spinnerAttribute = await spinners[i].getAttribute("aria-label");
                spinnerVisibleStatus.push(spinnerAttribute.indexOf("loading"));
            }
            if (!spinnerVisibleStatus.includes(-1)) {
                spinnerVisible = false;
            }
            expect(spinnerVisible).toBe(false);
        });
        await this.driver.sleep(1000);
    }
}
module.exports = Spinner;
//# sourceMappingURL=Spinner.js.map