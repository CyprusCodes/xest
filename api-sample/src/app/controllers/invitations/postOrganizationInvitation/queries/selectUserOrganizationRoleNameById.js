const { submitQuery, getFirst, camelKeys } = require("~root/lib/database");

const selectUserOrganizationRoleNameById = ({
  userOrganizationRoleId
}) => submitQuery`
    SELECT
        user_organization_role
    FROM user_organization_roles
    WHERE user_organization_role_id = ${userOrganizationRoleId}
`;

module.exports = getFirst(camelKeys(selectUserOrganizationRoleNameById));
