const { submitQuery } = require("~root/lib/database");

const deleteOrganizationUser = ({ orgUserId, orgId }) =>
  submitQuery`
    DELETE FROM user_organizations
    WHERE user_id = ${orgUserId} && organization_id = ${orgId};
  `;

module.exports = deleteOrganizationUser;
