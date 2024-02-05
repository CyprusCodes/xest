const { submitQuery, getFirst } = require("~root/lib/database");

const selectSuperAdmin = ({ userId }) => submitQuery`
    SELECT
        user_id
    FROM users
    WHERE user_id = ${userId} && user_role_id = 1;
`;

module.exports = getFirst(selectSuperAdmin, "user_id");
