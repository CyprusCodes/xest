/* eslint-disable no-console */
/* eslint-disable func-names */
/* https://stackoverflow.com/questions/26107027/running-mocha-setup-before-each-suite-rather-than-before-each-test */
const mocha = require("mocha");
const chalk = require("chalk");
const flattenDeep = require("lodash/flattenDeep");
const getTableNames = require("./queries/getTableNames");
const getTableRowCount = require("./queries/getTableRowCount");
const { _getTransactionStack } = require("~root/lib/database");

function getTableSize(tableSizes) {
  return flattenDeep(tableSizes).reduce((acc, curr) => {
    acc[curr.table_name] = curr.rows;
    return acc;
  }, {});
}

function suitePatchesBefore(tableSize) {
  before(async function() {
    const tableNames = await getTableNames();
    const tableSizes = await Promise.all(
      tableNames.map(t => getTableRowCount({ tableName: t.table_name }))
    );
    const transactionsBefore = _getTransactionStack();
    if (transactionsBefore.length !== 0) {
      throw transactionsBefore[0];
    }
    // eslint-disable-next-line no-param-reassign
    tableSize.before = getTableSize(tableSizes);
  });
}

function suitePatchesAfter(tableSize) {
  after(async function() {
    const tableNames = await getTableNames();
    const tableSizes = await Promise.all(
      tableNames.map(t => getTableRowCount({ tableName: t.table_name }))
    );
    const tableSizesNow = getTableSize(tableSizes);
    let tableIsNotClean = false;
    Object.keys(tableSizesNow).forEach(k => {
      if (tableSizesNow[k] !== tableSize.before[k]) {
        const extraRows = tableSizesNow[k] - tableSize.before[k];
        const label =
          extraRows > -1
            ? "added.\n\tDid you forget to clean up some mock records?"
            : "deleted.\n\tDid you delete records that you've not created by mistake?";

        const errorMsg = `\t${chalk.red(
          `✘ ${k}`
        )} table was not restored to its previous state. ${chalk.yellow(
          Math.abs(extraRows)
        )} extra row(s) ${label}`;

        tableIsNotClean = true;
        console.error(errorMsg);
      }
    });
    if (tableIsNotClean) {
      throw new Error(
        "Test suite failed to clean some database tables. See logs above."
      );
    }
    const transactionsAfter = _getTransactionStack();
    if (transactionsAfter.length !== 0) {
      throw transactionsAfter[0];
    }
  });
}

const origDescribe = mocha.describe;
const describe = function(n, tests) {
  origDescribe(n, function() {
    const tableSize = {};
    suitePatchesBefore(tableSize);
    tests.bind(this)();
    suitePatchesAfter(tableSize);
  });
};
const origOnly = origDescribe.only;
describe.only = function(n, tests) {
  origOnly(n, function() {
    const tableSize = {};
    suitePatchesBefore(tableSize);
    tests.bind(this)();
    suitePatchesAfter(tableSize);
  });
};
describe.skip = origDescribe.skip;

module.exports = describe;
