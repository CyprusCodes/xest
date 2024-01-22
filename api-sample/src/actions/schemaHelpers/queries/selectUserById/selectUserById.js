const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserById = ({ userId }) => submitQuery`
    SELECT
        first_name,
        email
    FROM users
    WHERE user_id = ${userId}
`;

module.exports = getFirst(selectUserById);
