const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserRole = ({ userOrganizationRoleId }) => submitQuery`
    SELECT
        user_organization_role
    FROM user_organization_roles
    WHERE user_organization_role_id = ${userOrganizationRoleId}
`;

module.exports = getFirst(selectUserRole, "user_organization_role");
