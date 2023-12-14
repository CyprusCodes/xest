const { submitQuery, getFirst, camelKeys } = require("~root/lib/database");

const selectUserByInvitationId = ({ invitationId, shortcode }) => submitQuery`
    SELECT 
	  invitation_shortcode,
      email,
      user_organization_invitation_id
      FROM user_organization_invitations
    WHERE  user_organization_invitation_id = ${invitationId} &&  invitation_shortcode = ${shortcode}
`;

module.exports = getFirst(camelKeys(selectUserByInvitationId));
