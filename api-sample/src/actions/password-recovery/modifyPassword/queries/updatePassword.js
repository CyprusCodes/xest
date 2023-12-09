const { submitQuery, getInsertId } = require("~root/lib/database");

const updatePassword = ({ email, password }) => submitQuery`

UPDATE users
SET password = SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224) WHERE email= ${email};
`;

module.exports = getInsertId(updatePassword);
