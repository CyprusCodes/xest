const { submitQuery, sql, sqlReduce } = require("~root/lib/database");

const acceptInvitationQuery = ({ invitationId, shortCode }) => {
  const updates = [];

  if (invitationId) {
    updates.push(sql`accepted_at = CURRENT_TIMESTAMP`);
  }

  if (updates.length !== 0) {
    return submitQuery`
    UPDATE
    user_organization_invitations SET ${updates.reduce(
      sqlReduce
    )} WHERE invitation_shortcode = ${shortCode} && user_organization_invitation_id = ${invitationId}`;
  }
  return Promise.resolve();
};
module.exports = acceptInvitationQuery;
