const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUserOrganizations = ({ userId }) => submitQuery`
    SELECT
        user_organizations.user_id,
        user_organizations.user_organization_role_id,
        user_roles.user_role,
        user_organizations.organization_id,
        organizations.organization_name
    FROM user_organizations
    LEFT JOIN organizations ON organizations.organization_id = user_organizations.organization_id
    LEFT JOIN user_roles ON user_roles.user_role_id = user_organizations.user_organization_role_id
    WHERE user_id = ${userId}
`;

module.exports = camelKeys(selectUserOrganizations);
