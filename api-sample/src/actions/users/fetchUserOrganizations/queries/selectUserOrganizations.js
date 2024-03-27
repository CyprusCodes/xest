const { submitQuery, camelKeys } = require("~root/lib/database");

const selectUserOrganizations = ({ userId }) => submitQuery`
    SELECT
        user_organizations.user_id,
        organizations.organization_id,
        user_organizations.user_organization_role_id,
        user_organization_roles.user_organization_role,
        organizations.organization_name
    FROM user_organizations
    LEFT JOIN organizations ON organizations.organization_id = user_organizations.organization_id
    LEFT JOIN user_organization_roles ON user_organization_roles.user_organization_role_id = user_organizations.user_organization_role_id
    WHERE user_id = ${userId}
`;

module.exports = camelKeys(selectUserOrganizations);
