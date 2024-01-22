const { submitQuery, getFirst, camelKeys } = require("~root/lib/database");

const selectUserRoleNameById = ({ userRoleId }) => submitQuery`
    SELECT
    user_role
    FROM user_roles
    WHERE user_role_id = ${userRoleId}
`;

module.exports = getFirst(camelKeys(selectUserRoleNameById));
