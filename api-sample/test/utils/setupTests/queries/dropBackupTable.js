const { submitQuery, sqlId } = require("~root/lib/database");

const backupTable = ({ tableName }) => submitQuery`
    DROP TABLE ${sqlId(`${tableName}_xest_backup`)};
`;

module.exports = backupTable;
