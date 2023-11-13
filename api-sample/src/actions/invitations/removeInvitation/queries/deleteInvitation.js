const { submitQuery, getInsertId } = require("~root/lib/database");

const deleteInvitation = ({ invitationId }) => submitQuery`
  DELETE 
    FROM user_organization_invitations 
  WHERE user_organization_invitation_id = ${invitationId}
`;
module.exports = getInsertId(deleteInvitation);
