const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserById = ({ userId }) => submitQuery`
    SELECT user_id
    FROM users 
    WHERE user_id = ${userId}
`;

module.exports = getFirst(selectUserById, "user_id");
