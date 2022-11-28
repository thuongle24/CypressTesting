"use strict";
const config = require("config");
let interrupted = false;
async function retry(functionToRun, retryCountInput, retryIntervalInput) {
    let retryCount = retryCountInput;
    if (!retryCount) {
        retryCount = config.get("retryCount.high");
    }
    const retryInterval = retryIntervalInput || config.get("retryIntervalMs");
    let tryCount = 0;
    while (tryCount <= retryCount && !interrupted) {
        try {
            await functionToRun();
            tryCount = retryCount + 1;
        }
        catch (err) {
            tryCount++;
            if (tryCount > retryCount) {
                throw err;
            }
            await new Promise((resolve) => {
                setTimeout(resolve, retryInterval);
            });
        }
    }
}
function reset() {
    interrupted = false;
}
function interrupt() {
    interrupted = true;
}
module.exports = { retry, reset, interrupt };
//# sourceMappingURL=retry.js.map