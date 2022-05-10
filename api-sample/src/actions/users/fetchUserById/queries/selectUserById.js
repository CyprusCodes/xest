const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectUserById = ({ userId }) => submitQuery`
    SELECT 
        user_id,
        first_name,
        last_name,
        user_types.user_type_id,
        user_types.user_type
    FROM users
    LEFT JOIN user_types ON users.user_type_id = user_types.user_type_id
    WHERE user_id = ${userId}
`;

module.exports = getFirst(camelKeys(selectUserById));
