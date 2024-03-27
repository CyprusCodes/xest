const { submitQuery, getFirst, camelKeys } = require("~root/lib/database");

const selectUserFullNameById = ({ userId }) => submitQuery`
    SELECT
        first_name,
        last_name
    FROM users
    WHERE user_id = ${userId}
`;

module.exports = getFirst(camelKeys(selectUserFullNameById));
