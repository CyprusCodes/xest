const { submitQuery } = require("~root/lib/database");

const getTableNames = () => submitQuery`
    SELECT 
    table_name as tableName 
    FROM information_schema.TABLES 
    WHERE table_schema = "{{PROJECT_NAME_SNAKECASE}}_db";
`;

module.exports = getTableNames;
