const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectUserById = ({ userId }) => submitQuery`
    SELECT
        first_name,
        last_name,
        email,
        user_roles.user_role_id,
        user_roles.user_role
    FROM users
    LEFT JOIN user_roles ON users.user_role_id = user_roles.user_role_id
    WHERE user_id = ${userId}
`;

module.exports = getFirst(camelKeys(selectUserById));
