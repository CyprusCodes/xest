const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUsers = () => submitQuery`
    SELECT 
        first_name,
        last_name,
        email,
        created_at,
        user_type
    FROM users
    LEFT JOIN user_types ON users.user_type_id = user_types.user_type_id
`;

module.exports = camelKeys(selectUsers);
