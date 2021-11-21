/* eslint-disable */
/* 
    this module saves the coverage json files from
    jest unit tests and mocha integration tests
    under full-coverage/ directory
*/
const fs = require("fs");
const path = require("path");
const jestUnitTestCoverage = require("../../../coverage-unit/coverage-final.json");
const mochaIntegrationTestCoverage = require("../../../coverage/coverage-final.json");

const mergedCoveragePath = path.join(__dirname, "../../../full-coverage");

try {
  if (!fs.existsSync(mergedCoveragePath)) {
    fs.mkdirSync(mergedCoveragePath);
  }

  fs.writeFileSync(
    `${mergedCoveragePath}/integration-test-coverage.json`,
    JSON.stringify(mochaIntegrationTestCoverage)
  );
  fs.writeFileSync(
    `${mergedCoveragePath}/unit-test-coverage.json`,
    JSON.stringify(jestUnitTestCoverage)
  );
} catch (err) {
  console.log(err);
}
