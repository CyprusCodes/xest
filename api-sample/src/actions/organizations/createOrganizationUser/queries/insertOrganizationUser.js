const { submitQuery, getInsertId } = require("~root/lib/database");

const insertOrganizationUser = ({
  userId,
  userOrganizationRoleId,
  organizationId,
  addedBy
}) => submitQuery`
  INSERT INTO user_organizations
  (
    user_id,
    user_role_id,
    organization_id,
    added_by
  )
  VALUES
  (
    ${userId},
    ${userOrganizationRoleId},
    ${organizationId},
    ${addedBy}
  )
`;

module.exports = getInsertId(insertOrganizationUser);
