const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserById = ({ userId, email }) => submitQuery`
    SELECT 
     first_name,
     email
    FROM users 
    WHERE user_id = ${userId} && email=${email}
`;

module.exports = getFirst(selectUserById);
