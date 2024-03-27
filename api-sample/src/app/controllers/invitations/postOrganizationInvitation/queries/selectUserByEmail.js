const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserByEmail = ({ email }) => submitQuery`
    SELECT
      email
    FROM users
    WHERE email = ${email};
`;

module.exports = getFirst(selectUserByEmail, "email");
