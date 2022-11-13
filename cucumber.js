const config = require("config");
const defaultArgs = [
  "--retry 2",
  "--retry-tag-filter @flaky",
  "--publish-quiet",
  "--require test/common/step_definitions",
  "--require test/common/hooks",
  "--require-module ts-node/register",
  "--require 'test/common/step_definitions/**/*.ts'",
];

module.exports = {
  default: defaultArgs.join(" "),
  api: [
    "test/api/features",
    "--require test/api/step_definitions",
    "--require 'test/api/step_definitions/**/*.ts'",
    `--parallel ${config.parallelism.api}`,
    ...defaultArgs,
  ].join(" "),
  acceptance: [
    "test/acceptance/features",
    "--require test/acceptance/step_definitions",
    "--require test/acceptance/hooks",
    "--require 'test/acceptance/step_definitions/**/*.ts'",
    `--parallel ${config.parallelism.acceptance}`,
    ...defaultArgs,
  ].join(" "),
};
