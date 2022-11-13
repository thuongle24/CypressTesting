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


setDefaultTimeout(config.cucumberDefaultTimeout);
const TIMEOUT = config.cucumberSetupTimeout;