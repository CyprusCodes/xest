const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserRole = ({ userRoleId }) => submitQuery`
    SELECT 
        user_role
    FROM user_roles
    WHERE user_role_id = ${userRoleId}
`;

module.exports = getFirst(selectUserRole, "user_role");
