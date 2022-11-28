"use strict";
const config = require("config");
const functionality = config.get("functionality");
let includeExpression = "";
let excludeExpression = "";
Object.keys(functionality).forEach(function (key) {
    if (functionality[key]) {
        if (includeExpression !== "") {
            includeExpression += "or ";
        }
        includeExpression += `@${key} `;
        console.log(includeExpression);
    }
    else {
        excludeExpression += `and not @${key} `;
    }
});
if (config.get("skipPendingTests")) {
    excludeExpression += `and not @pending `;
}
if (config.get("skipBugRaisedTests")) {
    excludeExpression += `and not @bugRaised `;
}
excludeExpression += `and not @manual `;
const tags = `(${includeExpression}) ${excludeExpression}`;
console.log(`TAGS: ${tags}`);
const defaultArgs = [
    `--tags "${tags}"`,
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
//# sourceMappingURL=cucumber.js.map