const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserRoleIfInUserRoles = ({ userRoleId }) => submitQuery`
    SELECT 
        user_role_id
    FROM user_roles
    WHERE user_role_id = ${userRoleId}
`;

module.exports = getFirst(selectUserRoleIfInUserRoles, "user_role_id");
