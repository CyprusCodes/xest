const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserByEmail = ({ email }) => submitQuery`
    SELECT
      email
    FROM registration_requests
    WHERE email IN (${email});
`;

module.exports = getFirst(selectUserByEmail, "email");
