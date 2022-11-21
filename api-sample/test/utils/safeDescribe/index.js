/* eslint-disable func-names */
/* https://stackoverflow.com/questions/26107027/running-mocha-setup-before-each-suite-rather-than-before-each-test */
const mocha = require("mocha");
const {
  _getQueryLog,
  _resetTestQueryLog,
  _getTransactionStack
} = require("~root/lib/database");
const getTableNames = require("../getTableNames");
const revertTableData = require("./queries/revertTableData");

const DML_STATEMENTS = [/insert\s/gi, /create\s/gi, /update\s/gi, /delete\s/gi];

async function getTables() {
  const tableNames = await getTableNames();
  return tableNames.filter(t => !t.tableName.includes("_xest_backup"));
}

function suitePatchesBefore() {
  before(async function() {
    const transactionsBefore = _getTransactionStack();
    if (transactionsBefore.length !== 0) {
      throw transactionsBefore[0];
    }
  });
}

function suitePatchesAfter() {
  after(async function() {
    const tableNames = await getTables();
    const queries = [..._getQueryLog()];

    const dataModificationQueries = queries
      .filter(query => DML_STATEMENTS.some(statement => query.match(statement)))
      .join("");

    const tablesToRevert = tableNames
      .map(t => t.tableName)
      .filter(table => dataModificationQueries.includes(` ${table}`));

    await Promise.all(
      tablesToRevert.map(async t => {
        await revertTableData({ tableName: t });
      })
    );

    _resetTestQueryLog();
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
