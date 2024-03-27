const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectUserById = ({ userId }) => submitQuery`
    SELECT
        first_name,
        last_name,
        email,
        is_super_admin,
    FROM users
    WHERE user_id = ${userId}
`;

module.exports = getFirst(camelKeys(selectUserById));
