const {
  submitQuery,
  sql,
  sqlReduce,
  getInsertId
} = require("~root/lib/database");

const updateOrganizationInvitation = ({
  email = null,
  invitationShortcode,
  orgId
}) => {
  const updates = [];
  if (email !== null) {
    updates.push(sql`email = ${email}`);
  }

  if (updates.length !== 0) {
    updates.push(sql`updated_at = CURRENT_TIMESTAMP`);
    return submitQuery`UPDATE user_organization_invitations SET ${updates.reduce(
      sqlReduce
    )} WHERE invitation_shortcode = ${invitationShortcode} && organization_id = ${orgId};`;
  }
  return Promise.resolve();
};

module.exports = getInsertId(updateOrganizationInvitation);
