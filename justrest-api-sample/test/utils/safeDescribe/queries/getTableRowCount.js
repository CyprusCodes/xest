const { submitQuery, sqlId } = require("~root/lib/database");

const getTableRowCount = ({ tableName }) => submitQuery`
    SELECT 
    COUNT(*) as rows,
    ${tableName} as table_name
    FROM ${sqlId(tableName)};
`;

module.exports = getTableRowCount;
