const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserOrganizationByEmail = ({
  email,
  orgId,
  userTypeId
}) => submitQuery`
    SELECT
        user_organizations.user_organization_id
    FROM user_organizations
    LEFT JOIN users ON users.user_id = user_organizations.user_id
    WHERE users.email = ${email} && user_organizations.organization_id = ${orgId} && user_organizations.user_type_id = ${userTypeId}
`;

module.exports = getFirst(
  selectUserOrganizationByEmail,
  "user_organization_id"
);
