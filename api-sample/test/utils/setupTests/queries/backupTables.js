const { submitQuery, sqlId } = require("~root/lib/database");

const backupTable = ({ tableName }) => submitQuery`
    CREATE TABLE ${sqlId(`${tableName}_xest_backup`)} LIKE ${sqlId(tableName)};
    INSERT INTO ${sqlId(`${tableName}_xest_backup`)} SELECT * FROM ${sqlId(
  tableName
)};
`;

module.exports = backupTable;
