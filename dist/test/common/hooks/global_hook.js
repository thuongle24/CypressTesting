"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const config = require("config");
//prevent specific sets of scenarios with @runSequentially tag from running in parallel
const { atMostOnePicklePerTag } = cucumber_1.parallelCanAssignHelpers;
(0, cucumber_1.setParallelCanAssign)(atMostOnePicklePerTag(["@runSequentially"]));
const _ = require("lodash");
const logger = require("../../../services/logging-service");
(0, cucumber_1.setDefaultTimeout)(config.cucumberDefaultTimeout);
const TIMEOUT = config.cucumberSetupTimeout;
(0, cucumber_1.Before)({ timeout: TIMEOUT }, async function (scenario) {
    logger.logInfo(scenario.pickle.name + " started...");
});
(0, cucumber_1.Before)({ tags: "@pending" }, function () {
    return "pending";
});
(0, cucumber_1.After)({ timeout: TIMEOUT }, async function (scenario) {
    if (scenario.result.status !== "PASSED") {
        logger.logError(`${scenario.pickle.name} ${scenario.result.status}.`);
        if (scenario.result.exception) {
            logger.logError(scenario.result.exception);
        }
    }
    else {
        logger.logInfo(`${scenario.pickle.name} ${scenario.result.status}.`);
    }
});
//# sourceMappingURL=global_hook.js.map