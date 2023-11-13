const { submitQuery, getFirst } = require("~root/lib/database");

const selectUser = ({ userId, email }) => submitQuery`
    SELECT 
	    user_id, 
        first_name, 
        last_name,
        email
    FROM users 
    WHERE user_id = ${userId} && email = ${email}
`;

module.exports = getFirst(selectUser);
