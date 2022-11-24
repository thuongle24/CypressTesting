import {
  Before,
  BeforeAll,
  After,
  AfterAll,
  setDefaultTimeout,
  setParallelCanAssign,
  parallelCanAssignHelpers,
} from "@cucumber/cucumber";
const config = require("config");

//prevent specific sets of scenarios with @runSequentially tag from running in parallel
const { atMostOnePicklePerTag } = parallelCanAssignHelpers;
setParallelCanAssign(atMostOnePicklePerTag(["@runSequentially"]));

const _ = require("lodash");
const logger = require("../../../services/logging-service");

setDefaultTimeout(config.cucumberDefaultTimeout);
const TIMEOUT = config.cucumberSetupTimeout;

Before({ timeout: TIMEOUT }, async function (scenario) {
  logger.logInfo(scenario.pickle.name + " started...");
});

Before({ tags: "@pending" }, function () {
  return "pending";
});

After({ timeout: TIMEOUT }, async function (scenario) {
  if (scenario.result.status !== "PASSED") {
    logger.logError(`${scenario.pickle.name} ${scenario.result.status}.`);

    if (scenario.result.exception) {
      logger.logError(scenario.result.exception);
    }
  } else {
    logger.logInfo(`${scenario.pickle.name} ${scenario.result.status}.`);
  }
});
