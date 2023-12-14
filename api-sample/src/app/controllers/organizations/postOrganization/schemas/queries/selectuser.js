const { submitQuery, getFirst } = require("~root/lib/database");

const selectInvitation = ({ userId }) => submitQuery`
    SELECT 
        user_id,
        first_name,
        last_name,
        email
    FROM users
    WHERE user_id = ${userId}
`;

module.exports = getFirst(selectInvitation, "email");
