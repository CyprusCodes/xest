const { submitQuery, getFirst } = require("~root/lib/database");

const selectSuperAdmin = ({ userId }) => submitQuery`
    SELECT
        user_id
    FROM users
    WHERE user_id = ${userId} && is_super_admin = 1;
`;

module.exports = getFirst(selectSuperAdmin, "user_id");
