const { submitQuery, sql, sqlReduce } = require("~root/lib/database");

const updateOrganizationUser = ({
  userId,
  orgId,
  orgUserId,
  userRoleId = null,
  enabled = null
}) => {
  const updates = [];

  if (userRoleId !== null) {
    updates.push(sql`user_role_id = ${userRoleId}`);
  }

  if (enabled !== null) {
    if (enabled === true) {
      updates.push(sql`disabled_by = null`);
      updates.push(sql`disabled_at = null`);
    }
    if (enabled === false) {
      updates.push(sql`disabled_by = ${userId}`);
      updates.push(sql`disabled_at = CURRENT_TIMESTAMP`);
    }
  }

  if (updates.length !== 0) {
    updates.push(sql`updated_at = CURRENT_TIMESTAMP`);
    return submitQuery`
      UPDATE
        user_organizations
      SET
        ${updates.reduce(sqlReduce)}
      WHERE
        user_id = ${orgUserId} && organization_id = ${orgId}
 `;
  }
  return Promise.resolve();
};

module.exports = updateOrganizationUser;
