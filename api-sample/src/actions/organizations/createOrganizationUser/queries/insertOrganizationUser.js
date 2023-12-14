const { submitQuery, getInsertId } = require("~root/lib/database");

const insertOrganizationUser = ({
  newOrgUserUserId,
  userRoleId,
  orgId,
  userId
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
    ${newOrgUserUserId},
    ${userRoleId},
    ${orgId},
    ${userId}
  )
`;

module.exports = getInsertId(insertOrganizationUser);
