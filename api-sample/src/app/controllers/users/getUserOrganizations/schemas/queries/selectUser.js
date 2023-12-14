const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectUser = ({ userId }) => submitQuery`
    SELECT
      user_id
    FROM users
    WHERE user_id=${userId};
`;

module.exports = getFirst(camelKeys(selectUser), "userId");
