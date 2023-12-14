const {
  submitQuery,
  sql,
  sqlReduce,
  getInsertId
} = require("~root/lib/database");

const updateUserInvitation = ({ invitationId, shortcode }) => {
  const updates = [];

  if (invitationId && shortcode) {
    updates.push(sql`accepted_at = CURRENT_TIMESTAMP`);
  }

  if (updates.length !== 0) {
    return submitQuery`
    UPDATE
      user_organization_invitations
    SET
      ${updates.reduce(sqlReduce)}
    WHERE
      user_organization_invitation_id = ${invitationId} && invitation_shortcode = ${shortcode}
  `;
  }
  return Promise.resolve();
};

module.exports = getInsertId(updateUserInvitation);
