require("module-alias/register");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../../.env")
});
// prevent running against production database by mistake
require("~root/utils/exitIfProductionDatabase")();

const chai = require("chai");
const sinonChai = require("sinon-chai");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");
const chaiJestSnapshot = require("chai-jest-snapshot");
const dateSerializer = require("../JestSnapshotDateSerializer");
const getTables = require("../getTableNames");
const backupTable = require("./queries/backupTables");
const dropBackupTable = require("./queries/dropBackupTable");

chai.use(deepEqualInAnyOrder);
chai.use(sinonChai);

// eslint-disable-next-line no-shadow
chai.use(chai => {
  const { Assertion } = chai;
  Assertion.addMethod("yupSchema", function validate(expectedSchema) {
    // eslint-disable-next-line no-underscore-dangle
    const obj = this._obj;
    new Assertion(() => expectedSchema.validateSync(obj)).not.to.throw();
  });
});

chaiJestSnapshot.addSerializer(dateSerializer);
chai.use(chaiJestSnapshot);

before(async function backup() {
  const tables = await getTables();
  await Promise.all(
    tables.map(table => backupTable({ tableName: table.tableName }))
  );
});

after(async function dropBackups() {
  const tables = await getTables();
  await Promise.all(
    tables.map(table => dropBackupTable({ tableName: table.tableName }))
  );
});

before(function resetSnapshotRegistry() {
  chaiJestSnapshot.resetSnapshotRegistry();
});

beforeEach(function configureUsingMochaContext() {
  const fileName = this.currentTest.file;
  const testName = this.currentTest.title;
  chaiJestSnapshot.configureUsingMochaContext(this);
  chaiJestSnapshot.setFilename(`${fileName}.schnap`);
  chaiJestSnapshot.setTestName(testName);
});
