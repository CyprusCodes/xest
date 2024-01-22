const { submitQuery, camelKeys } = require("~root/lib/database");

const selectOrganizationUsers = ({ orgId }) => submitQuery`
    SELECT
        user_organizations.user_organization_id,
        user_organizations.user_id,
        user_organizations.user_organization_role_id,
        user_organizations.organization_id,
        user_organizations.updated_at,
        user_organizations.created_at,
        users.first_name,
        users.last_name,
        users.email,
        user_roles.user_role
    FROM user_organizations
    LEFT JOIN users ON users.user_id = user_organizations.user_id
    LEFT JOIN user_roles ON user_roles.user_role_id = user_organizations.user_organization_role_id
    WHERE organization_id = ${orgId}
`;

module.exports = camelKeys(selectOrganizationUsers);
