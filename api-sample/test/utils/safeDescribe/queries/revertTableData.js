const { submitQuery, sqlId } = require("~root/lib/database");

const backupTable = ({ tableName }) => submitQuery`
    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE ${sqlId(tableName)};
    INSERT INTO ${sqlId(tableName)} SELECT * FROM ${sqlId(
  `${tableName}_xest_backup`
)};
    SET FOREIGN_KEY_CHECKS = 1;
`;

module.exports = backupTable;
