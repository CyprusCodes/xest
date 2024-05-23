const { submitQuery, camelKeys } = require("~root/lib/database");

const selectOrganizationsByUserId = ({ userId }) => submitQuery`
    SELECT
		organizations.organization_id,
		organizations.organization_name,
		user_organization_roles.user_organization_role,
		user_organization_roles.user_organization_role_id
	FROM user_organizations
	LEFT JOIN users ON user_organizations.user_id = users.user_id
	LEFT JOIN organizations ON user_organizations.organization_id = organizations.organization_id
	LEFT JOIN user_organization_roles ON user_organizations.user_organization_role_id = user_organization_roles.user_organization_role_id
	WHERE users.user_id = ${userId}
`;

module.exports = camelKeys(selectOrganizationsByUserId);
