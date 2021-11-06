const { submitQuery, getFirst } = require("~root/lib/database");

const getUserRole = ({ userId }) => submitQuery`
    SELECT user_type 
    FROM users
    LEFT JOIN user_types ON users.user_type_id = user_types.user_type_id
    WHERE users.user_id = ${userId}
`;

module.exports = getFirst(getUserRole, "user_type");
