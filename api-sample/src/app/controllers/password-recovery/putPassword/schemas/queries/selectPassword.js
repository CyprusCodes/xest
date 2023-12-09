const { submitQuery, getFirst } = require("~root/lib/database");

const selectPassword = ({ password, email }) => submitQuery`
    SELECT password
    FROM users 
    WHERE password = SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224) AND email = ${email}
`;

module.exports = getFirst(selectPassword, "password");
