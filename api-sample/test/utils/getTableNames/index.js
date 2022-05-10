const getTableNames = require("./queries/getTableNames");

async function getTables(all = false) {
  const tableNames = await getTableNames();
  if (all) {
    return tableNames;
  }
  return tableNames.filter(t => !t.tableName.includes("_xest_backup"));
}

module.exports = getTables;
