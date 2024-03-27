const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserOrganizationByEmail = ({ email, orgId }) => submitQuery`
    SELECT 
        user_organizations.user_organization_id
    FROM user_organizations
    LEFT JOIN users ON user_organizations.user_id = users.user_id 
    WHERE users.email = ${email} && user_organizations.organization_id = ${orgId}
`;

module.exports = getFirst(
  selectUserOrganizationByEmail,
  "user_organization_id"
);
