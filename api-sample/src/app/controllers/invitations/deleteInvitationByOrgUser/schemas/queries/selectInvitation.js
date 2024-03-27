const { submitQuery, getFirst } = require("~root/lib/database");

const selectInvitation = ({ invitationId }) => submitQuery`
    SELECT 
	    user_organization_invitation_id 
    FROM user_organization_invitations 
    WHERE user_organization_invitation_id = ${invitationId} 
`;

module.exports = getFirst(selectInvitation);
