const { submitQuery, getFirst } = require("~root/lib/database");

const selectEmail = ({ email }) => submitQuery`
    SELECT email
    FROM users 
    WHERE email = ${email} 
`;

module.exports = getFirst(selectEmail, "email");
