const { submitQuery, getFirst } = require("~root/lib/database");

const selectSuperAdmin = ({ userId }) => submitQuery`
    SELECT
        user_id
    FROM users
    WHERE user_id = ${userId} && user_type_id = 1
`;

module.exports = getFirst(selectSuperAdmin, "user_id");
