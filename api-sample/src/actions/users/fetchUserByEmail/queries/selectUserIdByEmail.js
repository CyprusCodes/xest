const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserIdByEmail = ({ email }) => submitQuery`
  SELECT
    user_id
  FROM users
  WHERE email = ${email}
`;

module.exports = getFirst(selectUserIdByEmail, "user_id");
