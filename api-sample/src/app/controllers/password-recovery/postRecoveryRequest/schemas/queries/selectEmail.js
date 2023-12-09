const { submitQuery, getFirst } = require("~root/lib/database");

const selectEmail = ({ requestedEmail }) => submitQuery`
    SELECT email
    FROM users 
    WHERE email = ${requestedEmail} 
`;

module.exports = getFirst(selectEmail);
