const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUserTypes = () => submitQuery`
    SELECT 
        user_type
    FROM user_types
`;

module.exports = camelKeys(selectUserTypes);
