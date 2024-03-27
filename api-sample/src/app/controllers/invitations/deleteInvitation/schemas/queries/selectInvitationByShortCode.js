const { submitQuery, getFirst } = require("~root/lib/database");

const selectUser = ({ shortCode, invitationId, email }) => submitQuery`
    SELECT 
	    invited_by,
        email
    FROM user_organization_invitations 
    WHERE user_organization_invitation_id = ${invitationId} && invitation_shortcode = ${shortCode} && email = ${email}
`;

module.exports = getFirst(selectUser);
